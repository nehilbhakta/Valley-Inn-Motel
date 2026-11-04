"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarCheck, Check, Phone, Users } from "lucide-react";
import type { Motel, Room } from "@/data/types";
import { formatPrice, photo } from "@/lib/site";
import { track } from "@/lib/analytics";
import { useBooking } from "./BookingRequest";
import { Lightbox } from "./Lightbox";
import styles from "./Rooms.module.css";

export function Rooms({ motel }: { motel: Motel }) {
  return (
    <section id="rooms" className={`section ${styles.section}`} aria-labelledby="rooms-title">
      <div className="container">
        <div className="section-intro">
          <h2 id="rooms-title">Two room types, both with the basics covered</h2>
          <p>Every room has free Wi-Fi, a flat-screen TV, a microwave and a refrigerator.</p>
        </div>
        <div className={styles.list}>
          {motel.rooms.map((room) => (
            <RoomCard key={room.id} room={room} motel={motel} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room, motel }: { room: Room; motel: Motel }) {
  const booking = useBooking();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [main, ...thumbs] = room.photos;

  return (
    <article id={`room-${room.id}`} className={styles.room} aria-labelledby={`${room.id}-title`}>
      <div className={styles.photos}>
        <button type="button" className={styles.mainPhoto} onClick={() => setLightbox(0)}>
          <Image {...photo(main)} sizes="(max-width: 900px) 100vw, 580px" />
          <span className="visually-hidden">View {room.name} photos</span>
        </button>
        {thumbs.map((p, i) => (
          <button key={p.key} type="button" className={styles.thumb} onClick={() => setLightbox(i + 1)}>
            <Image {...photo(p)} sizes="(max-width: 900px) 50vw, 290px" />
            <span className="visually-hidden">View photo: {p.alt}</span>
          </button>
        ))}
      </div>

      <div className={styles.info}>
        <h3 id={`${room.id}-title`}>{room.name}</h3>
        <p className={styles.beds}>
          <Users aria-hidden /> {room.beds}, sleeps {room.sleeps}
        </p>
        <p className={styles.description}>{room.description}</p>
        <ul className={styles.features}>
          {room.features.map((f) => (
            <li key={f}>
              <Check aria-hidden /> {f}
            </li>
          ))}
        </ul>

        <div className={styles.book}>
          <p className={styles.price}>
            {room.price !== null ? (
              <>
                <strong>{formatPrice(room.price)}</strong> per night
              </>
            ) : (
              <strong className={styles.callRate}>Call for today&rsquo;s rate</strong>
            )}
          </p>
          <div className={styles.actions}>
            {booking && (
              <button type="button" className="btn btn-primary" onClick={() => booking.open({ roomId: room.id })}>
                <CalendarCheck aria-hidden /> Reserve this room
              </button>
            )}
            <a
              href={`tel:${motel.phone.tel}`}
              className={`btn ${booking ? "btn-outline" : "btn-primary"}`}
              onClick={() => track("phone_call_click", { location: `room_${room.id}` })}
            >
              <Phone aria-hidden /> {booking ? "Call" : "Call to book"}
            </a>
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox photos={room.photos} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} label={`${room.name} photos`} />
      )}
    </article>
  );
}
