import type { PageDataLoad } from "@deijose/nix-js-kit";
import {
  getMovieBySlug,
  getReviews,
  getLikeCount,
  getAverageRating,
  getVisitorRating,
} from "../../data/store.ts";
import type { Movie, Review } from "../../data/store.ts";

export interface MovieData {
  movie: Movie | null;
  reviews: Review[];
  likes: number;
  averageRating: number;
  visitorRating: number;
  requestPath: string;
  /** Top-level title used by the document shell (<title>). */
  title: string;
}

export const load: PageDataLoad<MovieData> = async ({ params, request }) => {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const movie = getMovieBySlug(slug ?? "");

  if (!movie) {
    return {
      movie: null,
      reviews: [],
      likes: 0,
      averageRating: 0,
      visitorRating: 0,
      requestPath: request?.url ?? "",
      title: "Película no encontrada",
    };
  }

  return {
    movie,
    reviews: getReviews(movie.id),
    likes: getLikeCount(movie.id),
    averageRating: getAverageRating(movie.id),
    visitorRating: getVisitorRating(movie.id),
    requestPath: request?.url ?? "",
    title: movie.title,
  };
};

export const revalidate = 60;
