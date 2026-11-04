import images from "@/data/images.json";
import type { Motel, Photo } from "@/data/types";

export function photo(p: Photo) {
  const img = images[p.key];
  return { src: img.src, width: img.width, height: img.height, alt: p.alt };
}

/** 75 -> "$75", 74.99 -> "$74.99" */
export function formatPrice(price: number) {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

export function fullAddress(m: Motel) {
  if (!m.address) return null;
  const a = m.address;
  return `${a.street}, ${a.city}, ${a.state} ${a.zip}`;
}

/** Google Maps embed that works without an API key */
export function mapEmbedUrl(m: Motel) {
  const query = fullAddress(m) ?? m.name;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function directionsUrl(m: Motel) {
  if (m.mapsUrl) return m.mapsUrl;
  const query = fullAddress(m) ?? m.name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function lowestPrice(m: Motel) {
  const prices = m.rooms.map((r) => r.price).filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : null;
}
