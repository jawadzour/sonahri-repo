import { useRef, useState } from "react";
import { File as FileIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { mediaService } from "@/lib/media-service";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_MB = 20;

interface FileUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  className?: string;
  accept?: string;
}

export function FileUpload({ value, onChange, className, accept = ".pdf,.doc,.docx,.xls,.xlsx" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setIsUploading(true);
    setProgress(0);
    try {
      const uploaded = await mediaService.upload(file, setProgress);
      onChange(uploaded.url);
      toast.success("File uploaded.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "File upload failed."));
    } finally {
      setIsUploading(false);
    }
  };

  const fileName = value ? value.split("/").pop() : null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-3 rounded-md border border-dashed border-input p-3 hover:border-primary/50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
          <FileIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
          {fileName && <p className="truncate text-sm text-foreground">{fileName}</p>}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploading ? `Uploading ${progress}%` : value ? "Replace file" : "Upload file"}
            </Button>
            {value && !isUploading && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <X className="h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
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
