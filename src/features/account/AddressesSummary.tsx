import { href } from '@/lib/account';
import Link from 'next/link';
import { Card } from './Parts';
import { AccountUser } from './types';

function AddressesSummary({ user }: { user: AccountUser }) {
  return (
    <Card eyebrow="Private residences" title="Saved Addresses" action={<Link href={href("addresses")} className="label-caps text-accent underline underline-offset-2">Manage</Link>}>
      {user.addresses.length === 0 ? (
        <p className="text-[15px] leading-6 text-ink-muted">No saved addresses yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {user.addresses.slice(0, 2).map((a) => (
            <li key={a.id} className="rounded-sm bg-white p-3 shadow-hairline">
              <p className="flex items-center justify-between text-base font-semibold leading-6">{a.label}{a.isDefault && <span className="rounded-[2px] bg-[#fed9b9] px-2 text-[9px] font-bold uppercase leading-5 text-[#795d44]">Default</span>}</p>
              <p className="text-[13px] leading-5 text-ink-muted">{a.line1}, {a.city}, {a.country}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default AddressesSummary