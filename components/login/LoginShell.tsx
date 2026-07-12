"use client";

import { ArrowLeft, Wallet } from "lucide-react";
import { ReactNode } from "react";
import { LoginMarketingPanel } from "@/components/login/LoginMarketingPanel";
import { StepProgress } from "@/components/login/StepProgress";
// import { Card } from "@/components/ui/Card";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { AuthStep, stepIndexForAuthStep } from "@/lib/authMachine";

interface LoginShellProps {
  step: AuthStep;
  onBack: () => void;
  children: ReactNode;
}

export function LoginShell({ step, onBack, children }: LoginShellProps) {
  const stepIndex = stepIndexForAuthStep(step);

  return (
    <div className="flex min-h-screen bg-bg">
      <LoginMarketingPanel />

      <div className="relative flex flex-1 flex-col items-center justify-center p-4">
        <div className="absolute right-4 top-4">
          <ThemeSwitcher />
        </div>

        <div className="w-full max-w-md">
          <div className="relative items-center gap-2 text-xl font-semibold font-serif mb-6 flex lg:hidden">
            <div className="rounded-full bg-primary-light w-9 h-9 flex items-center justify-center p-1">
              <Wallet size={22} className="text-white" />
            </div>
            Dummy Bank
          </div>

          <div className="mb-6 flex items-center gap-3">
            {stepIndex > 1 && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to start"
                className="rounded-md p-1 text-text-muted hover:bg-bg hover:text-text"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <StepProgress step={stepIndex} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
