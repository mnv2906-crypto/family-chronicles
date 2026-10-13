/* Хроники Новогодья: связь с Supabase. Лежит рядом с chronicles.html */
(function () {
  var SB = {
    url: 'https://cywbrjcalnsyvpodnltx.supabase.co',
    key: 'sb_publishable_ZilCknQHNrKG9qs-FzZTUQ_-Zz_Vq52'
  };

  var css = document.createElement('style');
  css.textContent =
    '.up{margin:4px 0 10px}.up .st{font-size:15px;margin:6px 0;min-height:20px}' +
    '.up .ok{color:#2f6b3b;font-weight:700;margin-bottom:6px}' +
    '.up input[type=text],.namebox input{width:100%;font:inherit;font-size:16px;padding:10px;border-radius:8px;border:1.5px solid #7a5a1a88;background:#fffc;color:#2b2113;margin:6px 0}' +
    '.up .fl{display:block;font-size:15px;margin:6px 0}.up .fl input{display:block;margin-top:4px;max-width:100%}' +
    '.up .rec{margin-bottom:6px}.namebox{border:1px dashed #d9a93f77;border-radius:12px;padding:12px 14px;margin:0 0 16px;color:#b8c0e0}';
  document.head.appendChild(css);

  function H(extra) {
    var h = { apikey: SB.key };
    if (SB.key.indexOf('eyJ') === 0) h.Authorization = 'Bearer ' + SB.key;
    for (var k in extra) h[k] = extra[k];
    return h;
  }
  function check(r) {
    if (!r.ok) return r.text().then(function (t) { throw new Error(r.status + ' ' + t); });
  }
  function post(row) {
    return fetch(SB.url + '/rest/v1/submissions', {
      method: 'POST',
      headers: H({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify(row)
    }).then(check);
  }
  function upload(path, blob) {
    var type = (blob.type || 'application/octet-stream').split(';')[0];
    return fetch(SB.url + '/storage/v1/object/uploads/' + path, {
      method: 'POST',
      headers: H({ 'Content-Type': type }),
      body: blob
    }).then(check);
  }
  function ext(b) {
    var n = (b.name || '').split('.');
    if (n.length > 1 && n[n.length - 1].length < 6) return n[n.length - 1].toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
    var t = (b.type || '').split(';')[0];
    var map = { 'audio/mp4': 'm4a', 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm', 'image/jpeg': 'jpg', 'image/png': 'png' };
    return map[t] || 'bin';
  }
  function S() {
    if (!state.sent) state.sent = {};
    if (!state.pid) { state.pid = 'p' + Math.random().toString(36).slice(2, 8); save(); }
    return state;
  }

  var pend = {}, mr = null;
  var canRec = !!(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  function form(i, kind) {
    var d = document.createElement('div');
    d.className = 'up';
    var acc = kind === 'f' ? 'image/*' : kind === 'v' ? 'video/*,audio/*' : 'audio/*';
    var voice = kind === 'g' && canRec;
    d.innerHTML =
      (S().sent[i] ? '<div class="ok">Отправлено Летописцу ✓</div>' : '') +
      (voice ? '<button class="alt rec">Записать голос</button>' : '') +
      '<label class="fl">' + (voice ? 'или выберите готовый файл' : 'Выберите файл') + '<input type="file" accept="' + acc + '"></label>' +
      '<input type="text" class="txt" maxlength="300" placeholder="Подпись или текст (по желанию)">' +
      '<div class="st"></div><button class="go">Отправить в Хроники</button>';

    var st = d.querySelector('.st'), go = d.querySelector('.go');
    var file = d.querySelector('input[type=file]'), rec = d.querySelector('.rec');
    function say(t) { st.textContent = t; }

    file.onchange = function () {
      if (file.files[0]) { pend[i] = file.files[0]; say('Выбрано: ' + file.files[0].name); }
    };

    if (rec) rec.onclick = function () {
      if (mr) { mr.stop(); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        var ch = [], m = new MediaRecorder(stream);
        mr = m;
        m.ondataavailable = function (e) { if (e.data && e.data.size) ch.push(e.data); };
        m.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          pend[i] = new Blob(ch, { type: m.mimeType || 'audio/webm' });
          mr = null;
          rec.textContent = 'Записать заново';
          say('Запись готова. Нажмите «Отправить в Хроники».');
        };
        m.start();
        rec.textContent = 'Стоп';
        say('Идёт запись…');
      }).catch(function () { say('Нет доступа к микрофону. Выберите файл вместо записи.'); });
    };

    go.onclick = function () {
      if (!state.name) { say('Сначала напишите имя героя вверху страницы.'); return; }
      var note = d.querySelector('.txt').value.trim(), b = pend[i];
      if (!b && !note) { say('Добавьте запись, файл или текст.'); return; }
      go.disabled = true;
      say('Отправляю…');
      var path = null, p = Promise.resolve();
      if (b) { path = S().pid + '/t' + (i + 1) + '-' + Date.now() + '.' + ext(b); p = upload(path, b); }
      p.then(function () {
        return post({ player: state.name, task: i + 1, kind: kind, note: note || null, file_path: path });
      }).then(function () {
        delete pend[i];
        S().sent[i] = true;
        state.done[i] = true;
        save();
        window.render();
      }).catch(function (e) {
        console.error(e);
        say('Не получилось отправить. Проверьте интернет и попробуйте ещё раз.');
        go.disabled = false;
      });
    };
    return d;
  }

  function nameBox() {
    var box = document.getElementById('namebox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'namebox';
      var hero = document.getElementById('hero');
      hero.parentNode.insertBefore(box, hero);
    }
    if (state.name) { box.style.display = 'none'; return; }
    box.style.display = '';
    box.className = 'namebox';
    box.innerHTML = 'Как зовут вашего героя? Напишите имя, чтобы Летописец знал, кто присылает свитки.' +
      '<input type="text" maxlength="30" placeholder="Ваше имя"><button>Это я</button>';
    box.querySelector('button').onclick = function () {
      var v = box.querySelector('input').value.trim();
      if (!v) return;
      state.name = v;
      save();
      window.render();
    };
  }

  function enhance() {
    nameBox();
    var secs = document.querySelectorAll('#list .scroll');
    for (var s = 0; s < secs.length; s++) {
      var sec = secs[s], act = sec.querySelector('.act');
      var m = act && /свиток (\d+)/.exec(act.textContent);
      if (!m) continue;
      var i = +m[1] - 1, btns = sec.querySelectorAll('button'), old = null;
      for (var b = 0; b < btns.length; b++) if (btns[b].textContent === 'Отправить Летописцу') old = btns[b];
      if (!old) continue;
      var row = old.parentNode;
      old.parentNode.removeChild(old);
      row.parentNode.insertBefore(form(i, TASKS[i][2]), row);
    }
  }

  var _finish = window.finishTest;
  window.finishTest = function () {
    _finish();
    try {
      var ans = answers.map(function (a, n) { return TEST[n][1][a]; }).join(' / ');
      post({ player: state.name || 'без имени', task: 2, kind: 'hero', note: CLASSES[state.hero][0] + ' | ' + ans, file_path: null }).catch(function () {});
    } catch (e) {}
  };

  var _render = window.render;
  window.render = function () { _render(); enhance(); };
  window.render();
})();
