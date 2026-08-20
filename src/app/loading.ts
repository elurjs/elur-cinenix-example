import { html } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";

export default function RootLoading(): NixTemplate {
  return html`
    <section style="text-align: center; padding: 3rem 0;">
      <p class="muted">Cargando CineNix…</p>
      <div class="muted" style="font-size: 0.8rem;">shell de streaming (loading.ts global)</div>
    </section>
  `;
}
