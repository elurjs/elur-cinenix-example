import { html, signal } from "@elurjs/core";
import { elurJsAction } from "@elurjs/kit/action";
import { navigateTo } from "@elurjs/kit/router";
import type { ElurTemplate } from "@elurjs/core";

export default function RegisterForm(): ElurTemplate {
  const name = signal("");
  const email = signal("");
  const action = elurJsAction("register", { page: "/register" });

  async function submit(e: Event) {
    e.preventDefault();
    const result = await action.submit({ name: name.value, email: email.value });
    if (result && typeof result === "object" && "location" in result) {
      const location = (result as { location: string }).location;
      const qIndex = location.indexOf("?");
      const path = qIndex === -1 ? location : location.slice(0, qIndex);
      const search = qIndex === -1 ? "" : location.slice(qIndex);
      const ok = await navigateTo(path, search);
      if (!ok) window.location.href = location;
      return;
    }
  }

  const failure = () => {
    const value = action.data.value;
    return value && typeof value === "object" && "__elur_js_action_failure" in value
      ? (value as { data?: unknown }).data
      : null;
  };

  return html`
    <form class="card" style="max-width: 420px;" novalidate @submit=${submit} action="/__elur/actions" method="POST">
      <input type="hidden" name="__elur_js_action_name" value="register" />
      <input type="hidden" name="__elur_js_action_page" value="/register" />
      <div class="form-group">
        <label for="register-name">Nombre</label>
        <input id="register-name" name="name" type="text" value=${() => name.value} @input=${(e: Event) => (name.value = (e.target as HTMLInputElement).value)} required />
        ${() => failure() && (failure() as Record<string, string>).name ? html`<p class="form-error">${(failure() as Record<string, string>).name}</p>` : null}
      </div>
      <div class="form-group">
        <label for="register-email">Email</label>
        <input id="register-email" name="email" type="email" value=${() => email.value} @input=${(e: Event) => (email.value = (e.target as HTMLInputElement).value)} required />
        ${() => failure() && (failure() as Record<string, string>).email ? html`<p class="form-error">${(failure() as Record<string, string>).email}</p>` : null}
      </div>
      <button class="btn btn-primary" type="submit" disabled=${() => action.pending.value}>
        ${() => (action.pending.value ? "Registrando…" : "Registrarme")}
      </button>
      ${() => action.error.value ? html`<p class="form-error">${action.error.value.message}</p>` : null}
    </form>
  `;
}
