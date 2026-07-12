import { User } from "lucide-react";

const SIZE_CLASSES = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
} as const;

interface AvatarProps {
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function Avatar({ size = "sm", className = "" }: AvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent ${SIZE_CLASSES[size]} ${className}`}
    >
      <User
        size={size === "md" ? 20 : 16}
        className="absolute text-primary-light"
      />
    </div>
  );
}
