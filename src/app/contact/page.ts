import { html } from "@elurjs/core";
import { island } from "@elurjs/kit";
import type { ElurTemplate } from "@elurjs/core";
import ContactForm from "../../islands/ContactForm.ts";

export default function ContactPage(): ElurTemplate {
  return html`
    <h1>Contacto</h1>
    <p class="muted">Escríbenos con server actions (también funciona sin JavaScript).</p>
    ${island("ContactForm", ContactForm, {}, "load")}
  `;
}
