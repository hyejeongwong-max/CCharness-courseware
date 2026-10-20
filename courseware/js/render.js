/* 课件渲染逻辑（index.html 和 lesson.html 共用） */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* 行内小标记：**加粗** 与 `代码` */
function md(s) {
  let out = escapeHtml(s);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

function renderBlocks(blocks) {
  return blocks.map(function (b) {
    switch (b.t) {
      case "lead":
        return '<div class="block lead">' + md(b.text) + "</div>";

      case "audio":
        return (
          '<div class="block audio">' +
          '<div class="audio-title"><span class="icon">🔊</span><span>' + escapeHtml(b.title) + "</span></div>" +
          '<audio controls preload="none" src="' + escapeHtml(b.src) + '"></audio>' +
          '<details><summary>查看文字稿</summary><p>' + escapeHtml(b.transcript) + "</p></details>" +
          "</div>"
        );

      case "text":
        return (
          '<div class="block text">' +
          (b.h ? "<h3>" + escapeHtml(b.h) + "</h3>" : "") +
          "<p>" + md(b.p || "") + "</p>" +
          "</div>"
        );

      case "code":
        return (
          '<div class="block code">' +
          '<div class="code-head"><span>' + escapeHtml(b.lang || "code") + '</span><span>📋</span></div>' +
          "<pre><code>" + escapeHtml(b.code) + "</code></pre>" +
          "</div>"
        );

      case "svg":
        return (
          '<div class="block svg"><figure>' +
          '<div class="svg-wrap">' + b.svg + "</div>" +
          (b.caption ? "<figcaption>" + escapeHtml(b.caption) + "</figcaption>" : "") +
          "</figure></div>"
        );

      case "section":
        return (
          '<div class="block section">' +
          '<div class="sec-icon">' + escapeHtml(b.icon || "📌") + "</div>" +
          "<h2>" + escapeHtml(b.title) + "</h2>" +
          "</div>"
        );

      case "qa":
        return (
          '<div class="block qa">' +
          '<div class="q"><span class="q-label">Q</span><div>' + md(b.q) + "</div></div>" +
          '<div class="a"><span class="a-label">A</span><div>' + md(b.a) + "</div></div>" +
          "</div>"
        );

      case "tip":
        return '<div class="block tip">' + md(b.text) + "</div>";

      case "table":
        var head = (b.head || []).map(function (c) { return "<th>" + md(c) + "</th>"; }).join("");
        var rows = (b.rows || []).map(function (r) {
          return "<tr>" + r.map(function (c) { return "<td>" + md(c) + "</td>"; }).join("") + "</tr>";
        }).join("");
        return '<div class="block table"><table><thead><tr>' + head + "</tr></thead><tbody>" + rows + "</tbody></table></div>";

      default:
        return "";
    }
  }).join("");
}

function lessonById(id) {
  var list = (window.COURSE && window.COURSE.lessons) || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) return { lesson: list[i], index: i };
  }
  return null;
}

function renderIndex() {
  var app = document.getElementById("app");
  if (!app || !window.COURSE) return;
  var lessons = window.COURSE.lessons || [];
  var html =
    '<div class="hero">' +
    "<h1>" + escapeHtml(window.COURSE.title) + "</h1>" +
    '<p class="sub">' + escapeHtml(window.COURSE.subtitle) + "</p>" +
    '<p class="voice">🎙 朗读音色：' + escapeHtml(window.COURSE.voice) + "（每课含图文 + 音频）</p>" +
    "</div>" +
    '<div class="lesson-grid">' +
    lessons.map(function (l) {
      return (
        '<a class="lesson-card" href="lesson.html?lesson=' + encodeURIComponent(l.id) + '">' +
        '<div class="bar" style="background:' + (l.color || "#6366f1") + '"></div>' +
        '<div class="num">第 ' + l.num + " 课</div>" +
        '<div class="title">' + escapeHtml(l.title) + "</div>" +
        '<div class="desc">' + escapeHtml(l.desc) + "</div>" +
        "</a>"
      );
    }).join("") +
    "</div>";

  app.innerHTML = html;
}

