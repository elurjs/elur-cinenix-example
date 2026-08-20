import { html, signal } from "@deijose/nix-js";
import { nixJsAction } from "@deijose/nix-js-kit/action";
import { navigateTo } from "@deijose/nix-js-kit/router";
import type { NixTemplate } from "@deijose/nix-js";

export default function ContactForm(): NixTemplate {
  const name = signal("");
  const email = signal("");
  const message = signal("");
  const action = nixJsAction("sendMessage", { page: "/contact" });

  async function submit(e: Event) {
    e.preventDefault();
    const result = await action.submit({ name: name.value, email: email.value, message: message.value });
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
    return value && typeof value === "object" && "__nix_js_action_failure" in value
      ? (value as { data?: unknown }).data
      : null;
  };

  return html`
    <form class="card" style="max-width: 480px;" novalidate @submit=${submit} action="/__nix-js/actions" method="POST">
      <input type="hidden" name="__nix_js_action_name" value="sendMessage" />
      <input type="hidden" name="__nix_js_action_page" value="/contact" />
      <div class="form-group">
        <label for="contact-name">Nombre</label>
        <input id="contact-name" name="name" type="text" value=${() => name.value} @input=${(e: Event) => (name.value = (e.target as HTMLInputElement).value)} required />
      </div>
      <div class="form-group">
        <label for="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" value=${() => email.value} @input=${(e: Event) => (email.value = (e.target as HTMLInputElement).value)} required />
      </div>
      <div class="form-group">
        <label for="contact-message">Mensaje</label>
        <textarea id="contact-message" name="message" rows="4" value=${() => message.value} @input=${(e: Event) => (message.value = (e.target as HTMLTextAreaElement).value)} required></textarea>
      </div>
      <button class="btn btn-primary" type="submit" disabled=${() => action.pending.value}>
        ${() => (action.pending.value ? "Enviando…" : "Enviar mensaje")}
      </button>
      ${() => action.error.value ? html`<p class="form-error">${action.error.value.message}</p>` : null}
      ${() => failure() && Object.keys(failure() as Record<string, string>).length > 0 ? html`<p class="form-error">${Object.values(failure() as Record<string, string>).join(" · ")}</p>` : null}
      ${() => action.data.value && !(typeof action.data.value === "object" && "location" in action.data.value) && !(typeof action.data.value === "object" && "__nix_js_action_failure" in action.data.value) ? html`<p class="form-success">¡Mensaje enviado!</p>` : null}
    </form>
  `;
}
