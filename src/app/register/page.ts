import { html } from "@deijose/nix-js";
import { island } from "@deijose/nix-js-kit";
import type { NixTemplate } from "@deijose/nix-js";
import RegisterForm from "../../islands/RegisterForm.ts";

export default function RegisterPage(): NixTemplate {
  return html`
    <h1>Crea tu cuenta</h1>
    <p class="muted">Registro con server action scopeada a /register.</p>
    ${island("RegisterForm", RegisterForm, {}, "load")}
  `;
}
