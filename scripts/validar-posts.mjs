// Confere as regras de SEO dos posts sem precisar do build do Astro.
// Uso: npm run validar
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/content/posts';
const CATEGORIAS = ['aliancas', 'noivado', 'formatura', 'ouro-e-prata', 'cuidados', 'guias'];
const norm = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

let falhas = 0;

for (const arquivo of fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
  const texto = fs.readFileSync(path.join(DIR, arquivo), 'utf8');
  const fim = texto.indexOf('\n---', 4);
  const fm = texto.slice(0, fim);
  const campo = (k) => {
    const m = fm.match(new RegExp(`^${k}: "?(.*?)"?$`, 'm'));
    return m ? m[1] : null;
  };

  const seoTitle = campo('seoTitle');
  const description = campo('description');
  const keyword = campo('keyword');
  const category = campo('category');
  const image = campo('image');
  const imageAlt = campo('imageAlt');
  const draft = campo('draft') === 'true';

  const erros = [];
  if (!seoTitle || seoTitle.length < 20 || seoTitle.length > 60)
    erros.push(`seoTitle com ${seoTitle ? seoTitle.length : 0} caracteres (precisa de 20 a 60)`);
  if (!description || description.length < 120 || description.length > 160)
    erros.push(`description com ${description ? description.length : 0} caracteres (precisa de 120 a 160)`);
  if (!keyword) erros.push('keyword faltando');
  if (!CATEGORIAS.includes(category)) erros.push(`category inválida: ${category}`);
  if (keyword && seoTitle) {
    const faltando = norm(keyword).split(/\s+/).filter((w) => w.length > 3).filter((w) => !norm(seoTitle).includes(w));
    if (faltando.length) erros.push(`seoTitle não contém: ${faltando.join(', ')}`);
  }
  if (image && !imageAlt) erros.push('imageAlt obrigatório quando há image');
  if (image && !fs.existsSync(path.join('public', image))) erros.push(`capa não existe: ${image}`);
  for (const m of texto.matchAll(/src="(\/images\/[^"]+)"/g)) {
    if (!fs.existsSync(path.join('public', m[1]))) erros.push(`imagem não existe: ${m[1]}`);
  }
  for (const m of texto.matchAll(/\]\((https:\/\/blog\.gerlujoias\.com\.br[^)]*)\)/g)) {
    erros.push(`link interno absoluto (use caminho relativo): ${m[1]}`);
  }

  if (erros.length) falhas++;
  const marca = erros.length ? 'ERRO' : draft ? 'rascunho' : 'ok';
  console.log(`${marca.padEnd(9)} ${arquivo}${erros.length ? '\n           - ' + erros.join('\n           - ') : ''}`);
}

console.log(falhas ? `\n${falhas} post(s) com erro.` : '\nTodos os posts passaram.');
process.exit(falhas ? 1 : 0);
