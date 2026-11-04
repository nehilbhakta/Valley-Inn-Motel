"use client";

import { useState } from "react";
import { Calendar, CalendarCheck, Phone } from "lucide-react";
import type { Motel } from "@/data/types";
import { track } from "@/lib/analytics";
import { localAddDays, localToday } from "@/lib/site";
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
  // Prefill with tonight/tomorrow so the date boxes are never blank
  // (an empty iOS date input shows nothing at all, which looked broken).
  const [checkin, setCheckin] = useState(localToday());
  const [checkout, setCheckout] = useState(localAddDays(localToday(), 1));
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState("");
  const today = localToday();
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
      <h2 id="booking-bar-title" className={styles.barTitle}>
        Check availability
      </h2>
      <form onSubmit={submit} noValidate className={styles.fields}>
        <label className={styles.field}>
          <span>Check-in</span>
          <span className={styles.dateWrap}>
            <span className={styles.dateDisplay} aria-hidden="true">
              {formatDate(checkin)}
              <Calendar aria-hidden="true" />
            </span>
            <input
              className={styles.dateInput}
              type="date"
              min={today}
              value={checkin}
              onChange={(e) => onCheckin(e.target.value)}
              aria-label="Check-in date"
              aria-invalid={!!error}
              aria-describedby="avail-error"
            />
          </span>
        </label>
        <label className={styles.field}>
          <span>Check-out</span>
          <span className={styles.dateWrap}>
            <span className={styles.dateDisplay} aria-hidden="true">
              {formatDate(checkout)}
              <Calendar aria-hidden="true" />
            </span>
            <input
              className={styles.dateInput}
              type="date"
              min={checkin ? addDays(checkin, 1) : today}
              value={checkout}
              onChange={(e) => {
                setCheckout(e.target.value);
                setError("");
              }}
              aria-label="Check-out date"
              aria-invalid={!!error}
              aria-describedby="avail-error"
            />
          </span>
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
      {checkin && checkout && checkout > checkin ? (
        <p className={styles.summary}>
          {formatDate(checkin)} → {formatDate(checkout)} · {nights(checkin, checkout)} {nights(checkin, checkout) === 1 ? "night" : "nights"} · {guests}{" "}
          {guests === 1 ? "guest" : "guests"}
        </p>
      ) : null}
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

// "2026-11-04" -> "Nov 4, 2026", parsed as calendar parts (no timezone shift)
function formatDate(iso: string) {
  if (!iso) return "Choose a date";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function addDays(iso: string, days: number) {
  return localAddDays(iso, days);
}

function nights(checkin: string, checkout: string) {
  return Math.round(
    (new Date(`${checkout}T12:00:00`).getTime() - new Date(`${checkin}T12:00:00`).getTime()) / 86400000
  );
}
