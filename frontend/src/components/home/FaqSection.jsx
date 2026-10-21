import { useState } from "react";
import { FAQS } from "../../data/faqs";

// Preguntas frecuentes con acordeón: una abierta a la vez, con animación de altura.
function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-black px-6 py-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-white/60">
            Ayuda
          </p>
          <h2 className="mt-3 font-display text-5xl sm:text-6xl">FAQs</h2>
          <p className="mt-4 max-w-xs text-white/60">
            Lo esencial para comprar en Ruby.
          </p>
        </div>

        <ul className="border-t border-white/15">
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
                    <p className="max-w-2xl pb-6 text-white/70">{faq.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default FaqSection;
