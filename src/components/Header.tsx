"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";
import type { Motel } from "@/data/types";
import images from "@/data/images.json";
import { track } from "@/lib/analytics";
import styles from "./Header.module.css";

const links = [
  { href: "#rooms", label: "Rooms" },
  { href: "#photos", label: "Photos" },
  { href: "#location", label: "Location" },
  { href: "#faq", label: "FAQ" },
];

export function Header({ motel }: { motel: Motel }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <a href="#top" className={styles.brand} onClick={() => setOpen(false)}>
          <Image src={images.logo.src} width={48} height={48} alt="" priority />
          <span>
            <span className={styles.name}>{motel.shortName}</span>
            <span className={styles.area}>Downtown Phoenix</span>
          </span>
        </a>

        <nav id="site-nav" className={`${styles.nav} ${open ? styles.open : ""}`} aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={`tel:${motel.phone.tel}`}
          className={`btn btn-primary ${styles.call}`}
          onClick={() => track("phone_call_click", { location: "header" })}
        >
          <Phone aria-hidden />
          <span className={styles.callText}>{motel.phone.display}</span>
          <span className="visually-hidden">Call {motel.shortName}</span>
        </a>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
          <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
    </header>
  );
}
