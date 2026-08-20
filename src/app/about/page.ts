import { html } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";

export default function AboutPage(): NixTemplate {
  return html`
    <h1>Acerca de CineNix</h1>
    <p>
      Este proyecto es una demo completa de <strong>Nix.js Kit</strong>: un meta-framework
      para <a href="https://nix-js.dev/">Nix.js</a> con routing por archivos, SSG, SSR,
      ISR, streaming, islands y server actions.
    </p>
    <p>Página estática generada en build time desde <code>src/app/about/page.ts</code>.</p>
    <a href="/docs/intro" class="btn">Leer la documentación</a>
  `;
}
