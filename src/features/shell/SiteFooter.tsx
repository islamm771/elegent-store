import { NewsletterForm } from "@/features/home/NewsletterForm";
import Link from "next/link";

const collections = ["Women’s Atelier", "Men’s Tailoring", "Kids Capsule", "Fine Jewelry", "Footwear & Leather", "The Lookbook"];
const concierge = ["Complimentary Shipping", "Returns & Exchanges", "Private Styling Session", "Garment Care Guide", "Track Your Order", "Boutique Locations"];

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="eyebrow text-accent">{title}</h3>
      <ul className="flex flex-col gap-3 text-[15px] text-ink-muted">
        {items.map((i) => <li key={i}><Link href="/shop" className="hover:text-ink">{i}</Link></li>)}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-surface shadow-[0_-1px_6px_rgba(45,34,27,0.03)] lg:block">
      <div className="mx-auto grid max-w-360 grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] gap-12 px-4 lg:px-6 py-6 lg:py-12">
        <div className="flex flex-col gap-3 col-span-2 lg:col-span-1">
          <Link href="/" className="font-serif text-xl font-bold uppercase tracking-[4px] text-black lg:font-sans lg:text-2xl lg:tracking-[6px]">Elegent</Link>
          <p className="max-w-sm text-[15px] leading-6 text-ink-muted">An editorial sanctuary for contemporary couture, slow craft, and quiet luxury tailoring. Designed for discerning aesthetics worldwide.</p>
        </div>
        <Column title="Collections" items={collections} />
        <Column title="Client concierge" items={concierge} />
        <div className="flex flex-col gap-4 col-span-2 lg:col-span-1">
          <h3 className="eyebrow text-accent">The editorial dispatch</h3>
          <p className="text-[15px] leading-6 text-ink-muted">Subscribe to receive curated seasonal drops, bespoke invitations, and sustainable fashion narratives directly from our creative director.</p>
          <NewsletterForm placeholder="Enter your email address" button="Subscribe" />
          <p className="text-[11px] leading-4 text-ink-subtle">
            By subscribing, you accept our <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/terms" className="underline">Terms of Editorial Membership</Link>.
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex flex-wrap max-w-360 items-center justify-between gap-4 px-6 pt-5 pb-20 lg:py-5 text-[13px] text-ink-muted">
          <p>© 2025 Elegent Boutique. All rights reserved.</p>
          <p className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink">Terms of Service</Link>
          </p>
          <p className="eyebrow text-accent">Certified ethical craftsmanship</p>
        </div>
      </div>
    </footer>
  );
}
