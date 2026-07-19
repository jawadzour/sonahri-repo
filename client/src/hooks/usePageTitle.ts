import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Sonahri Humanitarian Development Society`;
  }, [title]);
}