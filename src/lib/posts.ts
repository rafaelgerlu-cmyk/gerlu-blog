import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const CATEGORIES: Record<Post['data']['category'], string> = {
  aliancas: 'Alianças',
  noivado: 'Noivado',
  formatura: 'Formatura',
  'ouro-e-prata': 'Ouro e prata',
  cuidados: 'Cuidados',
  guias: 'Guias',
};

// Rascunhos (draft: true) aparecem só no "npm run dev", nunca no site publicado.
export async function getPosts() {
  const all = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 200));
