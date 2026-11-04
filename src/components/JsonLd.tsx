import { motel } from "@/data/motel";
import { photo } from "@/lib/site";

// Tells Google this page is a motel, with its contact details and prices.
export function JsonLd() {
  const base = motel.siteUrl?.replace(/\/$/, "") ?? "";
  const prices = motel.rooms.map((r) => r.price).filter((p): p is number => p !== null);

  const data = {
    "@context": "https://schema.org",
    "@type": "Motel",
    name: motel.name,
    description: motel.description,
    ...(motel.siteUrl && { url: motel.siteUrl }),
    image: [`${base}/og-image.jpg`, ...motel.heroPhotos.slice(0, 2).map((p) => base + photo(p).src)],
    logo: `${base}/images/logo.webp`,
    telephone: motel.phone.tel,
    ...(motel.email && { email: motel.email }),
    ...(motel.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: motel.address.street,
        addressLocality: motel.address.city,
        addressRegion: motel.address.state,
        postalCode: motel.address.zip,
        addressCountry: "US",
      },
    }),
    ...(motel.geo && {
      geo: { "@type": "GeoCoordinates", latitude: motel.geo.lat, longitude: motel.geo.lng },
    }),
    ...(motel.mapsUrl && { hasMap: motel.mapsUrl }),
    checkinTime: to24h(motel.checkIn),
    checkoutTime: to24h(motel.checkOut),
    ...(prices.length && {
      priceRange: `$${Math.min(...prices)} - $${Math.max(...prices)}`,
      currenciesAccepted: "USD",
    }),
    amenityFeature: motel.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.name,
      value: true,
    })),
    makesOffer: motel.rooms
      .filter((r) => r.price !== null)
      .map((r) => ({
        "@type": "Offer",
        name: r.name,
        price: r.price!.toFixed(2),
        priceCurrency: "USD",
        itemOffered: { "@type": "HotelRoom", name: r.name, bed: r.beds, occupancy: { "@type": "QuantitativeValue", maxValue: r.sleeps } },
      })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function to24h(time: string) {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return time;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}
