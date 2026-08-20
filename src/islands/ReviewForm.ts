import { html, signal, computed } from "@deijose/nix-js";
import { nixJsAction } from "@deijose/nix-js-kit/action";
import { navigateTo } from "@deijose/nix-js-kit/router";
import type { NixTemplate } from "@deijose/nix-js";

export interface ReviewFormProps {
  slug: string;
  /** Concrete page path used to scope the server action (e.g. /movies/inception). */
  page: string;
}

export default function ReviewForm(props: ReviewFormProps): NixTemplate {
  const author = signal("");
  const rating = signal(5);
  const body = signal("");
  const pending = signal(false);
  const error = signal<string | null>(null);
  const success = signal(false);

  const action = nixJsAction("addReview", { page: props.page });

  const starsLabel = computed(() => `${rating.value} / 5`);

  async function submit(e: Event) {
    e.preventDefault();
    if (pending.value) return;
    pending.value = true;
    error.value = null;
    try {
      const result = await action.submit({
        slug: props.slug,
        author: author.value,
        rating: rating.value,
        body: body.value,
      });
      if (result && typeof result === "object" && "location" in result) {
        // Re-render the page body from the server (SPA-style) instead of a
        // full reload: the movie page is statically generated, so a reload
        // would show the stale HTML without the new review.
        const location = (result as { location: string }).location;
        const qIndex = location.indexOf("?");
        const path = qIndex === -1 ? location : location.slice(0, qIndex);
        const search = qIndex === -1 ? "" : location.slice(qIndex);
        const ok = await navigateTo(path, search);
        if (!ok) window.location.href = location;
        return;
      }
      success.value = true;
      author.value = "";
      body.value = "";
      setTimeout(() => (success.value = false), 4000);
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      pending.value = false;
    }
  }

  // The action name and page are serialized in hidden fields so the same form
  // works without JavaScript (progressive enhancement).
  return html`
    <form class="card" style="margin-top: 1.5rem;" novalidate @submit=${submit} action="/__nix-js/actions" method="POST">
      <input type="hidden" name="__nix_js_action_name" value="addReview" />
      <input type="hidden" name="__nix_js_action_page" value="/movies/${props.slug}" />
      <input type="hidden" name="slug" value="${props.slug}" />
      <h3>Deja tu reseña</h3>
      <div class="form-group">
        <label for="review-author">Nombre</label>
        <input id="review-author" name="author" type="text" value=${() => author.value} @input=${(e: Event) => (author.value = (e.target as HTMLInputElement).value)} required />
      </div>
      <div class="form-group">
        <label for="review-rating">Calificación: ${() => starsLabel.value}</label>
        <select id="review-rating" name="rating" value=${() => String(rating.value)} @change=${(e: Event) => (rating.value = Number((e.target as HTMLSelectElement).value))}>
          <option value="5">5 — Excelente</option>
          <option value="4">4 — Muy buena</option>
          <option value="3">3 — Buena</option>
          <option value="2">2 — Regular</option>
          <option value="1">1 — Mala</option>
        </select>
      </div>
      <div class="form-group">
        <label for="review-body">Reseña</label>
        <textarea id="review-body" name="body" rows="3" value=${() => body.value} @input=${(e: Event) => (body.value = (e.target as HTMLTextAreaElement).value)} required></textarea>
      </div>
      <button class="btn btn-primary" type="submit" disabled=${() => pending.value}>
        ${() => (pending.value ? "Enviando…" : "Publicar reseña")}
      </button>
      ${() => error.value ? html`<p class="form-error">${error.value}</p>` : null}
      ${() => success.value ? html`<p class="form-success">¡Reseña publicada! Recarga para verla.</p>` : null}
    </form>
  `;
}
