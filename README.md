# oppuserp.com

Site institucional do Oppus ERP. HTML, CSS e JS puros, sem build: é só publicar a pasta no GitHub Pages.

## Estrutura

```
index.html          página principal (hero, segmentos, recursos, fluxo, prints, FAQ, contato)
privacidade.html    política de privacidade e cookies (LGPD)
404.html            página de erro (o GitHub Pages usa sozinho)
robots.txt  sitemap.xml  site.webmanifest  favicon.ico  favicon.svg  apple-touch-icon.png
.nojekyll           faz o GitHub Pages servir os arquivos como estão
assets/css/site.css   todo o visual (cores em :root)
assets/js/site.js     menu, exemplos do hero, abas, formulário (mailto) e aviso de cookies
assets/fonts/         Archivo e IBM Plex Mono, servidas pelo próprio site (sem Google Fonts em tempo real)
assets/img/           logo.svg, logo-light.svg (rodapé escuro), og-image.jpg, ícones
ferramentas/otimizar-prints.py   converte os prints do ERP para WebP
```

## Publicar no GitHub Pages

1. Suba o conteúdo desta pasta para um repositório (ex.: `Oppus-Technologies/site`).
2. Settings › Pages › Source: *Deploy from a branch*, branch `main`, pasta `/ (root)`.
3. Domínio: em Settings › Pages › Custom domain, coloque `oppuserp.com` (o GitHub cria o arquivo `CNAME`).
   No DNS do domínio: registros `A` para `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` e `CNAME www → <usuario>.github.io`. Marque *Enforce HTTPS*.

Os endereços absolutos (canonical, og:image, sitemap, robots) usam `https://oppuserp.com`. Se o domínio for outro, troque em todos os arquivos.
A `404.html` usa caminhos começando com `/`, então funciona com domínio próprio; em `usuario.github.io/repositorio/` ela perde o estilo.

## Trocar os prints

Os 3 prints da seção "O sistema" (Início, Ordem de serviço, Entrada de notas) já estão no site, em `assets/img/print-*.webp`. Os PNGs originais ficam em `ferramentas/prints-originais/`.
Para trocar um, salve o novo PNG, rode `python ferramentas/otimizar-prints.py pasta-dos-prints` (gera as versões de 1600 e 800 px) e ajuste `width`/`height` da `<img>` no `index.html` se a proporção mudar. Corte a barra de título do Windows e avisos soltos (toasts) antes.

## Pendências marcadas no código

- **CNPJ**: hoje está o CPF do Murilo (130.955.039-54) com o rótulo "CNPJ", provisório. Trocar nos 2 HTMLs (rodapé e texto "Quem somos" da privacidade).
- **Medição de visitas**: o aviso de cookies já pede consentimento; para ligar o Google Analytics (ou outro), preencha `loadAnalytics()` em `assets/js/site.js`. Se mudar os tipos de cookie, aumente `CONSENT_VERSION` para o aviso aparecer de novo.
- Ao mudar o conteúdo, atualize `<lastmod>` no `sitemap.xml`.

## Testar localmente

```bash
python -m http.server 8765
```

e abra http://localhost:8765.
