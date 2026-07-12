const SIZE_CLASSES = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
} as const;

interface AvatarProps {
  email: string | null;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function Avatar({ email, size = "sm", className = "" }: AvatarProps) {
  const initial = email ? email[0].toUpperCase() : "?";

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent ${SIZE_CLASSES[size]} ${className}`}
    >
      {initial}
    </div>
  );
}
