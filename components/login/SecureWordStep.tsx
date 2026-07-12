/*
 * SecureWordStep — login flow step 2. Shows the secure word issued by /api/getSecureWord with a live 60s countdown, and collects the password.
 */
"use client";

import { Eye, EyeOff, Shield } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SecureWordStepProps {
  email: string;
  secureWord: string;
  expiresAt: number;
  onSubmit: (password: string) => void;
  onExpire: () => void;
  isLoading: boolean;
  error: string | null;
}

export function SecureWordStep({
  email,
  secureWord,
  expiresAt,
  onSubmit,
  onExpire,
  isLoading,
  error,
}: SecureWordStepProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.round((expiresAt - Date.now()) / 1000)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.round((expiresAt - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!password) return;
    onSubmit(password);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl text-text">Verify identity</h1>
        <p className="mt-1 text-sm text-text-muted">
          Signing in as <span className="font-medium text-text">{email}</span>
        </p>
      </div>

      <div className="py-2">
        <p className="text-xs uppercase tracking-wide font-semibold text-text-muted">
          Your secure word
        </p>
        <p className="mt-2 flex items-center gap-2 text-md font-medium uppercase tracking-wide text-primary-light rounded-2xl border border-[#E8E2D5] bg-[#F3F2F2] py-2 px-4">
          <Shield size={16} className="text-primary-light" />
          {secureWord}
        </p>
        <p className="mt-1 text-xs text-text-muted hidden">
          Expires in {secondsLeft}s
        </p>
        <p className="mt-2 text-xs text-text-muted">
          If this word looks unfamiliar, do not enter your password.
        </p>
      </div>

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        value={password}
        placeholder="Enter your password"
        onChange={(event) => setPassword(event.target.value)}
        error={error ?? undefined}
        required
        autoFocus
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-text-muted hover:text-text"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <Button type="submit" isLoading={isLoading} disabled={!password}>
        Continue
      </Button>

      <p className="text-center text-xs text-text-muted">
        Demo: use &quot;password123&quot;
      </p>
    </form>
  );
}
