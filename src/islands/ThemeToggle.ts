import { html, signal } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";

export interface ThemeToggleProps {
  initial?: string;
}

export default function ThemeToggle(props: ThemeToggleProps): ElurTemplate {
  function readClientTheme(): string | null {
    try {
      const stored = localStorage.getItem("cineelur-theme");
      if (stored) return stored;
    } catch {
    }
    const match = document.cookie.match(/theme=([^;]+)/);
    return match?.[1] ?? null;
  }

  // The stored preference wins over the server-rendered attribute: static
  // (SSG) pages bake the build-time theme, so localStorage/cookie are the
  // source of truth for the visitor.
  const initial =
    (typeof document !== "undefined" ? readClientTheme() : null) ||
    (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme")) ||
    props.initial ||
    "light";
  const theme = signal(initial);

  function apply(value: string) {
    document.documentElement.setAttribute("data-theme", value);
  }

  // Keep the <html> attribute in sync right after hydration.
  if (typeof document !== "undefined") {
    apply(initial);
  }

  function toggle() {
    const next = theme.value === "dark" ? "light" : "dark";
    theme.value = next;
    apply(next);
    document.cookie = `theme=${next}; Path=/; Max-Age=31536000`;
    try {
      localStorage.setItem("cineelur-theme", next);
    } catch {
    }
  }

  return html`
    <button class="btn" @click=${toggle} aria-label="Cambiar tema">
      ${() => (theme.value === "dark" ? "🌙 Oscuro" : "☀️ Claro")}
    </button>
  `;
}
