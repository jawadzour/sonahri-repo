import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/crud/page-header";
import { SearchBar } from "@/components/crud/search-bar";
import { DataTable } from "@/components/crud/data-table";
import { PaginationControls } from "@/components/crud/pagination-controls";
import { ResourceFormDialog } from "@/components/crud/resource-form-dialog";
import { ConfirmDeleteDialog } from "@/components/crud/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { useResource } from "@/hooks/use-resource";
import type { ResourceConfig } from "@/types/resource-config";

interface ResourceListPageProps<T extends { id: number | string }> {
  config: ResourceConfig<T>;
}

export function ResourceListPage<T extends { id: number | string }>({
  config,
}: ResourceListPageProps<T>) {
  const {
    items,
    pagination,
    search,
    isLoading,
    isMutating,
    goToPage,
    changeSearch,
    create,
    update,
    remove,
  } = useResource<T>(config.endpoint, { pageSize: config.pageSize ?? 10 });

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);

  const canCreate = config.canCreate !== false;
  const canEdit = config.canEdit !== false;
  const canDelete = config.canDelete !== false;

  const openCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = (item: T) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editingItem) {
      return update(editingItem.id, values as never);
    }
    return create(values as never);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    const ok = await remove(deletingItem.id);
    if (ok) setDeletingItem(null);
  };

  return (
    <div>
      <PageHeader
        title={config.label}
        description={config.description}
        action={
          canCreate && (
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add {config.singularLabel}
            </Button>
          )
        }
      />

      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={changeSearch}
          placeholder={config.searchPlaceholder ?? `Search ${config.label.toLowerCase()}...`}
        />
      </div>

      <DataTable
        columns={config.columns}
        data={items}
        isLoading={isLoading}
        onEdit={canEdit ? openEdit : undefined}
        onDelete={canDelete ? setDeletingItem : undefined}
        emptyTitle={config.emptyStateTitle ?? `No ${config.label.toLowerCase()} yet`}
        emptyDescription={
          config.emptyStateDescription ??
          `${config.singularLabel} you add will show up here.`
        }
      />

      {!isLoading && items.length > 0 && (
        <PaginationControls pagination={pagination} onPageChange={goToPage} />
      )}

      <ResourceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingItem ? `Edit ${config.singularLabel}` : `Add ${config.singularLabel}`}
        fields={config.fields}
        defaultValues={editingItem ?? undefined}
        onSubmit={handleSubmit}
        isSubmitting={isMutating}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingItem)}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        onConfirm={handleDelete}
        itemLabel={config.singularLabel.toLowerCase()}
        isDeleting={isMutating}
      />
    </div>
  );
}
