# CLAUDE.md — Site do Oppus ERP

Landing page institucional do **Oppus ERP** (ERP para empresas de 1 a muitas filiais: oficina, agro, comércio, distribuição, serviços). HTML, CSS e JS puros, **sem build e sem dependências**, publicado no GitHub Pages em https://oppuserp.com. O produto em si vive em outro repositório (`AlembroERP`, Rust + iced); aqui só se fala dele. Texto em pt-BR.

## Comandos

```bash
python -m http.server 8765          # teste local em http://localhost:8765
python ferramentas/otimizar-prints.py pasta-com-pngs   # PNG -> WebP (1600 e 800 px)
```

- Repositório: https://github.com/Oppus-Technologies/Oppus-Landing-Page (branch `main`, remoto `origin`). O Pages publica a raiz da `main`. **Não commite nem faça push sem o usuário pedir.** Commits em português, `tipo(área): resumo` com corpo explicando o porquê, um assunto por commit.
- O GitHub criou um arquivo `CNAME` (`oppuserp.com`) direto na `main`: faça `git pull --rebase` antes de dar push se o push for recusado. Não apague o `CNAME`.
- DNS está no GoDaddy: 4 registros `A` na raiz para os IPs do GitHub Pages; o `CNAME www → oppuserp.com.` é padrão do GoDaddy e não editável (serve).

## Estrutura

```
index.html          página única: hero, segmentos (abas), recursos, fluxo, prints, porte, implantação, FAQ, contato
privacidade.html    política de privacidade e cookies (LGPD)
404.html            erro 404 (o Pages serve sozinho); usa caminhos com "/" na frente
robots.txt  sitemap.xml  site.webmanifest  favicon.ico  favicon.svg  apple-touch-icon.png  .nojekyll  CNAME
assets/css/site.css   todo o visual; cores e medidas em :root
assets/js/site.js     menu móvel, exemplos do hero, abas, fluxo, formulário (mailto), cookies
assets/fonts/         Archivo (variável) e IBM Plex Mono, locais: nada de Google Fonts em tempo real
assets/img/           logo.svg, logo-light.svg (rodapé escuro), og-image.jpg, ícones, print-*.webp
ferramentas/          script dos prints e os PNGs originais
```

## Design

- Papel quente (`--paper`), tinta escura (`--ink`/`--night`) e o laranja da logo `#D57404` (`--orange`). **Azul = NF-e (peças), verde-petróleo = NFS-e (serviço)**, igual ao ERP. Cores só por variáveis de `:root`; sem hex solto nos componentes.
- Títulos em Archivo larga e pesada (`font-stretch` 108–120%), rótulos e números em Plex Mono. Evite visual genérico de landing de IA (cards iguais com ícone, gradiente roxo, emoji).
- O hero é um "bilhete" que se divide em NF-e e NFS-e (cenas Oficina/Agro/Loja em `SCENES`, no `site.js`). A 404 imita uma nota rejeitada. Mantenha esse vocabulário visual.
- Responsivo: breakpoints em 1120, 1020 (menu móvel), 860, 640 e 380 px. Teste sempre em 375 px e em 1440 px; não pode haver rolagem horizontal. Respeite `prefers-reduced-motion`.

## Convenções

- Endereços absolutos (`canonical`, `og:*`, sitemap, robots) usam `https://oppuserp.com`. Páginas novas: título, `meta description`, canonical, OG, entrada no `sitemap.xml` (com `<lastmod>`) e link no rodapé.
- A logo (`logo.svg`, `favicon.svg`) é **vetorizada do PNG original** (potrace) e está pronta: não refaça nem troque por PNG. Só o laranja e o creme (`#F4EFE6`) do rodapé mudam.
- Contato: `murilo@oppuserp.com` e WhatsApp (47) 99956-2317. O formulário **não envia nada**: monta um `mailto:` com assunto e corpo. Sempre manter "Respondemos em até 24 horas".
- **Cookies**: aviso em `site.js` com consentimento em `localStorage` (`oppus-consent`, `CONSENT_VERSION`). Hoje o site não tem rastreadores; se ligar analytics, só dentro de `loadAnalytics()` e depois do consentimento, e atualize a tabela da `privacidade.html`. Mudou o tipo de cookie: aumente `CONSENT_VERSION`.
- Prints do ERP (seção "O sistema"): corte a barra de título do Windows, cubra avisos soltos (toast) com a cor do fundo, converta para WebP e use `srcset` 800/1600 com `width`/`height` e `alt` descritivo. Dados de demonstração apenas: nada de cliente real.
- Imagens sempre comprimidas; o `og-image.jpg` é 1200×630.

## Dados provisórios (pendências)

- **CNPJ**: hoje é o CPF do Murilo (130.955.039-54) com o rótulo "CNPJ", provisório e **público**. Trocar pelo CNPJ real em `index.html` (rodapé) e `privacidade.html` (rodapé e "Quem somos"). Busque `130.955.039-54`.
- Textos que dependem do produto real e devem ser revistos quando o ERP mudar: filiais (o ERP ainda não tem recurso específico), maquininha (integração é simulada), emissão fiscal (também simulada até o emissor real) e a descrição da implantação.
- Não prometa o que o ERP não faz. A parte fiscal é "guarda e confere; a tributação é do contador", como no ERP.

## Armadilhas

- `404.html` usa `/assets/...`: só funciona em domínio próprio (não em `usuario.github.io/repo/`).
- Ao editar com `sed`/PowerShell em Windows, confira acentos e barras; o Git avisa de LF/CRLF, é inofensivo.
- Em teste automático com o navegador oculto, transições CSS ficam congeladas (menu e aviso de cookies parecem translúcidos); desligue as transições para conferir o estado final.
- O seletor `.shot-bar > span:first-of-type` é o título da janela do print; os botões `.shot-ctl` ficam à direita porque o título tem `flex: 1`.
