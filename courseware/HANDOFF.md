# 课件项目交接文档（HANDOFF）

> 给接手的 agent：**请先完整读完本文，再开始任何工作。**

---

## 一、任务是什么

把 `learn-claude-code` 课程的 17 课（s01~s17），制作成一套**前端课件**。

每课课件 = 图文 + 讲课音频 + 知识补充 + 难点解读 + 面试题。

最终交付物：一套完整、可双击打开的课件（`courseware/` 文件夹）。

---

## 二、核心规格（用户已拍板，务必遵守，不要自行更改）

1. **内容基准**：以每课的 `README.zh.md` 为基准，**不重写**，内容以 README 为准。
2. **板块顺序**：问题 → 解决方案 → 工作原理 → 知识补充 → 难点解读 → 面试题 → 试一下 → 下一步。
3. **讲课音频**：用「晓晓」音色（`zh-CN-XiaoxiaoNeural`），是**详细讲解**（把 README 讲透），不是干读 README 原文。
4. **知识补充**：背景 / 类比 / 延伸阅读，2~3 条。
5. **难点解读**：易错点 + 关键设计决策 + "为什么这么设计"。
6. **面试题**：根据该课知识点，生成 **AI 产品经理求职中的高频或难点面试题**，并**附带答案**。
7. **交付节奏**：**做一课、核对一课**，直到 s17，形成完整课件。

---

## 三、当前进度

- [x] **s01 Agent Loop** —— 已按上述规格完成（可作样板参考）
- [ ] **s02 Tool Use** —— 目前是旧版（缺少"知识补充/难点解读/面试题"板块），**需要按新规格重做**
- [ ] s03 ~ s17 —— 未做

> 课程源文件位置：项目根目录下 `s01_agent_loop/`、`s02_tool_use/` … 每课目录里有 `README.zh.md`（内容基准）和 `code.py`、`images/`（含 SVG 图）。

---

## 四、技术细节

### 文件结构

```
courseware/
├── index.html            # 课程目录首页
├── lesson.html           # 单课页面（默认显示 s01）
├── data/lessons.js       # ★ 唯一数据源：所有课程内容
├── js/render.js          # 渲染逻辑
├── css/style.css         # 样式
├── tools/gen_audio.py    # 从 lessons.js 提取文字 → 合成音频
├── audio/*.mp3           # 生成的讲课音频
└── HANDOFF.md            # 本文档
```

### block 类型（写进 lessons.js 的 `blocks` 数组）

| 类型 | 字段 | 用途 |
|------|------|------|
| `lead` | text | 开场导语 |
| `section` | icon, title | 章节标题（如 ❓ 问题） |
| `audio` | src, title, transcript | 讲课音频（transcript 即朗读文本） |
| `text` | h, p | 图文段落（支持 `**加粗**` 和 `` `行内代码` ``） |
| `code` | lang, code | 代码块 |
| `svg` | caption, svg | 图解（内联 SVG） |
| `tip` | text | 提示框 |
| `table` | head, rows | 表格 |
| `qa` | q, a | 面试题 + 答案 |

### 制作一节课的流程

1. 精读 `sXX/README.zh.md`，按板块提炼内容。
2. 图：README 里 `sXX/images/*.svg` 的图**直接内联使用**；没有则补画一张 SVG。
3. 写「知识补充」「难点解读」「面试题」。
4. 把内容写进 `data/lessons.js` 对应课的 `blocks`。
5. 生成音频：

```bash
cd courseware
# 用项目根目录的 .venv（已装 edge-tts）
../.venv/bin/python tools/gen_audio.py --force
```

6. 验证：

```bash
node --check data/lessons.js     # 语法检查
node --check js/render.js
open index.html                  # 浏览器人工检查
```

### 已知坑（务必注意）

- `transcript` / `text` / `q` / `a` 等字符串里**不要用英文双引号 `"`**（会截断 JS 字符串）；需要引号时用中文引号 `""`。
- `code` 和 `svg` 字段用**反引号模板字符串**（`` ` ``），可含真实换行和英文引号。
- 音频块里的 `transcript` 文本就是语音合成来源，改文字后必须重跑 `gen_audio.py --force`。

---

## 五、下一步具体任务（按顺序）

1. **重做 s02**（读 `s02_tool_use/README.zh.md`，参照 s01 样板）。
2. 交给用户核对 s02，通过后做 s03。
3. 依次推进到 s17。

## 六、每课完成后交给用户核对时，需确认

- 章节结构是否合理
- 面试题方向 / 难度是否符合预期
- 知识补充与难点解读的深度是否足够

用户确认「没问题」后再做下一课。
