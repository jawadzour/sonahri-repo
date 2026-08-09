import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/crud/image-upload";
import { FileUpload } from "@/components/crud/file-upload";
import { buildZodSchema } from "@/lib/build-schema";
import { cn } from "@/lib/utils";
import type { FieldConfig } from "@/types/resource-config";

interface ResourceFormDialogProps<T extends Record<string, unknown>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FieldConfig[];
  defaultValues?: Partial<T>;
  onSubmit: (values: Record<string, unknown>) => Promise<boolean>;
  isSubmitting?: boolean;
}

export function ResourceFormDialog<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  defaultValues,
  onSubmit,
  isSubmitting,
}: ResourceFormDialogProps<T>) {
  const schema = buildZodSchema(fields);

  const emptyDefaults = Object.fromEntries(
    fields.map((f) => [f.name, f.type === "boolean" ? false : ""])
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  useEffect(() => {
    if (open) {
      reset({ ...emptyDefaults, ...defaultValues });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  const submit = handleSubmit(async (values) => {
    const ok = await onSubmit(values);
    if (ok) onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const errorMessage = errors[field.name]?.message as string | undefined;
            const span = field.colSpan === 2 || field.type === "textarea" || field.type === "richtext" ? "sm:col-span-2" : "";

            return (
              <div key={field.name} className={cn("space-y-1.5", span)}>
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </Label>

                {field.type === "textarea" || field.type === "richtext" ? (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    rows={field.type === "richtext" ? 6 : 3}
                    {...register(field.name)}
                  />
                ) : field.type === "select" ? (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: ctrl }) => (
                      <Select value={ctrl.value as string} onValueChange={ctrl.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder ?? "Select..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : field.type === "boolean" ? (
                  <div className="flex h-9 items-center">
                    <Controller
                      control={control}
                      name={field.name}
                      render={({ field: ctrl }) => (
                        <Switch checked={Boolean(ctrl.value)} onCheckedChange={ctrl.onChange} />
                      )}
                    />
                  </div>
                ) : field.type === "image" ? (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: ctrl }) => (
                      <ImageUpload
                        value={ctrl.value as string}
                        onChange={ctrl.onChange}
                      />
                    )}
                  />
                ) : field.type === "file" ? (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: ctrl }) => (
                      <FileUpload
                        value={ctrl.value as string}
                        onChange={ctrl.onChange}
                      />
                    )}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type === "password" ? "password" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                  />
                )}

                {field.description && !errorMessage && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}
                {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
              </div>
            );
          })}

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
