import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Template obrigatório de SEO. Se algum campo faltar ou estiver fora do limite,
 * o build FALHA e o post não vai ao ar — de propósito, para não repetir os erros do gerlu.blog.
 * Arquivos que começam com "_" (ex.: _modelo.md) são ignorados.
 */
const norm = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const words = (t: string) => norm(t).split(/\s+/).filter((w) => w.length > 3);

const posts = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/posts' }),
  schema: z.object({
    // Título do <title> e do Google. Pensado para busca, palavra-chave no início.
    seoTitle: z.string().min(20).max(60, 'seoTitle: no máximo 60 caracteres (o Google corta o resto)'),
    // Título (H1) exibido na página. Pode ser um pouco mais longo/natural.
    title: z.string().min(10).max(100),
    // Meta description: aparece no Google abaixo do título.
    description: z
      .string()
      .min(120, 'description: mínimo 120 caracteres')
      .max(160, 'description: no máximo 160 caracteres'),
    // Palavra-chave principal que o post quer ranquear.
    keyword: z.string().min(3),
    keywordsSecundarias: z.array(z.string()).default([]),
    category: z.enum(['aliancas', 'noivado', 'formatura', 'ouro-e-prata', 'cuidados', 'guias']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Equipe Gerlu Joalheria'),
    // Imagem de capa em /public/images/... (1200x630 recomendado). Alt é obrigatório se houver imagem.
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // Link da loja para o CTA do post (caminho dentro de gerlujoias.com.br). Opcional.
    storePath: z.string().default(''),
    storeCta: z.string().default('Conheça nossas alianças'),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(false),
  }).refine((d) => !d.image || !!d.imageAlt, { message: 'imageAlt é obrigatório quando há image', path: ['imageAlt'] })
    .refine((d) => words(d.keyword).every((w) => norm(d.seoTitle).includes(w)), {
      message: 'seoTitle deve conter as palavras da keyword principal',
      path: ['seoTitle'],
    }),
});

export const collections = { posts };
