import { Wallet, Shield, Smartphone, TrendingUp } from "lucide-react";

const FEATURE_BULLETS = [
  { icon: Shield, label: "256-bit AES encryption" },
  { icon: Smartphone, label: "Multi-factor authentication" },
  { icon: TrendingUp, label: "Real-time portfolio insights" },
];

export function LoginMarketingPanel() {
  return (
    <div className="relative hidden w-[45%] flex-col overflow-hidden bg-primary p-10 text-text-inverse lg:flex justify-between">
      <div className="pointer-events-none absolute left-24 top-12 h-50 w-50 rounded-full bg-warning/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative flex items-center gap-2 text-xl font-semibold font-serif ">
        <div className="rounded-full bg-primary-light w-9 h-9 flex items-center justify-center p-1">
          <Wallet size={22} />
        </div>
        Dummy Bank
      </div>

      <div className="relative mt-24 max-w-sm">
        <h1 className="font-serif text-4xl leading-tight">
          Your money,
          <br />
          perfectly <span className="italic">ordered.</span>
        </h1>
        <p className="mt-4 text-sm text-text-inverse/80 max-w-[300]">
          Bank-grade security meets modern clarity. Every transaction, every
          account — right where you expect it.
        </p>

        <ul className="mt-8 flex flex-col gap-3">
          {FEATURE_BULLETS.map((feature) => {
            const Icon = feature.icon;
            return (
              <li
                key={feature.label}
                className="flex items-center gap-3 text-sm"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-text-inverse/10">
                  <Icon size={14} className="text-accent" />
                </span>
                {feature.label}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="relative mt-auto text-xs text-text-inverse/50">
        © 2026 NovaBank Financial Services, N.A. Member FDIC.
      </p>
    </div>
  );
}
