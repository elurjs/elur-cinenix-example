import { html } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import type { LayoutProps } from "@deijose/nix-js-kit";

export default function MarketingLayout({ children }: LayoutProps): NixTemplate {
  return html`
    <section class="card" style="margin-top: 1.5rem; padding: 1.5rem 2rem;">
      <div class="muted" style="font-size: 0.8rem; margin-bottom: 1rem;">
        ← Sección de marketing (route group <code>(marketing)</code>)
      </div>
      ${children}
    </section>
  `;
}
