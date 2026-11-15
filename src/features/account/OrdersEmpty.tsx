import { PackageIcon } from '@/ui';
import Link from 'next/link';
import { Card } from './Parts';

function OrdersEmpty() {
  return (
    <Card eyebrow="Order vault" title="No orders yet">
      <div className="flex flex-col items-start gap-3">
        <span className="grid size-12 place-items-center rounded-pill bg-[#fed9b9]"><PackageIcon width={20} height={20} /></span>
        <p className="max-w-md text-[15px] leading-6 text-ink-muted">When you place an order, you’ll be able to follow its courier, download the invoice and reorder from here.</p>
        <Link href="/shop" className="rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-widest text-white shadow-cta hover:bg-ink">Browse the capsule</Link>
      </div>
    </Card>
  );
}

export default OrdersEmpty