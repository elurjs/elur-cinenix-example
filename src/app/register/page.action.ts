import { fail, redirect } from "@deijose/nix-js-kit";

export async function register(input: { name?: unknown; email?: unknown }): Promise<unknown> {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  if (name.length < 2 || name.length > 100) {
    return fail({ name: "El nombre debe tener entre 2 y 100 caracteres" }, 400);
  }
  if (!email.includes("@") || email.length > 254) {
    return fail({ email: "Correo inválido" }, 400);
  }
  // Demo: no se persiste nada, solo se redirige al catálogo.
  console.log(`[register] ${name} <${email}>`);
  return redirect(303, "/movies?registered=1");
}
