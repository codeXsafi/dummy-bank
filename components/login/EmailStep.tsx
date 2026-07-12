/*
 * EmailStep — login flow step 1. Collects the email address and kicks off
 * /api/getSecureWord (handled by the parent page, not here — this
 * component only reports the submitted value up).
 */
"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface EmailStepProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function EmailStep({ onSubmit, isLoading, error }: EmailStepProps) {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl text-text">Welcome back</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter your email to continue securely.
        </p>
      </div>
      <Input
        label="USERNAME"
        labelClassName="text-xs uppercase tracking-wide text-text-muted"
        type="email"
        autoComplete="email"
        placeholder="your.username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={error ?? undefined}
        required
        autoFocus
      />
      <Button type="submit" isLoading={isLoading} disabled={!email.trim()}>
        Continue
      </Button>
      <p className="text-center text-xs text-text-muted">
        Demo: maker@dummybank.com
      </p>
    </form>
  );
}
