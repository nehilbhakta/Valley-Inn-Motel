import type { Motel } from "@/data/types";
import { Phone } from "lucide-react";
import { formatPrice, lowestPrice } from "@/lib/site";
import { HeroSlides } from "./HeroSlides";
import { BookingBar } from "./BookingBar";
import styles from "./Hero.module.css";

export function Hero({ motel }: { motel: Motel }) {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.frame}>
        <HeroSlides photos={motel.heroPhotos} />
        <div className={`container ${styles.copy}`}>
          {(() => {
            const from = lowestPrice(motel);
            return from !== null ? (
              <span className={styles.pricePill}>Rooms from {formatPrice(from)}/night</span>
            ) : null;
          })()}
          <h1 id="hero-title">Clean rooms near downtown Phoenix</h1>
          <p>Free parking, free Wi-Fi, microwave &amp; fridge in every room.</p>
          <div className={styles.ctaRow}>
            <a href="#rooms" className="btn btn-gold">
              See rooms
            </a>
            <a href={`tel:${motel.phone.tel}`} className="btn btn-outline btn-light">
              <Phone aria-hidden /> <span className={styles.callFull}>Call {motel.phone.display}</span>
              <span className={styles.callShort}>Call us</span>
            </a>
          </div>
        </div>
      </div>
      <div className={`container ${styles.barWrap}`}>
        <BookingBar motel={motel} />
      </div>
    </section>
  );
}