function renderLesson(id) {
  var app = document.getElementById("app");
  if (!app || !window.COURSE) return;
  var hit = lessonById(id);
  var lessons = window.COURSE.lessons || [];
  if (!hit) {
    app.innerHTML = '<div class="hero"><h1>未找到这节课</h1><p><a href="index.html">← 返回目录</a></p></div>';
    return;
  }
  var l = hit.lesson, idx = hit.index;
  var prev = idx > 0 ? lessons[idx - 1] : null;
  var next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  var pager =
    '<div class="pager">' +
    (prev
      ? '<a href="lesson.html?lesson=' + encodeURIComponent(prev.id) + '"><span class="dir">← 上一课</span>' + escapeHtml(prev.num + " " + prev.title) + "</a>"
      : '<a href="index.html"><span class="dir">←</span>目录</a>') +
    '<div class="spacer"></div>' +
    (next
      ? '<a href="lesson.html?lesson=' + encodeURIComponent(next.id) + '"><span class="dir">下一课 →</span>' + escapeHtml(next.num + " " + next.title) + "</a>"
      : '<a href="index.html">回目录<span class="dir">→</span></a>') +
    "</div>";

  var html =
    '<div class="lesson-head">' +
    '<div class="kicker" style="color:' + (l.color || "#6366f1") + '">第 ' + l.num + " 课</div>" +
    "<h1>" + escapeHtml(l.title) + "</h1>" +
    '<p class="desc">' + escapeHtml(l.desc) + "</p>" +
    "</div>" +
    renderBlocks(l.blocks) +
    pager;

  app.innerHTML = html;
  document.title = l.title + " · " + window.COURSE.title;
}

/* ===== 全局语音速率控制器 =====
   所有 audio 统一使用一个全局语速（不再用单个播放器的速度菜单）：
   - 固定悬浮在单课页右上角，− / + 微调（步进 0.25×），或点预设档位
   - 选择持久化到 localStorage，下次打开仍生效
   - 任何音频开始播放时都会强制应用全局速率 */
var RATE_KEY = "courseware.rate";
var GLOBAL_RATE = 1.0;

function loadRate() {
  try {
    var v = parseFloat(localStorage.getItem(RATE_KEY));
    if (v >= 0.5 && v <= 2) GLOBAL_RATE = v;
  } catch (e) { /* localStorage 不可用时保持默认 1.0 */ }
}

function saveRate() {
  try { localStorage.setItem(RATE_KEY, String(GLOBAL_RATE)); } catch (e) {}
}

function fmtRate(v) {
  return (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, "") + "×";
}

function applyRateToAll() {
  var audios = document.querySelectorAll("audio");
  for (var i = 0; i < audios.length; i++) audios[i].playbackRate = GLOBAL_RATE;
}

function setRate(v) {
  v = Math.round(Math.max(0.5, Math.min(2, v)) * 100) / 100;
  GLOBAL_RATE = v;
  saveRate();
  updateRateUI();
  applyRateToAll();
}

function updateRateUI() {
  var val = document.getElementById("rate-value");
  if (val) val.textContent = fmtRate(GLOBAL_RATE);
  var ps = document.querySelectorAll("#rate-control .rate-preset");
  for (var i = 0; i < ps.length; i++) {
    ps[i].classList.toggle("active", Math.abs(parseFloat(ps[i].dataset.p) - GLOBAL_RATE) < 1e-9);
  }
}

function initGlobalRateControl() {
  loadRate();
  if (document.getElementById("rate-control")) return;
  var el = document.createElement("div");
  el.id = "rate-control";
  el.innerHTML =
    '<div class="rate-main">' +
    '<span class="rate-label">语速</span>' +
    '<button type="button" class="rate-btn" data-d="-0.25" title="减慢">−</button>' +
    '<span class="rate-value" id="rate-value">' + fmtRate(GLOBAL_RATE) + "</span>" +
    '<button type="button" class="rate-btn" data-d="0.25" title="加快">+</button>' +
    "</div>" +
    '<div class="rate-presets">' +
    [0.75, 1, 1.25, 1.5, 2].map(function (p) {
      return '<button type="button" class="rate-preset" data-p="' + p + '">' + fmtRate(p) + "</button>";
    }).join("") +
    "</div>";
  document.body.appendChild(el);

  el.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.dataset) return;
    if (t.dataset.d) setRate(GLOBAL_RATE + parseFloat(t.dataset.d));
    else if (t.dataset.p) setRate(parseFloat(t.dataset.p));
  });

  // 任何音频开始播放时都应用全局速率（覆盖所有动态渲染的播放器）
  document.addEventListener("play", function (e) {
    if (e.target && e.target.tagName === "AUDIO") e.target.playbackRate = GLOBAL_RATE;
  }, true);

  applyRateToAll();
  updateRateUI();
}
