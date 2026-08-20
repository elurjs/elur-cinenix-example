import { html } from "@deijose/nix-js";
import { island } from "@deijose/nix-js-kit";
import type { NixTemplate } from "@deijose/nix-js";
import ContactForm from "../../islands/ContactForm.ts";

export default function ContactPage(): NixTemplate {
  return html`
    <h1>Contacto</h1>
    <p class="muted">Escríbenos con server actions (también funciona sin JavaScript).</p>
    ${island("ContactForm", ContactForm, {}, "load")}
  `;
}
