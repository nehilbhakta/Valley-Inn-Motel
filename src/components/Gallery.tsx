"use client";

import { useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import type { Motel } from "@/data/types";
import { photo } from "@/lib/site";
import { Lightbox } from "./Lightbox";
import styles from "./Gallery.module.css";

const PREVIEW = 7;

export function Gallery({ motel }: { motel: Motel }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const preview = motel.gallery.slice(0, PREVIEW);

  return (
    <section id="photos" className={`section ${styles.section}`} aria-labelledby="photos-title">
      <div className="container">
        <div className={styles.head}>
          <div className="section-intro">
            <h2 id="photos-title">See the rooms and property</h2>
            <p>The lobby, rooms, bathrooms and parking. Tap any photo to see it larger.</p>
          </div>
          <button type="button" className={`btn btn-outline ${styles.all}`} onClick={() => setLightbox(0)}>
            <Images aria-hidden /> See all {motel.gallery.length} photos
          </button>
        </div>

        <ul className={styles.grid}>
          {preview.map((p, i) => (
            <li key={p.key} className={styles[`tile${i}`]}>
              <button type="button" onClick={() => setLightbox(i)}>
                <Image {...photo(p)} sizes="(max-width: 700px) 50vw, 400px" />
                <span className="visually-hidden">Open photo: {p.alt}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {lightbox !== null && (
        <Lightbox photos={motel.gallery} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} label="Valley Inn photos" />
      )}
    </section>
  );
}
