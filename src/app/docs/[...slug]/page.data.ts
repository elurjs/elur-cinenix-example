import type { PageDataLoad } from "@elurjs/kit";

export interface DocData {
  path: string[];
  title: string;
  content: string[];
}

const DOCS: Record<string, { title: string; content: string[] }> = {
  intro: {
    title: "Introducción",
    content: [
      "CineElur es una demo completa de Elur Kit.",
      "Esta página usa una ruta catch-all: docs/[...slug]/page.ts.",
      "Cada documento se genera en build time con generateStaticParams.",
    ],
  },
  "islands": {
    title: "Islands",
    content: [
      "Las islands son componentes interactivos que se hidratan en el cliente.",
      "Directivas disponibles: load, idle y visible.",
    ],
  },
  "server-actions": {
    title: "Server actions",
    content: [
      "Las server actions viven en page.action.ts y se llaman con elurJsAction().",
      "También funcionan desde formularios HTML sin JavaScript.",
    ],
  },
  "streaming": {
    title: "Streaming",
    content: [
      "Los loading.ts definen shells que se muestran al instante.",
      "El contenido real llega después desde /__elur/render.",
    ],
  },
};

export const DOC_KEYS = Object.keys(DOCS);

export const load: PageDataLoad<DocData> = async ({ params }) => {
  const segments = Array.isArray(params.slug) ? params.slug : [params.slug ?? ""];
  const doc = DOCS[segments[0]];

  if (!doc) {
    return {
      path: segments,
      title: "Documento no encontrado",
      content: [`No existe docs/${segments.join("/")}.`],
    };
  }

  return {
    path: segments,
    title: doc.title,
    content: doc.content,
  };
};
