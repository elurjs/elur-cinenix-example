import { html, signal, computed } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";
import type { Movie } from "../app/data/store.ts";

export interface SearchMoviesProps {
  movies: Movie[];
  genres: string[];
  initialGenre?: string | null;
}

export default function SearchMovies(props: SearchMoviesProps): ElurTemplate {
  const query = signal("");
  const genre = signal<string | null>(props.initialGenre ?? null);

  const visible = computed(() => {
    const q = query.value.trim().toLowerCase();
    const g = genre.value;
    return props.movies.filter((movie) => {
      const matchesGenre = !g || movie.genres.includes(g);
      const matchesQuery =
        q.length === 0 ||
        movie.title.toLowerCase().includes(q) ||
        movie.director.toLowerCase().includes(q) ||
        movie.genres.some((genre) => genre.toLowerCase().includes(q));
      return matchesGenre && matchesQuery;
    });
  });

  const resultLabel = computed(() => {
    const n = visible.value.length;
    return n === 1 ? "1 resultado" : `${n} resultados`;
  });

  return html`
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="form-group">
        <input
          type="search"
          placeholder="Buscar por título, director o género…"
          value=${() => query.value}
          @input=${(e: Event) => (query.value = (e.target as HTMLInputElement).value)}
        />
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;">
        <span class="muted" style="font-size: 0.85rem;">Filtrar:</span>
        ${props.genres.map((genreName: string) => html`
          <button
            class=${() => `btn ${genre.value === genreName ? "btn-primary" : ""}`}
            style="padding: 0.25rem 0.7rem; font-size: 0.8rem;"
            @click=${() => (genre.value = genre.value === genreName ? null : genreName)}
          >
            ${genreName}
          </button>
        `)}
        ${() => genre.value ? html`<button class="btn" style="padding: 0.25rem 0.7rem; font-size: 0.8rem;" @click=${() => (genre.value = null)}>Limpiar ✕</button>` : null}
      </div>
      <p class="muted" style="font-size: 0.85rem; margin-top: 0.75rem;">${() => resultLabel.value}</p>
    </div>

    <div class="movie-grid">
      ${() => visible.value.map((movie: Movie) => html`
        <article class="card movie-card">
          <h3><a href="/movies/${movie.slug}">${movie.title}</a></h3>
          <p class="muted" style="font-size: 0.85rem;">${movie.year} · ${movie.director}</p>
          <p style="font-size: 0.9rem;">${movie.synopsis.slice(0, 90)}…</p>
          <div>${movie.genres.map((g: string) => html`<span class="tag">${g}</span>`)}</div>
        </article>
      `)}
    </div>
  `;
}
