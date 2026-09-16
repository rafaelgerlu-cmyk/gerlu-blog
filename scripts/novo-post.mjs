// Uso: npm run novo-post "aliancas-de-ouro-18k-ou-14k"
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const raw = process.argv[2];
if (!raw) {
  console.error('Informe o slug: npm run novo-post "aliancas-de-ouro-18k-ou-14k"');
  process.exit(1);
}
const slug = raw.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const dest = `src/content/posts/${slug}.md`;
if (existsSync(dest)) {
  console.error(`Já existe: ${dest}`);
  process.exit(1);
}
const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
const tpl = readFileSync('src/content/posts/_modelo.md', 'utf8')
  .replace(/^# =+[\s\S]*?# =+\n\n/m, '')
  .replace(/^pubDate: .*/m, `pubDate: ${today}`);
writeFileSync(dest, tpl);
console.log(`Criado: ${dest} (draft: true — mude para false para publicar)`);
