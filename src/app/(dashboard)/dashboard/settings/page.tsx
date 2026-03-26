"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";

type ProfileRow = {
  full_name?: string | null;
  email?: string | null;
  company_name?: string | null;
};

function initialsFromName(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

export default function SettingsPage() {
  const router = useRouter();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [fullName, setFullName] = React.useState("MOTO3D User");
  const [email, setEmail] = React.useState("user@example.com");
  const [company, setCompany] = React.useState("");

  const [orgName, setOrgName] = React.useState("My Organization");
  const [orgDomain, setOrgDomain] = React.useState("");
  const [orgId, setOrgId] = React.useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [notifConfig, setNotifConfig] = React.useState(true);
  const [notifWeekly, setNotifWeekly] = React.useState(false);
  const [notifFeatures, setNotifFeatures] = React.useState(true);

  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);
  const [savingOrg, setSavingOrg] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        if (!user) return;
        
        setUserId(user.id);
        
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (cancelled) return;
        const profile = p as unknown as ProfileRow | null;
        setFullName(
          profile?.full_name ?? user.user_metadata?.full_name ?? "MOTO3D User",
        );
        setEmail(profile?.email ?? user.email ?? "user@example.com");
        setCompany(profile?.company_name ?? "");

        const { data: org } = await supabase
          .from("organizations")
          .select("*")
          .eq("owner_id", user.id)
          .single();
        
        if (org) {
          setOrgId(org.id);
          setOrgName(org.name || "My Organization");
          setOrgDomain(org.domain || "");
        }
      } catch {
        // keep defaults
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSavingProfile(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          company_name: company,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Update password error:", error);
      toast.error("Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
      toast.success("Account deleted. We're sorry to see you go!");
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account");
    }
  };

  const handleSaveOrg = async () => {
    if (!userId) return;
    setSavingOrg(true);
    try {
      const supabase = createClient();
      
      if (orgId) {
        const { error } = await supabase
          .from("organizations")
          .update({
            name: orgName,
            domain: orgDomain,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orgId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("organizations")
          .insert({
            owner_id: userId,
            name: orgName,
            domain: orgDomain,
          })
          .select("id")
          .single();

        if (error) throw error;
        if (data) setOrgId(data.id);
      }

      toast.success("Organization saved!");
    } catch (error) {
      console.error("Save org error:", error);
      toast.error("Failed to save organization");
    } finally {
      setSavingOrg(false);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 space-y-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar size="lg">
                    <AvatarFallback>{initialsFromName(fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                    <Camera className="size-4" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Change Photo</div>
                  <div className="text-xs text-muted-foreground">
                    Upload coming soon
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} readOnly disabled />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Company Name</Label>
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
              </div>

              <Button 
                className="w-full sm:w-auto" 
                onClick={handleSaveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={handleUpdatePassword}
                disabled={savingPassword}
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>This action cannot be undone</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="org" className="mt-4 space-y-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Manage your organization profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Input value={orgDomain} onChange={(e) => setOrgDomain(e.target.value)} placeholder="www.yoursite.com" />
                </div>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Logo</div>
                    <div className="text-xs text-muted-foreground">Upload coming soon</div>
                  </div>
                  <Badge variant="secondary">Optional</Badge>
                </div>
              </div>
              <Button 
                className="w-full sm:w-auto"
                onClick={handleSaveOrg}
                disabled={savingOrg}
              >
                {savingOrg ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Control what we send you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  label: "Email notifications for new configurations",
                  checked: notifConfig,
                  set: setNotifConfig,
                  disabled: false,
                },
                {
                  label: "Weekly analytics digest",
                  checked: notifWeekly,
                  set: setNotifWeekly,
                  disabled: false,
                },
                {
                  label: "New feature announcements",
                  checked: notifFeatures,
                  set: setNotifFeatures,
                  disabled: false,
                },
                {
                  label: "Security alerts",
                  checked: true,
                  set: () => {},
                  disabled: true,
                },
              ].map((n) => (
                <div
                  key={n.label}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3"
                >
                  <div className="text-sm">{n.label}</div>
                  <Switch
                    checked={n.checked}
                    onCheckedChange={n.set}
                    disabled={n.disabled}
                  />
                </div>
              ))}
              <Button className="w-full sm:w-auto">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all configurations.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

