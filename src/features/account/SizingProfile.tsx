import { href } from '@/lib/account';
import Link from 'next/link';
import { Card } from './Parts';
import { AccountUser } from './types';

function SizingProfile({ user }: { user: AccountUser }) {
  const m = user.measurements;
  const cells = [["Bust", m.bust], ["Waist", m.waist], ["Hip", m.hip], ["Inseam", m.inseam]] as const;
  const any = cells.some(([, v]) => v) || m.size;
  return (
    <Card eyebrow="Master tailor metrics" title="Custom Sizing Capsule" action={<Link href={href("sizing")} className="label-caps text-accent underline underline-offset-2">Edit</Link>}>
      {any ? (
        <>
          <ul className="grid grid-cols-4 gap-2">
            {cells.map(([l, v]) => (
              <li key={l} className="flex flex-col items-center rounded-sm bg-white py-3 shadow-hairline">
                <span className="text-[10px] uppercase tracking-wider text-ink-subtle">{l}</span>
                <span className="text-lg font-semibold leading-6.5">{v ?? "—"}{v ? <small className="pl-0.5 text-[13px] font-normal text-ink-subtle">cm</small> : null}</span>
              </li>
            ))}
          </ul>
          <p className="flex justify-between rounded-[2px] bg-field/60 px-2 py-1 text-[13px]"><span className="text-ink-muted">Default size</span><b>{m.size ? m.size.toUpperCase() : "Not set"}</b></p>
        </>
      ) : (
        <p className="text-[15px] leading-6 text-ink-muted">Save your measurements so we can pre-select the right size and tailor every piece before dispatch.</p>
      )}
    </Card>
  );
}

export default SizingProfile