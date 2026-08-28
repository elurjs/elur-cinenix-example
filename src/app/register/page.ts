import { html } from "@elurjs/core";
import { island } from "@elurjs/kit";
import type { ElurTemplate } from "@elurjs/core";
import RegisterForm from "../../islands/RegisterForm.ts";

export default function RegisterPage(): ElurTemplate {
  return html`
    <h1>Crea tu cuenta</h1>
    <p class="muted">Registro con server action scopeada a /register.</p>
    ${island("RegisterForm", RegisterForm, {}, "load")}
  `;
}
