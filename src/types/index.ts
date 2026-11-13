type category = {
  id: string;
  title: string;
  href: string;
  image: string;
  tone: string;
  groups: readonly string[];
  where: Record<string, string>;
}

type categoryTab = "all" | "women" | "men" | "atelier";