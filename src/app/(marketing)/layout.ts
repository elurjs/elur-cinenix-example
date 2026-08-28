import { html } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";
import type { LayoutProps } from "@elurjs/kit";

export default function MarketingLayout({ children }: LayoutProps): ElurTemplate {
  return html`
    <section class="card" style="margin-top: 1.5rem; padding: 1.5rem 2rem;">
      <div class="muted" style="font-size: 0.8rem; margin-bottom: 1rem;">
        ← Sección de marketing (route group <code>(marketing)</code>)
      </div>
      ${children}
    </section>
  `;
}
