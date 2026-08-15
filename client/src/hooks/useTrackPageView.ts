import { useEffect } from "react";
import { useLocation } from "wouter";
import { sendPageView } from "@/lib/shds-api";

// Fires a page-view beacon on the initial load and on every client-side
// route change, powering the admin dashboard's visitor stats.
export function useTrackPageView() {
  const [location] = useLocation();

  useEffect(() => {
    sendPageView(location);
  }, [location]);
}
