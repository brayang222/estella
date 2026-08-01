"use client";

import { useState } from "react";
import styles from "./Collection.module.css";
import { PlaceholderImage } from "./PlaceholderImage";
import { Reveal } from "./Reveal";
import { categoryFilters, products, type ProductCategory } from "@/lib/products";
import { staggerDelay } from "@/lib/stagger";
import { waLink, waProductMessage } from "@/lib/whatsapp";

export function Collection() {
  const [category, setCategory] = useState<"todo" | ProductCategory>("todo");

  const visibleProducts = products.filter(
    (p) => category === "todo" || p.category === category
  );

  return (
    <section id="coleccion" className={styles.section}>
      <Reveal className={styles.header}>
        <div className={styles.headingGroup}>
          <span className={styles.eyebrow}>La colección</span>
          <h2 className={styles.heading}>Selección Estella</h2>
        </div>
        <div className={styles.filters}>
          {categoryFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.filterBtn} ${category === f.key ? styles.active : ""}`}
              onClick={() => setCategory(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className={styles.grid}>
        {visibleProducts.map((p, index) => (
          <Reveal key={p.id} delay={staggerDelay(index)} className={styles.card}>
            <div className={styles.media}>
              <PlaceholderImage
                label={p.placeholderLabel}
                angle={128}
                spacing={10}
                tone={1}
                labelPosition="center"
                className={styles.mediaImage}
                src={p.image}
                alt={p.name}
              />
              <span className={styles.tag}>{p.tag}</span>
              <div className={styles.cta}>
                <a
                  href={waLink(waProductMessage(p.name, p.price))}
                  target="_blank"
                  rel="noopener"
                  className={styles.ctaLink}
                >
                  Consultar pieza
                </a>
              </div>
            </div>
            <div className={styles.meta}>
              <h3 className={styles.name}>{p.name}</h3>
              <span className={styles.price}>{p.price}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
