import Script from "next/script";
import { motel } from "@/data/motel";

// Google Analytics. Turned on by setting analyticsId in src/data/motel.ts.
export function Analytics() {
  const id = motel.analyticsId;
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
