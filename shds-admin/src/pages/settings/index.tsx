import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/crud/page-header";
import { ImageUpload } from "@/components/crud/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { settingsService } from "@/lib/settings-service";
import { getApiErrorMessage } from "@/lib/api";
import type { WebsiteSettings } from "@/types/models";

const schema = z.object({
  site_name: z.string().min(1, "Site name is required."),
  tagline: z.string().optional().or(z.literal("")),
  logo_url: z.string().optional().or(z.literal("")),
  favicon_url: z.string().optional().or(z.literal("")),
  contact_email: z.string().min(1, "Contact email is required.").email("Enter a valid email."),
  contact_phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  facebook_url: z.string().optional().or(z.literal("")),
  twitter_url: z.string().optional().or(z.literal("")),
  instagram_url: z.string().optional().or(z.literal("")),
  linkedin_url: z.string().optional().or(z.literal("")),
  youtube_url: z.string().optional().or(z.literal("")),
  maintenance_mode: z.boolean(),
  donation_bank_name: z.string().optional().or(z.literal("")),
  donation_account_title: z.string().optional().or(z.literal("")),
  donation_account_number: z.string().optional().or(z.literal("")),
  donation_iban: z.string().optional().or(z.literal("")),
  donation_swift_code: z.string().optional().or(z.literal("")),
  donation_raast_id: z.string().optional().or(z.literal("")),
  donation_instructions: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  site_name: "",
  tagline: "",
  logo_url: "",
  favicon_url: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  linkedin_url: "",
  youtube_url: "",
  maintenance_mode: false,
  donation_bank_name: "",
  donation_account_title: "",
  donation_account_number: "",
  donation_iban: "",
  donation_swift_code: "",
  donation_instructions: "",
};

export default function WebsiteSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await settingsService.getWebsiteSettings();
        const sanitized = Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, v === null ? "" : v])
        ) as unknown as FormValues;
        reset({ ...defaultValues, ...sanitized });
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load website settings."));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    try {
      await settingsService.updateWebsiteSettings(values as Partial<WebsiteSettings>);
      toast.success("Website settings saved.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save settings."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Website Settings" description="General site identity and contact details." />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full max-w-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Website Settings"
        description="General site identity, contact details, social links, and donation information."
        action={
          <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Site identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="site_name">Site name</Label>
              <Input id="site_name" {...register("site_name")} />
              {errors.site_name && <p className="text-xs text-destructive">{errors.site_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" {...register("tagline")} />
            </div>
            <div className="space-y-1.5">
              <Label>Logo</Label>
              <Controller
                control={control}
                name="logo_url"
                render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Favicon</Label>
              <Controller
                control={control}
                name="favicon_url"
                render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <Label htmlFor="maintenance_mode">Maintenance mode</Label>
                <p className="text-xs text-muted-foreground">Show a maintenance page on the public site.</p>
              </div>
              <Controller
                control={control}
                name="maintenance_mode"
                render={({ field }) => (
                  <Switch id="maintenance_mode" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact &amp; social</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact_email">Contact email</Label>
              <Input id="contact_email" type="email" {...register("contact_email")} />
              {errors.contact_email && (
                <p className="text-xs text-destructive">{errors.contact_email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_phone">Contact phone</Label>
              <Input id="contact_phone" {...register("contact_phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input id="facebook_url" {...register("facebook_url")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="twitter_url">Twitter / X</Label>
                <Input id="twitter_url" {...register("twitter_url")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input id="instagram_url" {...register("instagram_url")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input id="linkedin_url" {...register("linkedin_url")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="youtube_url">YouTube</Label>
                <Input id="youtube_url" {...register("youtube_url")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Donation information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Shown on the public Donate page. This is informational only — no payment
              gateway is connected yet, so donors transfer manually using these details.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="donation_bank_name">Bank name</Label>
                <Input id="donation_bank_name" placeholder="e.g. Meezan Bank" {...register("donation_bank_name")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="donation_account_title">Account title</Label>
                <Input id="donation_account_title" {...register("donation_account_title")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="donation_account_number">Account number</Label>
                <Input id="donation_account_number" {...register("donation_account_number")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="donation_iban">IBAN</Label>
                <Input id="donation_iban" placeholder="PK00XXXX0000000000000000" {...register("donation_iban")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="donation_swift_code">SWIFT / BIC code</Label>
                <Input id="donation_swift_code" placeholder="For international transfers" {...register("donation_swift_code")} />
              </div>

            </div>
            <div className="space-y-1.5">
              <Label htmlFor="donation_instructions">Additional instructions</Label>
              <Textarea
                id="donation_instructions"
                rows={3}
                placeholder="e.g. Please email your transfer receipt to donations@shds.org.pk"
                {...register("donation_instructions")}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}