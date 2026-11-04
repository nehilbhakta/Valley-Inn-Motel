import { Clock, ShieldCheck, SquareParking, Wifi } from "lucide-react";
import type { Motel } from "@/data/types";
import { formatPrice, lowestPrice } from "@/lib/site";
import styles from "./WhyBook.module.css";

// Factual book-direct strip: every claim here comes from src/data/motel.ts.
export function WhyBook({ motel }: { motel: Motel }) {
  const from = lowestPrice(motel);
  const cards = [
    {
      icon: ShieldCheck,
      title: "No booking fees",
      text: "Book direct with the front desk — no third-party fees.",
    },
    {
      icon: SquareParking,
      title: "Free parking",
      text: "On site, right by your room.",
    },
    {
      icon: Wifi,
      title: "Free Wi-Fi",
      text: "In every room, plus a flat-screen TV, microwave and fridge.",
    },
    {
      icon: Clock,
      title: `Check-in ${motel.checkIn}`,
      text: `Check-out ${motel.checkOut}. Call the front desk for today's availability.`,
    },
  ];
  return (
    <section className={styles.strip} aria-label="Why book direct">
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Book direct</p>
            <h2>
              {from !== null ? (
                <>Rooms from {formatPrice(from)}/night, no booking fees</>
              ) : (
                <>Book direct, no booking fees</>
              )}
            </h2>
          </div>
          <a href={`tel:${motel.phone.tel}`} className="btn btn-primary">
            Call {motel.phone.display}
          </a>
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
