import type { Motel } from "@/data/types";
import { HeroSlides } from "./HeroSlides";
import { BookingBar } from "./BookingBar";
import styles from "./Hero.module.css";

export function Hero({ motel }: { motel: Motel }) {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.frame}>
        <HeroSlides photos={motel.heroPhotos} />
        <div className={`container ${styles.copy}`}>
          <h1 id="hero-title">Clean rooms near downtown Phoenix</h1>
          <p>Free parking right outside your door, free Wi-Fi, and a microwave and fridge in every room.</p>
        </div>
      </div>
      <div className={`container ${styles.barWrap}`}>
        <BookingBar motel={motel} />
      </div>
    </section>
  );
}
