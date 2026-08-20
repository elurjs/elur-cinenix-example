import { html } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";

export default function NotFoundPage(): NixTemplate {
  return html`
    <section style="text-align: center; padding: 4rem 0;">
      <h1 style="font-size: 4rem; margin: 0;">404</h1>
      <p class="muted">Esa página no existe en CineNix.</p>
      <a href="/" class="btn btn-primary">← Volver al inicio</a>
    </section>
  `;
}
