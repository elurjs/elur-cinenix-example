import type { PageDataLoad } from "@deijose/nix-js-kit";
import { getMovies, allGenres } from "../data/store.ts";

export interface MoviesData {
  movies: ReturnType<typeof getMovies>;
  genres: string[];
  /** Genre filter from the query string (e.g. /movies?genre=Sci-Fi). */
  genre: string | null;
}

export const load: PageDataLoad<MoviesData> = async ({ searchParams }) => {
  return {
    movies: getMovies(),
    genres: allGenres(),
    genre: searchParams.get("genre"),
  };
};
