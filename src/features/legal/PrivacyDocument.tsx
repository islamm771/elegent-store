import { ArrowUpRightIcon, BadgeCheckIcon, CheckIcon, DownloadIcon, GlobeIcon, LockIcon, MailIcon, PackageIcon, PinIcon, RulerIcon, ShieldIcon, UserIcon } from "@/ui";
import { legal as L } from "@/lib/legal";
import { LegalLayout } from "./LegalLayout";
import { PrintButton } from "./PrintButton";
import { Body, Crumbs, IndexCard, Pill, RomanArticle, mailto } from "./ui";

const sections = [
  { id: "overview", title: "Overview & Atelier Discretion" },
  { id: "information", title: "Information We Collect" },
  { id: "use", title: "How We Use Client Data" },
  { id: "payment", title: "Payment & Transaction Security" },
  { id: "cookies", title: "Cookies & Digital Experience" },
  { id: "transfers", title: "International Transfers & GDPR" },
  { id: "rights", title: "Client Rights & Concierge DPO" },
];

const highlights = [
  { icon: LockIcon, title: "Encrypted Bespoke Files", text: "Silhouette measures and tailoring notes are sealed in encrypted European vaults." },
  { icon: ShieldIcon, title: "Zero Commercial Resale", text: "We will never monetize, lease, or barter our client portfolio under any circumstance." },
  { icon: UserIcon, title: "VIP Sovereign Rights", text: "Full sovereignty over your profile with on-demand deletion and ledger retrieval." },
];

const cards = [
  { icon: RulerIcon, title: "Bespoke Fit & Atelier Data", text: "Precise posture analyses, dimensional silhouettes, lapel configurations, sleeve adjustments, and monogram specifications recorded during private sessions.", tag: "Stored in segregated encrypted archives" },
  { icon: UserIcon, title: "Identity & Concierge Record", text: "Full legal name, private residential destinations, confidential direct phone lines, correspondence preferences, and designated styling representatives.", tag: "Access limited to senior tailoring staff" },
  { icon: PackageIcon, title: "Global Transit & Customs", text: "Airway bill requirements, specialized courier drop authorizations, diplomatic delivery declarations, and localized import compliance clearance documents.", tag: "Audited courier vault dispatches" },
  { icon: GlobeIcon, title: "Digital Atelier Telemetry", text: "IP localization strictly for tax calculation and currency conversion, lookbook bookmarking behaviors, and wishlist preferences stored locally in your session.", tag: "Ephemerally cached · cookie configurable" },
];

const uses = [
  ["01", "Fulfillment of Bespoke Commissions", "Executing cutwork, allocating silk yardage from Como mills, calibrating shoulder balances, and coordinating armhole drops according to your exact morphology."],
  ["02", "Private Editorial Dispatches", "Transmitting bespoke invites to intimate trunk exhibitions, seasonal lookbook hardcovers, and discreet notifications regarding limited capsule releases."],
  ["03", "Diplomatic & Border Compliance", "Fulfilling European Union, Swiss Federal, and North American tax withholding charters on rare textiles, exotic hides, and precious bullion embellishments."],
];

const cookies = [
  ["Essential Atelier Cookies", "Required for secure session maintenance, cart persistence, and checkout token integrity.", "Mandatory", "field"],
  ["Aesthetic Customization", "Remembers your preferred lookbook viewing density, typography scale, and curated regional drop reminders.", "Configurable", "peach"],
  ["Performance Diagnostics", "Anonymized telemetry to ensure rapid asset rendering across high-DPI displays worldwide.", "Configurable", "peach"],
] as const;

const Office = ({ o, icon: Icon }: { o: (typeof L.offices)["paris"]; icon: typeof PinIcon }) => (
  <div className="flex flex-col gap-3 bg-canvas p-6 shadow-hairline">
    <p className="flex items-center gap-2 text-base font-medium leading-6"><Icon width={15} height={15} className="text-accent" />{o.name}</p>
    <p className="text-[12px] leading-[19.5px] text-ink-muted">{o.lines.map((l) => <span key={l} className="block">{l}</span>)}</p>
    <a href={`mailto:${o.email}`} className="pt-2 text-[12px] font-semibold tracking-[0.05em] text-black underline">{o.email}</a>
  </div>
);

