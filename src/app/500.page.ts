import { html } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";

export default function ErrorPage(): ElurTemplate {
  return html`
    <section style="text-align: center; padding: 4rem 0;">
      <h1 style="font-size: 4rem; margin: 0;">500</h1>
      <p class="muted">Algo salió mal en el servidor.</p>
      <a href="/" class="btn btn-primary">← Volver al inicio</a>
    </section>
  `;
}
