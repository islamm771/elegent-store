import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <>
      <section className="px-4 pb-6 pt-2 lg:hidden">
        <div className="flex flex-col gap-3 rounded-[8px] bg-sand p-5">
          <p className="label-caps text-accent">Join Elegent Society</p>
          <h3 className="font-serif text-2xl font-semibold leading-8">Receive Private Seasonal Previews</h3>
          <p className="text-[13px] leading-5 text-ink-muted">Be first to view archival re-releases and members-only salons.</p>
          <NewsletterForm className="pt-1" />
        </div>
      </section>

      <section className="hidden py-12 lg:block">
        <div className="mx-auto max-w-360 px-4 lg:px-6">
          <div className="flex flex-col items-center gap-4 rounded-[8px] bg-sand px-8 py-16 text-center">
            <p className="eyebrow text-accent">The private salon</p>
            <h2 className="font-serif text-5xl font-semibold leading-[56px] tracking-[-0.025em]">Join the Elegent Society</h2>
            <p className="max-w-2xl text-[15px] leading-6 text-ink-muted">
              Receive early private access to limited batch capsule drops, seasonal lookbooks, and invitations to private styling salons in Paris, Milan, and New York.
            </p>
            <NewsletterForm className="w-full max-w-lg pt-4" placeholder="Enter your private email..." />
          </div>
        </div>
      </section>
    </>
  );
}
