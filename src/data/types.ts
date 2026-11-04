// The shape of one motel's content. To make a site for another motel,
// copy src/data/motel.ts, change the values, and swap the photos.

import type images from "./images.json";

/** A photo name from src/data/images.json, e.g. "slide5" */
export type PhotoKey = keyof typeof images;

export interface Photo {
  key: PhotoKey;
  alt: string;
}

export interface Room {
  id: string;
  name: string;
  beds: string;
  sleeps: number;
  description: string;
  features: string[];
  /** Nightly rate in USD, e.g. 79.99. Leave null to show "Call for today's rate". */
  price: number | null;
  photos: Photo[];
}

export interface Amenity {
  icon: "wifi" | "parking" | "snowflake" | "microwave" | "desk" | "tv" | "map" | "nosmoking";
  name: string;
  detail: string;
}

export interface Motel {
  name: string;
  shortName: string;
  /** Live site address, e.g. "https://valleyinnphx.com". Used for Google and share previews. */
  siteUrl: string | null;
  tagline: string;
  description: string;
  phone: { display: string; tel: string };
  /** Where booking requests go. Leave null to hide the email link. */
  email: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  geo: { lat: number; lng: number } | null;
  /** Short Google Maps link for the "Get directions" button */
  mapsUrl: string | null;
  checkIn: string;
  checkOut: string;
  heroPhotos: Photo[];
  welcome: { heading: string; body: string; photo: Photo };
  rooms: Room[];
  amenities: Amenity[];
  nearby: string[];
  gallery: Photo[];
  /** Google Analytics Measurement ID, e.g. "G-AB12CD34EF". Leave null to turn analytics off. */
  analyticsId: string | null;
  /** EmailJS keys for the "Request this room" form. Leave null to use call-to-book only. */
  emailjs: {
    publicKey: string;
    serviceId: string;
    guestTemplateId: string;
    motelTemplateId: string;
  } | null;
}
