import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Trash2, Upload, Copy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/crud/page-header";
import { SearchBar } from "@/components/crud/search-bar";
import { PaginationControls } from "@/components/crud/pagination-controls";
import { EmptyState } from "@/components/crud/empty-state";
import { ConfirmDeleteDialog } from "@/components/crud/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { mediaService } from "@/lib/media-service";
import { getApiErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { MediaFile } from "@/types/models";
import type { PaginationMeta } from "@/types/api";

export default function MediaLibraryPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaFile[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    per_page: 24,
    total: 0,
    pages: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingItem, setDeletingItem] = useState<MediaFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await mediaService.list({ page, per_page: 24, search: search || undefined });
      setItems(result.data);
      setPagination(result.pagination);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load media library."));
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await mediaService.upload(file);
      toast.success("File uploaded.");
      setPage(1);
      await fetchItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Upload failed."));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await mediaService.remove(deletingItem.id);
      toast.success("File deleted.");
      setDeletingItem(null);
      await fetchItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete file."));
    } finally {
      setIsDeleting(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard.");
  };

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="All images and documents uploaded across every module."
        action={
          <>
            <Button onClick={() => inputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploading ? "Uploading..." : "Upload file"}
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </>
        }
      />

      <div className="mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search files..." />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No media uploaded yet"
          description="Files uploaded here — or from image fields in any module — will show up in this library."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((file) => {
            const isImage = file.mime_type?.startsWith("image/");
            return (
              <Card key={file.id} className="group overflow-hidden p-0">
                <div className="relative aspect-square bg-muted">
                  {isImage ? (
                    <img src={file.url} alt={file.alt_text ?? file.filename} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      {file.filename.split(".").pop()?.toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => copyUrl(file.url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeletingItem(file)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{file.filename}</p>
                  <p className="text-[11px] text-muted-foreground">{formatDate(file.created_at)}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <PaginationControls pagination={pagination} onPageChange={setPage} />
      )}

      <ConfirmDeleteDialog
        open={Boolean(deletingItem)}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        onConfirm={handleDelete}
        itemLabel="this file"
        isDeleting={isDeleting}
      />
    </div>
  );
}