export async function PrivacyDocument() {
  return (
    <LegalLayout>
      <section className="bg-surface px-4 py-4 shadow-hairline lg:px-14 lg:py-5">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Crumbs items={["Home", "Legal & Compliance", "Privacy Policy"]} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2 rounded-[12px] bg-field px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] shadow-hairline"><span className="size-2 rounded-[12px] bg-accent" />Formal atelier charter · {L.privacy.rev}</span>
            <span className="text-[12px] uppercase tracking-[0.05em] text-ink-muted">Document ref: {L.privacy.docRef}</span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-10 lg:px-14 lg:py-20">
        <div aria-hidden className="absolute -top-32 right-12 hidden size-96 rounded-[12px] bg-accent/10 blur-[64px] lg:block" />
        <div className="relative mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col gap-5 lg:col-span-8 lg:gap-6">
            <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-accent"><span className="h-[1.5px] w-10 bg-accent" />Haute couture discretion</p>
            <h1 className="text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-black lg:text-[60px] lg:leading-[60px]">Privacy Policy &amp;<br />Client Data Charter</h1>
            <p className="max-w-[672px] text-[16px] leading-7 text-ink-muted lg:text-lg">Our unwavering commitment to confidentiality, discretion, and safeguarding your personal information at the highest Mediterranean atelier standards.</p>
          </div>
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-4 bg-white p-6 shadow-cta">
              <p className="flex items-center justify-between text-[12px] uppercase tracking-[0.1em]"><span className="text-ink-muted">Last revised</span><b>{L.privacy.revised}</b></p>
              <p className="flex items-center justify-between gap-3 text-[12px] uppercase tracking-[0.1em]"><span className="text-ink-muted">Jurisdiction</span><b className="font-medium">{L.privacy.jurisdiction}</b></p>
              <PrintButton className="w-full bg-black text-white hover:bg-ink"><DownloadIcon width={15} height={15} />Download PDF charter</PrintButton>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 lg:px-14 lg:pb-12">
        <ul className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-3 lg:gap-6">
          {highlights.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 bg-field p-6 shadow-hairline">
              <Icon width={18} height={18} className="mt-1 shrink-0 text-accent" />
              <div><h2 className="text-[18px] leading-7 text-black">{title}</h2><p className="text-[12px] leading-[19.5px] text-ink-muted">{text}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <div className="px-4 pb-16 lg:px-14 lg:pb-28">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:gap-16">
          <aside className="flex flex-col gap-5 lg:sticky lg:top-[122px] lg:col-span-3 lg:self-start lg:gap-6">
            <IndexCard title="Index of articles" sections={sections} marker="roman" />
            <div className="flex flex-col gap-3 bg-line/60 p-6 shadow-hairline print:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Private counsel</p>
              <p className="text-[12px] leading-[19.5px] text-ink-muted">Require private consultation regarding our cryptographic records or personal archive?</p>
              <a href={mailto(L.emails.dpo, "Private consultation — personal archive")} className="flex items-center gap-2 text-[12px] font-bold uppercase leading-4 tracking-[0.05em] text-black">Inquire via PGP concierge <ArrowUpRightIcon width={10} height={10} /></a>
            </div>
          </aside>

          <article className="flex flex-col gap-14 lg:col-span-9 lg:gap-20">
            <blockquote className="relative overflow-hidden bg-surface p-6 shadow-cta lg:p-12">
              <span aria-hidden className="absolute -bottom-10 -right-6 select-none text-[128px] font-bold leading-[128px] opacity-5">“</span>
              <p className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-accent"><ShieldIcon width={12} height={12} />The Maison pledge</p>
              <p className="mt-4 text-[20px] font-normal italic leading-7 text-black lg:text-[24px] lg:leading-8">“Discretion is the purest cornerstone of haute luxury. Just as our artisans protect the secrets of master cutwork and hand-turned silks, we regard our patrons’ private identities with reverent sanctity.”</p>
              <footer className="pt-4 text-[12px] uppercase tracking-[0.1em] text-ink-muted">— Maison Elegent board of directors, Rue du Faubourg Saint-Honoré, Paris</footer>
            </blockquote>

            <RomanArticle id="overview" no={1} title="Overview & Atelier Discretion">
              <Body>{L.privacyEntity} (“Elegent”, “the Maison”, “we”, or “our”) operates curated physical salons across Paris, Milan, and Geneva, alongside our digital atelier hosted at {L.siteHost}. This Privacy Charter governs how our global houses handle the personal narratives, sartorial measurements, and transaction histories entrusted to us.</Body>
              <Body>We operate under the philosophy of <i>data minimalism</i>. We never accumulate peripheral telemetry that does not contribute directly to the enhancement of your bespoke appointments, fitting adjustments, private previews, and seamless cross-border shipping.</Body>
              <div className="flex flex-col gap-2 bg-field p-6 shadow-hairline">
                <p className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.1em] text-black"><BadgeCheckIcon width={15} height={15} className="text-accent" />Scope of application</p>
                <p className="text-[12px] leading-[19.5px] text-ink-muted">This charter extends across all Maison touchpoints: private atelier fittings, phone and concierge styling consultations, digital purchases via our curated drops, and private salon viewings during fashion calendar presentations.</p>
              </div>
            </RomanArticle>

            <RomanArticle id="information" no={2} title="Information We Collect">
              <Body>Depending on your relationship with Elegent—whether exploring our seasonal lookbooks or commissioning custom evening wear—the categories of personal archives we retain comprise:</Body>
              <div className="grid gap-4 pt-1 sm:grid-cols-2 lg:gap-6">
                {cards.map(({ icon: Icon, title, text, tag }) => (
                  <div key={title} className="flex flex-col gap-3 bg-surface p-6 shadow-hairline">
                    <span className="grid size-10 place-items-center rounded-[12px] bg-sand"><Icon width={16} height={16} /></span>
                    <h3 className="text-[18px] font-medium leading-7 text-black">{title}</h3>
                    <p className="text-[12px] leading-[19.5px] text-ink-muted">{text}</p>
                    <p className="text-[10px] font-bold uppercase leading-6 tracking-[0.05em] text-accent">{tag}</p>
                  </div>
                ))}
              </div>
            </RomanArticle>

            <RomanArticle id="use" no={3} title="How We Use Client Data">
              <Body>Every record collected serves the solitary goal of delivering flawless haute couture execution. Elegent deploys client records strictly under lawful, transparent legal grounds:</Body>
              <ol className="relative flex flex-col gap-6 bg-white p-6 shadow-cta lg:p-8">
                {uses.map(([n, t, d], i) => (
                  <li key={n} className={i ? "border-t border-field pt-6" : ""}>
                    <div className="flex gap-4"><span className="text-[20px] font-bold leading-7 text-accent">{n}</span>
                      <div className="flex flex-col gap-1"><h3 className="text-[14px] font-semibold uppercase leading-5 tracking-[0.05em] text-black">{t}</h3><p className="text-[12px] leading-[19.5px] text-ink-muted">{d}</p></div></div>
                  </li>
                ))}
              </ol>
            </RomanArticle>

            <RomanArticle id="payment" no={4} title="Payment & Transaction Security">
              <Body>Elegent does not store raw credit card numbers or banking credentials on public-facing architecture. Our financial conduit operates on end-to-end cryptographic tokenization governed by international Tier-1 PCI-DSS standards.</Body>
              <ul className="grid gap-6 bg-sand p-6 shadow-hairline sm:grid-cols-3 lg:p-8">
                {[[ShieldIcon, "PCI-DSS Level 1", "Certified under the most stringent payment safety rubric in global banking infrastructure."], [LockIcon, "Irreversible tokenization", "Card data is substituted with unique, mathematically disconnected alphanumeric tokens."], [BadgeCheckIcon, "3D-Secure 2.2", "Biometric authorization shields high-value acquisitions against identity spoofing."]].map(([I, t, d]) => {
                  const Icon = I as typeof ShieldIcon;
                  return <li key={t as string} className="flex flex-col gap-2"><p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.05em]"><Icon width={14} height={14} className="text-accent" />{t as string}</p><p className="text-[12px] leading-[19.5px] text-ink-muted">{d as string}</p></li>;
                })}
              </ul>
            </RomanArticle>

            <RomanArticle id="cookies" no={5} title="Cookies & Refined Experience Preferences">
              <Body>Our digital space utilizes cookies and local storage tokens to preserve your aesthetic preferences, such as selected currency display, language fluency, and saved boutique garments.</Body>
              <ul className="flex flex-col gap-3">
                {cookies.map(([t, d, pill, tone]) => (
                  <li key={t} className="flex flex-col gap-3 bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-[14px] font-semibold leading-5 text-black">{t}</p><p className="text-[12px] leading-4 text-ink-muted">{d}</p></div>
                    <Pill tone={tone}>{pill}</Pill>
                  </li>
                ))}
              </ul>
            </RomanArticle>

            <RomanArticle id="transfers" no={6} title="International Transfers & Rights under GDPR / CCPA">
              <Body>As a European luxury maison with clients across Tokyo, New York, London, and the Emirates, data may occasionally transit through Swiss secure relay centers or encrypted European servers.</Body>
              <Body>We execute European Commission-approved Standard Contractual Clauses (SCCs) and honor all statutory rights defined under the EU General Data Protection Regulation (GDPR), the UK Data Protection Act 2018, and the California Consumer Privacy Act (CCPA/CPRA).</Body>
              <div className="grid gap-4 sm:grid-cols-2">
                {[["European & UK rights (GDPR)", ["Right to access tailoring ledgers", "Right to erase biometric fit measurements", "Right to object to algorithmic profiling", "Right to portable cryptographic export"]], ["California patrons (CCPA / CPRA)", ["Strict “Do Not Sell My Info” compliance", "Zero discrimination for exercising rights", "Full annual disclosure of third-party vendors", "Direct correction of recorded personal addresses"]]].map(([t, items]) => (
                  <div key={t as string} className="flex flex-col gap-2 bg-field p-5">
                    <p className="text-[11px] font-bold uppercase leading-6 tracking-[0.05em] text-accent">{t as string}</p>
                    <ul className="flex flex-col gap-1.5">{(items as string[]).map((i) => <li key={i} className="flex gap-2.5 text-[12px] leading-4 text-ink-muted"><CheckIcon width={11} height={11} className="mt-0.5 shrink-0 text-accent" />{i}</li>)}</ul>
                  </div>
                ))}
              </div>
            </RomanArticle>

            <RomanArticle id="rights" no={7} title="Client Data Rights & Contact Data Protection Officer">
              <Body>You may request complete removal of your client history, order archival certificates, or inspect your tailor records at any point. Our appointed Data Protection Officer oversees every request personally with bespoke attention.</Body>
              <div className="flex flex-col gap-6 bg-surface p-6 shadow-cta lg:p-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Maison Data Protection Bureau</p><h3 className="text-[24px] leading-8 text-black">Direct Concierge Inquiries</h3></div>
                  <p className="flex items-center gap-2 text-[12px] uppercase tracking-[0.05em] text-ink-muted"><span className="size-2.5 rounded-[12px] bg-accent" />Guaranteed 24-hour confidential response</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                  <Office o={L.offices.paris} icon={PinIcon} />
                  <Office o={L.offices.milan} icon={MailIcon} />
                </div>
                <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between lg:pt-10">
                  <p className="text-[12px] leading-4 text-ink-muted">Prefer an automated archive package? Generate a certified report of all personal data held.</p>
                  <a href={mailto(L.emails.dpo, "Request for my data ledger", "Please send me a certified report of all personal data you hold about me.\n\nFull name:\nAccount email:\n")} className="shrink-0 bg-black px-6 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.05em] text-white shadow-hairline hover:bg-ink print:hidden">Request data ledger</a>
                </div>
              </div>
            </RomanArticle>
          </article>
        </div>
      </div>
    </LegalLayout>
  );
}
