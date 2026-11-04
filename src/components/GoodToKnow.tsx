import { Clock, Phone, SquareParking, Wifi } from "lucide-react";
import type { Motel } from "@/data/types";
import styles from "./GoodToKnow.module.css";

// Only facts that are in src/data/motel.ts or in the booking dialog copy.
// Nothing here invents a cancellation, deposit, pet or smoking policy:
// guests are sent to the front desk for anything not listed.
export function GoodToKnow({ motel }: { motel: Motel }) {
  const cards = [
    {
      icon: Clock,
      title: "Check-in & check-out",
      text: `Check-in from ${motel.checkIn}, check-out by ${motel.checkOut}.`,
    },
    {
      icon: SquareParking,
      title: "Free parking",
      text: "Free parking on site, right by your room.",
    },
    {
      icon: Wifi,
      title: "Free Wi-Fi & TV",
      text: "Free Wi-Fi and a flat-screen TV in every room, plus a microwave and refrigerator.",
    },
    {
      icon: Phone,
      title: "Reservation requests",
      text: "A reservation request is not confirmed until the front desk confirms availability — call to confirm.",
    },
  ];
  return (
    <section id="good-to-know" className={`section ${styles.section}`} aria-labelledby="good-to-know-title">
      <div className="container">
        <div className="section-intro">
          <p className="eyebrow">Good to know</p>
          <h2 id="good-to-know-title">Before you book</h2>
          <p>
            The essentials, straight from the front desk. For anything not listed
            here — rates for a specific date, or any other policy — call{" "}
            <a href={`tel:${motel.phone.tel}`}>{motel.phone.display}</a>.
          </p>
        </div>
        <ul className={styles.grid}>
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <li key={c.title}>
                <Icon aria-hidden />
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
