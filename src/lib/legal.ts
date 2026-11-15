/**
 * Facts used by the Terms and Privacy pages. Edit this one file — the legal text reads from it.
 * The values below come from the Figma mock-ups (a fictional maison); replace them with your real company details.
 * While you run `npm run dev` a banner on both pages reminds you until you do (it never shows in production).
 */
export const legal = {
  brand: "Elegent",
  siteHost: "elegent.luxury",

  // The mock-ups name the legal entity differently on each page — keep or unify them here.
  privacyEntity: "Elegent Boutique SARL",
  termsEntity: "Elegent Maison S.A.",
  registration: "REGISTRATION RCS PARIS B 492 810 392",
  legalAddress: "Bureau Juridique • 18 Place Vendôme, 75001 Paris",

  privacy: { revised: "October 2024", rev: "REV. 2024.10", docRef: "ELG-DPO-882", jurisdiction: "Paris · Milan · Geneva" },
  terms: { effective: "October 14, 2024", edition: "Vol. 2024 / Edition IV", jurisdiction: "Paris & Geneva", leadTime: "28 to 45 Days", exchangeWindow: "14 Days Post-Delivery", tier: "Complimentary Concierge" },

  emails: {
    dpo: "dpo-paris@elegent-atelier.com",
    concierge: "concierge@elegent-atelier.com",
    ombudsman: "ombudsman@elegent-atelier.com",
    inquiryTo: "concierge@elegent-atelier.com", // where the Terms page "legal inquiry" form is delivered
  },
  hours: "Mon – Sat, 9:00 - 19:00 CET",
  offices: {
    paris: { name: "Parisian Atelier Office", lines: ["Bureau de Protection des Données Elegent", "18 Rue du Faubourg Saint-Honoré", "75008 Paris, France"], email: "dpo-paris@elegent-atelier.com" },
    milan: { name: "Milanese Tailoring Chamber", lines: ["Ufficio Riservatezza & Sartoria Elegent", "Via Monte Napoleone 12", "20121 Milano, Italy"], email: "concierge@elegent-atelier.com" },
  },
};

export type Legal = typeof legal;

/** What still holds the mock-up's sample data. */
export function legalPlaceholders(l: Legal = legal): string[] {
  const out: string[] = [];
  if ([l.emails.dpo, l.emails.concierge, l.emails.ombudsman].some((e) => e.endsWith("@elegent-atelier.com"))) out.push("emails");
  if (l.registration.includes("492 810 392")) out.push("registration");
  if (l.legalAddress.includes("Vendôme") || l.offices.paris.lines.some((x) => x.includes("Saint-Honoré"))) out.push("addresses");
  return out;
}
