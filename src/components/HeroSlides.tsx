"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { Photo } from "@/data/types";
import { photo } from "@/lib/site";
import styles from "./Hero.module.css";

const SLIDE_MS = 6500;

export function HeroSlides({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Don't auto-rotate for visitors who ask for less motion
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || photos.length < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % photos.length), SLIDE_MS);
    return () => window.clearInterval(t);
  }, [playing, photos.length]);

  return (
    <>
      {photos.map((p, i) => {
        const img = photo(p);
        return (
          <Image
            key={p.key}
            {...img}
            alt={i === index ? img.alt : ""}
            aria-hidden={i !== index}
            priority={i === 0}
            sizes="100vw"
            className={`${styles.slide} ${i === index ? styles.active : ""}`}
          />
        );
      })}
      {photos.length > 1 && (
        <button type="button" className={styles.pause} onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
          <span className="visually-hidden">{playing ? "Pause photo slideshow" : "Play photo slideshow"}</span>
        </button>
      )}
    </>
  );
}
