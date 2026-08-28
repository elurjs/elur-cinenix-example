import { html } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";

export default function PricingPage(): ElurTemplate {
  return html`
    <h1>Planes de CineElur</h1>
    <p class="muted">Precios simples para una página generada desde un route group.</p>
    <div class="movie-grid">
      <div class="card">
        <h3>Free</h3>
        <p>Catálogo completo</p>
        <p>Reseñas ilimitadas</p>
        <p><strong>$0</strong>/mes</p>
        <a class="btn btn-primary" href="/register">Empezar</a>
      </div>
      <div class="card">
        <h3>Pro</h3>
        <p>Recomendaciones IA</p>
        <p>Ventajas premium</p>
        <p><strong>$9</strong>/mes</p>
        <a class="btn" href="/contact">Contactar</a>
      </div>
    </div>
  `;
}
