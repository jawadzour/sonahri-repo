import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** A controlled preview modal — the caller owns open state and the trigger
 * element, so this composes cleanly with existing clickable triggers
 * (thumbnails, buttons) without nesting interactive elements. */
export function ImageLightbox({ src, alt, open, onOpenChange }: ImageLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-2">
        <DialogTitle className="px-2 pt-1 text-sm font-medium">{alt || "Image preview"}</DialogTitle>
        <img src={src} alt={alt ?? ""} className="max-h-[75vh] w-full rounded-md object-contain" />
      </DialogContent>
    </Dialog>
  );
}
