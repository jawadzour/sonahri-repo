import { useEffect, useMemo, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  /** Every distinct value currently in use — shown as pickable options. */
  options: string[];
  placeholder?: string;
  /** Shown while `options` is still loading. */
  isLoading?: boolean;
}

/**
 * A searchable popup that lists existing distinct values for a free-text
 * field (e.g. Project.sector) so admins pick a consistent existing category
 * instead of retyping slightly different variants — while still allowing a
 * brand new value to be typed and added. Styled to match Select.
 */
export function Combobox({ value, onChange, options, placeholder = "Select or type...", isLoading }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  const trimmedQuery = query.trim();
  const hasExactMatch = options.some((opt) => opt.toLowerCase() === trimmedQuery.toLowerCase());

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
            "focus:outline-none focus:ring-1 focus:ring-ring",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className="z-50 w-[--radix-popover-trigger-width] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
          <div className="flex items-center gap-2 border-b border-border px-2.5">
            <Search className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {isLoading ? (
              <p className="px-2 py-4 text-center text-xs text-muted-foreground">Loading categories...</p>
            ) : filtered.length === 0 && !trimmedQuery ? (
              <p className="px-2 py-4 text-center text-xs text-muted-foreground">No categories yet.</p>
            ) : filtered.length === 0 ? (
              <p className="px-2 py-3 text-center text-xs text-muted-foreground">No matches.</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none hover:bg-accent/10 hover:text-accent"
                >
                  <Check className={cn("h-3.5 w-3.5 shrink-0", opt === value ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{opt}</span>
                </button>
              ))
            )}

            {trimmedQuery && !hasExactMatch && (
              <button
                type="button"
                onClick={() => {
                  onChange(trimmedQuery);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-sm py-1.5 pl-2 pr-2 text-sm text-primary outline-none hover:bg-accent/10"
              >
                <Plus className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Add "{trimmedQuery}"</span>
              </button>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
