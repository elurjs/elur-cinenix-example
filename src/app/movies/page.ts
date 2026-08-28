import { html } from "@elurjs/core";
import { island } from "@elurjs/kit";
import type { PageProps } from "@elurjs/kit";
import type { ElurTemplate } from "@elurjs/core";
import type { MoviesData } from "./page.data.ts";
import type { Movie } from "../data/store.ts";
import SearchMovies from "../../islands/SearchMovies.ts";

export default function MoviesPage({ data }: PageProps<MoviesData>): ElurTemplate {
  return html`
    <h1>Catálogo</h1>
    <p class="muted">${data.movies.length} películas · filtro por género vía query string: ${data.genre ?? "todos"}</p>
    ${island("SearchMovies", SearchMovies, { movies: data.movies, genres: data.genres, initialGenre: data.genre }, "idle")}
  `;
}

export function movieCard(movie: Movie): ReturnType<typeof html> {
  return html`
    <article class="card movie-card">
      <h3><a href="/movies/${movie.slug}">${movie.title}</a></h3>
      <p class="muted" style="font-size: 0.85rem;">${movie.year} · ${movie.director}</p>
      <p style="font-size: 0.9rem;">${movie.synopsis.slice(0, 90)}…</p>
      <div>${movie.genres.map((genre: string) => html`<span class="tag">${genre}</span>`)}</div>
    </article>
  `;
}
