import { useEffect, useState } from "react";
import { fetchSeoSettings, type PublicSeoSettings } from "@/lib/shds-api";

// Inline `<script>` children rendered through react-helmet-async don't
// execute here (Helmet renders them as ordinary DOM children instead of
// teleporting to <head>, and browsers never run scripts inserted that
// way) — so GA/GTM are injected imperatively instead, the same way
// Google's own official snippets create their script tags.
function injectScript(id: string, attrs: Partial<HTMLScriptElement>, textContent?: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  Object.assign(script, attrs);
  if (textContent) script.textContent = textContent;
  document.head.appendChild(script);
}

function gtmScript(containerId: string): string {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${containerId}');`;
}

function gtagConfigScript(measurementId: string): string {
  return `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${measurementId}');`;
}

// Loads Google Analytics (GA4) and/or Google Tag Manager using the IDs
// configured in the admin panel's SEO Settings page — rotating or adding a
// tracking ID later is a settings change, not a code deploy.
export default function Analytics() {
  const [settings, setSettings] = useState<PublicSeoSettings | null>(null);

  useEffect(() => {
    fetchSeoSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    if (!settings) return;

    if (settings.google_tag_manager_id) {
      injectScript("gtm-loader", {}, gtmScript(settings.google_tag_manager_id));
    }
    if (settings.google_analytics_id) {
      injectScript("gtag-loader", {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`,
      });
      injectScript("gtag-config", {}, gtagConfigScript(settings.google_analytics_id));
    }
  }, [settings]);

  if (!settings?.google_tag_manager_id) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${settings.google_tag_manager_id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
