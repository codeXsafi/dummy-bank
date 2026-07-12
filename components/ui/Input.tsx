import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelClassName = "",
      error,
      rightSlot,
      id,
      className = "",
      ...rest
    },
    ref,
  ) => {
    // useId generates a stable id when the caller doesn't supply one, so
    // label/input stay associated even if this component is rendered many
    // times on one page (e.g. the 6 MFA digit boxes each need a unique id).
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm font-medium text-text ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`w-full rounded-xl border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60 ${
              rightSlot ? "pr-10" : ""
            } ${error ? "border-danger" : "border-border"} ${className}`}
            {...rest}
          />
          {rightSlot && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightSlot}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
