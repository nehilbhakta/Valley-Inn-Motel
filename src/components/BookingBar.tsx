"use client";

import { useState } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import type { Motel } from "@/data/types";
import { track } from "@/lib/analytics";
import { useBooking } from "./BookingRequest";
import styles from "./BookingBar.module.css";

// White booking bar that overlaps the bottom of the hero photo.
// Guests pick dates and guests here, then choose the room in the booking form.
// Without EmailJS keys it shows a call-to-book version instead.
export function BookingBar({ motel }: { motel: Motel }) {
  const booking = useBooking();
  return booking ? <AvailabilityBar motel={motel} open={booking.open} /> : <CallOnlyBar motel={motel} />;
}

function AvailabilityBar({ motel, open }: { motel: Motel; open: NonNullable<ReturnType<typeof useBooking>>["open"] }) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const maxGuests = Math.max(...motel.rooms.map((r) => r.sleeps));

  function onCheckin(value: string) {
    setCheckin(value);
    setError("");
    // Default to a one-night stay so guests only have to pick one date
    if (value && (!checkout || checkout <= value)) setCheckout(addDays(value, 1));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkin || !checkout) return setError("Choose your check-in and check-out dates.");
    if (checkout <= checkin) return setError("Check-out must be after check-in.");
    // Start the form on the smallest room that fits everyone; guests can change it there
    const room = [...motel.rooms].sort((a, b) => a.sleeps - b.sleeps).find((r) => r.sleeps >= guests) ?? motel.rooms[0];
    track("check_availability", { guests: String(guests) });
    open({ roomId: room.id, checkin, checkout, guests });
  }

  return (
    <section id="rate-sign" className={styles.bar} aria-labelledby="booking-bar-title">
      <h2 id="booking-bar-title" className="visually-hidden">
        Check availability
      </h2>
      <form onSubmit={submit} noValidate className={styles.fields}>
        <label className={styles.field}>
          <span>Check-in</span>
          <input
            type="date"
            min={today}
            value={checkin}
            onChange={(e) => onCheckin(e.target.value)}
            aria-invalid={!!error}
            aria-describedby="avail-error"
          />
        </label>
        <label className={styles.field}>
          <span>Check-out</span>
          <input
            type="date"
            min={checkin ? addDays(checkin, 1) : today}
            value={checkout}
            onChange={(e) => {
              setCheckout(e.target.value);
              setError("");
            }}
            aria-invalid={!!error}
            aria-describedby="avail-error"
          />
        </label>
        <label className={`${styles.field} ${styles.guests}`}>
          <span>Guests</span>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={`btn btn-primary ${styles.submit}`}>
          <CalendarCheck aria-hidden /> Check availability
        </button>
      </form>
      <p id="avail-error" className={styles.error} aria-live="polite">
        {error}
      </p>
      <p className={styles.note}>
        Book direct with no booking fees. Prefer to talk?{" "}
        <a href={`tel:${motel.phone.tel}`} onClick={() => track("phone_call_click", { location: "booking_bar" })}>
          Call {motel.phone.display}
        </a>
      </p>
    </section>
  );
}

function CallOnlyBar({ motel }: { motel: Motel }) {
  return (
    <section id="rate-sign" className={`${styles.bar} ${styles.callOnly}`} aria-labelledby="booking-bar-title">
      <div>
        <h2 id="booking-bar-title" className={styles.callTitle}>
          Book direct with the front desk
        </h2>
        <p className={styles.callText}>
          No booking fees. Check-in {motel.checkIn}, check-out {motel.checkOut}.
        </p>
      </div>
      <a
        href={`tel:${motel.phone.tel}`}
        className={`btn btn-primary ${styles.submit}`}
        onClick={() => track("phone_call_click", { location: "booking_bar" })}
      >
        <Phone aria-hidden /> Call {motel.phone.display}
      </a>
    </section>
  );
}

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}
