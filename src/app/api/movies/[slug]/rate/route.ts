import { getMovieBySlug, setVisitorRating, getAverageRating } from "../../../../data/store.ts";

export async function POST(request: Request, ctx: { params: Record<string, string | string[]> }): Promise<Response> {
  const slug = Array.isArray(ctx.params.slug) ? ctx.params.slug[0] : ctx.params.slug;
  const movie = getMovieBySlug(slug);
  if (!movie) {
    return Response.json({ error: "Película no encontrada" }, { status: 404 });
  }
  let rating: unknown;
  try {
    ({ rating } = (await request.json()) as { rating: unknown });
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }
  const value = Number(rating);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return Response.json({ error: "rating debe ser un entero entre 1 y 5" }, { status: 400 });
  }
  setVisitorRating(movie.id, value);
  return Response.json({ rating: value, average: getAverageRating(movie.id) });
}
