"use client";

import * as React from "react";
import { Copy, RefreshCcw } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { renderMarkdown } from "@/lib/ai/markdown";

const iframeCode = `<!-- MOTO3D AI Configurator Widget -->
<iframe
  src="https://moto3d.ai/embed/YOUR_ORG_ID"
  width="100%"
  height="600"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write"
  style="border-radius: 12px;"
></iframe>`;

const jsCode = `<div id="moto3d-configurator"></div>
<script src="https://moto3d.ai/widget.js"
  data-api-key="YOUR_API_KEY"
  data-model="ninja-zx6r"
  data-theme="dark">
</script>`;

const reactCode = `import { Moto3DConfigurator } from '@moto3d/react'

<Moto3DConfigurator
  apiKey="YOUR_API_KEY"
  model="ninja-zx6r"
  theme="dark"
/>`;

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 font-mono text-sm">
        <code>{code}</code>
      </pre>
      <Button
        type="button"
        size="icon-sm"
        variant="secondary"
        className="absolute right-3 top-3"
        onClick={() => {
          void navigator.clipboard.writeText(code);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
        aria-label="Copy code"
      >
        <Copy className="size-4" />
      </Button>
      {copied ? (
        <div className="absolute right-12 top-3 rounded-md bg-foreground px-2 py-1 text-xs text-background">
          Copied
        </div>
      ) : null}
    </div>
  );
}

export default function EmbedPage() {
  const [model, setModel] = React.useState("ninja-zx6r");
  const [theme, setTheme] = React.useState("dark");
  const [showAi, setShowAi] = React.useState(true);
  const [showShare, setShowShare] = React.useState(true);
  const [showPrice, setShowPrice] = React.useState(true);
  const [size, setSize] = React.useState("responsive");
  const [domain, setDomain] = React.useState("");

  const [apiKey, setApiKey] = React.useState("mk_live_xxxx...xxxx");

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Embed Widget</h1>
        <p className="mt-1 text-muted-foreground">
          Integrate the 3D configurator into your website
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>Configure what your visitors see</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Motorcycle Model</Label>
                <Select
                  value={model}
                  onValueChange={(v) => setModel(typeof v === "string" ? v : "ninja-zx6r")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>{model}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ninja-zx6r">Ninja ZX-6R</SelectItem>
                    <SelectItem value="mt-07">MT-07</SelectItem>
                    <SelectItem value="africa-twin">Africa Twin</SelectItem>
                    <SelectItem value="r1250gs">R 1250 GS</SelectItem>
                    <SelectItem value="390duke">390 Duke</SelectItem>
                    <SelectItem value="scrambler">Scrambler Icon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={theme}
                  onValueChange={(v) => setTheme(typeof v === "string" ? v : "dark")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>{theme === "dark" ? "Dark" : "Light"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                <div>
                  <div className="text-sm font-medium">Show AI Chat</div>
                  <div className="text-xs text-muted-foreground">Enable the AI assistant</div>
                </div>
                <Switch checked={showAi} onCheckedChange={setShowAi} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                <div>
                  <div className="text-sm font-medium">Show Share Button</div>
                  <div className="text-xs text-muted-foreground">Let users share builds</div>
                </div>
                <Switch checked={showShare} onCheckedChange={setShowShare} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                <div>
                  <div className="text-sm font-medium">Show Price</div>
                  <div className="text-xs text-muted-foreground">Display total build price</div>
                </div>
                <Switch checked={showPrice} onCheckedChange={setShowPrice} />
              </div>

              <div className="space-y-2">
                <Label>Widget Size</Label>
                <Select
                  value={size}
                  onValueChange={(v) => setSize(typeof v === "string" ? v : "responsive")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {size === "responsive"
                        ? "Responsive"
                        : size === "small"
                          ? "Small (400x300)"
                          : size === "medium"
                            ? "Medium (600x450)"
                            : "Large (800x600)"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="responsive">Responsive</SelectItem>
                    <SelectItem value="small">Small (400x300)</SelectItem>
                    <SelectItem value="medium">Medium (600x450)</SelectItem>
                    <SelectItem value="large">Large (800x600)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Your Domain</Label>
                <Input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="www.yourdealership.com"
                />
              </div>

              <Button className="w-full">Generate Code</Button>
              <div
                className="text-xs text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(
                    `- Model: **${model}**\n- Theme: **${theme}**\n- AI Chat: **${showAi ? "On" : "Off"}** · Share: **${showShare ? "On" : "Off"}** · Price: **${showPrice ? "On" : "Off"}**\n- Size: **${size}** · Domain: **${domain || "not set"}**`,
                  ),
                }}
              />
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Your API Key</CardTitle>
              <CardDescription>Use this key for API integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input readOnly value={apiKey} />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => void navigator.clipboard.writeText(apiKey)}
                  aria-label="Copy API key"
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => setApiKey("mk_live_" + Math.random().toString(16).slice(2, 10) + "...xxxx")}
                  aria-label="Refresh key"
                >
                  <RefreshCcw className="size-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full text-destructive">
                Regenerate Key
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-border overflow-hidden">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Widget Preview</CardTitle>
                <CardDescription>Live preview</CardDescription>
              </div>
              <Badge className="border-0 bg-green-500/20 text-green-400">
                <span className="mr-2 inline-block size-2 rounded-full bg-green-400" />
                Live Preview
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg bg-muted/30 p-8 aspect-video">
                <div className="text-4xl">🏍️</div>
                <div className="mt-3 text-sm font-semibold">3D Configurator Widget</div>
                <div className="mt-1 text-xs text-muted-foreground">Widget will appear here</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>Copy & paste into your website</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="iframe">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="iframe">HTML Iframe</TabsTrigger>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                  <TabsTrigger value="react">React</TabsTrigger>
                </TabsList>
                <TabsContent value="iframe" className="mt-4">
                  <CodeBlock code={iframeCode} />
                </TabsContent>
                <TabsContent value="js" className="mt-4">
                  <CodeBlock code={jsCode} />
                </TabsContent>
                <TabsContent value="react" className="mt-4">
                  <CodeBlock code={reactCode} />
                </TabsContent>
              </Tabs>
              <Button
                type="button"
                className="mt-4 w-full"
                onClick={() => void navigator.clipboard.writeText(iframeCode)}
              >
                Copy Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

