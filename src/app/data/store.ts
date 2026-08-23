/**
 * In-memory store for movies, reviews, ratings and likes. No external
 * dependencies so the whole app runs on Node and Bun alike.
 */

export interface Movie {
  id: number;
  slug: string;
  title: string;
  year: number;
  director: string;
  genres: string[];
  durationMin: number;
  synopsis: string;
  featured: boolean;
}

export interface Review {
  id: number;
  movieId: number;
  author: string;
  rating: number;
  body: string;
  createdAt: string;
}

const movies: Movie[] = [
  {
    id: 1,
    slug: "inception",
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Thriller"],
    durationMin: 148,
    synopsis: "Un ladrón que roba secretos corporativos a través del sueño recibe la tarea inversa: implantar una idea en la mente de un CEO.",
    featured: true,
  },
  {
    id: 2,
    slug: "the-grand-budapest-hotel",
    title: "The Grand Budapest Hotel",
    year: 2014,
    director: "Wes Anderson",
    genres: ["Comedy", "Drama"],
    durationMin: 99,
    synopsis: "Las aventuras de un conserje de un famoso hotel europeo entre guerras y su leal empleado.",
    featured: true,
  },
  {
    id: 3,
    slug: "parasite",
    title: "Parasite",
    year: 2019,
    director: "Bong Joon-ho",
    genres: ["Thriller", "Drama"],
    durationMin: 132,
    synopsis: "Una familia pobre se infiltra en el hogar de una familia adinerada con consecuencias impredecibles.",
    featured: true,
  },
  {
    id: 4,
    slug: "mad-max-fury-road",
    title: "Mad Max: Fury Road",
    year: 2015,
    director: "George Miller",
    genres: ["Action", "Sci-Fi"],
    durationMin: 120,
    synopsis: "En un páramo postapocalíptico, Max ayuda a Furiosa a escapar con las esposas del tirano Immortan Joe.",
    featured: false,
  },
  {
    id: 5,
    slug: "everything-everywhere-all-at-once",
    title: "Everything Everywhere All at Once",
    year: 2022,
    director: "Daniel Kwan, Daniel Scheinert",
    genres: ["Sci-Fi", "Comedy"],
    durationMin: 139,
    synopsis: "Una lavandera china se convierte en la única esperanza del multiverso.",
    featured: false,
  },
  {
    id: 6,
    slug: "spirited-away",
    title: "Spirited Away",
    year: 2001,
    director: "Hayao Miyazaki",
    genres: ["Animation", "Fantasy"],
    durationMin: 125,
    synopsis: "Chihiro debe salvar a sus padres transformados en cerdos en un mundo de espíritus.",
    featured: false,
  },
];

let nextReviewId = 1;
const reviews: Review[] = [
  { id: nextReviewId++, movieId: 1, author: "Nora", rating: 5, body: "Una obra maestra del cine moderno.", createdAt: "2026-07-01 10:00:00" },
  { id: nextReviewId++, movieId: 1, author: "Leo", rating: 4, body: "Compleja pero fascinante.", createdAt: "2026-07-02 11:30:00" },
  { id: nextReviewId++, movieId: 3, author: "Mar", rating: 5, body: "Mejor película de la década.", createdAt: "2026-07-03 09:15:00" },
];

const likes = new Map<number, number>();
const visitorRatings = new Map<string, number>();

export function getMovies(): Movie[] {
  return [...movies];
}

export function getFeaturedMovies(): Movie[] {
  return movies.filter((m) => m.featured);
}

export function getMovieBySlug(slug: string): Movie | null {
  return movies.find((m) => m.slug === slug) ?? null;
}

export function getMovieById(id: number): Movie | null {
  return movies.find((m) => m.id === id) ?? null;
}

export function movieSlugs(): string[] {
  return movies.map((m) => m.slug);
}

export function getReviews(movieId: number): Review[] {
  return reviews.filter((r) => r.movieId === movieId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addReview(movieId: number, author: string, rating: number, body: string): Review {
  const review: Review = {
    id: nextReviewId++,
    movieId,
    author,
    rating,
    body,
    createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
  };
  reviews.push(review);
  return review;
}

export function getLikeCount(movieId: number): number {
  return likes.get(movieId) ?? 0;
}

export function toggleLike(movieId: number): number {
  const current = likes.get(movieId) ?? 0;
  const next = current >= 1 ? 0 : 1;
  likes.set(movieId, next);
  return next;
}

export function getVisitorRating(movieId: number): number {
  return visitorRatings.get(String(movieId)) ?? 0;
}

export function setVisitorRating(movieId: number, rating: number): void {
  visitorRatings.set(String(movieId), rating);
}

export function getAverageRating(movieId: number): number {
  const all = [...reviews.filter((r) => r.movieId === movieId).map((r) => r.rating)];
  const visitor = getVisitorRating(movieId);
  if (visitor > 0) all.push(visitor);
  if (all.length === 0) return 0;
  return Math.round((all.reduce((a, b) => a + b, 0) / all.length) * 10) / 10;
}

export function allGenres(): string[] {
  return [...new Set(movies.flatMap((m) => m.genres))].sort();
}
