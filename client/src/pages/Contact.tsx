import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Contact() {
  usePageTitle("Contact Us");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitInquiry = trpc.contact.submitInquiry.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Your inquiry has been received. We will get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "general",
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      const isBackendUnavailable =
        error.message?.includes("valid JSON") ||
        error.message?.includes("Unexpected token") ||
        error.message?.includes("Failed to fetch");
      toast.error(
        isBackendUnavailable
          ? "This is a preview version — the contact form isn't connected yet. It will work on the live site."
          : error.message || "Failed to submit inquiry. Please try again."
      );
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitInquiry.mutateAsync(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Get in touch with SHDS for inquiries, partnerships, or support
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-gray-900">Office Locations</h2>

          <div className="flex justify-center mb-12">

            {/* Head Office */}
            {/* Head Office */}
            <Card className="p-8 md:p-10 bg-white border-2 border-[#2d8659] rounded-2xl shadow-md mb-12">
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="w-8 h-8 text-[#2d8659]" />
                <h3 className="text-2xl font-bold text-gray-900">Head Office</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Location */}
                <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-[#2d8659] transition-colors duration-300">
                  <p className="text-sm font-semibold text-[#2d8659] mb-2 uppercase tracking-wide">Location</p>
                  <p className="text-gray-800 font-medium">Office No 323, Turkish Colony, Makli</p>
                  <p className="text-gray-600 text-sm mt-1">District Thatta, Sindh, Pakistan</p>
                </div>

                {/* Phone */}
                <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-[#2d8659] transition-colors duration-300">
                  <p className="text-sm font-semibold text-[#2d8659] mb-2 uppercase tracking-wide">Phone</p>
                  <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-gray-800 font-medium whitespace-nowrap">+92-333-2592501</p>
                    <p className="text-gray-800 font-medium whitespace-nowrap">+92-312-6083699</p>
                  </div>
                </div>

                {/* Email */}
                <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-[#2d8659] transition-colors duration-300">
                  <p className="text-sm font-semibold text-[#2d8659] mb-2 uppercase tracking-wide">Email</p>
                  <p className="text-gray-800 font-medium break-all">sonahri_thatto@yahoo.com</p>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Send us a Message</h2>
          <p className="text-gray-600 text-lg mb-12">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <Card className="p-8 border-0 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-gray-900 font-semibold mb-2 block">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                  className="
border-2 border-gray-300
rounded-xl
focus:border-[#2d8659]
focus:ring-2
focus:ring-[#2d8659]/20
transition-all duration-300"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-900 font-semibold mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                  className="
border-2 border-gray-300
rounded-xl
focus:border-[#2d8659]
focus:ring-2
focus:ring-[#2d8659]/20
transition-all duration-300"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-gray-900 font-semibold mb-2 block">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+92-300-XXXXXXX"
                  className="
border-2 border-gray-300
rounded-xl
focus:border-[#2d8659]
focus:ring-2
focus:ring-[#2d8659]/20
transition-all duration-300"
                />
              </div>

              {/* Inquiry Type */}
              <div>
                <Label htmlFor="inquiryType" className="text-gray-900 font-semibold mb-2 block">
                  Inquiry Type
                </Label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="
w-full px-4 py-3
border-2 border-gray-300
rounded-xl
focus:outline-none
focus:border-[#2d8659]
focus:ring-2
focus:ring-[#2d8659]/20
transition-all duration-300"
                >
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="donation">Donation/Support</option>
                  <option value="volunteer">Volunteer Opportunity</option>
                  <option value="employment">Employment Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <Label htmlFor="subject" className="text-gray-900 font-semibold mb-2 block">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="What is your inquiry about?"
                  className="
border-2 border-gray-300
rounded-xl
focus:border-[#2d8659]
focus:ring-2
focus:ring-[#2d8659]/20
transition-all duration-300"
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-gray-900 font-semibold mb-2 block">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Please provide details about your inquiry..."
                  rows={6}
                  className="
border-2 border-gray-300
rounded-xl
focus:border-[#2d8659]
focus:ring-2
focus:ring-[#2d8659]/20
transition-all duration-300"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2d8659] hover:bg-[#1b5e3f] text-white py-3 text-lg font-semibold"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                * Required fields. We respect your privacy and will only use your information to respond to your inquiry.
              </p>
            </form>
          </Card>
        </div>
      </section>

      {/* Response Time */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card
            className="
group
p-8
bg-gradient-to-r
from-[#2d8659]
to-[#1e5a96]
text-white
border-2
border-transparent
rounded-2xl
hover:border-orange-300
hover:shadow-2xl
hover:-translate-y-2
transition-all duration-300"
          >
            <h3 className="text-2xl font-bold mb-4">Response Time</h3>
            <p className="text-lg text-blue-100 leading-relaxed">
              We aim to respond to all inquiries within 2-3 business days. For urgent matters, please call our office directly. Thank you for your interest in SHDS and our mission to build resilient communities in rural Sindh.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
