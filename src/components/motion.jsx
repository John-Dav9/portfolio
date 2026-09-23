import { useEffect, useRef, useState } from "react";
import { animate, m, useInView, useReducedMotion } from "motion/react";

const EASE = [0.2, 0.7, 0.2, 1];

// Fades and lifts its content the first time it scrolls into view.
export function Reveal({ as = "div", delay = 0, y = 28, className, children, ...rest }) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

// Staggers direct children built with <m.* variants={revealItem}>.
export const revealGroup = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
export const revealItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Pointer position as CSS variables, consumed by the .spotlight::before gradient.
export function trackSpotlight(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export function CountUp({ value, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return undefined;
    if (reduceMotion) {
      ref.current.textContent = String(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = String(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

// Types `text` character by character; restarts when the text changes.
export function Typewriter({ text, className }) {
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState({ source: text, count: 0 });
  const count = typed.source === text ? typed.count : 0;

  useEffect(() => {
    if (reduceMotion || count >= text.length) return undefined;
    const timer = setTimeout(() => setTyped({ source: text, count: count + 1 }), count === 0 ? 350 : 45);
    return () => clearTimeout(timer);
  }, [text, count, reduceMotion]);

  const visible = reduceMotion ? text : text.slice(0, count);
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{visible}</span>
      <span aria-hidden="true" className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[3px] animate-blink bg-accent" />
    </span>
  );
}

// Fixed page background; the soft light follows the pointer on devices that have one.
export function Backdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia?.("(pointer: fine)").matches) return undefined;
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--px", `${e.clientX}px`);
        el.style.setProperty("--py", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={ref} className="backdrop" aria-hidden="true" />;
}
