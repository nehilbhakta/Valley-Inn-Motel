"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/data/types";
import { photo } from "@/lib/site";
import styles from "./Lightbox.module.css";

interface Props {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  label: string;
}

export function Lightbox({ photos, index, onIndex, onClose, label }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const count = photos.length;
  const prev = () => onIndex((index - 1 + count) % count);
  const next = () => onIndex((index + 1) % count);

  // Native <dialog> handles focus and the Escape key
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const current = photo(photos[index]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
        touchX.current = null;
      }}
    >
      <figure className={styles.figure}>
        <Image {...current} sizes="100vw" className={styles.image} />
        <figcaption>
          <span>{current.alt}</span>
          {count > 1 && (
            <span className={styles.count}>
              {index + 1} of {count}
            </span>
          )}
        </figcaption>
      </figure>

      <button type="button" className={styles.close} onClick={onClose} autoFocus>
        <X aria-hidden />
        <span className="visually-hidden">Close photos</span>
      </button>
      {count > 1 && (
        <>
          <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={prev}>
            <ChevronLeft aria-hidden />
            <span className="visually-hidden">Previous photo</span>
          </button>
          <button type="button" className={`${styles.nav} ${styles.next}`} onClick={next}>
            <ChevronRight aria-hidden />
            <span className="visually-hidden">Next photo</span>
          </button>
        </>
      )}
    </dialog>
  );
}
