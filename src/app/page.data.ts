import type { PageDataLoad } from "@deijose/nix-js-kit";
import { getFeaturedMovies, allGenres } from "./data/store.ts";

export interface HomeData {
  featured: ReturnType<typeof getFeaturedMovies>;
  genres: string[];
  totalMinutes: number;
  greeting: string;
}

export const load: PageDataLoad<HomeData> = async ({ params, searchParams }) => {
  const featured = getFeaturedMovies();
  return {
    featured,
    genres: allGenres(),
    totalMinutes: featured.reduce((acc, m) => acc + m.durationMin, 0),
    greeting: searchParams.get("greet") ?? "Bienvenido",
  };
};
