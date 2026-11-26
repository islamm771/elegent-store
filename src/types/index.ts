export type category = {
  id: string;
  title: string;
  href: string;
  image: string;
  tone: string;
  groups: readonly string[];
  where: Record<string, string>;
}

export type categoryTab = "all" | "women" | "men" | "atelier";


export const NEXT: Record<string, { to: NextStatus; label: string } | undefined> = {
  CONFIRMED: { to: "PACKED", label: "Mark packed" },
  PACKED: { to: "SHIPPED", label: "Out for delivery" },
  SHIPPED: { to: "DELIVERED", label: "Mark delivered" },
};

export type NextStatus = "PACKED" | "SHIPPED" | "DELIVERED"