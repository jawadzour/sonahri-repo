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
import type { SeoSettings } from "@/types/models";

const schema = z.object({
  default_meta_title: z.string().min(1, "Meta title is required."),
  default_meta_description: z.string().optional().or(z.literal("")),
  default_og_image_url: z.string().optional().or(z.literal("")),
  google_analytics_id: z.string().optional().or(z.literal("")),
  google_tag_manager_id: z.string().optional().or(z.literal("")),
  google_site_verification: z.string().optional().or(z.literal("")),
  robots_txt: z.string().optional().or(z.literal("")),
  sitemap_enabled: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  default_meta_title: "",
  default_meta_description: "",
  default_og_image_url: "",
  google_analytics_id: "",
  google_tag_manager_id: "",
  google_site_verification: "",
  robots_txt: "",
  sitemap_enabled: true,
};

export default function SeoSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await settingsService.getSeoSettings();
        const sanitized = Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, v === null ? "" : v])
        ) as unknown as FormValues;
        reset({ ...defaultValues, ...sanitized });
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load SEO settings."));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    try {
      await settingsService.updateSeoSettings(values as Partial<SeoSettings>);
      toast.success("SEO settings saved.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save SEO settings."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="SEO Settings" description="Default metadata used across the public site." />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full max-w-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="SEO Settings"
        description="Default metadata, social preview image, and search engine configuration."
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
            <CardTitle>Default metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="default_meta_title">Default meta title</Label>
              <Input id="default_meta_title" {...register("default_meta_title")} />
              {errors.default_meta_title && (
                <p className="text-xs text-destructive">{errors.default_meta_title.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="default_meta_description">Default meta description</Label>
              <Textarea id="default_meta_description" rows={3} {...register("default_meta_description")} />
            </div>
            <div className="space-y-1.5">
              <Label>Default social share image</Label>
              <Controller
                control={control}
                name="default_og_image_url"
                render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search engine configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
              <Input id="google_analytics_id" placeholder="G-XXXXXXXXXX" {...register("google_analytics_id")} />
              <p className="text-xs text-muted-foreground">
                GA4 Measurement ID, from Admin &gt; Data Streams &gt; your web stream in Google Analytics.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
              <Input id="google_tag_manager_id" placeholder="GTM-XXXXXXX" {...register("google_tag_manager_id")} />
              <p className="text-xs text-muted-foreground">
                Container ID from the top-right of your Tag Manager workspace.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="google_site_verification">Google site verification</Label>
              <Input id="google_site_verification" {...register("google_site_verification")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="robots_txt">robots.txt overrides</Label>
              <Textarea id="robots_txt" rows={4} className="font-mono text-xs" {...register("robots_txt")} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <Label htmlFor="sitemap_enabled">Generate sitemap.xml</Label>
                <p className="text-xs text-muted-foreground">Automatically publish an XML sitemap.</p>
              </div>
              <Controller
                control={control}
                name="sitemap_enabled"
                render={({ field }) => (
                  <Switch id="sitemap_enabled" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
