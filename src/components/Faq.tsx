import type { Motel } from "@/data/types";
import { formatPrice } from "@/lib/site";
import styles from "./Faq.module.css";

// Every answer is drawn from src/data/motel.ts or the booking dialog copy.
// No distances, policies or prices are invented.
export function Faq({ motel }: { motel: Motel }) {
  const roomList = motel.rooms
    .map((r) => `${r.name} (${r.beds}, sleeps ${r.sleeps}${r.price !== null ? `, ${formatPrice(r.price)}/night` : ""})`)
    .join("; ");
  const items = [
    {
      q: "What time is check-in and check-out?",
      a: `Check-in is from ${motel.checkIn} and check-out is by ${motel.checkOut}.`,
    },
    {
      q: "What rooms do you have, and what do they cost?",
      a: `${roomList}. Every room has free Wi-Fi, a flat-screen TV, a microwave and a refrigerator.`,
    },
    {
      q: "Is parking free?",
      a: "Yes — free parking on site, right by your room.",
    },
    {
      q: "How do I book, and is my reservation confirmed?",
      a: "Call the front desk, or send a reservation request online when it is available. A request is not confirmed until the front desk confirms availability — call to confirm, and no payment is needed when you send a request.",
    },
    {
      q: "Where is the motel, and what's nearby?",
      a: `${motel.name} is at ${motel.address ? `${motel.address.street}, ${motel.address.city}, ${motel.address.state} ${motel.address.zip}` : "downtown Phoenix"}, close to ${motel.nearby.join(", ")}.`,
    },
    {
      q: "What if I have a question not listed here?",
      a: `Call the front desk at ${motel.phone.display}${motel.email ? ` or email ${motel.email}` : ""} — they can confirm rates and availability for your dates.`,
    },
  ];
  return (
    <section id="faq" className={`section ${styles.section}`} aria-labelledby="faq-title">
      <div className="container">
        <div className="section-intro">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">Questions guests ask</h2>
          <p>Tap a question to see the answer.</p>
        </div>
        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
