"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface RequestQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  motorcycleName: string;
  motorcycleBrand: string;
  motorcycleYear: number;
  color: string;
  upgrades: Array<{ name: string; price: number }>;
  totalPrice: number;
  configurationId?: string;
  configData?: Record<string, unknown>;
  userEmail?: string;
}

export function RequestQuoteModal({
  open,
  onOpenChange,
  motorcycleName,
  motorcycleBrand,
  motorcycleYear,
  color,
  upgrades,
  totalPrice,
  configurationId,
  configData,
  userEmail,
}: RequestQuoteModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(userEmail || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [contactMethod, setContactMethod] = useState("email");
  const [message, setMessage] = useState("");
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeInDetails, setTradeInDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          city,
          contactMethod,
          message,
          tradeIn: hasTradeIn,
          tradeInDetails: hasTradeIn ? tradeInDetails : null,
          configurationId,
          motorcycleName: `${motorcycleBrand} ${motorcycleName} ${motorcycleYear}`,
          totalPrice,
          configData: {
            ...configData,
            color,
            upgrades,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to submit quote request");

      setSuccess(true);

      // Track analytics event
      if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
        ((window as unknown as Record<string, unknown>).gtag as (...args: unknown[]) => void)("event", "inquiry", {
          motorcycle: `${motorcycleBrand} ${motorcycleName}`,
          price: totalPrice,
          city,
        });
      }

      // Reset form after 3 seconds and close
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
        setName("");
        setEmail(userEmail || "");
        setPhone("");
        setCity("");
        setMessage("");
        setHasTradeIn(false);
        setTradeInDetails("");
      }, 3000);
    } catch (error) {
      console.error("Quote submission error:", error);
      alert("Failed to submit quote request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Quote Request Sent!</h3>
            <p className="text-muted-foreground">
              A dealership will contact you within 24 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            A dealership will contact you about this configuration
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city">City/Location</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Los Angeles, CA"
              />
            </div>

            <div>
              <Label>Preferred Contact Method *</Label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="email"
                    checked={contactMethod === "email"}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-sm">Email</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="call"
                    checked={contactMethod === "call"}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-sm">Phone Call</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="whatsapp"
                    checked={contactMethod === "whatsapp"}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-sm">WhatsApp</span>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message/Notes</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any special requests or questions?"
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium">Do you have a motorcycle to trade in?</span>
                <input
                  type="checkbox"
                  checked={hasTradeIn}
                  onChange={(e) => setHasTradeIn(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                />
              </label>
              {hasTradeIn && (
                <Input
                  value={tradeInDetails}
                  onChange={(e) => setTradeInDetails(e.target.value)}
                  placeholder="e.g., 2020 Yamaha MT-07, 15,000 miles"
                />
              )}
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Configuration Summary
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Motorcycle:</span>
                <span className="font-medium">
                  {motorcycleBrand} {motorcycleName} {motorcycleYear}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Color:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border border-neutral-700"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">{color}</span>
                </div>
              </div>
              {upgrades.length > 0 && (
                <div className="mt-3 space-y-1 border-t border-neutral-800 pt-3">
                  <span className="text-sm font-medium text-neutral-400">
                    Equipped Upgrades:
                  </span>
                  {upgrades.map((upgrade, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-300">{upgrade.name}</span>
                      <span className="text-neutral-400">
                        +${upgrade.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-neutral-800 pt-3">
                <span className="font-semibold">Total Price:</span>
                <Badge className="bg-red-600 text-lg font-bold">
                  ${totalPrice.toLocaleString()}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 text-base font-medium uppercase tracking-wide hover:bg-red-700"
            size="lg"
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Quote Request
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
