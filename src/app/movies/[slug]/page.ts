import { html } from "@deijose/nix-js";
import { island } from "@deijose/nix-js-kit";
import type { NixTemplate } from "@deijose/nix-js";
import type { PageProps, GenerateStaticParams } from "@deijose/nix-js-kit";
import type { MovieData } from "./page.data.ts";
import { movieSlugs } from "../../data/store.ts";
import LikeButton from "../../../islands/LikeButton.ts";
import RatingStars from "../../../islands/RatingStars.ts";
import ReviewForm from "../../../islands/ReviewForm.ts";

export const generateStaticParams: GenerateStaticParams = async () => {
  return movieSlugs().map((slug) => ({ slug }));
};

export default function MoviePage({ data, params }: PageProps<MovieData>): NixTemplate {
  const slug = typeof params.slug === "string" ? params.slug : params.slug[0];

  if (!data.movie) {
    return html`
      <article class="card" style="margin-top: 2rem;">
        <h1>Película no encontrada</h1>
        <p class="muted">No existe "${slug}" en el catálogo.</p>
        <a href="/movies" class="btn">← Volver al catálogo</a>
      </article>
    `;
  }

  const movie = data.movie;

  return html`
    <nav class="muted" style="font-size: 0.85rem; margin: 1rem 0;">
      <a href="/movies">Catálogo</a> / ${movie.title}
    </nav>

    <article class="card">
      <header>
        <h1>${movie.title}</h1>
        <p class="muted">${movie.year} · ${movie.director} · ${movie.durationMin} min</p>
        <div>
          ${movie.genres.map((genre: string) => html`<span class="tag">${genre}</span>`)}
        </div>
      </header>
      <p style="margin-top: 1rem;">${movie.synopsis}</p>

      <div style="display: flex; gap: 1rem; align-items: center; margin-top: 1.25rem;">
        ${island("LikeButton", LikeButton, { slug: movie.slug, initial: data.likes }, "load")}
        ${island("RatingStars", RatingStars, { slug: movie.slug, initial: data.visitorRating, average: data.averageRating }, "visible")}
        <span class="muted" style="font-size: 0.85rem;">Media: ${data.averageRating > 0 ? `${data.averageRating} / 5` : "sin reseñas"}</span>
      </div>
      <p class="muted" style="font-size: 0.75rem;">request.url: ${data.requestPath || "—"}</p>
    </article>

    <section style="margin-top: 2rem;">
      <h2>Reseñas (${data.reviews.length})</h2>
      <div class="review-list">
        ${data.reviews.length > 0
          ? data.reviews.map((review) => html`
              <div class="card" style="padding: 0.9rem 1.1rem;">
                <strong>${review.author}</strong>
                <span class="stars" style="font-size: 1rem;">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
                <p style="font-size: 0.95rem; margin: 0.35rem 0 0;">${review.body}</p>
              </div>
            `)
          : html`<p class="muted">Sé el primero en reseñar esta película.</p>`}
      </div>
      ${island("ReviewForm", ReviewForm, { slug: movie.slug, page: `/movies/${movie.slug}` }, "visible")}
    </section>
  `;
}
