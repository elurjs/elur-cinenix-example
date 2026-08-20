import { fail, redirect } from "@deijose/nix-js-kit";

function clean(value: unknown, min: number, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (v.length < min || v.length > max) return null;
  return v;
}

export async function sendMessage(input: { name?: unknown; email?: unknown; message?: unknown }): Promise<unknown> {
  const errors: Record<string, string> = {};
  const name = clean(input.name, 2, 100);
  if (!name) errors.name = "El nombre debe tener entre 2 y 100 caracteres";
  const email = clean(input.email, 3, 254);
  if (!email || !email.includes("@")) errors.email = "Correo inválido";
  const message = clean(input.message, 10, 2000);
  if (!message) errors.message = "El mensaje debe tener entre 10 y 2000 caracteres";
  if (Object.keys(errors).length > 0) {
    return fail(errors, 400);
  }
  console.log(`[contact] ${name} <${email}>: ${message}`);
  return redirect(303, "/contact?sent=1");
}
