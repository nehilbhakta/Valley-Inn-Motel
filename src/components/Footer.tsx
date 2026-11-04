import Image from "next/image";
import type { Motel } from "@/data/types";
import images from "@/data/images.json";
import { fullAddress } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer({ motel }: { motel: Motel }) {
  const address = fullAddress(motel);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Image src={images.logo.src} width={72} height={72} alt={`${motel.shortName} logo`} />
          <div>
            <p className={styles.name}>{motel.name}</p>
            {address && <p>{address}</p>}
            <p>
              <a href={`tel:${motel.phone.tel}`}>{motel.phone.display}</a>
              {motel.email && (
                <>
                  <br />
                  <a href={`mailto:${motel.email}`}>{motel.email}</a>
                </>
              )}
            </p>
          </div>
        </div>
        <nav aria-label="Footer" className={styles.links}>
          <a href="#rooms">Rooms and rates</a>
          <a href="#photos">Photos</a>
          <a href="#location">Location</a>
          <a href="#contact">Book direct</a>
        </nav>
      </div>
      <div className={`container ${styles.legal}`}>
        <small>&copy; {new Date().getFullYear()} {motel.name}</small>
      </div>
    </footer>
  );
}
