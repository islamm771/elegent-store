/** Home category cards. `where` is how each card counts and links into the catalogue. Photos: /public/images/home/. */
export const categories = [
  { id: "dresses",   title: "Dresses & Silhouettes", href: "/shop?cat=dresses",             where: { category: "dresses" },          groups: ["women", "atelier"], image: "/images/home/dresses.jpg",   tone: "#c49a72" },
  { id: "outerwear", title: "Tailored Outerwear",    href: "/shop?cat=outerwear",           where: { category: "outerwear" },        groups: ["women", "men"],     image: "/images/home/outerwear.jpg", tone: "#d9c4a4" },
  { id: "linen",     title: "Pure Linen Capsule",    href: "/shop?material=flax-linen",     where: { material: "flax-linen" },       groups: ["women", "men"],     image: "/images/home/linen.jpg",     tone: "#b98a5e" },
  { id: "silk",      title: "Fine Silk & Knitwear",  href: "/shop?material=mulberry-silk",  where: { material: "mulberry-silk" },    groups: ["women", "atelier"], image: "/images/home/silk.jpg",      tone: "#eadfcb" },
] as const;

export const categoryTabs = ["all", "women", "men", "atelier"] as const;
