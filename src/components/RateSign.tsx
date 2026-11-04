"use client";

import { Phone } from "lucide-react";
import type { Motel } from "@/data/types";
import { formatPrice } from "@/lib/site";
import { track } from "@/lib/analytics";
import { useBooking } from "./BookingRequest";
import styles from "./RateSign.module.css";

// The roadside-style price sign in the hero
export function RateSign({ motel }: { motel: Motel }) {
  const booking = useBooking();

  return (
    <aside id="rate-sign" className={styles.sign} aria-labelledby="rates-title">
      <h2 id="rates-title" className={styles.title}>
        Nightly rates
      </h2>
      <dl className={styles.rates}>
        {motel.rooms.map((room) => (
          <div key={room.id} className={styles.row}>
            <dt>
              <a href={`#room-${room.id}`}>{room.name}</a>
            </dt>
            <dd>
              {room.price !== null ? (
                <span className={styles.price}>{formatPrice(room.price)}</span>
              ) : (
                <span className={styles.callRate}>Call for rate</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <a
        href={`tel:${motel.phone.tel}`}
        className={`btn btn-primary ${styles.call}`}
        onClick={() => track("phone_call_click", { location: "rate_sign" })}
      >
        <Phone aria-hidden /> Call {motel.phone.display}
      </a>
      {booking && (
        <button type="button" className={`btn btn-outline ${styles.request}`} onClick={() => booking.open()}>
          Book online
        </button>
      )}
      <p className={styles.note}>
        Book direct with no booking fees. Check-in {motel.checkIn}, check-out {motel.checkOut}.
      </p>
    </aside>
  );
}
