import { Reveal } from "./motion";

export default function SectionHeading({ index, title, children }) {
  return (
    <Reveal className="section-title mb-8 gap-3 sm:mb-10 sm:gap-4">
      <span className="font-mono text-accent transition-colors duration-500">{index}.</span>
      <h2 className="text-[1.35rem] leading-tight font-extrabold tracking-tight text-white min-[380px]:text-3xl sm:text-4xl">{title}</h2>
      {children && <div className="order-last ml-4 hidden sm:block">{children}</div>}
    </Reveal>
  );
}
