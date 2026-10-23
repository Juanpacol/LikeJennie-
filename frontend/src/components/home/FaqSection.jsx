import { useState } from "react";
import { FAQS } from "../../data/faqs";

// Preguntas frecuentes con acordeón: una abierta a la vez, con animación de altura.
function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="px-6 py-14 text-white sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[5fr_7fr]">
        {/* Hueco de la columna del collage (lo dibuja ShopCollage). */}
        <div aria-hidden="true" className="hidden lg:block" />

        <div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
              Ayuda
            </p>
            <h2 className="mt-3 font-condensed text-6xl font-light uppercase tracking-[-0.01em] sm:text-7xl">
              FAQs
            </h2>
            <p className="mt-4 max-w-xs text-white/60">
              Lo esencial para comprar en Ruby.
            </p>
          </div>

          <ul className="mt-10 border-t border-white/15">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <li key={faq.question} className="border-b border-white/15">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="hover-underline flex w-full items-center justify-between gap-6 py-5 text-left font-display text-xl sm:text-2xl"
                  >
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-2xl leading-none transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-white/70">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
