import type { PageDataLoad } from "@deijose/nix-js-kit";
import { allGenres } from "./data/store.ts";

export interface LayoutData {
  /** Number of genres available, used in the nav. */
  genreCount: number;
  /** Theme hint from the `theme` cookie (server-side detection). */
  cookieTheme: string;
  /** Applied to the <html> element so the theme survives navigation. */
  htmlAttributes?: Record<string, string>;
  /**
   * No-flash theme bootstrap: runs in <head> before the first paint and
   * before the deferred client bundle, so the stored preference is applied
   * before the page becomes visible (static pages bake the build-time theme).
   */
  headScripts?: string[];
}

const THEME_SCRIPT = `try{var t=localStorage.getItem("cinenix-theme")}catch(e){}
t=t||(document.cookie.match(/theme=([^;]+)/)||[])[1]||"light";
document.documentElement.setAttribute("data-theme",t);`;

export const load: PageDataLoad<LayoutData> = async ({ request }) => {
  const cookie = request?.headers.get("cookie") ?? "";
  const match = cookie.match(/theme=([^;]+)/);
  const theme = match?.[1] ?? "light";
  return {
    genreCount: allGenres().length,
    cookieTheme: theme,
    htmlAttributes: { "data-theme": theme },
    headScripts: [THEME_SCRIPT],
  };
};
