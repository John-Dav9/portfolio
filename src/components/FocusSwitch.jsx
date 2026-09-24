import { useTranslation } from "react-i18next";
import { useFocus } from "./FocusContext";

const OPTIONS = [
  { value: "dev", icon: "</>" },
  { value: "data", icon: "▦" },
];

export default function FocusSwitch({ className = "" }) {
  const { t } = useTranslation();
  const { focus, setFocus } = useFocus();

  return (
    <div
      role="group"
      aria-label={t("focus.label")}
      className={`relative grid grid-cols-2 rounded-full border border-line bg-panel p-1 font-mono text-[13px] ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
          focus === "data" ? "translate-x-full" : ""
        }`}
      />
      {OPTIONS.map(({ value, icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setFocus(value)}
          aria-pressed={focus === value}
          className={`relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors duration-300 ${
            focus === value ? "text-ink" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span aria-hidden="true">{icon}</span> {t(`focus.${value}`)}
        </button>
      ))}
    </div>
  );
}
