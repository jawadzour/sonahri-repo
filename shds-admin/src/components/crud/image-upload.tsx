import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { mediaService } from "@/lib/media-service";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validate = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload a PNG, JPG, WEBP, GIF, or SVG image.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validate(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);
    setProgress(0);
    try {
      const uploaded = await mediaService.upload(file, setProgress);
      onChange(uploaded.url);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Image upload failed."));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-md border border-dashed border-input p-3 transition-colors",
          "hover:border-primary/50"
        )}
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? `Uploading ${progress}%` : value ? "Replace image" : "Upload image"}
            </Button>
            {value && !isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP, GIF, or SVG — up to {MAX_FILE_SIZE_MB}MB.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
