// Dados fixos do blog — edite aqui, vale para o site inteiro.
export const SITE = {
  name: 'Blog Gerlu Joalheria',
  shortName: 'Gerlu',
  description:
    'Guias sobre alianças de casamento, anéis de noivado e joias em ouro 18k e prata — da Gerlu Joalheria, há 35 anos em Betim/MG.',
  locale: 'pt_BR',
  lang: 'pt-BR',
  defaultOgImage: '/og-default.png',
};

export const STORE = {
  name: 'Gerlu Joalheria',
  url: 'https://www.gerlujoias.com.br/',
  city: 'Betim',
  state: 'MG',
};

// Adiciona UTM aos links do blog para a loja (para medir no GA4 quanto o blog gera de visita/venda).
export function storeLink(path = '', campaign = 'blog', content?: string) {
  const u = new URL(path.replace(/^\//, ''), STORE.url);
  u.searchParams.set('utm_source', 'blog');
  u.searchParams.set('utm_medium', 'referral');
  u.searchParams.set('utm_campaign', campaign);
  if (content) u.searchParams.set('utm_content', content);
  return u.toString();
}
