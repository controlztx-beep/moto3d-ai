"use client";

import * as React from "react";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useConfiguratorStore } from "@/stores/configuratorStore";

function CopyRow({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(() => {
    void navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <div className="flex gap-2">
      <input
        readOnly
        className="flex-1 rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-sm"
        value={value}
      />
      <Button type="button" variant="secondary" className="shrink-0 gap-2" onClick={copy}>
        <Copy className="size-4" />
        {copied ? "Copied!" : label ?? "Copy"}
      </Button>
    </div>
  );
}

export function ShareModal() {
  const isShareModalOpen = useConfiguratorStore((s) => s.isShareModalOpen);
  const toggleShareModal = useConfiguratorStore((s) => s.toggleShareModal);
  const currentConfigId = useConfiguratorStore((s) => s.currentConfigId);
  
  const [shareLink, setShareLink] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isShareModalOpen || !currentConfigId) return;
    
    async function generateShareLink() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: config, error: fetchError } = await supabase
          .from('configurations')
          .select('share_token')
          .eq('id', currentConfigId)
          .single();

        if (fetchError) throw fetchError;

        let token = config?.share_token;
        
        if (!token) {
          token = crypto.randomUUID();
          const { error: updateError } = await supabase
            .from('configurations')
            .update({ share_token: token, is_public: true })
            .eq('id', currentConfigId);

          if (updateError) throw updateError;
        } else {
          await supabase
            .from('configurations')
            .update({ is_public: true })
            .eq('id', currentConfigId);
        }

        const url = `${window.location.origin}/shared/${token}`;
        setShareLink(url);
      } catch (error) {
        console.error('Share link error:', error);
        toast.error('Failed to generate share link');
      } finally {
        setLoading(false);
      }
    }

    void generateShareLink();
  }, [isShareModalOpen, currentConfigId]);

  const shareUrl = shareLink ? encodeURIComponent(shareLink) : '';
  const shareText = encodeURIComponent("Check out my MOTO3D build!");
  const embedCode = shareLink ? `<iframe src="${shareLink}" width="100%" height="600" frameborder="0"></iframe>` : '';

  const openSocial = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog
      open={isShareModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          useConfiguratorStore.setState({ isShareModalOpen: false });
        }
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Share Configuration</DialogTitle>
          <DialogDescription>
            Share your custom motorcycle build
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : !currentConfigId ? (
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-center text-sm">
                Please save your configuration first to generate a share link.
              </div>
            ) : shareLink ? (
              <CopyRow value={shareLink} />
            ) : (
              <div className="text-center text-sm text-muted-foreground">Failed to generate link</div>
            )}
          </TabsContent>

          <TabsContent value="embed" className="mt-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : !currentConfigId ? (
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-center text-sm">
                Please save your configuration first to generate embed code.
              </div>
            ) : embedCode ? (
              <>
                <pre className="overflow-x-auto rounded-lg border border-border bg-zinc-950 p-3 text-muted-foreground text-xs">
                  <code>{embedCode}</code>
                </pre>
                <CopyRow value={embedCode} />
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground">Failed to generate embed code</div>
            )}
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  openSocial(
                    `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
                  )
                }
              >
                Twitter / X
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  openSocial(
                    `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                  )
                }
              >
                Facebook
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  openSocial(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                  )
                }
              >
                LinkedIn
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  openSocial(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(`${decodeURIComponent(shareText)} ${shareLink || ''}`)}`,
                  )
                }
              >
                WhatsApp
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={toggleShareModal}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
