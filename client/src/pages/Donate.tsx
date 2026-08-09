import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Landmark, Smartphone, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  fetchPrograms,
  fetchWebsiteSettings,
  submitDonation,
  type DonationPaymentMethod,
  type PublicProgram,
  type PublicWebsiteSettings,
} from "@/lib/shds-api";

const inputClassName =
  "border-2 border-gray-300 rounded-xl focus:border-[#2d8659] focus:ring-2 focus:ring-[#2d8659]/20 transition-all duration-300";

const selectClassName =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#2d8659] focus:ring-2 focus:ring-[#2d8659]/20 transition-all duration-300";

interface FormState {
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: string;
  currency: string;
  programId: string;
  message: string;
  paymentMethod: DonationPaymentMethod | "";
  transactionReference: string;
  isAnonymous: boolean;
}

const initialFormState: FormState = {
  donorName: "",
  donorEmail: "",
  donorPhone: "",
  amount: "",
  currency: "PKR",
  programId: "",
  message: "",
  paymentMethod: "",
  transactionReference: "",
  isAnonymous: false,
};

const PAYMENT_METHODS: { value: DonationPaymentMethod; label: string; icon: typeof Landmark }[] = [
  { value: "bank_transfer", label: "Bank Transfer", icon: Landmark },
  { value: "jazzcash", label: "JazzCash", icon: Smartphone },
  { value: "easypaisa", label: "Easypaisa", icon: Smartphone },
];

