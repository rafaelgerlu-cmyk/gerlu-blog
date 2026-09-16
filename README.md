# Blog Gerlu Joalheria

Blog em **Astro** (HTML estático, rápido, bom para SEO), hospedado na **Vercel** com deploy automático a cada `git push`.
URL: https://blog.gerlujoias.com.br

## Publicar um post (fluxo do dia a dia)

1. Texto pronto vem do chat de redação.
2. `npm run novo-post "slug-com-a-palavra-chave"` → cria `src/content/posts/slug-com-a-palavra-chave.md` a partir do modelo.
3. Preencher o cabeçalho (seoTitle, title, description, keyword, category…), colar o texto e mudar `draft: false`.
4. `npm run build` → se algum campo de SEO estiver errado, o build **falha** e diz o quê.
5. `git add . && git commit -m "post: slug" && git push` → a Vercel publica em ~1 min.

Regras que o build obriga (`src/content.config.ts`):

| Campo | Regra |
|---|---|
| `seoTitle` | 20–60 caracteres, contém as palavras da `keyword` |
| `description` | 120–160 caracteres |
| `keyword` | obrigatória |
| `category` | aliancas, noivado, formatura, ouro-e-prata, cuidados, guias |
| `imageAlt` | obrigatório se tiver `image` |

A URL do post é o nome do arquivo — sem data, sem ID. Arquivos começando com `_` não são publicados (ex.: `_modelo.md`). Rascunhos (`draft: true`) só aparecem em `npm run dev`.

## O que já vem pronto

- `<title>`, meta description, canonical, Open Graph e Twitter Card em toda página
- `sitemap-index.xml`, `robots.txt` e `rss.xml` automáticos
- Dados estruturados (JSON-LD): BlogPosting, Breadcrumb e FAQ (quando o post tem `faq`)
- Sumário automático, tempo de leitura, posts relacionados
- Botão para a loja no fim de cada post + links no topo/rodapé, todos com UTM (`utm_source=blog`) para medir no GA4
- Imagem padrão de compartilhamento: `public/og-default.png`

## Configuração inicial (uma vez)

1. **GitHub**: criar o repositório `gerlu-blog` (privado) e subir esta pasta:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/gerlu-blog.git
   git push -u origin main
   ```
2. **Vercel**: Add New → Project → importar `gerlu-blog`. Framework detectado: Astro. Deploy.
3. **Domínio**: na Vercel, Project → Settings → Domains → adicionar `blog.gerlujoias.com.br`.
   A Vercel mostra um registro **CNAME** (`blog` → valor indicado por ela). Criar esse registro no painel DNS onde o `gerlujoias.com.br` está. Não mexer nos registros do domínio principal (a loja Irroba).
4. **Google Search Console** (essencial — faltou no gerlu.blog): adicionar a propriedade `blog.gerlujoias.com.br`, verificar e enviar `https://blog.gerlujoias.com.br/sitemap-index.xml`. A cada post novo: "Inspeção de URL → Solicitar indexação".
5. **Loja**: adicionar um link "Blog" no menu/rodapé da Irroba apontando para o blog.

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | instala dependências (primeira vez) |
| `npm run dev` | abre em http://localhost:4321 (mostra rascunhos) |
| `npm run build` | gera o site em `dist/` e valida o SEO |
| `npm run novo-post "slug"` | cria post a partir do modelo |

Textos fixos (nome, descrição, URL da loja): `src/consts.ts`. Cores e fontes: `src/styles/global.css`.
