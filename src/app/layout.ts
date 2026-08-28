import { html, signal } from "@elurjs/core";
import { island } from "@elurjs/kit";
import type { LayoutProps } from "@elurjs/kit";
import type { ElurTemplate } from "@elurjs/core";
import type { LayoutData } from "./layout.data.ts";
import ThemeToggle from "../islands/ThemeToggle.ts";

export default function RootLayout({ children, data }: LayoutProps<LayoutData>): ElurTemplate {
  const visited = signal(0);
  const genreCount = data?.genreCount ?? 0;

  return html`
    <style>
      :root {
        --bg: #f8fafc;
        --surface: #ffffff;
        --text: #0f172a;
        --muted: #64748b;
        --primary: #e11d48;
        --primary-dark: #be123c;
        --border: #e2e8f0;
      }
      [data-theme="dark"] {
        --bg: #0f172a;
        --surface: #1e293b;
        --text: #f1f5f9;
        --muted: #94a3b8;
        --primary: #f43f5e;
        --border: #334155;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        line-height: 1.6;
        transition: background 0.2s, color 0.2s;
      }
      .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
      .site-header {
        position: sticky; top: 0; z-index: 10;
        background: color-mix(in srgb, var(--bg) 85%, transparent);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--border);
      }
      .nav { display: flex; align-items: center; gap: 1.25rem; padding: 0.9rem 0; }
      .brand { font-weight: 800; font-size: 1.2rem; color: var(--primary); text-decoration: none; }
      .nav-links { display: flex; gap: 1rem; margin-left: auto; }
      .nav-links a { color: var(--text); text-decoration: none; font-size: 0.95rem; }
      .nav-links a:hover { color: var(--primary); }
      .site-footer { border-top: 1px solid var(--border); padding: 1.5rem 0; margin-top: 3rem; color: var(--muted); font-size: 0.85rem; }
      .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text); cursor: pointer; text-decoration: none; font-size: 0.9rem; }
      .btn:hover { border-color: var(--primary); color: var(--primary); }
      .btn-primary { background: var(--primary); border-color: var(--primary); color: white; }
      .btn-primary:hover { background: var(--primary-dark); color: white; }
      .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; }
      .movie-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; }
      .movie-card h3 { margin: 0 0 0.35rem; }
      .movie-card h3 a { color: var(--text); text-decoration: none; }
      .movie-card h3 a:hover { color: var(--primary); }
      .tag { display: inline-block; background: color-mix(in srgb, var(--primary) 12%, var(--surface)); color: var(--primary); border-radius: 999px; padding: 0.15rem 0.6rem; font-size: 0.78rem; margin-right: 0.3rem; }
      .muted { color: var(--muted); }
      .form-group { margin-bottom: 1rem; }
      .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem; }
      .form-group input, .form-group textarea, .form-group select {
        width: 100%; padding: 0.5rem 0.7rem; border-radius: 8px;
        border: 1px solid var(--border); background: var(--bg); color: var(--text);
        font: inherit;
      }
      .form-error { color: var(--primary); font-size: 0.9rem; }
      .form-success { color: #16a34a; font-size: 0.9rem; }
      .review-list { display: grid; gap: 0.75rem; }
      .stars { color: #f59e0b; font-size: 1.3rem; letter-spacing: 2px; }
    </style>
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="/">🎬 CineElur</a>
        <nav class="nav-links">
          <a href="/">Inicio</a>
          <a href="/movies">Catálogo</a>
          <a href="/docs/intro">Docs</a>
          <a href="/pricing">Precios</a>
          <a href="/about">Acerca</a>
        </nav>
        <span class="muted" style="font-size: 0.8rem;">${genreCount} géneros</span>
        ${island("ThemeToggle", ThemeToggle, { initial: data?.cookieTheme ?? "light" }, "load")}
      </div>
    </header>
    <main class="container">
      ${children}
      <p class="muted" style="font-size: 0.8rem;">
        Visitas en esta sesión: ${() => visited.value}
        <button class="btn" style="margin-left: 0.5rem; padding: 0.2rem 0.6rem;" @click=${() => visited.value++}>+1</button>
      </p>
    </main>
    <footer class="site-footer">
      <div class="container">
        <p>CineElur — demo de <strong>Elur Kit</strong>: SSG, SSR, ISR, streaming, islands, server actions y API routes.</p>
      </div>
    </footer>
  `;
}
