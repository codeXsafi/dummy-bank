/*
 * StepProgress — the 3-segment dash indicator at the top of the login form card, showing which of the 3 steps (email / secure word+password / MFA) is active.
 */
interface StepProgressProps {
  step: 1 | 2 | 3;
}

export function StepProgress({ step }: StepProgressProps) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {[1, 2, 3].map((segment) => {
        const isActive = segment === step;
        const isPast = segment < step;
        return (
          <span
            key={segment}
            className={`h-1 rounded-full transition-all ${
              isActive
                ? "w-6 bg-accent"
                : isPast
                  ? "w-3 bg-accent/40"
                  : "w-3 bg-border"
            }`}
          />
        );
      })}
    </div>
  );
}
