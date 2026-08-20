# CineNix — catálogo de películas con Nix.js Kit

Proyecto de ejemplo completo que demuestra **todas** las funcionalidades de
`@deijose/nix-js-kit`, distinto al blog: catálogo de películas con reseñas,
ratings, búsqueda instantánea, documentación con rutas catch-all y páginas de
marketing.

## Funcionalidades cubiertas

| Funcionalidad | Dónde |
| --- | --- |
| Routing por archivos | `src/app/**/page.ts` |
| Route groups `(marketing)` | `src/app/(marketing)/` (layout + pricing + features) |
| Rutas dinámicas `[slug]` | `src/app/movies/[slug]/` con `generateStaticParams` |
| Rutas catch-all `[...slug]` | `src/app/docs/[...slug]/` con `generateStaticParams` |
| Data loaders | `page.data.ts` con `params`, `searchParams` y `request` |
| Layouts + `layout.data.ts` | `layout.ts` raíz y del grupo de marketing (tema vía cookie) |
| Páginas de error | `404.page.ts` y `500.page.ts` |
| Server actions | `movies/[slug]/page.action.ts` (`addReview`) — **scopeada en ruta dinámica** |
| Progressive enhancement | Formulario de reseñas sin JavaScript (`POST /__nix-js/actions`) |
| API routes | `api/movies/**` (GET/POST, parámetros dinámicos, validación) |
| Islands | `ThemeToggle` (load), `LikeButton` (load), `SearchMovies` (idle), `RatingStars` (visible), `ReviewForm` (visible) |
| Streaming | `loading.ts` global y `movies/[slug]/loading.ts` |
| ISR | `revalidate = 60` en `movies/[slug]/page.data.ts` |
| Router SPA | Navegación sin recarga + título + re-hidratación de islands |
| Interpolación de atributos | `href="/movies/${slug}"` en páginas e islands |
| SSG + SSR + adapters | `build` / `start` / `preview` / `dev` / `adapter <node\|bun\|vercel\|netlify>` |

## Scripts

```bash
bun install
bun run build        # SSG → dist/
bun run start        # SSR + streaming + ISR en http://127.0.0.1:3000
bun run dev          # dev server con hot reload (supervisor + worker)
bun run preview      # sirve dist/ con fallback SSR
bun run adapter node # genera .nix-js/node-server.mjs
bunx tsc --noEmit    # typecheck
bun run test:e2e     # E2E en Chrome headless (requiere: bunx playwright install chromium)
```

## E2E (Playwright + Chrome headless)

La suite `e2e/cinenix.spec.ts` cubre con un navegador real:

- SSG + hidratación de islands (ThemeToggle) y persistencia del tema **sin flash**
  (head script antes del paint) incluso tras redirects de server actions.
- Búsqueda instantánea y filtro por género (island `idle`).
- Navegación SPA sin recarga (contador de `framenavigated`).
- Like y rating contra la API real (aserciones deterministas con `waitForResponse`).
- Publicación de reseña: aparece en la página **sin recarga** (vía `navigateTo`).
- Validación de servidor visible (400 → mensajes) y redirect SPA.
- Docs catch-all, página 404 y fallback streaming de slugs desconocidos.
- Sin errores de consola (solo se permiten 4xx esperados).

## Notas

- Las actions en rutas dinámicas se scopedan por la URL concreta: el cliente
  llama `nixJsAction("addReview", { page: "/movies/inception" })` y el servidor
  lo resuelve al patrón `/movies/:slug`.
- El bundle de hidratación se construye con un wrapper de Vite que inyecta el
  plugin de interpolación automáticamente (los `href` parciales funcionan
  también en el cliente).
- La media de rating mezcla reseñas con el voto del visitante; los likes son
  por película (store en memoria, se reinicia con el proceso).
