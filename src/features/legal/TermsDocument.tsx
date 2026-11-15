import { Photo } from "@/features/home/Photo";
import { legal as L } from "@/lib/legal";
import { BadgeCheckIcon, CheckIcon, ClockIcon, GlobeIcon, MailIcon, ShieldIcon, XIcon } from "@/ui";
import { InquiryForm } from "./InquiryForm";
import { LegalLayout } from "./LegalLayout";
import { PrintButton } from "./PrintButton";
import { Clause, Crumbs, IndexCard, SectionArticle, mailto } from "./ui";

const sections = [
  { id: "acceptance", title: "Acceptance of Atelier Terms" },
  { id: "craftsmanship", title: "Bespoke Craftsmanship & Made-to-Order" },
  { id: "pricing", title: "Pricing, Currencies & Valued Taxes" },
  { id: "logistics", title: "Global White-Glove Logistics" },
  { id: "returns", title: "Returns & First Alteration Guarantee" },
  { id: "ip", title: "Intellectual Property & Haute Rights" },
  { id: "law", title: "Governing Law & Concierge Arbitration" },
];

const Group = ({ children }: { children: React.ReactNode }) => <div className="flex flex-col gap-4">{children}</div>;

export async function TermsDocument() {
  return (
    <LegalLayout>
      <section className="bg-surface py-5 lg:py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <Crumbs items={["Home", "Legal", "Terms of Service"]} />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] tracking-[0.05em]">
            <span className="flex items-center gap-2 font-medium text-accent"><span className="size-1.5 rounded-[12px] bg-accent" />{L.terms.edition}</span>
            <span className="hidden text-ink-faint lg:inline">|</span>
            <span className="uppercase text-ink-muted">Effective: {L.terms.effective}</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 lg:px-14 lg:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 lg:gap-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="flex flex-col items-start gap-4 lg:col-span-8">
              <span className="rounded-[12px] bg-line px-3 py-1 text-[11px] font-semibold uppercase leading-6 tracking-[0.1em] text-accent">Legal codex &amp; haute atelier covenant</span>
              <h1 className="text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-black lg:text-[60px] lg:leading-[60px]">Terms of Service &amp; <i className="font-normal">Atelier</i><br /><i className="font-normal">Conditions</i></h1>
              <p className="max-w-3xl pt-1 text-[16px] leading-7 text-ink-muted lg:text-lg">The governing principles for bespoke orders, curated ready-to-wear acquisitions, and exclusive atelier membership across all continental salons and the digital boutique.</p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
              <PrintButton className="w-full bg-line text-black hover:bg-sand lg:w-auto"><span aria-hidden>↓</span>Download legal codex (PDF)</PrintButton>
              <p className="text-[11px] tracking-[0.025em] text-ink-subtle print:hidden">Opens your browser’s print dialog — choose “Save as PDF”.</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-6 bg-surface px-6 pb-6 pt-8 shadow-hairline lg:grid-cols-4">
            {[["Standard jurisdiction", L.terms.jurisdiction], ["Made-to-order lead", L.terms.leadTime], ["Exchange window", L.terms.exchangeWindow], ["White-glove tier", L.terms.tier]].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1"><dt className="text-[10px] uppercase leading-6 tracking-[0.1em] text-accent">{k}</dt><dd className="text-[16px] leading-6 text-black lg:text-lg lg:leading-7">{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="pb-10 lg:pb-12">
        <div className="relative mx-auto flex h-70 max-w-360 px-4 items-end overflow-hidden bg-line shadow-cta lg:h-96 lg:px-6">
          <Photo src="/images/legal/atelier.jpg" tone="#b9a584" alt="" className="w-full h-full absolute! inset-0" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 via-50% to-transparent" />
          <div className="relative flex max-w-xl flex-col gap-2 p-6 lg:p-12">
            <p className="text-[10px] uppercase leading-6 tracking-widest text-peach">The sartorial promise</p>
            <p className="text-[18px] italic leading-7 text-white lg:text-2xl lg:leading-8">“Every silhouette drafted in our salons is an enduring pact of material reverence, quiet precision, and mutual integrity.”</p>
          </div>
        </div>
      </section>

      <div className="px-4 pb-16 lg:px-14 lg:pb-24">
        <div className="mx-auto grid max-w-360 gap-8 px-4 lg:px-6 lg:grid-cols-12 lg:gap-16">
          <aside className="flex flex-col gap-5 lg:sticky lg:top-[122px] lg:col-span-4 lg:gap-6 lg:self-start">
            <IndexCard title="Index of clauses" meta="7 Sections" sections={sections} marker="decimal" />

            <div className="flex flex-col gap-4 bg-black p-6 shadow-cta lg:p-7 print:hidden">
              <span className="grid size-10 place-items-center rounded-[12px] bg-sand/20 text-white"><MailIcon width={16} height={16} /></span>
              <h2 className="text-[20px] font-medium leading-7 tracking-[-0.025em] text-white">Private Atelier Concierge</h2>
              <p className="text-[12px] leading-[19.5px] text-[#858383]">Require personal assistance deciphering contractual clauses for bridal couture commissions, institutional acquisitions, or private runway reservations?</p>
              <div className="flex flex-col gap-2 pt-2 text-[12px]">
                <a href={`mailto:${L.emails.concierge}`} className="flex items-center gap-2 text-canvas"><MailIcon width={13} height={13} />{L.emails.concierge}</a>
                <p className="flex items-center gap-2 text-[#858383]"><ClockIcon width={13} height={13} />{L.hours}</p>
              </div>
              <a href={mailto(L.emails.concierge, "Request for formal advisory")} className="mt-1 bg-canvas py-3 text-center text-[12px] font-semibold uppercase tracking-[0.1em] text-black hover:bg-white">Request formal advisory</a>
            </div>

            <div className="flex flex-col items-center gap-2 bg-sand p-6 text-center">
              <ShieldIcon width={24} height={24} className="text-accent" />
              <p className="pt-1.5 text-[16px] leading-6 text-black">Cryptographic Authenticity</p>
              <p className="text-[12px] leading-[18px] text-ink-muted">All executed commissions are registered on our immutable provenance ledger. Certificates of Authenticity accompany every sealed parcel.</p>
            </div>
          </aside>

          <article className="flex flex-col gap-12 lg:col-span-8 lg:gap-16">
            <div className="relative flex flex-col gap-2 overflow-hidden bg-white p-6 shadow-hairline lg:p-10">
              <span aria-hidden className="absolute -right-8 -top-8 size-32 rounded-[12px] bg-[#fed9b9]/30 blur-[40px]" />
              <p className="relative text-[10px] font-semibold uppercase leading-6 tracking-[0.1em] text-accent">Notice of legal binding</p>
              <p className="relative text-[22px] leading-8 text-black lg:text-[30px] lg:leading-9">Welcome to the sanctuary of Elegent. These terms delineate the reciprocal devotion between our maison and your patronage.</p>
              <p className="relative pt-2 text-[14px] leading-[22.75px] text-ink-muted">By browsing our editorial archives, accessing our digital salon, placing an acquisition order for seasonal prêt-à-porter, or entering into an bespoke Made-to-Order commission with our master artisans, you unequivocally accede to these conditions. Please inspect each provision with thoughtful deliberation.</p>
            </div>

            <SectionArticle id="acceptance" no={1} title="Acceptance of Atelier Terms & Digital Covenant">
              <Group>
                <Clause n="1.1." title="Contractual Capacity.">Access to the Elegent platform and transactions conducted through our digital or physical salons are restricted to individuals who possess the full legal age of majority in their respective home jurisdiction (at minimum 18 years of age) and capacity to bind themselves contractually without reservation.</Clause>
                <Clause n="1.2." title="Affirmation of Consent.">Clicking “Finalize Atelier Acquisition,” issuing authorization for a customized sartorial invoice, or submitting a private sizing profile signifies complete and unconditional agreement to these terms, our associated <a href="/privacy" className="underline decoration-accent underline-offset-2">Privacy Framework</a>, and our Sustainable Craftsmanship Charter.</Clause>
                <Clause n="1.3." title="Periodic Revision.">Elegent reserves the sole editorial right to refine, modify, or modernize these conditions to mirror regulatory evolutions, raw fabric harvest cycles, or international maritime stipulations. Continued interaction after modifications constitute binding acceptance.</Clause>
              </Group>
            </SectionArticle>

            <SectionArticle id="craftsmanship" no={2} title="Bespoke Craftsmanship & Made-to-Order Policies">
              <Group>
                <Clause n="2.1." title="Artisanal Nuance & Natural Grain.">Our garments utilize naturally spun Mediterranean linen, unrefined raw Mulberry silks, organic brushed cashmere, and vegetal-tanned Tuscan calfskin. Variations in weave density, slubbing, and dye receptivity are innate characteristics of genuine slow-craft and are celebrated as unique signatures rather than defects.</Clause>
                <Clause n="2.2." title="Commission Timeline & Deposits." />
                <ul className="flex flex-col gap-3 pl-4">
                  {[["Made-to-Order Collections:", " Commences immediately upon receipt of 100% remittance. Standard construction window spans 21 to 35 business days prior to dispatch."], ["Bespoke Haute Couture:", " Requires an initial non-refundable 50% atelier deposit to secure textile allotment and master cutter scheduling. The residual 50% is due prior to final packaging."], ["Measurements & Digital Calibrations:", " Clients bear sole responsibility for accurate measurements provided via our virtual concierge session or submitted forms."]].map(([b, t]) => (
                    <li key={b} className="flex gap-3 text-[14px] leading-[22.75px] text-ink-muted"><CheckIcon width={13} height={13} className="mt-1.5 shrink-0 text-accent" /><span><b className="font-bold">{b}</b>{t}</span></li>
                  ))}
                </ul>
                <Clause n="2.3." title="Cancellation Limitations.">Because cloth is individually measured, sheared, and hand-stitched to your specifications, bespoke commissions cannot be cancelled or altered after 48 hours post-submission.</Clause>
              </Group>
            </SectionArticle>

            <div className="flex flex-col gap-4 bg-sand/80 p-6 shadow-hairline lg:p-10">
              <p className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.1em] text-accent"><BadgeCheckIcon width={16} height={16} />Patron privilege guarantee</p>
              <h3 className="text-[24px] font-medium leading-8 text-black lg:text-[30px] lg:leading-9">White-Glove Fitting &amp; Complimentary First Alteration</h3>
              <p className="text-[14px] leading-[22.75px] text-ink-muted">Every Made-to-Order garment purchased directly through Elegent is shielded by our Signature Fitting Guarantee. Should your garment require refined tapering, hem recalibration, or waist adjustment upon delivery:</p>
              <ol className="grid gap-4 pt-2 md:grid-cols-3">
                {[["1. Salon visit", "Complimentary tailoring session at our flagship ateliers in Paris, Milan, London, or New York."], ["2. Local tailor credit", "We subsidize up to $150 USD with your preferred local master tailor upon submission of invoice."], ["3. Round-trip re-fit", "Complimentary insured return to our Mediterranean workshop with expedited turnaround."]].map(([t, d]) => (
                  <li key={t} className="flex flex-col gap-1 bg-canvas p-4"><p className="text-[11px] font-bold uppercase leading-6 text-black">{t}</p><p className="text-[12px] leading-4 text-ink-muted">{d}</p></li>
                ))}
              </ol>
              <p className="pt-2 text-[12px] italic leading-4 text-ink-subtle">*Guarantee claims must be logged with Concierge within 14 calendar days from documented receipt.</p>
            </div>

            <SectionArticle id="pricing" no={3} title="Pricing, Currencies & Valued Import Duties">
              <Group>
                <Clause n="3.1." title="Currency Denominations.">All catalog pricing is rendered in Euros (€), United States Dollars ($), or British Pounds (£), determined by geolocation detection. Billing executes in the displayed currency.</Clause>
                <Clause n="3.2." title="Taxes, VAT, and Custom Levies (DDP vs DDU)." />
                <div className="flex flex-col gap-3 bg-field p-6">
                  {[[BadgeCheckIcon, "European Union, US, UK & GCC (DDP - Delivered Duty Paid)", "Prices are inclusive of all customs dues, import surcharges, and local Value Added Taxes. No auxiliary fees will be levied upon doorstep presentation."], [GlobeIcon, "Rest of the World (DDU - Delivered Duty Unpaid)", "Applicable customs brokerage fees and municipal duties remain the absolute obligation of the recipient and are evaluated upon domestic port arrival."]].map(([I, t, d], i) => {
                    const Icon = I as typeof GlobeIcon;
                    return <div key={t as string} className={`flex gap-3 ${i ? "pt-2" : ""}`}><Icon width={15} height={15} className="mt-0.5 shrink-0 text-accent" /><div className="flex flex-col gap-1"><p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.05em] text-black">{t as string}</p><p className="text-[12px] leading-[18px] text-ink-muted">{d as string}</p></div></div>;
                  })}
                </div>
                <Clause n="3.3." title="Price Rectification.">While meticulous curation prevents discrepancies, in the event of an inadvertent technical error resulting in an erroneous listed price, Elegent reserves the prerogative to cancel unfulfilled orders with immediate total reimbursement.</Clause>
              </Group>
            </SectionArticle>

            <SectionArticle id="logistics" no={4} title="Global White-Glove Shipping & Delivery Logistics">
              <Group>
                <Clause n="4.1." title="Climate-Neutral Air Courier.">We partner exclusively with premier specialized carriers (DHL Medical &amp; Luxury Express, Ferrari Group) ensuring continuous temperature control and 100% verified carbon-offset voyages.</Clause>
                <Clause n="4.2." title="Direct Signature Requisite.">Due to the intrinsic rarity and insured value of Elegent couture pieces, all shipments mandate in-person biometric or written physical signature upon delivery. Parcels will not be relinquished to unattended porches, communal mail lockers, or third-party forwarding depots without antecedent client indemnification.</Clause>
                <Clause n="4.3." title="Risk of Loss & Passage of Title.">Title of ownership and risk of loss transfers to the client at the precise moment of authenticated physical delivery. Damaged packaging must be marked on the carrier manifest prior to signature.</Clause>
              </Group>
            </SectionArticle>

            <SectionArticle id="returns" no={5} title="Returns, Alterations & Exchange Protocols">
              <Group>
                <Clause n="5.1." title="Curated Ready-to-Wear (RTW).">Unworn, undamaged garments featuring intact silk tags, tamper-evident security ribbon, and original cedar hanger packaging may be returned for exchange or boutique credit within fourteen (14) calendar days of delivery.</Clause>
                <Clause n="5.2." title="Exclusions from Return.">In accordance with international hygiene directives and haute couture exclusivity, the following categories are strictly non-returnable:</Clause>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {["Custom Monogrammed Pieces", "Bespoke & Tailored Silhouettes", "Intimate Body Linen & Swimwear", "Archival Vintage Archive Drops"].map((x) => (
                    <li key={x} className="flex items-center gap-2 bg-surface p-3 text-[12px] leading-4 text-ink-muted"><XIcon width={10} height={10} className="shrink-0 text-accent" strokeWidth={2.5} />{x}</li>
                  ))}
                </ul>
                <Clause n="5.3." title="Refund Modality.">Accepted returns undergo quality verification by our atelier conservator. Approved reimbursements are credited to the original payment channel within 5 to 7 operational banking days, deducting applicable regional courier collection fees.</Clause>
              </Group>
            </SectionArticle>

            <SectionArticle id="ip" no={6} title="Intellectual Property & Haute Atelier Rights">
              <Group>
                <Clause n="6.1." title="Design Patents & Silhouette Copyright.">All cut geometries, bespoke textile blends, embroidery schematics, brand insignias, visual lookbooks, and editorial photography are the proprietary artistic estate of {L.termsEntity}.</Clause>
                <Clause n="6.2." title="Prohibition of Reverse-Engineering.">Patrons and institutional purchasers explicitly covenant not to reproduce, digitize for 3D generative synthesis, deconstruct, or replicate any Elegent garment or bespoke accoutrement for commercial emulation or secondary derivative fabrication.</Clause>
                <Clause n="6.3." title="Media Use.">Editorial imagery may only be reproduced for non-commercial journalistic commentary accompanied by clear typographical attribution: “Elegent Haute Atelier.”</Clause>
              </Group>
            </SectionArticle>

            <SectionArticle id="law" no={7} title="Governing Law & Concierge Arbitration">
              <Group>
                <Clause n="7.1." title="Jurisdiction.">These conditions and any non-contractual obligations arising from or related to atelier transactions shall be governed by, and construed in conformity with, the substantive laws of France, disregarding conflict-of-law principles.</Clause>
                <Clause n="7.2." title="Friendly Conciliation Phase.">Before initiating any formal tribunal action, patrons agree to submit disputes to our Private Mediation Council via <a href={`mailto:${L.emails.ombudsman}`} className="underline decoration-accent underline-offset-2">{L.emails.ombudsman}</a>. We pledge an elevated sixty (60) day bespoke conciliation dialog conducted in good faith.</Clause>
                <Clause n="7.3." title="Arbitration Venue.">Should conciliation fail, all unresolved contentions shall be definitively adjudicated under the Rules of Arbitration of the International Chamber of Commerce (ICC) by one sole arbitrator appointed in alignment with said rules. The official seat of arbitration shall be Paris, France; proceedings shall proceed in the English language.</Clause>
              </Group>
            </SectionArticle>

            <section id="inquiry" className="scroll-mt-28 flex flex-col gap-5 bg-surface p-6 shadow-hairline lg:p-10 print:hidden">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1"><p className="text-[10px] font-bold uppercase leading-6 tracking-[0.1em] text-accent">Direct juridical channel</p><h2 className="text-[22px] font-medium leading-8 text-black lg:text-2xl">Bespoke Inquiries &amp; Legal Consultations</h2></div>
                <span className="w-fit rounded-[12px] bg-canvas px-3 py-1 text-[12px] leading-4 text-accent">Response within 24 Hours</span>
              </div>
              <p className="text-[14px] leading-[22.75px] text-ink-muted">If you represent a private styling office, museum exhibition conservatory, or bridal estate requiring specialized addendums or tailored contractual terms:</p>
              <InquiryForm fallbackEmail={L.emails.inquiryTo} />
            </section>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between lg:pt-8">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-[12px] bg-field text-[20px] font-bold italic text-accent">E</span>
                <div><p className="text-[16px] leading-5 text-black">{L.termsEntity}</p><p className="text-[12px] leading-4 text-ink-subtle">{L.legalAddress}</p></div>
              </div>
              <div className="flex flex-col sm:items-end"><p className="text-[14px] italic leading-5 text-accent">Signed by direction of the Conservateur</p><p className="text-[11px] uppercase leading-6 tracking-[0.1em] text-ink-subtle">{L.registration}</p></div>
            </div>
          </article>
        </div>
      </div>
    </LegalLayout>
  );
}
