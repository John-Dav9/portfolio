import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import emailjs from "@emailjs/browser";
import i18n from "../i18n";
import App from "../App";

vi.mock("@emailjs/browser", () => ({ default: { send: vi.fn(() => Promise.resolve({ status: 200 })) } }));

const renderAt = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

beforeEach(async () => {
  await i18n.changeLanguage("fr");
  vi.mocked(emailjs.send).mockClear();
});

describe("home page", () => {
  it("renders every section with a single h1", () => {
    renderAt("/");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const name of ["Mes Compétences", "À propos", "Mes projets", "Ce que disent les gens", "Me Contacter"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });

  it("switches language, content and the html lang attribute", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(document.documentElement.lang).toBe("en");
    expect(localStorage.getItem("language")).toBe("en");
    expect(screen.getByRole("heading", { name: "My Skills" })).toBeInTheDocument();
    expect(screen.getByText("Back-End Development")).toBeInTheDocument();
    expect(screen.getByText(/Designed a structured Data Warehouse/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "true");
  });

  it("highlights skills and projects matching the Dev/Data switch", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const bmw = screen.getByRole("heading", { level: 3, name: "Analyse BMW - Data Warehouse" }).closest("article");
    const luxedrive = screen.getByRole("heading", { level: 3, name: "LuxeDrive" }).closest("article");
    expect(within(bmw).getByText("Data")).toBeInTheDocument();
    expect(bmw).toHaveClass("opacity-45");
    expect(luxedrive).not.toHaveClass("opacity-45");

    await user.click(screen.getAllByRole("button", { name: /data$/ })[0]);
    expect(document.documentElement.dataset.focus).toBe("data");
    expect(bmw).not.toHaveClass("opacity-45");
    expect(luxedrive).toHaveClass("opacity-45");
    expect(screen.getByRole("link", { name: "Voir les projets data →" })).toBeInTheDocument();
  });

  it("opens the skill dialog with the keyboard and closes it with Escape", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const card = screen.getByRole("button", { name: /Développement Front-End/ });
    card.focus();
    await user.keyboard(" ");
    const dialog = screen.getByRole("dialog", { name: "Développement Front-End" });
    expect(within(dialog).getByRole("button", { name: "Fermer" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(card).toHaveFocus();
  });

  it("toggles the full testimonial list", async () => {
    const user = userEvent.setup();
    renderAt("/");
    expect(screen.queryByText("Fernand Taptue")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Voir tous les avis (4)" }));
    expect(screen.getByText("Fernand Taptue")).toBeInTheDocument();
  });
});

describe("contact form", () => {
  const fillRequired = async (user) => {
    await user.type(screen.getByLabelText(/^Prénom/), "Ada");
    await user.type(screen.getByLabelText(/^Nom/), "Lovelace");
    await user.type(screen.getByLabelText(/^Adresse e-mail/), "ada@example.com");
    await user.selectOptions(screen.getByLabelText(/^Sujet/), "Freelance");
    await user.type(screen.getByLabelText(/^Message/), "Bonjour");
    await user.click(screen.getByRole("checkbox"));
  };

  it("sends the message through EmailJS without requiring a phone number", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: "Envoyer le message" }));
    expect(emailjs.send).toHaveBeenCalledTimes(1);
    const params = vi.mocked(emailjs.send).mock.calls[0][2];
    expect(params).toMatchObject({ from_name: "Ada Lovelace", reply_to: "ada@example.com", phone_number: "—" });
    expect(await screen.findByText(/Message envoyé avec succès/)).toBeInTheDocument();
  });

  it("distinguishes countries sharing a dial code", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await fillRequired(user);
    await user.selectOptions(screen.getByLabelText("Indicatif pays"), "USA");
    expect(screen.getByLabelText("Indicatif pays")).toHaveValue("USA");
    await user.type(screen.getByLabelText(/^Numéro de téléphone/), "5551234");
    await user.click(screen.getByRole("button", { name: "Envoyer le message" }));
    expect(vi.mocked(emailjs.send).mock.calls[0][2].phone_number).toBe("+1 5551234");
  });

  it("silently drops submissions that fill the honeypot", async () => {
    const user = userEvent.setup();
    const { container } = renderAt("/");
    await fillRequired(user);
    container.querySelector("#website").value = "spam";
    await user.click(screen.getByRole("button", { name: "Envoyer le message" }));
    expect(emailjs.send).not.toHaveBeenCalled();
  });
});

describe("other routes", () => {
  it("renders legal pages with navigation back to home sections", async () => {
    renderAt("/privacy-policy");
    expect(await screen.findByRole("heading", { level: 1, name: "Politique de confidentialité" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Contact" })[0]).toHaveAttribute("href", "/#Contact");
  });

  it("renders the legal notice in English", async () => {
    await i18n.changeLanguage("en");
    renderAt("/legal-notice");
    expect(await screen.findByRole("heading", { level: 1, name: "Legal notice" })).toBeInTheDocument();
    expect(screen.getByText(/Contabo GmbH/)).toBeInTheDocument();
  });

  it("renders a styled 404 page", async () => {
    renderAt("/does-not-exist");
    expect(await screen.findByRole("heading", { level: 1, name: "Page introuvable" })).toBeInTheDocument();
  });
});
