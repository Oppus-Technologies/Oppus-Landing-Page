/* Oppus ERP — site institucional. Sem dependências. */
(function () {
  'use strict';

  var EMAIL = 'murilo@oppuserp.com';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function storage(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { return null; }
  }

  /* ---------- cabeçalho ---------- */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- menu móvel ---------- */
  var menuBtn = $('.menu-btn');
  var menu = $('#menu-movel');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      $('.i-open', menuBtn).style.display = open ? 'none' : '';
      $('.i-close', menuBtn).style.display = open ? '' : 'none';
    };
    menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1020) setMenu(false); });
  }

  /* ---------- exemplo do hero: uma venda, duas notas ---------- */
  var brl = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var money = function (c) { return brl.format(c / 100); };
  // valores em centavos; p = produto (NF-e), s = serviço (NFS-e)
  var SCENES = {
    oficina: {
      kind: 'Ordem de serviço', no: 'OS nº 1007', who: 'Fernanda Lima · Corolla XEi 2019',
      pSub: 'Peças · ICMS estadual', sSub: 'Mão de obra · ISS municipal',
      lines: [
        ['p', 'Amortecedor dianteiro', 2, '', 36900],
        ['p', 'Bieleta da barra estabilizadora', 2, '', 7900],
        ['s', 'Substituição de amortecedores', 2, ' h', 15000],
        ['s', 'Alinhamento e balanceamento', 1, '', 15000]
      ]
    },
    agro: {
      kind: 'Pedido de venda', no: 'Pedido nº 2231', who: 'Sítio Boa Vista · produtor rural',
      pSub: 'Insumos · ICMS estadual', sSub: 'Serviço técnico · ISS municipal',
      lines: [
        ['p', 'Semente de milho híbrido (sc)', 20, '', 89000],
        ['p', 'Adubo NPK 05-20-10 (sc 50 kg)', 30, '', 16500],
        ['s', 'Regulagem de plantadeira', 3, ' h', 18000],
        ['s', 'Visita técnica a campo', 1, '', 25000]
      ]
    },
    loja: {
      kind: 'Venda balcão', no: 'Venda nº 5120', who: 'Consumidor · CPF na nota',
      pSub: 'Produtos · ICMS estadual', sSub: 'Montagem · ISS municipal',
      lines: [
        ['p', 'Motosserra 18"', 1, '', 189000],
        ['p', 'Corrente de reposição', 2, '', 8990],
        ['p', 'Óleo 2 tempos 500 ml', 3, '', 3250],
        ['s', 'Montagem e regulagem', 1, '', 12000]
      ]
    }
  };

  var demo = $('#demo');
  if (demo) {
    var tabs = $$('[data-scene]', demo);
    var f = function (name) { return $('[data-f="' + name + '"]', demo); };
    var timers = [];
    var current = 'oficina';
    var auto = !reduced;
    var visible = true;

    var setStatus = function (el, done) {
      el.textContent = done ? 'Autorizada' : 'Processando';
      el.classList.toggle('ok', done);
      el.classList.toggle('wait', !done);
    };

    var render = function (key) {
      var s = SCENES[key];
      var p = 0, sv = 0;
      var html = s.lines.map(function (l) {
        var total = l[2] * l[4];
        if (l[0] === 'p') p += total; else sv += total;
        var esc = l[1].replace(/&/g, '&amp;').replace(/</g, '&lt;');
        return '<li class="' + l[0] + '"><span class="d">' + esc + '</span><span class="q">' + l[2] + l[3] + ' × ' + money(l[4]) + '</span><span class="v">' + money(total) + '</span></li>';
      }).join('');
      f('kind').textContent = s.kind;
      f('no').textContent = s.no;
      f('who').textContent = s.who;
      f('lines').innerHTML = html;
      f('total').textContent = 'R$ ' + money(p + sv);
      f('pSub').textContent = s.pSub;
      f('sSub').textContent = s.sSub;
      f('pVal').textContent = 'R$ ' + money(p);
      f('sVal').textContent = 'R$ ' + money(sv);
    };

    var play = function () {
      timers.forEach(clearTimeout);
      timers = [];
      if (reduced) { setStatus(f('pSt'), true); setStatus(f('sSt'), true); return; }
      setStatus(f('pSt'), false);
      setStatus(f('sSt'), false);
      timers.push(setTimeout(function () { setStatus(f('pSt'), true); }, 1500));
      timers.push(setTimeout(function () { setStatus(f('sSt'), true); }, 2300));
    };

    var show = function (key, focus) {
      current = key;
      tabs.forEach(function (t) {
        var on = t.dataset.scene === key;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      if (reduced) { render(key); play(); return; }
      demo.classList.add('is-swapping');
      setTimeout(function () { render(key); demo.classList.remove('is-swapping'); play(); }, 250);
    };

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { auto = false; show(t.dataset.scene); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        auto = false;
        show(tabs[(i + d + tabs.length) % tabs.length].dataset.scene, true);
      });
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(demo);
    }
    var order = Object.keys(SCENES);
    setInterval(function () {
      if (!auto || !visible || document.hidden) return;
      show(order[(order.indexOf(current) + 1) % order.length]);
    }, 7000);
    play();
  }

  /* ---------- segmentos (abas) ---------- */
  var segTabs = $$('.seg-tabs [role="tab"]');
  if (segTabs.length) {
    var select = function (tab, focus) {
      segTabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    };
    segTabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: segTabs.length - 1 }[e.key];
        if (n === undefined) return;
        e.preventDefault();
        select(segTabs[(n + segTabs.length) % segTabs.length], true);
      });
    });
  }

  /* ---------- fluxo: acende passo a passo ---------- */
  var flow = $('#fluxo');
  if (flow) {
    var steps = $$('.flow-step', flow);
    var light = function () {
      steps.forEach(function (s, i) {
        setTimeout(function () {
          s.classList.add('is-lit');
          flow.style.setProperty('--flow', (i / (steps.length - 1)) * (1 - 1 / steps.length) * 100 + '%');
        }, reduced ? 0 : i * 450);
      });
    };
    if ('IntersectionObserver' in window && !reduced) {
      var fo = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { light(); fo.disconnect(); }
      }, { threshold: 0.35 });
      fo.observe(flow);
    } else { light(); }
  }

  /* ---------- entrada suave ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- copiar e-mail ---------- */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var label = $('span', b);
      var done = function () {
        b.classList.add('is-done');
        label.textContent = 'Copiado';
        setTimeout(function () { b.classList.remove('is-done'); label.textContent = 'Copiar'; }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, function () {});
    });
  });

  /* ---------- formulário: monta o e-mail e abre o programa do visitante ---------- */
  var form = $('#form-contato');
  if (form) {
    var check = function (input) {
      var ok = input.value.trim().length >= (input.tagName === 'TEXTAREA' ? 10 : 2);
      input.closest('.field').classList.toggle('invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    $$('[required]', form).forEach(function (i) {
      i.addEventListener('blur', function () { if (i.value) check(i); });
      i.addEventListener('input', function () { if (i.closest('.field').classList.contains('invalid')) check(i); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = $$('[required]', form).filter(function (i) { return !check(i); });
      if (bad.length) { bad[0].focus(); return; }
      var v = function (n) { return form.elements[n].value.trim(); };
      var subject = 'Contato pelo site · ' + v('empresa');
      var lines = [v('mensagem'), '', '—', 'Nome: ' + v('nome'), 'Empresa: ' + v('empresa')];
      if (v('telefone')) lines.push('Telefone: ' + v('telefone'));
      if (v('cidade')) lines.push('Cidade: ' + v('cidade'));
      lines.push('Segmento: ' + v('segmento'), 'Unidades: ' + v('unidades'));
      var body = lines.join('\r\n');
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      $('#form-done').classList.add('is-on');
    });
  }

  /* ---------- ano no rodapé ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- cookies (LGPD) ----------
     Hoje o site não usa cookies de medição. Se um dia usar (ex.: Google Analytics),
     carregue o script dentro de loadAnalytics(): ele só roda com o consentimento. */
  var CONSENT_KEY = 'oppus-consent';
  var CONSENT_VERSION = 1;

  function loadAnalytics() {
    /* Exemplo (GA4):
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', 'G-XXXXXXX', { anonymize_ip: true });
    */
  }

  function applyConsent(c) {
    window.oppusConsent = c;
    if (c && c.analytics) loadAnalytics();
    document.dispatchEvent(new CustomEvent('oppus:consent', { detail: c }));
  }

  var banner;
  function buildBanner() {
    banner = document.createElement('section');
    banner.className = 'cookie';
    banner.setAttribute('aria-labelledby', 'cookie-titulo');
    banner.innerHTML =
      '<h2 id="cookie-titulo">Cookies neste site</h2>' +
      '<p>Usamos só o essencial para o site funcionar. Com a sua permissão, também podemos medir visitas para melhorar as páginas. <a href="' + privacyHref() + '#cookies">Saiba mais</a>.</p>' +
      '<div class="cookie-prefs" id="cookie-prefs">' +
        '<div class="pref"><strong>Essenciais</strong><span>Lembram a sua escolha sobre cookies. Sempre ativos.</span><label class="switch"><input type="checkbox" checked disabled aria-label="Cookies essenciais, sempre ativos"><i></i></label></div>' +
        '<div class="pref"><strong>Medição</strong><span>Estatísticas de visita sem identificar você.</span><label class="switch"><input type="checkbox" id="ck-analytics" aria-label="Permitir cookies de medição"><i></i></label></div>' +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="btn btn-primary" data-ck="all">Aceitar todos</button>' +
        '<button type="button" class="btn btn-ghost" data-ck="essential">Só essenciais</button>' +
        '<button type="button" class="btn btn-ghost" data-ck="prefs" aria-expanded="false" aria-controls="cookie-prefs">Configurar</button>' +
      '</div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]');
      if (!b) return;
      var a = b.dataset.ck;
      if (a === 'prefs') {
        if (banner.classList.contains('show-prefs')) { save($('#ck-analytics').checked); return; }
        banner.classList.add('show-prefs');
        b.textContent = 'Salvar escolha';
        b.setAttribute('aria-expanded', 'true');
        return;
      }
      save(a === 'all');
    });
  }
  function privacyHref() {
    var a = document.querySelector('a[href$="privacidade.html"]');
    return a ? a.getAttribute('href') : '/privacidade.html';
  }
  function openBanner(prefs) {
    if (!banner) buildBanner();
    var saved = storage(CONSENT_KEY);
    $('#ck-analytics').checked = !!(saved && saved.analytics);
    var pb = $('[data-ck="prefs"]', banner);
    banner.classList.toggle('show-prefs', !!prefs);
    pb.textContent = prefs ? 'Salvar escolha' : 'Configurar';
    pb.setAttribute('aria-expanded', String(!!prefs));
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('is-on'); });
  }
  function closeBanner() {
    banner.classList.remove('is-on');
    setTimeout(function () { banner.hidden = true; }, 350);
  }
  function save(analytics) {
    var c = { v: CONSENT_VERSION, analytics: !!analytics, at: new Date().toISOString() };
    storage(CONSENT_KEY, c);
    applyConsent(c);
    closeBanner();
  }

  var saved = storage(CONSENT_KEY);
  if (saved && saved.v === CONSENT_VERSION) applyConsent(saved);
  else setTimeout(function () { openBanner(false); }, 600);

  $$('[data-cookie-prefs]').forEach(function (b) {
    b.addEventListener('click', function () { openBanner(true); });
  });
})();
