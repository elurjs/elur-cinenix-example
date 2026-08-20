import { getMovies } from "../../data/store.ts";

export async function GET(): Promise<Response> {
  return Response.json({ movies: getMovies() });
}

export async function POST(request: Request): Promise<Response> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }
  const { slug, title } = (raw ?? {}) as { slug?: unknown; title?: unknown };
  if (typeof slug !== "string" || typeof title !== "string") {
    return Response.json({ error: "slug y title son obligatorios" }, { status: 400 });
  }
  return Response.json(
    { error: "El catálogo es de solo lectura en esta demo" },
    { status: 501 },
  );
}
