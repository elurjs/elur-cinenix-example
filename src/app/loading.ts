import { html } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";

export default function RootLoading(): ElurTemplate {
  return html`
    <section style="text-align: center; padding: 3rem 0;">
      <p class="muted">Cargando CineElur…</p>
      <div class="muted" style="font-size: 0.8rem;">shell de streaming (loading.ts global)</div>
    </section>
  `;
}
