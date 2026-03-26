import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { LoginForm } from "./login-form";

function LoginFallback() {
  return (
    <div className="border-border/60 bg-card/40 flex min-h-[420px] w-full max-w-md flex-col items-center justify-center rounded-xl border border-dashed p-8 backdrop-blur-sm">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground mt-4 text-sm">Loading sign in…</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
