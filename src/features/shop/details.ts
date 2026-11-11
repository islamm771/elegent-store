/** Product-page content. The featured dress uses the Figma copy; other products get generated placeholder copy. */
import { materialName, type ShopProduct } from "./catalog";

export const colorTitles: Record<string, string> = {
  mocha: "Warm Mocha", sand: "Sand Dune", biscuit: "Oat Biscuit", olive: "Forest Sage", espresso: "Obsidian Black", terra: "Terracotta Clay",
};

export interface Review { title: string; body: string; author: string; size: string; when: string }
export interface ReviewData { dist: [number, number, number, number, number]; fit: { small: number; true: number; large: number }; items: Review[] }
export interface Detail {
  description: string; bullets: string[]; fabric: string[]; shipping: string[];
  fitNote: string; valueProp: { title: string; text: string }; capsule: string; slowCraft: string; reviews?: ReviewData;
}

const materialCopy: Record<string, { title: string; text: string; care: string[] }> = {
  "flax-linen": { title: "100% Certified Flax Linen", text: "Naturally breathable, temperature-regulating, and pre-washed for effortless drape without stiffness.", care: ["Machine wash cold on a gentle cycle", "Line dry in the shade", "Warm iron while slightly damp"] },
  "mulberry-silk": { title: "Mulberry Raw Silk", text: "Smooth, breathable, and finished by hand for a fluid drape.", care: ["Hand wash cool or dry clean", "Do not wring or tumble dry", "Iron on low, inside out"] },
  cashmere: { title: "Grade-A Cashmere", text: "Long-staple fibres that stay soft and resist pilling.", care: ["Hand wash cool with a wool detergent", "Dry flat, away from direct heat", "Store folded, never hung"] },
  leather: { title: "Vegetable-Tanned Leather", text: "Tanned with plant extracts and finished by hand; it develops a rich patina with wear.", care: ["Wipe with a soft dry cloth", "Condition with a leather balm twice a year", "Keep away from water and direct heat"] },
  raffia: { title: "Hand-Woven Raffia", text: "Natural palm fibre woven by artisans — lightweight, breathable and naturally structured.", care: ["Spot clean with a damp cloth", "Air dry away from direct sunlight", "Store stuffed to keep its shape"] },
  "gold-vermeil": { title: "18k Gold Vermeil", text: "Thick 18k gold over sterling silver — hypoallergenic and made to last.", care: ["Remove before swimming or showering", "Wipe with a soft polishing cloth", "Store separately in the pouch provided"] },
  "wool-lyocell": { title: "Virgin Wool & Lyocell", text: "A fluid, temperature-balancing blend that holds its pleats and drapes cleanly.", care: ["Dry clean or hand wash cool", "Press with a cloth on low heat", "Store on a wide hanger"] },
  "organic-cotton": { title: "GOTS Organic Cotton", text: "Grown and woven without synthetic chemicals.", care: ["Machine wash cold", "Tumble dry low or line dry", "Warm iron if needed"] },
};

const shipping = [
  "Complimentary carbon-neutral express delivery on orders over $200.",
  "30-day returns with a prepaid label included.",
  "Complimentary atelier alterations on every garment.",
];

const featuredReviews: ReviewData = {
  dist: [92, 6, 2, 0, 0],
  fit: { small: 3, true: 94, large: 3 },
  items: [
    { title: "Sublime linen weight and impeccable tailoring", body: "I wore this for an editorial symposium in Florence and received continuous inquiries. The square neckline stays completely structured without gaping, and the Warm Mocha hue has an exquisite depth that doesn’t wash out skin tones. Truly worth every penny.", author: "Helena V.", size: "S", when: "3 days ago" },
    { title: "The button craftsmanship is pure luxury", body: "Fast delivery to New York with pristine dust bag packaging. Fabric has substantial heft without feeling hot in summer humidity. Fits gently through the waist without pulling on the buttons.", author: "Camilla M.", size: "M", when: "2 weeks ago" },
  ],
};

const featured: Partial<Detail> = {
  description: "A signature piece of the warm season, the Square-Neck Buttoned Linen Dress balances vintage femininity with sharp architectural lines. Crafted from tightly woven medium-weight French flax linen that softens beautifully with age.",
  bullets: [
    "Crisp square neckline framing collarbones",
    "Functional covered self-fabric buttons from neck to hem",
    "Gently gathered elbow-length sleeves with elastic cuffs",
    "Concealed seam pockets at hips",
    "Model is 5'10\" (178cm) and wearing a size Small",
  ],
  fitNote: "True to size. Tailored bodice with comfortable ease through the A-line skirt.",
  valueProp: { title: "100% Normandy Certified Flax Linen", text: "Naturally breathable, temperature-regulating, and pre-washed for effortless drape without stiffness. Zero microplastics." },
  reviews: featuredReviews,
};

type DetailInput = Pick<ShopProduct, "id" | "name" | "material">;

/** Stable 1–99 number derived from the slug, for the "Slow craft №" label. */
const craftNo = (id: string) => (Array.from(id).reduce((n, c) => n + c.charCodeAt(0), 0) % 99) + 1;

export function getDetail(p: DetailInput): Detail {
  const m = materialCopy[p.material] ?? materialCopy["flax-linen"];
  const n = craftNo(p.id);
  const base: Detail = {
    description: `A signature piece of the season, the ${p.name} pairs quiet tailoring with ${materialName(p.material).toLowerCase()} that softens beautifully with wear.`,
    bullets: [`Crafted from ${materialName(p.material).toLowerCase()}`, "Hand-finished seams and a clean interior", "Pre-washed for a soft hand-feel", "Model is 5'10\" (178cm) and wearing a size Small"],
    fabric: [`Composition: ${materialName(p.material)}`, ...m.care],
    shipping,
    fitNote: "True to size. Tailored through the body with comfortable ease.",
    valueProp: { title: m.title, text: m.text },
    capsule: "Summer capsule",
    slowCraft: `Slow craft № ${String(n).padStart(2, "0")}`,
  };
  return p.id === "square-neck-buttoned-linen-dress" ? { ...base, ...featured, fabric: base.fabric } : base;
}

export const pairings = [
  { id: "pair-capri-sandal", name: "Capri Leather Strap Sandal", category: "Footwear", price: 95, tone: "#b5774a" },
  { id: "pair-raffia-bag", name: "Woven Raffia Market Bag", category: "Accessories", price: 110, tone: "#c9a46c" },
  { id: "pair-gold-hoops", name: "Hammered Aurelia Gold Hoops", category: "Fine jewelry", price: 75, tone: "#d9c4a4" },
  { id: "pair-linen-sunhat", name: "Frayed Brim Linen Sunhat", category: "Headwear", price: 65, tone: "#e0cfae" },
] as const;

/** Lighten/darken a hex colour toward white (t>0) or black (t<0). */
function shade(hex: string, t: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(t >= 0 ? c + (255 - c) * t : c * (1 + t)));
  return `#${ch.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function makeSlides(p: Pick<ShopProduct, "id" | "tone"> & { images?: string[] }) {
  const labels = ["Full look", "Texture detail", "Model silhouette", "Styled angle"];
  const tweak = [0, 0.18, -0.12, 0.32];
  return labels.map((label, i) => ({ label, src: p.images?.[i] ?? (i === 0 ? `/images/shop/${p.id}.jpg` : `/images/shop/${p.id}-${i + 1}.jpg`), tone: shade(p.tone, tweak[i]) }));
}
