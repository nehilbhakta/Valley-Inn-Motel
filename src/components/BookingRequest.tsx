"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Phone, X } from "lucide-react";
import type { Motel } from "@/data/types";
import { formatPrice, localToday } from "@/lib/site";
import { track } from "@/lib/analytics";
import styles from "./BookingRequest.module.css";

// Booking request form. Sends a confirmation email to the guest and a booking
// alert to the motel through EmailJS, using the keys in src/data/motel.ts.
// The form always shows; until the keys are filled in, sending asks guests to call.

export interface BookingPrefill {
  roomId?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
}

type Booking = { open: (prefill?: BookingPrefill) => void } | null;
const BookingContext = createContext<Booking>(null);
export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ motel, children }: { motel: Motel; children: React.ReactNode }) {
  const [prefill, setPrefill] = useState<BookingPrefill | null>(null);
  // Until the EmailJS keys are filled in, there is no online form to open:
  // the booking bar and room buttons fall back to call-to-book instead of
  // letting a guest fill in a form that can only end in "call us".
  const keys = motel.emailjs;
  const configured =
    keys !== null && Object.values(keys).every((v) => v && !v.startsWith("PASTE_"));
  const value: Booking = configured
    ? {
        open: (p = {}) => {
          setPrefill({ ...p, roomId: p.roomId ?? motel.rooms[0].id });
          track("booking_form_open", { room: p.roomId ?? "any" });
        },
      }
    : null;

  return (
    <BookingContext.Provider value={value}>
      {children}
      {prefill && <RequestDialog motel={motel} prefill={prefill} onClose={() => setPrefill(null)} />}
    </BookingContext.Provider>
  );
}

type Errors = Partial<Record<"name" | "email" | "dates" | "form", string>>;

function RequestDialog({ motel, prefill, onClose }: { motel: Motel; prefill: BookingPrefill; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [roomId, setRoomId] = useState(prefill.roomId!);
  const maxGuests = motel.rooms.find((r) => r.id === roomId)?.sleeps ?? 2;
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const today = localToday();

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    const name = get("name");
    const email = get("email");
    const checkin = get("checkin");
    const checkout = get("checkout");

    const next: Errors = {};
    if (!name) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter an email address like name@example.com.";
    if (!checkin || !checkout) next.dates = "Choose your check-in and check-out dates.";
    else if (checkout <= checkin) next.dates = "Check-out must be after check-in.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }

    // Spam trap: people never see this field, bots fill it in
    if (get("website")) {
      setSentTo(email);
      return;
    }

    const room = motel.rooms.find((r) => r.id === get("room"))!;
    const params = {
      guest_name: name,
      guest_email: email,
      guest_phone: get("phone") || "Not given",
      room_type: room.price !== null ? `${room.name} (${formatPrice(room.price)}/night)` : room.name,
      guests: get("guests"),
      checkin: friendlyDate(checkin),
      checkout: friendlyDate(checkout),
      nights: String(Math.round((Date.parse(checkout) - Date.parse(checkin)) / 86400000)),
      special_requests: get("requests") || "None",
    };

    const keys = motel.emailjs;
    const configured = keys !== null && Object.values(keys).every((v) => v && !v.startsWith("PASTE_"));
    if (!configured) {
      console.warn("Booking emails are off: add the EmailJS keys in src/data/motel.ts");
      setErrors({ form: `Online booking isn't available yet. Call us at ${motel.phone.display} to reserve your room.` });
      return;
    }
    setSending(true);
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await Promise.all([
        emailjs.send(keys.serviceId, keys.guestTemplateId, params, { publicKey: keys.publicKey }),
        emailjs.send(keys.serviceId, keys.motelTemplateId, params, { publicKey: keys.publicKey }),
      ]);
      setSentTo(email);
      track("booking_request", { room: room.id });
    } catch (err) {
      console.error("Booking request failed", err);
      setErrors({ form: `Your request didn't go through. Call us at ${motel.phone.display} to book.` });
    } finally {
      setSending(false);
    }
  }

  const clear = (key: keyof Errors) => errors[key] && setErrors((er) => ({ ...er, [key]: undefined }));

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="request-title" onClose={onClose}>
      <button type="button" className={styles.close} onClick={() => ref.current?.close()}>
        <X aria-hidden />
        <span className="visually-hidden">Close</span>
      </button>

      {sentTo ? (
        <div className={styles.done} role="status">
          <h2 id="request-title">Reservation request sent</h2>
          <p>
            We emailed the details to <strong>{sentTo}</strong>.
          </p>
          <p className={styles.notice}>
            <strong>Your reservation is not confirmed yet.</strong> Call the front desk at{" "}
            <a href={`tel:${motel.phone.tel}`}>{motel.phone.display}</a> to confirm it. Until then, your room is
            subject to availability.
          </p>
          <div className={styles.doneActions}>
            <a
              href={`tel:${motel.phone.tel}`}
              className="btn btn-primary"
              onClick={() => track("phone_call_click", { location: "booking_confirm" })}
            >
              <Phone aria-hidden /> Call to confirm
            </a>
            <button type="button" className="btn btn-outline" onClick={() => ref.current?.close()}>
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <h2 id="request-title">Reserve your room</h2>
          <p className={styles.intro}>
            Add your details and we&rsquo;ll email you a summary. Then call the front desk to confirm availability and your reservation. No payment needed now.
          </p>

          <label className={styles.field}>
            <span>Room</span>
            <select name="room" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              {motel.rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {r.price !== null ? ` (${formatPrice(r.price)}/night)` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Guests</span>
            <select name="guests" key={roomId} defaultValue={guestLabel(Math.min(prefill.guests ?? 2, maxGuests))}>
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={guestLabel(n)}>
                  {guestLabel(n)}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>Check-in</span>
              <input type="date" name="checkin" min={today} defaultValue={prefill.checkin} aria-invalid={!!errors.dates} aria-describedby="err-dates" onChange={() => clear("dates")} />
            </label>
            <label className={styles.field}>
              <span>Check-out</span>
              <input type="date" name="checkout" min={today} defaultValue={prefill.checkout} aria-invalid={!!errors.dates} aria-describedby="err-dates" onChange={() => clear("dates")} />
            </label>
          </div>
          <p id="err-dates" className={styles.error}>{errors.dates}</p>

          <label className={styles.field}>
            <span>Full name</span>
            <input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="err-name" onChange={() => clear("name")} />
          </label>
          <p id="err-name" className={styles.error}>{errors.name}</p>

          <label className={styles.field}>
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="err-email" onChange={() => clear("email")} />
          </label>
          <p id="err-email" className={styles.error}>{errors.email}</p>

          <label className={styles.field}>
            <span>
              Phone <em>(optional)</em>
            </span>
            <input type="tel" name="phone" autoComplete="tel" />
          </label>

          <label className={styles.field}>
            <span>
              Special requests <em>(optional)</em>
            </span>
            <input name="requests" placeholder="Ground floor, early check-in" />
          </label>

          <div className={styles.trap} aria-hidden="true">
            <label>
              Leave this empty <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <p className={styles.error} role="alert">{errors.form}</p>
          <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={sending}>
            {sending ? "Sending reservation request" : "Send reservation request"}
          </button>
        </form>
      )}
    </dialog>
  );
}

// "2026-12-10" -> "Thu, Dec 10, 2026" for the emails
function friendlyDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const guestLabel = (n: number) => `${n} ${n === 1 ? "guest" : "guests"}`;
