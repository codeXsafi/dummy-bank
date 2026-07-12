/*
 * MfaStep — login flow step 3. Six single-digit inputs for the MFA code
 */
"use client";

import { Smartphone } from "lucide-react";
import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/Button";
import { maskEmail } from "@/lib/maskEmail";

const CODE_LENGTH = 6;
const RESEND_MESSAGE_DURATION_MS = 3000;

interface MfaStepProps {
  email: string;
  attemptsRemaining: number;
  locked: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (code: string) => void;
}

export function MfaStep({
  email,
  attemptsRemaining,
  locked,
  isLoading,
  error,
  onSubmit,
}: MfaStepProps) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [showResendMessage, setShowResendMessage] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!locked) inputRefs.current[0]?.focus();
  }, [locked]);

  function handleResendCode() {
    inputRefs.current[0]?.focus();
    setShowResendMessage(true);
    setTimeout(() => setShowResendMessage(false), RESEND_MESSAGE_DURATION_MS);
  }

  function setDigit(index: number, value: string) {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleChange(index: number, rawValue: string) {
    const digit = rawValue.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const nextDigits = [...digits];
    nextDigits[index] = digit;
    if (nextDigits.every((d) => d !== "")) {
      onSubmit(nextDigits.join(""));
    }
  }

  function handleKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      // Current box is already empty — move focus back and clear the
      // previous box too, matching the common "delete backwards" pattern
      // users expect from OTP inputs.
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, "");
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < CODE_LENGTH - index && i < pasted.length; i++) {
      next[index + i] = pasted[i];
    }
    setDigits(next);

    const lastFilledIndex = Math.min(
      index + pasted.length - 1,
      CODE_LENGTH - 1,
    );
    inputRefs.current[lastFilledIndex]?.focus();

    if (next.every((d) => d !== "")) {
      onSubmit(next.join(""));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl text-text">One more step</h1>
        <p className="mt-1 text-sm text-text-muted">
          We sent a 6-digit code to {maskEmail(email)}
        </p>
      </div>

      <div className="flex justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-teal-200 bg-teal-100/40 text-accent">
          <Smartphone size={28} />
        </span>
      </div>

      <div className="flex justify-center gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={locked || isLoading}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            className="h-12 w-10 rounded-xl border border-border bg-surface text-center text-lg font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
            aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
          />
        ))}
      </div>

      {locked ? (
        <p className="text-sm text-danger">
          Too many incorrect attempts. This account is locked.
        </p>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        <p className="text-xs text-text-muted hidden">
          {attemptsRemaining} attempt(s) remaining
        </p>
      )}

      <Button
        type="button"
        isLoading={isLoading}
        disabled={locked || digits.some((d) => d === "")}
        onClick={() => onSubmit(digits.join(""))}
      >
        Verify & Sign In
      </Button>

      <div className="flex flex-col items-center gap-1 text-center text-xs mt-1 text-text-muted">
        <p>Demo code: 123456</p>
        {showResendMessage ? (
          <p className="text-accent">Code resent</p>
        ) : (
          <button
            type="button"
            onClick={handleResendCode}
            disabled={locked}
            className="text-gray-500 mt-1 font-medium underline-offset-2 hover:underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
