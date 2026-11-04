import type { Motel } from "./types";

// Everything on the website comes from this file.
// Values marked TODO still need the real details from the motel.

export const motel: Motel = {
  name: "Valley Inn Downtown Phoenix",
  shortName: "Valley Inn",
  siteUrl: "https://valleyinndowntownphoenix.com",
  tagline: "Clean rooms and free parking, close to downtown Phoenix.",
  description:
    "Valley Inn Downtown Phoenix offers clean King and Double Queen rooms with free Wi-Fi, free parking, a microwave and refrigerator, close to downtown Phoenix and Sky Harbor Airport.",
  phone: { display: "(602) 756-0213", tel: "+16027560213" },
  email: "valleyinndowntownphoenix@gmail.com",
  address: { street: "965 E Van Buren St", city: "Phoenix", state: "AZ", zip: "85006" },
  geo: { lat: 33.45094, lng: -112.05949 }, // 965 E Van Buren St, Phoenix
  mapsUrl: null, // optional: short Google Maps link. Without it, directions search the address.
  checkIn: "3:00 PM",
  checkOut: "11:00 AM",

  heroPhotos: [
    { key: "slide13", alt: "Valley Inn's two-story building and palm trees in the morning sun" },
    { key: "hero4", alt: "Valley Inn courtyard with palm trees under a blue sky" },
    { key: "slide2", alt: "Valley Inn covered entrance with downtown Phoenix behind it" },
    { key: "hero2", alt: "Valley Inn sign and front entrance from the street" },
  ],

  welcome: {
    heading: "A simple, comfortable base for your Phoenix trip",
    body: "Here for a Suns game, a convention or a flight out of Sky Harbor? Valley Inn keeps it easy: clean rooms, free parking right outside your door, and fast Wi-Fi, a short drive from downtown.",
    photo: { key: "slide4", alt: "Valley Inn front desk and lobby" },
  },

  rooms: [
    {
      id: "king",
      name: "King Room",
      beds: "1 king bed",
      sleeps: 2,
      description: "Room to spread out for solo travelers and couples, with a desk and a lounge chair.",
      features: ["Free Wi-Fi", "Flat-screen TV", "Microwave and refrigerator", "Work desk"],
      price: 75,
      photos: [
        { key: "slide5", alt: "King room with a large bed and wood headboard" },
        { key: "slide10", alt: "Flat-screen TV, desk and closet rack in the King room" },
        { key: "slide7", alt: "Bathroom with lit mirror and granite vanity" },
      ],
    },
    {
      id: "double-queen",
      name: "Double Queen Room",
      beds: "2 queen beds",
      sleeps: 4,
      description: "Two queen beds for families, friends and teams sharing a room.",
      features: ["Free Wi-Fi", "Flat-screen TV", "Microwave and refrigerator", "Sitting area"],
      price: 80,
      photos: [
        { key: "slide6", alt: "Double Queen room with two beds and a small sofa" },
        { key: "slide9", alt: "Vanity with lit mirror next to the bathroom" },
        { key: "slide11", alt: "Bathroom with tub and shower" },
      ],
    },
  ],

  amenities: [
    { icon: "wifi", name: "Free Wi-Fi", detail: "In every room" },
    { icon: "parking", name: "Free parking", detail: "On site, right by your room" },
    { icon: "snowflake", name: "Air conditioning", detail: "Built for Phoenix summers" },
    { icon: "microwave", name: "Microwave and fridge", detail: "In every room" },
    { icon: "tv", name: "Flat-screen TV", detail: "In every room" },
    { icon: "desk", name: "Front desk", detail: "Help during your stay" },
  ],

  nearby: [
    "Downtown Phoenix",
    "Phoenix Convention Center",
    "Chase Field",
    "Footprint Center",
    "Arizona State Capitol",
    "Phoenix Sky Harbor Airport",
  ],

  gallery: [
    { key: "slide2", alt: "Covered entrance and courtyard" },
    { key: "slide5", alt: "King room" },
    { key: "slide21", alt: "Valley Inn sign at the street entrance" },
    { key: "slide6", alt: "Double Queen room" },
    { key: "slide13", alt: "Two-story building with palm trees" },
    { key: "slide8", alt: "King room with desk" },
    { key: "slide4", alt: "Front desk and lobby" },
    { key: "slide10", alt: "TV and desk area" },
    { key: "slide7", alt: "Bathroom vanity" },
    { key: "slide16", alt: "Parking next to the rooms" },
    { key: "slide3", alt: "Lobby entrance" },
    { key: "slide11", alt: "Bathroom with tub" },
    { key: "slide9", alt: "Lit vanity mirror" },
    { key: "slide12", alt: "Covered drive-through entrance" },
    { key: "slide29", alt: "Desert landscaping along the building" },
    { key: "slide14", alt: "Building at sunrise" },
    { key: "slide22", alt: "Entrance and sign from the parking lot" },
    { key: "slide18", alt: "View from the second-floor walkway" },
  ],

  analyticsId: null, // TODO: create a Google Analytics property for this motel
  // Booking form emails. Paste the 4 values from your Valley Inn EmailJS account
  // (see email-templates/README.md). The booking form appears once these are filled in.
  emailjs: {
    publicKey: "PASTE_PUBLIC_KEY",
    serviceId: "PASTE_SERVICE_ID",
    guestTemplateId: "PASTE_GUEST_TEMPLATE_ID",
    motelTemplateId: "PASTE_MOTEL_TEMPLATE_ID",
  },
};
