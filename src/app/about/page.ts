import { html } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";

export default function AboutPage(): ElurTemplate {
  return html`
    <h1>Acerca de CineElur</h1>
    <p>
      Este proyecto es una demo completa de <strong>Elur Kit</strong>: un meta-framework
      para <a href="https://elur.dev/">Elur</a> con routing por archivos, SSG, SSR,
      ISR, streaming, islands y server actions.
    </p>
    <p>Página estática generada en build time desde <code>src/app/about/page.ts</code>.</p>
    <a href="/docs/intro" class="btn">Leer la documentación</a>
  `;
}
