import { html, signal } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";

export interface RatingStarsProps {
  slug: string;
  initial: number;
  average: number;
}

export default function RatingStars(props: RatingStarsProps): NixTemplate {
  const rating = signal(props.initial);
  const pending = signal(false);

  async function setRating(value: number) {
    if (pending.value || value === rating.value) return;
    pending.value = true;
    try {
      const res = await fetch(`/api/movies/${props.slug}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });
      if (!res.ok) throw new Error("Failed to rate");
      rating.value = value;
    } catch (err) {
      console.error("[rating]", err);
    } finally {
      pending.value = false;
    }
  }

  return html`
    <div class="stars" role="radiogroup" aria-label="Calificar">
      ${[1, 2, 3, 4, 5].map((star: number) => html`
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; font-size: 1.4rem; padding: 0 0.1rem;"
          aria-label="${star} estrellas"
          aria-checked=${() => (rating.value >= star ? "true" : "false")}
          role="radio"
          @click=${() => setRating(star)}
        >
          ${() => (rating.value >= star ? "★" : "☆")}
        </button>
      `)}
    </div>
  `;
}
