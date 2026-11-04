"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import type { Motel } from "@/data/types";
import { track } from "@/lib/analytics";
import styles from "./CallBar.module.css";

// Floating call button on phones. It appears once the rate sign (which has its
// own call button) scrolls out of view, so there are never two on screen.
export function CallBar({ motel }: { motel: Motel }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sign = document.getElementById("rate-sign");
    if (!sign) return setVisible(true);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sign);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={`tel:${motel.phone.tel}`}
      className={`${styles.bar} ${visible ? styles.visible : ""}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => track("phone_call_click", { location: "call_bar" })}
    >
      <Phone aria-hidden /> Call {motel.phone.display}
    </a>
  );
}
