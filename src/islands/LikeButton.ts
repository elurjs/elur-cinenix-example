import { html, signal } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";

export interface LikeButtonProps {
  slug: string;
  initial: number;
}

export default function LikeButton(props: LikeButtonProps): ElurTemplate {
  const likes = signal(props.initial);
  const pending = signal(false);

  async function toggle() {
    if (pending.value) return;
    pending.value = true;
    try {
      const res = await fetch(`/api/movies/${props.slug}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to like");
      const data = (await res.json()) as { likes: number };
      likes.value = data.likes;
    } catch (err) {
      console.error("[like]", err);
    } finally {
      pending.value = false;
    }
  }

  return html`
    <button class="btn" @click=${toggle} aria-label="Me gusta" disabled=${() => pending.value}>
      👍 ${() => likes.value} me gusta
    </button>
  `;
}
