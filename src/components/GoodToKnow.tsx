import type { Motel } from "@/data/types";
import { formatPrice, lowestPrice } from "@/lib/site";
import styles from "./GoodToKnow.module.css";

// One "good to know" section only — the old navy book-direct card strip
// duplicated these same facts, so it was removed. This section is deliberately
// NOT another 4-card grid: it is a single at-a-glance panel with the times
// on one side and a short checklist on the other. Only facts from
// src/data/motel.ts are used; anything not listed goes to the front desk.
export function GoodToKnow({ motel }: { motel: Motel }) {
  const from = lowestPrice(motel);
  return (
    <section id="good-to-know" className={`section ${styles.section}`} aria-labelledby="good-to-know-title">
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.times}>
            <p className="eyebrow">Good to know</p>
            <h2 id="good-to-know-title">Before you book</h2>
            <p className={styles.price}>
              {from !== null ? <>Rooms from {formatPrice(from)}/night — no booking fees when you book direct.</> : <>Book direct — no booking fees.</>}
            </p>
            <dl>
              <div>
                <dt>Check-in</dt>
                <dd>{motel.checkIn}</dd>
              </div>
              <div>
                <dt>Check-out</dt>
                <dd>{motel.checkOut}</dd>
              </div>
            </dl>
            <a href={`tel:${motel.phone.tel}`} className="btn btn-primary">
              Call {motel.phone.display}
            </a>
          </div>
          <ul className={styles.checklist}>
            <li>
              <strong>Free parking</strong>
              <span>On site, right by your room.</span>
            </li>
            <li>
              <strong>Free Wi-Fi &amp; TV</strong>
              <span>Free Wi-Fi and a flat-screen TV in every room, plus a microwave and refrigerator.</span>
            </li>
            <li>
              <strong>Not confirmed until the front desk confirms it</strong>
              <span>A reservation request is not confirmed until the front desk confirms availability — call to confirm.</span>
            </li>
            <li>
              <strong>Anything else?</strong>
              <span>
                For rates on a specific date or any other policy, call{" "}
                <a href={`tel:${motel.phone.tel}`}>{motel.phone.display}</a>.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
