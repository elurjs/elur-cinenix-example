import { html } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";
import type { PageProps, GenerateStaticParams } from "@elurjs/kit";
import type { DocData } from "./page.data.ts";
import { DOC_KEYS } from "./page.data.ts";

export const generateStaticParams: GenerateStaticParams = async () => {
  return DOC_KEYS.map((slug) => ({ slug: [slug] }));
};

export default function DocsPage({ data, params }: PageProps<DocData>): ElurTemplate {
  const segments = Array.isArray(params.slug) ? params.slug : [params.slug ?? ""];
  return html`
    <h1>📚 ${data.title}</h1>
    <p class="muted" style="font-size: 0.85rem;">
      Ruta catch-all: <code>docs/${segments.join("/")}</code>
    </p>
    <div class="card">
      ${data.content.map((paragraph: string) => html`<p>${paragraph}</p>`)}
    </div>
    <div style="margin-top: 1rem;">
      <a href="/docs/intro" class="btn">Intro</a>
      <a href="/docs/islands" class="btn">Islands</a>
      <a href="/docs/server-actions" class="btn">Server actions</a>
      <a href="/docs/streaming" class="btn">Streaming</a>
    </div>
  `;
}
