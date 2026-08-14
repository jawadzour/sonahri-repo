export type DonationPaymentMethod = "bank_transfer" | "jazzcash" | "easypaisa";

export const DONATION_CURRENCIES = ["PKR", "USD", "GBP", "EUR"] as const;

export const DONATION_PROGRAMS = [
  "Education",
  "Health & Nutrition (MNCH & Family Planning)",
  "WASH (Water, Sanitation & Hygiene)",
  "Livelihoods & Food Security",
  "Women Empowerment & Gender-Based Violence",
  "Disaster Risk Reduction & Emergency Response",
  "Social Mobilization & Community Development",
] as const;

export const DONATION_PAYMENT_METHODS: {
  id: DonationPaymentMethod;
  label: string;
}[] = [
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "jazzcash", label: "JazzCash" },
  { id: "easypaisa", label: "EasyPaisa" },
];

/**
 * SHDS official payment/donation details shown to donors after they pick a
 * payment method. Update these with the organization's real account details.
 */
export const DONATION_PAYMENT_DETAILS: Record<
  DonationPaymentMethod,
  { title: string; fields: { label: string; value: string }[] }
> = {
  bank_transfer: {
    title: "Bank Transfer",
    fields: [
      { label: "Account Title", value: "Sonahri Humanitarian Development Society" },
      { label: "Bank Name", value: "Habib Bank Limited (HBL)" },
      { label: "Account Number", value: "1234-5678901-01" },
      { label: "IBAN", value: "PK00 HABB 0001 2345 6789 0101" },
    ],
  },
  jazzcash: {
    title: "JazzCash",
    fields: [{ label: "Account Number", value: "0333-2592501" }],
  },
  easypaisa: {
    title: "EasyPaisa",
    fields: [{ label: "Account Number", value: "0312-6083699" }],
  },
};