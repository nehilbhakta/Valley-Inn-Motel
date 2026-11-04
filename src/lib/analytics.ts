declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Send an event to Google Analytics, if it's turned on for this motel */
export function track(event: string, params: Record<string, string> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}
