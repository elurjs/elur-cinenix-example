import { html } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";

export default function FeaturesPage(): ElurTemplate {
  return html`
    <h1>Características</h1>
    <ul>
      <li>SSG de todo el catálogo en segundos.</li>
      <li>ISR: las páginas de películas se regeneran cada 60 s.</li>
      <li>Streaming: la ficha de cada película muestra un shell al instante.</li>
      <li>Islands hidratadas solo donde hace falta.</li>
      <li>Server actions sin JavaScript (progressive enhancement).</li>
    </ul>
    <a href="/movies" class="btn btn-primary">Ver catálogo</a>
  `;
}
