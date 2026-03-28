"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Mail, Phone } from "lucide-react";

interface QuoteLead {
  id: string;
  created_at: string;
  event_data: {
    name: string;
    email: string;
    phone: string;
    city?: string;
    contactMethod: string;
    message?: string;
    tradeIn?: boolean;
    tradeInDetails?: string;
    motorcycleName: string;
    totalPrice: number;
    status?: string;
  };
}

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<QuoteLead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadLeads() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("analytics_events")
          .select("*")
          .eq("event_type", "inquiry")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLeads((data as QuoteLead[]) || []);
      } catch (error) {
        console.error("Error loading leads:", error);
      } finally {
        setLoading(false);
      }
    }
    void loadLeads();
  }, []);

  const updateStatus = async (leadId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return;

      const updatedEventData = {
        ...lead.event_data,
        status: newStatus,
      };

      const { error } = await supabase
        .from("analytics_events")
        .update({ event_data: updatedEventData })
        .eq("id", leadId);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? { ...l, event_data: updatedEventData }
            : l
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Name", "Email", "Phone", "City", "Motorcycle", "Price", "Status"];
    const rows = filteredLeads.map((lead) => [
      new Date(lead.created_at).toLocaleDateString(),
      lead.event_data.name,
      lead.event_data.email,
      lead.event_data.phone || "",
      lead.event_data.city || "",
      lead.event_data.motorcycleName,
      lead.event_data.totalPrice,
      lead.event_data.status || "new",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredLeads = React.useMemo(() => {
    if (statusFilter === "all") return leads;
    return leads.filter((l) => (l.event_data.status || "new") === statusFilter);
  }, [leads, statusFilter]);

  const statusCounts = React.useMemo(() => {
    const counts = {
      all: leads.length,
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
    };
    leads.forEach((l) => {
      const status = l.event_data.status || "new";
      if (status in counts) {
        counts[status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [leads]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quote Requests</h1>
          <p className="mt-1 text-muted-foreground">
            Manage customer inquiries and leads
          </p>
        </div>
        <Badge variant="secondary" className="text-lg">
          {leads.length} Total
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as string)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({statusCounts.all})</SelectItem>
            <SelectItem value="new">New ({statusCounts.new})</SelectItem>
            <SelectItem value="contacted">Contacted ({statusCounts.contacted})</SelectItem>
            <SelectItem value="qualified">Qualified ({statusCounts.qualified})</SelectItem>
            <SelectItem value="converted">Converted ({statusCounts.converted})</SelectItem>
            <SelectItem value="lost">Lost ({statusCounts.lost})</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>
            Click on a row to view full details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Motorcycle</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No quote requests yet
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        setExpandedRow(expandedRow === lead.id ? null : lead.id)
                      }
                    >
                      <TableCell>
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.event_data.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {lead.event_data.city || "No location"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.event_data.email}
                          </div>
                          {lead.event_data.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.event_data.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{lead.event_data.motorcycleName}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${lead.event_data.totalPrice.toLocaleString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={lead.event_data.status || "new"}
                          onValueChange={(value) => updateStatus(lead.id, value as string)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                    {expandedRow === lead.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/30">
                          <div className="space-y-3 p-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  Preferred Contact:
                                </span>
                                <p className="capitalize">{lead.event_data.contactMethod}</p>
                              </div>
                              {lead.event_data.tradeIn && (
                                <div>
                                  <span className="text-xs font-medium text-muted-foreground">
                                    Trade-in:
                                  </span>
                                  <p>{lead.event_data.tradeInDetails || "Yes"}</p>
                                </div>
                              )}
                            </div>
                            {lead.event_data.message && (
                              <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  Message:
                                </span>
                                <p className="mt-1 text-sm">{lead.event_data.message}</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
