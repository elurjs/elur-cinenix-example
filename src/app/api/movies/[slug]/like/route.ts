import { getMovieBySlug, toggleLike, getLikeCount } from "../../../../data/store.ts";

export async function POST(_request: Request, ctx: { params: Record<string, string | string[]> }): Promise<Response> {
  const slug = Array.isArray(ctx.params.slug) ? ctx.params.slug[0] : ctx.params.slug;
  const movie = getMovieBySlug(slug);
  if (!movie) {
    return Response.json({ error: "Película no encontrada" }, { status: 404 });
  }
  toggleLike(movie.id);
  return Response.json({ likes: getLikeCount(movie.id) });
}