export default function Donate() {
  usePageTitle("Donate");

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const [programs, setPrograms] = useState<PublicProgram[]>([]);
  const [settings, setSettings] = useState<PublicWebsiteSettings | null>(null);

  useEffect(() => {
    fetchPrograms().then(setPrograms).catch(() => setPrograms([]));
    fetchWebsiteSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Screenshot must be smaller than 5MB.");
      e.target.value = "";
      return;
    }
    setScreenshot(file || null);
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formData.donorName.trim()) nextErrors.donorName = "Your name is required.";

    if (formData.donorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donorEmail)) {
      nextErrors.donorEmail = "Enter a valid email address.";
    }

    if (formData.donorPhone && !/^[+\d][\d\s-]{6,}$/.test(formData.donorPhone)) {
      nextErrors.donorPhone = "Enter a valid phone number.";
    }

    const amountNum = Number(formData.amount);
    if (!formData.amount || Number.isNaN(amountNum) || amountNum <= 0) {
      nextErrors.amount = "Enter a donation amount greater than zero.";
    }

    if (!formData.paymentMethod) {
      nextErrors.paymentMethod = "Please select a payment method.";
    }

    if (!formData.transactionReference.trim()) {
      nextErrors.transactionReference = "Transaction reference/ID is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const message = await submitDonation({
        donorName: formData.donorName,
        donorEmail: formData.donorEmail || undefined,
        donorPhone: formData.donorPhone || undefined,
        amount: formData.amount,
        currency: formData.currency,
        programId: formData.programId ? Number(formData.programId) : undefined,
        message: formData.message || undefined,
        paymentMethod: formData.paymentMethod as DonationPaymentMethod,
        transactionReference: formData.transactionReference,
        isAnonymous: formData.isAnonymous,
        screenshot,
      });
      toast.success(message);
      setIsSubmitted(true);
      setFormData(initialFormState);
      setScreenshot(null);
    } catch (error) {
      console.error("Donation submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Donate</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Your support helps SHDS build resilient, healthy, and educated communities across rural Sindh.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {isSubmitted ? (
            <Card className="p-10 text-center border-2 border-[#2d8659] rounded-2xl shadow-md">
              <CheckCircle2 className="w-16 h-16 text-[#2d8659] mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank you for your donation!</h2>
              <p className="text-gray-600 text-lg mb-8">
                We've received your submission and will verify your payment shortly. You'll receive a
                confirmation email once it's verified.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-[#2d8659] hover:bg-[#1b5e3f] text-white px-8 py-6 text-lg font-semibold"
              >
                Make Another Donation
              </Button>
            </Card>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Make a Donation</h2>
              <p className="text-gray-600 text-lg mb-12">
                Fill out the form below. After choosing a payment method, we'll show you the account
                details to send your donation to.
              </p>

              <Card className="p-8 border-0 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Donor Name */}
                  <div>
                    <Label htmlFor="donorName" className="text-gray-900 font-semibold mb-2 block">
                      Donor Name *
                    </Label>
                    <Input
                      id="donorName"
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={inputClassName}
                    />
                    {errors.donorName && <p className="text-sm text-red-600 mt-1">{errors.donorName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <Label htmlFor="donorEmail" className="text-gray-900 font-semibold mb-2 block">
                        Email Address
                      </Label>
                      <Input
                        id="donorEmail"
                        name="donorEmail"
                        type="email"
                        value={formData.donorEmail}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className={inputClassName}
                      />
                      {errors.donorEmail && <p className="text-sm text-red-600 mt-1">{errors.donorEmail}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="donorPhone" className="text-gray-900 font-semibold mb-2 block">
                        Phone Number
                      </Label>
                      <Input
                        id="donorPhone"
                        name="donorPhone"
                        type="tel"
                        value={formData.donorPhone}
                        onChange={handleChange}
                        placeholder="+92-300-XXXXXXX"
                        className={inputClassName}
                      />
                      {errors.donorPhone && <p className="text-sm text-red-600 mt-1">{errors.donorPhone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Amount */}
                    <div>
                      <Label htmlFor="amount" className="text-gray-900 font-semibold mb-2 block">
                        Donation Amount *
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="e.g. 5000"
                        className={inputClassName}
                      />
                      {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
                    </div>

                    {/* Currency */}
                    <div>
                      <Label htmlFor="currency" className="text-gray-900 font-semibold mb-2 block">
                        Currency
                      </Label>
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className={selectClassName}
                      >
                        <option value="PKR">PKR — Pakistani Rupee</option>
                        <option value="USD">USD — US Dollar</option>
                        <option value="GBP">GBP — British Pound</option>
                        <option value="EUR">EUR — Euro</option>
                      </select>
                    </div>
                  </div>

                  {/* Program (optional) */}
                  {programs.length > 0 && (
                    <div>
                      <Label htmlFor="programId" className="text-gray-900 font-semibold mb-2 block">
                        Donate Towards a Program (Optional)
                      </Label>
                      <select
                        id="programId"
                        name="programId"
                        value={formData.programId}
                        onChange={handleChange}
                        className={selectClassName}
                      >
                        <option value="">General donation</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="text-gray-900 font-semibold mb-2 block">
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Leave a note with your donation..."
                      rows={4}
                      className={inputClassName}
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label className="text-gray-900 font-semibold mb-3 block">Payment Method *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.paymentMethod === value
                              ? "border-[#2d8659] bg-[#2d8659]/5 shadow-md"
                              : "border-gray-200 hover:border-[#2d8659]/50"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              formData.paymentMethod === value ? "text-[#2d8659]" : "text-gray-500"
                            }`}
                          />
                          <span className="text-sm font-semibold text-gray-800">{label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.paymentMethod && (
                      <p className="text-sm text-red-600 mt-2">{errors.paymentMethod}</p>
                    )}
                  </div>

                  {/* Payment details, shown once a method is picked */}
                  {formData.paymentMethod && (
                    <div className="border-2 border-[#2d8659]/30 bg-[#2d8659]/5 rounded-xl p-6">
                      <p className="text-sm font-semibold text-[#2d8659] mb-3 uppercase tracking-wide">
                        Send your donation to
                      </p>

                      {formData.paymentMethod === "bank_transfer" && (
                        <div className="space-y-1.5 text-gray-800">
                          <p>
                            <span className="font-semibold">Account Title:</span>{" "}
                            {settings?.donation_account_title || "—"}
                          </p>
                          <p>
                            <span className="font-semibold">Bank Name:</span>{" "}
                            {settings?.donation_bank_name || "—"}
                          </p>
                          <p>
                            <span className="font-semibold">Account Number:</span>{" "}
                            {settings?.donation_account_number || "—"}
                          </p>
                          <p>
                            <span className="font-semibold">IBAN:</span>{" "}
                            {settings?.donation_iban || "—"}
                          </p>
                          {settings?.donation_swift_code && (
                            <p>
                              <span className="font-semibold">SWIFT/BIC (for international transfers):</span>{" "}
                              {settings.donation_swift_code}
                            </p>
                          )}
                        </div>
                      )}

                      {formData.paymentMethod === "jazzcash" && (
                        <p className="text-gray-800">
                          <span className="font-semibold">JazzCash Number:</span>{" "}
                          {settings?.donation_jazzcash_number || "—"}
                        </p>
                      )}

                      {formData.paymentMethod === "easypaisa" && (
                        <p className="text-gray-800">
                          <span className="font-semibold">Easypaisa Number:</span>{" "}
                          {settings?.donation_easypaisa_number || "—"}
                        </p>
                      )}

                      {settings?.donation_instructions && (
                        <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-[#2d8659]/20">
                          {settings.donation_instructions}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Transaction Reference */}
                  <div>
                    <Label htmlFor="transactionReference" className="text-gray-900 font-semibold mb-2 block">
                      Transaction Reference / Transaction ID *
                    </Label>
                    <Input
                      id="transactionReference"
                      name="transactionReference"
                      value={formData.transactionReference}
                      onChange={handleChange}
                      placeholder="e.g. TRX123456 or bank transfer reference"
                      className={inputClassName}
                    />
                    {errors.transactionReference && (
                      <p className="text-sm text-red-600 mt-1">{errors.transactionReference}</p>
                    )}
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <Label htmlFor="screenshot" className="text-gray-900 font-semibold mb-2 block">
                      Payment Screenshot (Optional)
                    </Label>
                    <label
                      htmlFor="screenshot"
                      className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-[#2d8659] transition-colors duration-300"
                    >
                      <Upload className="w-5 h-5 text-gray-500 shrink-0" />
                      <span className="text-sm text-gray-600 truncate">
                        {screenshot ? screenshot.name : "Click to upload a screenshot or receipt (PNG, JPG, PDF)"}
                      </span>
                      <input
                        id="screenshot"
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp,.pdf"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Anonymous */}
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isAnonymous: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-[#2d8659] focus:ring-[#2d8659]"
                    />
                    Make this donation anonymous
                  </label>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2d8659] hover:bg-[#1b5e3f] text-white py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Donation"}
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    * Required fields. Your donation will be verified by our team before being confirmed.
                  </p>
                </form>
              </Card>
            </>
          )}
        </div>
      </section>
    </div>
  );
}