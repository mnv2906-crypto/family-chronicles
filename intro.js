/* Хроники Новогодья: пролог, правила и праздничный фон. Лежит рядом с chronicles.html */
(function () {
  /* ===== Праздничный фон ===== */
  var css = document.createElement('style');
  css.textContent =
    'html{min-height:100%;background:' +
    'radial-gradient(circle at 10% 16%,#e8453c38 0 30px,transparent 70px),' +
    'radial-gradient(circle at 90% 24%,#f5c84a33 0 26px,transparent 64px),' +
    'radial-gradient(circle at 16% 58%,#3fb67a30 0 32px,transparent 72px),' +
    'radial-gradient(circle at 88% 68%,#4aa3f530 0 28px,transparent 66px),' +
    'radial-gradient(1.5px 1.5px at 30% 12%,#fff9 50%,transparent),radial-gradient(1.5px 1.5px at 70% 8%,#fff8 50%,transparent),' +
    'radial-gradient(1px 1px at 55% 40%,#fff7 50%,transparent),radial-gradient(1.5px 1.5px at 8% 80%,#fff7 50%,transparent),' +
    'radial-gradient(ellipse at 50% 108%,#1f6b52aa,transparent 60%),' +
    'linear-gradient(180deg,#1b2b66,#0c1230 58%,#0b2229) fixed !important}' +
    'body{background:none !important;padding-top:calc(52px + env(safe-area-inset-top,0px)) !important}' +
    '.garland{position:fixed;top:env(safe-area-inset-top,0px);left:0;right:0;height:34px;z-index:6;pointer-events:none}' +
    '.garland svg{display:block;width:100%;height:14px}' +
    '.garland i{position:absolute;top:8px;width:10px;height:15px;margin-left:-5px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:var(--c);box-shadow:0 0 12px 3px var(--c)}' +
    '@media (prefers-reduced-motion:no-preference){.garland i{animation:tw 2.4s infinite ease-in-out}}' +
    '@keyframes tw{0%,100%{opacity:1}50%{opacity:.35}}' +
    '.rules ol{padding-left:22px;margin:6px 0 12px}.rules li{margin:0 0 8px}' +
    '.start{display:block;width:100%;margin:0 0 18px;background:#d9a93f;color:#2b2113;font-weight:700}' +
    '.aboutbtn{display:block;margin:-8px auto 16px;background:transparent;color:#d9a93f;border:1px solid #d9a93f88;min-height:36px;padding:6px 14px;font-size:15px}';
  document.head.appendChild(css);

  var g = document.createElement('div');
  g.className = 'garland';
  var n = 10, w = 100 / n, d = 'M0 4', cols = ['#ff5a4f', '#ffd25a', '#52d38a', '#5bb6ff'], bulbs = '';
  for (var k = 0; k < n; k++) {
    d += ' Q' + ((k + 0.5) * w) + ' 14 ' + ((k + 1) * w) + ' 4';
    bulbs += '<i style="left:' + ((k + 0.5) * w) + '%;--c:' + cols[k % 4] + ';animation-delay:' + (k * 0.3) + 's"></i>';
  }
  g.innerHTML = '<svg viewBox="0 0 100 14" preserveAspectRatio="none"><path d="' + d + '" fill="none" stroke="#05080f" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>' + bulbs;
  document.body.appendChild(g);

  /* ===== Снег ===== */
  if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:5;pointer-events:none';
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), W = 0, H = 0, flakes = [];
    var size = function () { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    size();
    window.addEventListener('resize', size);
    for (var f = 0; f < 70; f++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2.2, v: 0.35 + Math.random() * 0.9, a: Math.random() * 6.28 });
    (function snow() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        for (var i = 0; i < flakes.length; i++) {
          var p = flakes[i];
          p.y += p.v; p.a += 0.012; p.x += Math.sin(p.a) * 0.4;
          if (p.y > H + 4) { p.y = -4; p.x = Math.random() * W; }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
        }
      }
      requestAnimationFrame(snow);
    })();
  }

  /* ===== Пролог и правила ===== */
  var intro = document.createElement('div');
  intro.id = 'intro';
  intro.innerHTML =
    '<section class="scroll"><div class="act">Пролог</div><h2>Королевство без Ключа</h2>' +
    '<p>Давным-давно в Королевстве Новогодье, где снег пахнет мандаринами, а часы бьют только по праздникам, хранился Волшебный Ключ. Он отпирает дверь, за которой ждёт Новый год.</p>' +
    '<p>В одну тёмную ночь Ключ исчез. Королевство обыскало каждый сугроб и каждую ёлку, но тщетно. Тогда Великая Книга Хроник раскрылась сама и выбрала героев, которые смогут его найти.</p>' +
    '<p>Она выбрала вашу семью. Книга, конечно, могла ошибиться. Но она никогда в этом не признаётся.</p></section>' +
    '<section class="scroll rules"><div class="act">Условия игры</div><h2>Как это устроено</h2><ol>' +
    '<li><b>Назовите имя героя.</b> Один раз впишите его на главной странице, чтобы Летописец знал, кто присылает свитки. Летописец ведёт Хроники и всё записывает.</li>' +
    '<li><b>Новые свитки.</b> Игра идёт с 26 октября по 20 декабря. По понедельникам, средам и пятницам открывается новый свиток с заданием. Закрытые печатью свитки ждут своего дня.</li>' +
    '<li><b>Задания короткие.</b> На каждое уходит одна-три минуты. Выполнить можно голосом, фото или коротким видео, как вам удобнее. Стесняетесь камеры? Достаточно голоса или фото.</li>' +
    '<li><b>Отправьте в Хроники.</b> Когда задание готово, нажмите «Отправить в Хроники». Присланное видит только Летописец, а остальные герои узнают всё в особый вечер.</li>' +
    '<li><b>Пропустили свиток?</b> Ничего страшного. Свитки не исчезают, их можно выполнить позже, пока идёт игра.</li>' +
    '<li><b>Тайна героев.</b> Не рассказывайте друг другу свои ответы до финала. Так сюрпризов в Хрониках будет больше.</li>' +
    '<li><b>Финал в новогоднюю ночь.</b> Все герои соберутся вместе (кто за одним столом, кто по видеосвязи), и Хроники будут прочитаны вслух. Тогда и выяснится, кто нашёл Ключ.</li>' +
    '</ol></section><button class="start">Начать игру</button>';
  document.getElementById('clocks').parentNode.insertBefore(intro, document.getElementById('clocks'));

  var about = document.createElement('button');
  about.className = 'aboutbtn';
  about.textContent = 'О игре и правилах';
  var lead = document.querySelector('.lead');
  lead.parentNode.insertBefore(about, lead.nextSibling);
  var startBtn = intro.querySelector('.start');

  var show = true, touched = false;
  function apply() {
    if (!touched) show = !state.introSeen;
    ['clocks', 'hero', 'list', 'namebox'].forEach(function (id) {
      var e = document.getElementById(id);
      if (!e) return;
      e.style.display = (show || (id === 'namebox' && state.name)) ? 'none' : '';
    });
    var note = document.querySelector('.note');
    if (note) note.style.display = show ? 'none' : '';
    intro.style.display = show ? '' : 'none';
    about.style.display = show ? 'none' : '';
    startBtn.textContent = state.introSeen ? 'Вернуться к свиткам' : 'Начать игру';
  }
  startBtn.onclick = function () {
    state.introSeen = true; touched = true; show = false; save();
    window.render(); window.scrollTo(0, 0);
  };
  about.onclick = function () {
    touched = true; show = true; window.render(); window.scrollTo(0, 0);
  };

  var _render = window.render;
  window.render = function () { _render(); apply(); };
  window.render();
})();
