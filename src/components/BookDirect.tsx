"use client";

import { Mail, Phone } from "lucide-react";
import type { Motel } from "@/data/types";
import { track } from "@/lib/analytics";
import { useBooking } from "./BookingRequest";
import styles from "./BookDirect.module.css";

export function BookDirect({ motel }: { motel: Motel }) {
  const booking = useBooking();

  return (
    <section id="contact" className={styles.band} aria-labelledby="contact-title">
      <div className={`container ${styles.inner}`}>
        <div>
          <h2 id="contact-title">Book direct with the front desk</h2>
          <p>Call for today&rsquo;s rates and availability. Booking direct means no third-party fees. Check-in {motel.checkIn}, check-out {motel.checkOut}.</p>
        </div>
        <div className={styles.actions}>
          <a
            href={`tel:${motel.phone.tel}`}
            className={styles.phone}
            onClick={() => track("phone_call_click", { location: "book_direct" })}
          >
            <Phone aria-hidden />
            {motel.phone.display}
          </a>
          <div className={styles.secondary}>
            {booking && (
              <button type="button" className="btn btn-gold" onClick={() => booking.open()}>
                Reserve online
              </button>
            )}
            {motel.email && (
              <a href={`mailto:${motel.email}`} className={styles.email}>
                <Mail aria-hidden /> {motel.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
