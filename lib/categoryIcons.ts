import {
  Coffee,
  Heart,
  LucideIcon,
  MapPin,
  Package,
  PlayCircle,
  Repeat,
  ShoppingCart,
  TrendingUp,
  Zap,
} from "lucide-react";

interface CategoryStyle {
  icon: LucideIcon;
  tintClassName: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Groceries: {
    icon: ShoppingCart,
    tintClassName: "bg-success/15 text-success",
  },
  Entertainment: {
    icon: PlayCircle,
    tintClassName: "bg-accent/15 text-accent",
  },
  Income: { icon: TrendingUp, tintClassName: "bg-success/15 text-success" },
  Transport: { icon: MapPin, tintClassName: "bg-accent/15 text-accent" },
  Shopping: { icon: Package, tintClassName: "bg-danger/15 text-danger" },
  Dining: { icon: Coffee, tintClassName: "bg-warning/15 text-warning" },
  Transfer: { icon: Repeat, tintClassName: "bg-primary/10 text-primary" },
  Health: { icon: Heart, tintClassName: "bg-danger/15 text-danger" },
  Bills: { icon: Zap, tintClassName: "bg-warning/15 text-warning" },
};

const FALLBACK_STYLE: CategoryStyle = {
  icon: Repeat,
  tintClassName: "bg-primary/10 text-primary",
};

export function categoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] ?? FALLBACK_STYLE;
}
