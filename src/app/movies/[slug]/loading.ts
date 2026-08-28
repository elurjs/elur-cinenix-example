import { html } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";

export default function MovieLoading(): ElurTemplate {
  return html`
    <article class="card" style="margin-top: 2rem; text-align: center; padding: 3rem;">
      <p>Cargando ficha de la película…</p>
      <p class="muted" style="font-size: 0.8rem;">shell de streaming (loading.ts de la ruta dinámica)</p>
    </article>
  `;
}
