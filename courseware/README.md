# 课件（courseware）

《Claude Code Harness 教程》的**前端课件**：每节课包含

- **图文**：文字 + SVG 图解（README 原图内联）
- **讲课音频**：晓晓（zh-CN-XiaoxiaoNeural）结构化深度讲解（支持全局语速控制）
- **知识补充**：背景 / 类比 / 延伸阅读
- **难点解读**：易错点 + 关键设计决策 + 为什么这么设计
- **面试题**：AI 产品经理求职高频/难点题，附答案

> **规格权威文档：`courseware/HANDOFF.md`**（含板块顺序、音频要求、每课校验清单），做课/改课前先读它。

## 如何打开

直接双击 `index.html`，用浏览器打开即可（无需服务器；音频为本地 mp3）。

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
├── js/render.js        # 渲染逻辑（支持 lead/section/audio/text/code/svg/tip/table/qa）
├── data/lessons.js     # ★ 课程内容（唯一数据源）
├── audio/              # 生成的朗读音频（mp3）
├── tools/gen_audio.py  # 从 lessons.js 提取文字 → 合成音频
└── HANDOFF.md          # 项目交接文档（规格 + 进度 + 校验清单）
```

## 如何新增/重做一节课

1. 精读 `sXX/README.zh.md`，按规格板块提炼内容（不重写 README）。
2. 在 `data/lessons.js` 的 `lessons` 数组追加/替换课对象（`id`、`num`、`title`、`desc`、`blocks`），**只做增量追加/局部替换**。
3. 音频块格式：`{ t: "audio", src: "audio/sXX-01.mp3", title: "...", transcript: "朗读文本" }`。
4. 生成音频（首次需建 .venv）：

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt   # 项目根目录
cd courseware
../.venv/bin/python tools/gen_audio.py            # 生成全部缺失音频
../.venv/bin/python tools/gen_audio.py --force    # 强制全量重生成
../.venv/bin/python tools/gen_audio.py s02        # 只重生成 src 含 s02 的音频
```

5. 校验（交付前必做）：`node --check data/lessons.js` + 浏览器抽查 + 按 HANDOFF「每课校验清单」逐项核对。

## 全局语速控制

单课页右上角有**全局语速控制器**：− / + 微调（步进 0.25×），或点预设档位（0.75 / 1.0 / 1.25 / 1.5 / 2.0）。所有音频统一生效，选择会记住（localStorage），下次打开仍是该语速。

## 已知坑

- `transcript` / `text` / `q` / `a` 等字符串里**不要用英文双引号 `"`**（会截断 JS 字符串），用中文引号 `""`。
- `code` / `svg` 字段用**反引号模板字符串**（可含真实换行与英文引号）。
- 音频块的 `transcript` 就是语音合成来源：**改文字后必须重跑对应音频**（用 `gen_audio.py sXX` 按课过滤）。
- `lessons.js` 是唯一数据源，**禁止整文件重写**，只做增量追加/局部替换。

## block 类型

| 类型 | 用途 |
|------|------|
| `lead` | 开场导语 |
| `section` | 章节标题（icon + title） |
| `audio` | 音频卡片（src + title + transcript） |
| `text` | 图文段落（h 标题 + p 正文，支持 `**加粗**` 和 `` `代码` ``） |
| `code` | 代码块（lang + code） |
| `svg` | 图解（caption + 内联 SVG） |
| `tip` | 提示框 |
| `table` | 表格（head + rows） |
| `qa` | 面试题（q 问题 + a 答案） |
