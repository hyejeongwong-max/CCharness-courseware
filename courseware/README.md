# 课件（courseware）

《Claude Code Harness 教程》的**前端课件**：每节课含图文（文字 + SVG 图解）+ 音频（晓晓朗读）。

## 如何打开

直接双击 `index.html`，用浏览器打开即可（无需服务器、无需联网查看图文，音频需本地文件）。

或在终端起个本地服务：

```bash
cd courseware
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 目录结构

```
courseware/
├── index.html          # 课程目录（首页）
├── lesson.html         # 单课页面（?lesson=s01）
├── css/style.css       # 样式
├── js/render.js        # 渲染逻辑
├── data/lessons.js     # ★ 课程内容（唯一数据源）
├── audio/              # 生成的朗读音频（mp3）
└── tools/gen_audio.py  # 从 lessons.js 提取文字 → 合成音频
```

## 如何新增一节课

1. 在 `data/lessons.js` 的 `lessons` 数组里加一个新对象（`id`、`num`、`title`、`desc`、`blocks`）。
2. 音频块格式：`{ t: "audio", src: "audio/sXX-01.mp3", title: "...", transcript: "朗读文本" }`。
3. 生成音频：

```bash
.venv/bin/python tools/gen_audio.py        # 项目根目录的 .venv（已装 edge-tts）
```

4. 刷新浏览器即可。

## block 类型

| 类型 | 用途 |
|------|------|
| `lead` | 开场导语 |
| `audio` | 音频卡片（src + title + transcript） |
| `text` | 图文段落（h 标题 + p 正文，支持 `**加粗**` 和 `` `代码` ``） |
| `code` | 代码块（lang + code） |
| `svg` | 图解（caption + 内联 SVG） |
| `tip` | 提示框 |
| `table` | 表格（head + rows） |
