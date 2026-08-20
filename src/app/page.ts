import { html } from "@deijose/nix-js";
import type { PageProps } from "@deijose/nix-js-kit";
import type { NixTemplate } from "@deijose/nix-js";
import type { HomeData } from "./page.data.ts";
import type { Movie } from "./data/store.ts";

export default function HomePage({ data }: PageProps<HomeData>): NixTemplate {
  return html`
    <section style="text-align: center; padding: 3rem 0 2rem;">
      <h1>${data.greeting} a CineNix 🎬</h1>
      <p class="muted">
        Catálogo de ${data.genres.length} géneros ·
        ${data.totalMinutes} minutos de cine destacado ·
        generado con Nix.js Kit
      </p>
      <a href="/movies" class="btn btn-primary" style="font-size: 1rem;">Explorar catálogo</a>
    </section>

    <section>
      <h2>Destacadas</h2>
      <div class="movie-grid">
        ${data.featured.map((movie: Movie) => html`
          <article class="card movie-card">
            <h3><a href="/movies/${movie.slug}">${movie.title}</a></h3>
            <p class="muted" style="font-size: 0.85rem;">${movie.year} · ${movie.director}</p>
            <p style="font-size: 0.9rem;">${movie.synopsis.slice(0, 90)}…</p>
            <div>${movie.genres.map((genre: string) => html`<span class="tag">${genre}</span>`)}</div>
          </article>
        `)}
      </div>
    </section>
  `;
}
