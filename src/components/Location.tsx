import { MapPin, Navigation } from "lucide-react";
import type { Motel } from "@/data/types";
import { directionsUrl, fullAddress, mapEmbedUrl } from "@/lib/site";
import styles from "./Location.module.css";

export function Location({ motel }: { motel: Motel }) {
  const address = fullAddress(motel);

  return (
    <section id="location" className={`section ${styles.location}`} aria-labelledby="location-title">
      <div className={`container ${styles.inner}`}>
        <div>
          <p className="eyebrow">Location</p>
          <h2 id="location-title">Close to downtown and the airport</h2>
          {address && <p className={styles.address}>{address}</p>}
          <p className={styles.lead}>A short drive to:</p>
          <ul className={styles.nearby}>
            {motel.nearby.map((place) => (
              <li key={place}>
                <MapPin aria-hidden /> {place}
              </li>
            ))}
          </ul>
          <a href={directionsUrl(motel)} target="_blank" rel="noopener" className={`btn btn-primary ${styles.directions}`}>
            <Navigation aria-hidden /> Get directions
          </a>
        </div>
        <div className={styles.map}>
          <iframe
            title={`Map showing ${motel.name}`}
            src={mapEmbedUrl(motel)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
