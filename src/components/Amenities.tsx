import { ConciergeBell, Microwave, Snowflake, SquareParking, Tv, Wifi, MapPin, CigaretteOff } from "lucide-react";
import type { Amenity, Motel } from "@/data/types";
import styles from "./Amenities.module.css";

const icons: Record<Amenity["icon"], React.ComponentType<{ "aria-hidden"?: boolean }>> = {
  wifi: Wifi,
  parking: SquareParking,
  snowflake: Snowflake,
  microwave: Microwave,
  tv: Tv,
  desk: ConciergeBell,
  map: MapPin,
  nosmoking: CigaretteOff,
};

export function Amenities({ motel }: { motel: Motel }) {
  return (
    <section className={styles.amenities} aria-labelledby="amenities-title">
      <div className="container">
        <h2 id="amenities-title" className="visually-hidden">
          Amenities
        </h2>
        <ul className={styles.list}>
          {motel.amenities.map((a) => {
            const Icon = icons[a.icon];
            return (
              <li key={a.name}>
                <Icon aria-hidden />
                <span>
                  <strong>{a.name}</strong>
                  <span>{a.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
