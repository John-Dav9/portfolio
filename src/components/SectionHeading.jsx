import { Reveal } from "./motion";

export default function SectionHeading({ index, title, children }) {
  return (
    <Reveal className="section-title mb-10">
      <span className="font-mono text-accent transition-colors duration-500">{index}.</span>
      <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
      {children && <div className="order-last ml-4 hidden sm:block">{children}</div>}
    </Reveal>
  );
}
