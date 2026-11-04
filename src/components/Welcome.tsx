import Image from "next/image";
import type { Motel } from "@/data/types";
import { photo } from "@/lib/site";
import styles from "./Welcome.module.css";

export function Welcome({ motel }: { motel: Motel }) {
  return (
    <section className={`section ${styles.welcome}`} aria-labelledby="welcome-title">
      <div className={`container ${styles.inner}`}>
        <Image {...photo(motel.welcome.photo)} sizes="(max-width: 900px) 100vw, 560px" className={styles.photo} />
        <div className={styles.text}>
          <h2 id="welcome-title">{motel.welcome.heading}</h2>
          <p>{motel.welcome.body}</p>
          <dl className={styles.times}>
            <div>
              <dt>Check-in</dt>
              <dd>{motel.checkIn}</dd>
            </div>
            <div>
              <dt>Check-out</dt>
              <dd>{motel.checkOut}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
