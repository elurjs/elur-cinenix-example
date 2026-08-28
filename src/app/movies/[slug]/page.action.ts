import { fail, redirect } from "@elurjs/kit";
import { getMovieBySlug, addReview as createReview } from "../../data/store.ts";

function cleanAuthor(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const author = value.trim();
  if (author.length < 2 || author.length > 50) return null;
  return author;
}

function cleanBody(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const body = value.trim();
  if (body.length < 4 || body.length > 1000) return null;
  return body;
}

function cleanRating(value: unknown): number | null {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  return rating;
}

/**
 * Server action: adds a review for a movie. Scoped to the dynamic route
 * `/movies/:slug`; works from the client (elurJsAction) and from a plain form
 * (progressive enhancement).
 */
export async function addReview(input: { slug?: string; author?: unknown; rating?: unknown; body?: unknown }): Promise<unknown> {
  const slug = typeof input.slug === "string" ? input.slug : "";
  const movie = getMovieBySlug(slug);
  if (!movie) {
    return fail({ slug: "Película no encontrada" }, 404);
  }

  const author = cleanAuthor(input.author);
  const rating = cleanRating(input.rating);
  const body = cleanBody(input.body);

  const errors: Record<string, string> = {};
  if (!author) errors.author = "El nombre debe tener entre 2 y 50 caracteres";
  if (!rating) errors.rating = "La calificación debe ser un número entre 1 y 5";
  if (!body) errors.body = "La reseña debe tener entre 4 y 1000 caracteres";
  if (Object.keys(errors).length > 0) {
    return fail(errors, 400);
  }

  createReview(movie.id, author!, rating!, body!);
  return redirect(303, `/movies/${movie.slug}?reviewed=1`);
}
