import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createResourceService } from "@/lib/resource-service";
import { getApiErrorMessage } from "@/lib/api";
import type { PaginationMeta } from "@/types/api";

interface UseResourceOptions {
  pageSize?: number;
}

export function useResource<T extends { id: number | string }, TInput = Partial<T>>(
  endpoint: string,
  { pageSize = 10 }: UseResourceOptions = {}
) {
  const service = useRef(createResourceService<T, TInput>(endpoint)).current;

  const [items, setItems] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    per_page: pageSize,
    total: 0,
    pages: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await service.list({ page, per_page: pageSize, search: search || undefined });
      setItems(result.data);
      setPagination(result.pagination);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load data."));
    } finally {
      setIsLoading(false);
    }
  }, [service, page, pageSize, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const goToPage = (nextPage: number) => {
    setPage(Math.max(1, Math.min(nextPage, pagination.pages || 1)));
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const create = async (payload: TInput) => {
    setIsMutating(true);
    try {
      await service.create(payload);
      toast.success("Created successfully.");
      await fetchItems();
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create item."));
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const update = async (id: number | string, payload: TInput) => {
    setIsMutating(true);
    try {
      await service.update(id, payload);
      toast.success("Updated successfully.");
      await fetchItems();
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update item."));
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const remove = async (id: number | string) => {
    setIsMutating(true);
    try {
      await service.remove(id);
      toast.success("Deleted successfully.");
      // If we deleted the last item on a page beyond page 1, step back a page.
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchItems();
      }
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete item."));
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    items,
    pagination,
    page,
    search,
    isLoading,
    isMutating,
    goToPage,
    changeSearch,
    create,
    update,
    remove,
    refetch: fetchItems,
  };
}
