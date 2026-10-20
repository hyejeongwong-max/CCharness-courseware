// ============================================================
//  Claude Code Harness 课件数据（单一数据源）
//  内容以每课 README.zh.md 为基准 + 知识补充 + 难点解读 + 面试题
//
//  block 类型：
//    lead    开场导语
//    section 章节标题（icon + title）
//    audio   讲课音频（src=文件, transcript=朗读文本，也是语音合成来源）
//    text    图文段落（h=小标题, p=正文，支持 **加粗** 和 `行内代码`）
//    code    代码块（lang + code）
//    svg     图解（caption + 内联 SVG）
//    tip     提示框
//    table   表格（head + rows）
//    qa      面试题（q=问题, a=答案）
// ============================================================
window.COURSE = {
  title: "Claude Code Harness 教程",
  subtitle: "从零拆解一个 AI 编程 Agent 的载具",
  voice: "晓晓（zh-CN-XiaoxiaoNeural）",
  lessons: [
    {
      id: "s01",
      num: "01",
      title: "Agent Loop",
      desc: "一个循环 + Bash 就是一个 Agent",
      color: "#6366f1",
      blocks: [
        { t: "lead", text: "本课是整套课程的地基。核心就一句话：**模型负责「想」，循环负责「做」**。后面 16 课全是在这个循环上叠加能力。" },

        { t: "section", icon: "❓", title: "问题：模型只会说，不会做" },
        { t: "text", h: "", p: "你问大模型：**「帮我看看目录下有哪些文件，然后执行 xxx.py」**\n\n模型能输出一条 bash 命令，但**输出完就停了**：\n\n- 它不会自己执行\n- 也不会看到结果后继续推理\n\n于是你只能手动跑一遍、把输出贴回对话框，它才接着给下一条命令。\n\n**每一个来回，你都在做「中间层」。** 把它自动化，就是这一课的目标。" },
        { t: "audio", src: "audio/s01-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第一课，Agent Loop，智能体循环。这一课是整套课程的地基。先从一个真实场景说起：你问大模型，帮我看看目录下有哪些文件，再执行某个脚本。模型能回答你一条命令，比如 ls。但注意，它说完就停了。它不会自己真的去执行，也不会看到执行结果后继续往下推理。于是你只能手动复制这条命令，跑到终端里跑一遍，再把输出贴回对话框，它才接着给你下一条命令。你发现了吗？在模型和真实世界之间，每一次来回，你都在充当那个中间人。第一课要做的，就是把你这个中间人的活，自动化掉。" },

        { t: "section", icon: "💡", title: "解决方案：一个 while 循环" },
        { t: "text", h: "", p: "一个 `while True` 循环：**模型调用工具就继续，不调用就停。**\n\n循环直接检查响应里的内容块（`tool_use` block）来决定下一步。" },
        { t: "svg", caption: "Agent Loop 流程图（来自 README 原图）", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 530" font-family="system-ui, -apple-system, sans-serif"><defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#555"/></marker><marker id="arrow-blue" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/></marker><marker id="arrow-green" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a"/></marker><linearGradient id="header" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1e3a5f"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs><rect width="720" height="530" fill="#fafbfc" rx="8"/><rect x="0" y="0" width="720" height="48" fill="url(#header)" rx="8"/><rect x="0" y="40" width="720" height="8" fill="url(#header)"/><text x="360" y="31" fill="#fff" font-size="16" font-weight="700" text-anchor="middle">Agent Loop — 一个 while 循环驱动整个 Agent</text><rect x="60" y="80" width="160" height="52" rx="8" fill="#f0f4ff" stroke="#2563eb" stroke-width="2"/><text x="140" y="102" fill="#1e3a5f" font-size="13" font-weight="600" text-anchor="middle">用户提问</text><text x="140" y="120" fill="#64748b" font-size="11" text-anchor="middle">"帮我创建 hello.py"</text><line x1="140" y1="132" x2="140" y2="162" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrow-blue)"/><rect x="60" y="164" width="160" height="48" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,2"/><text x="140" y="185" fill="#334155" font-size="12" font-weight="500" text-anchor="middle">messages[]</text><text x="140" y="201" fill="#94a3b8" font-size="10" text-anchor="middle">累积式消息列表</text><line x1="220" y1="188" x2="288" y2="188" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/><rect x="290" y="140" width="180" height="96" rx="8" fill="#fff" stroke="#2563eb" stroke-width="2"/><text x="380" y="166" fill="#1e3a5f" font-size="14" font-weight="700" text-anchor="middle">大模型 (LLM)</text><line x1="310" y1="176" x2="450" y2="176" stroke="#e2e8f0" stroke-width="1"/><text x="380" y="194" fill="#475569" font-size="11" text-anchor="middle">模型阅读消息历史</text><text x="380" y="210" fill="#475569" font-size="11" text-anchor="middle">判断：需要工具吗？</text><text x="380" y="228" fill="#64748b" font-size="10" text-anchor="middle">返回内容块</text><line x1="380" y1="236" x2="380" y2="276" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/><polygon points="380,280 470,316 380,352 290,316" fill="#fff8f0" stroke="#d97706" stroke-width="2"/><text x="380" y="312" fill="#92400e" font-size="12" font-weight="600" text-anchor="middle">tool_use block</text><text x="380" y="326" fill="#92400e" font-size="10" text-anchor="middle">存在？</text><line x1="470" y1="316" x2="540" y2="316" stroke="#16a34a" stroke-width="2" marker-end="url(#arrow-green)"/><text x="505" y="308" fill="#16a34a" font-size="10" font-weight="600" text-anchor="middle">否</text><rect x="542" y="294" width="130" height="44" rx="22" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><text x="607" y="313" fill="#166534" font-size="12" font-weight="600" text-anchor="middle">返回结果</text><text x="607" y="329" fill="#166534" font-size="10" text-anchor="middle">循环结束</text><line x1="380" y1="352" x2="380" y2="392" stroke="#d97706" stroke-width="2" marker-end="url(#arrow)"/><text x="395" y="376" fill="#d97706" font-size="10" font-weight="600">是</text><rect x="290" y="394" width="180" height="48" rx="8" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/><text x="380" y="415" fill="#92400e" font-size="12" font-weight="600" text-anchor="middle">执行工具调用</text><text x="380" y="432" fill="#92400e" font-size="10" text-anchor="middle">run_bash(command)</text><path d="M 290 418 L 40 418 L 40 188 L 58 188" fill="none" stroke="#d97706" stroke-width="1.5" marker-end="url(#arrow)" stroke-dasharray="6,3"/><text x="18" y="375" fill="#92400e" font-size="10" font-weight="500" transform="rotate(-90, 18, 375)">追加 tool_result 到 messages</text><rect x="60" y="462" width="600" height="48" rx="6" fill="#f1f5f9"/><text x="80" y="482" fill="#334155" font-size="10">核心：一个</text><text x="148" y="482" fill="#1e3a5f" font-size="10" font-weight="700" font-family="monospace">while True</text><text x="220" y="482" fill="#334155" font-size="10">循环。模型调工具 → 执行 → 喂回 → 再问。不调工具就停。</text><text x="80" y="500" fill="#64748b" font-size="10">后续所有章节都在这个循环上叠加机制。</text></svg>` },
        { t: "table", head: ["信号", "含义", "循环动作"], rows: [["包含 `tool_use` block", "模型要求调用工具", "执行 → 结果喂回去 → 继续"], ["不包含 `tool_use` block", "模型没有调用工具", "退出循环"]] },
        { t: "audio", src: "audio/s01-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案出奇的简单，就是一个 while true 无限循环。流程是这样的：把用户的问题发给模型，模型返回内容；我们检查返回内容里有没有 tool use 这个块，也就是模型有没有要求调用工具。如果有，就执行工具，把结果喂回给模型，再回到开头，让模型继续；如果没有，就说明模型干完了，退出循环。判断的标准非常干净：模型调用工具，循环继续；模型不调用工具，循环结束。你可以看着屏幕上的那张图，跟着箭头走一遍：用户提问，进入消息列表，交给大模型，模型判断要不要工具，要就执行、结果喂回、再判断，不要就结束。" },

        { t: "section", icon: "⚙️", title: "工作原理：五步翻译成代码" },
        { t: "table", head: ["步骤", "动作"], rows: [["第 1 步", "把用户问题作为第一条消息放进 `messages`"], ["第 2 步", "把消息 + 工具定义一起发给 LLM"], ["第 3 步", "追加模型回答，检查是否调工具；没调 → 结束"], ["第 4 步", "执行工具，收集结果"], ["第 5 步", "结果作为新消息追加，回到第 2 步"]] },
        { t: "code", lang: "python", code: `def agent_loop(messages):
    while True:                                # 无限循环
        # 第 2 步：消息 + 工具定义发给 LLM
        response = client.messages.create(
            model=MODEL, messages=messages, tools=TOOLS)

        # 第 3 步：追加模型回答
        messages.append({"role": "assistant", "content": response.content})

        # 检查它有没有调用工具
        tool_calls = [
            block for block in response.content if block.type == "tool_use"
        ]
        # 没调 → 结束
        if not tool_calls:
            return

        # 第 4 步：执行工具，收集结果
        results = []
        for block in tool_calls:
            output = run_bash(block.input["command"])
            results.append({"type": "tool_result",
                            "tool_use_id": block.id,
                            "content": output})

        # 第 5 步：结果喂回去，回到第 2 步继续循环
        messages.append({"role": "user", "content": results})` },
        { t: "text", h: "", p: "三十多行代码，就是**最小可运行的 agent harness 内核**。\n\n它给模型提供持续行动的最小框架：**模型负责决策**（调不调工具、调哪个），**harness 负责执行**（调用工具、把结果作为新消息追加）。" },
        { t: "audio", src: "audio/s01-03.mp3", title: "讲解 · 工作原理", transcript: "把它翻译成代码，一共五步。第一步，把用户的问题作为第一条消息，放进 messages 数组。第二步，把消息和工具定义一起发给大模型。第三步，把模型的回答追加进消息列表，然后检查：它有没有调用工具？没有，就直接结束。第四步，如果有，就执行模型要求的工具，比如执行它给的命令，把输出收集起来。第五步，把工具结果作为一条新消息追加进去，然后回到第二步，继续循环。整个过程三十多行代码，就是最小可运行的 agent 内核。核心逻辑是：模型负责决策，harness 负责执行。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 为什么叫「最小可运行的 agent harness 内核」", p: "一个 Agent 产品 = **模型 + Harness**。\n\n智能（感知、推理、行动的能力）来自模型训练本身；Harness 负责给模型一个**可操作的环境**（工具、观察、行动接口）。这个循环，就是环境与模型之间最基础的那道连接。" },
        { t: "text", h: "② 一个类比", p: "模型是**司机**（做决策），Harness 是**载具**（执行）。\n\n这个循环就是驾驶过程：司机下指令 → 载具执行 → 汇报结果 → 司机再下指令。" },
        { t: "text", h: "③ 延伸", p: "你现在用的各种 AI 编程助手（Claude Code 等），剥到最里层，就是这个循环。\n\n后面 16 课（工具、权限、Hooks、记忆、任务系统……）全是在这个循环上「挂载」更多机制，循环本身不变。" },
        { t: "audio", src: "audio/s01-04.mp3", title: "讲解 · 知识补充", transcript: "补充一点背景知识。为什么这个循环被称为最小可运行的 agent harness 内核？因为一个 agent 产品等于模型加 harness。智能，也就是感知、推理、行动的能力，来自模型训练本身；而 harness 负责给模型一个可操作的环境。这个循环，就是环境和模型之间最基础的那道连接。打个比方，模型是司机，负责做决定；harness 是载具，负责执行。这个循环就是驾驶的过程：司机下指令，载具执行，汇报结果，司机再下指令。再延伸一下，你现在用的各种 AI 编程助手，剥到最里层，就是这个循环。后面十六课的工具、权限、记忆、任务系统，全都是在这个循环上挂载更多的机制。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么用 `while True`，而不是写死「最多执行 N 次」", p: "因为任务需要多少步是**无法预知**的。\n\n写死步数：简单任务会空转浪费，复杂任务做不完。\n\n正确做法是**让模型自己决定何时停**——它不再返回 `tool_use`，就说明干完了。" },
        { t: "text", h: "难点 2：判断条件为什么是「检查 tool_use block」", p: "因为这是模型「想要行动」的**唯一明确信号**。\n\n没有 `tool_use` = 模型认为任务已完成，就该停。" },
        { t: "text", h: "易错点 3：为什么「只有实际存在的 tool_use 才进入执行阶段」", p: "这是为了**避免追加空工具结果消息**。\n\n空结果会污染上下文、浪费 token，甚至让模型犯迷糊。\n\n（代码里先用列表推导筛出真实 `tool_use`，再执行。）" },
        { t: "text", h: "核心设计决策", p: "**职责分离**：模型负责决策，Harness 负责执行。\n\n这个边界，后面所有课都不会变。" },
        { t: "audio", src: "audio/s01-05.mp3", title: "讲解 · 难点解读", transcript: "讲三个难点，也是面试常考的点。第一，为什么用 while true 无限循环，而不是写死最多执行三次？因为任务需要多少步是无法预知的，写死步数，简单任务会空转，复杂任务做不完。正确做法是让模型自己决定何时停：它不再返回 tool use，就说明干完了。第二，判断条件为什么是检查 tool use 块？因为这是模型想要行动的唯一明确信号。没有 tool use，就说明它认为任务完成了。第三，一个容易踩的坑：为什么只有实际存在的 tool use 块才进入执行阶段？因为这样可以避免往消息列表里追加空的工具结果，空结果会污染上下文、浪费 token，甚至让模型犯迷糊。记住最核心的设计决策：模型负责决策，harness 负责执行，这个边界后面所有课都不会变。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "什么是 AI Agent？它和「调用一次大模型 API」的本质区别是什么？", a: "核心区别在**「循环 + 反馈」**。单次调用是「一问一答」，模型输出就结束；Agent 是一个 `while` 循环：模型输出 `tool_use` → 环境执行 → 结果作为新消息喂回 → 模型再推理，直到模型不再调用工具才停止。Agency（感知-推理-行动-再感知）来自这个**反馈闭环**，而不是某一次更聪明的回答。产品经理要能说清：**Agent = 模型（决策）+ 循环（执行反馈）+ 工具（行动接口）**。" },
        { t: "qa", q: "一个最小可用的 coding agent，最少需要哪些组件？为什么「一个循环 + 一个 Bash 工具」就够了？", a: "最少三样：① 一个 LLM（决策者）；② 一个工具执行层（哪怕只有 Bash，给模型「动手」能力）；③ 一个 `while` 循环（把工具结果持续喂回，形成反馈）。够用的原因：**模型本身已具备感知、推理、行动的智能**，Harness 只需提供「能行动 + 能反馈」的最小环境。这也解释了为什么好的 agent 产品是「信任模型、把工程精力放在 harness 上」，而不是写一堆决策树替模型做判断。" },
        { t: "qa", q: "如果一个 agent 产品「感觉不聪明」，作为产品经理你会先怀疑哪一层？怎么定位？", a: "先区分是**智能问题还是 harness 问题**，逐层消融：\n\n① 看模型：换一个更强的模型，若表现明显变好 → 瓶颈在模型能力；\n② 看工具：工具描述是否清晰、是否原子化、是否给足信息；\n③ 看反馈闭环：工具结果有没有正确喂回 `messages`、上下文有没有被污染、有没有空结果被追加。\n\n这体现了「Agent = 模型 + Harness」的产品观：**不聪明的锅，不一定在模型。**" },
        { t: "qa", q: "（难点）为什么 Agent 循环不能写死「最多执行 3 步」，而要用 `while True` 让模型自己停？", a: "因为任务复杂度不可预知：步数太少 → 复杂任务做不完；步数太多 → 简单任务空转。正确做法是**让模型通过「不再返回 tool_use」来声明任务完成**，终止条件来自模型判断而非产品侧硬编码。\n\n高频追问：那模型死循环怎么办？—— 这正是后面 s03 权限、以及超时/步数上限等「安全护栏」要解决的：**护栏可以限制上限，但正常终止应由模型决定。**" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s01_agent_loop/code.py\n```\n\n试试这些 prompt：\n\n1. `Create a file called hello.py that prints “Hello, World!”`\n2. `List all Python files in this directory`\n3. `What is the current git branch?`\n\n**观察重点**：模型什么时候调用工具（循环继续）、什么时候不调用（循环结束）？" },
        { t: "audio", src: "audio/s01-06.mp3", title: "讲解 · 总结", transcript: "最后总结一下。第一课就一句话：一个循环，加一个工具，就是一个最简单的 agent。模型负责想，循环负责做。后面十六课，全是在这个循环上叠加能力：加更多工具、加权限、加记忆、加计划。但那个核心的循环，从头到尾都不会变。学完这一课，建议你到试一下板块，自己动手跑一次，亲眼看看模型是怎么自动执行命令的。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "现在模型手里只有 `bash` 一个工具：读文件要 `cat`、写文件要 `echo ... >`、找文件要 `find`，又丑又容易出错。\n\n**下一课 s02 Tool Use** → 给它 5 个真正的工具，会发生什么？模型会不会一次调用多个工具？" },
        { t: "tip", text: "一句话记住 S01：**一个循环 + 一个工具 = 一个最简单的 Agent**。模型负责「想」，循环负责「做」。后面 16 课都在这个循环上叠加，循环本身永远不变。" }
      ]
    },
    {
      id: "s02",
      num: "02",
      title: "Tool Use",
      desc: "新增工具 = 新增一个 handler",
      color: "#14b8a6",
      blocks: [
        { t: "lead", text: "第二课把「工具」从 1 个变成 5 个，并且用一个「对照表」来分发。核心思想：**循环一行不改，加工具只加一行映射。**" },
        { t: "audio", src: "audio/s02-01.mp3", title: "① 只有 bash 一个工具，很笨拙", transcript: "欢迎来到第二课，Tool Use，工具使用。上一课，我们的智能体手里只有一个工具，就是 bash。听起来很厉害，其实很笨拙。比如它想读一个文件，不能直接说，我要读这个文件，它得绕个弯，拼出一条命令 cat 空格 文件名；想写文件，又得拼 echo 什么什么；想改文件，还得拼更复杂的命令。每一件事，模型都得先翻译成一条命令，既浪费脑力，又容易拼错。就像你手里只有一把锤子，那看什么都像钉子。第二课要做的，就是给它一套真正的、专门的工具。" },
        { t: "text", h: "核心问题", p: "S01 里只有 `bash` 一个工具：\n\n- 读文件 → 得拼 `cat 路径`\n- 写文件 → 得拼 `echo ... > 文件`\n- 改文件 → 得拼复杂的 `sed`\n\n**每一件事都要先翻译成命令，浪费 token，还容易拼错。**\n就像手里只有一把锤子，看什么都像钉子。" },
        { t: "audio", src: "audio/s02-02.mp3", title: "② 解决方案：工具对照表", transcript: "第二课的做法很妙。它给模型加了四个新工具：读文件、写文件、改文件、找文件，加上原来的 bash，一共五个。但真正精彩的地方，不是工具变多了，而是它只改了一行代码。上一课循环里，执行工具的地方写死了 run bash，只认 bash 一个；这一课，它把这里换成了一张对照表，就像一个总机接线员。模型说，我要用读文件这个工具，程序就去表里查：读文件归谁管？哦，归这个函数管，好，调用它。以后加新工具，只要在表里加一行就行，核心循环一行都不用改。" },
        { t: "svg", caption: "工具分发：模型 → TOOL_HANDLERS 对照表 → 5 个工具", svg: "<svg viewBox='0 0 680 270' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><defs><marker id='b1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6366f1'/></marker></defs><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='15' text-anchor='middle'><rect x='270' y='20' width='100' height='40' rx='9' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='320' y='45' fill='#1e1b4b' font-weight='600'>🤖 模型</text><line x1='320' y1='60' x2='320' y2='78' stroke='#6366f1' stroke-width='1.5' marker-end='url(#b1)'/><rect x='160' y='80' width='320' height='44' rx='9' fill='#fef3c7' stroke='#f59e0b' stroke-width='1.5'/><text x='320' y='107' fill='#78350f' font-weight='600'>TOOL_HANDLERS 工具对照表</text><line x1='320' y1='124' x2='85' y2='208' stroke='#6366f1' stroke-width='1.2' marker-end='url(#b1)'/><line x1='320' y1='124' x2='215' y2='208' stroke='#6366f1' stroke-width='1.2' marker-end='url(#b1)'/><line x1='320' y1='124' x2='345' y2='208' stroke='#6366f1' stroke-width='1.2' marker-end='url(#b1)'/><line x1='320' y1='124' x2='475' y2='208' stroke='#6366f1' stroke-width='1.2' marker-end='url(#b1)'/><line x1='320' y1='124' x2='605' y2='208' stroke='#6366f1' stroke-width='1.2' marker-end='url(#b1)'/><rect x='30' y='210' width='110' height='44' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='85' y='227' fill='#134e4a' font-weight='600'>bash</text><text x='85' y='244' fill='#134e4a' font-size='12'>执行命令</text><rect x='160' y='210' width='110' height='44' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='215' y='227' fill='#134e4a' font-weight='600'>read_file</text><text x='215' y='244' fill='#134e4a' font-size='12'>读文件</text><rect x='290' y='210' width='110' height='44' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='345' y='227' fill='#134e4a' font-weight='600'>write_file</text><text x='345' y='244' fill='#134e4a' font-size='12'>写文件</text><rect x='420' y='210' width='110' height='44' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='475' y='227' fill='#134e4a' font-weight='600'>edit_file</text><text x='475' y='244' fill='#134e4a' font-size='12'>改文件</text><rect x='550' y='210' width='110' height='44' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='605' y='227' fill='#134e4a' font-weight='600'>glob</text><text x='605' y='244' fill='#134e4a' font-size='12'>找文件</text></g></svg>" },
        { t: "code", lang: "python", code: "# ① 定义 5 个工具（告诉模型\"我能做什么\"）\nTOOLS = [\n    {\"name\": \"bash\",       \"description\": \"执行 shell 命令\"},\n    {\"name\": \"read_file\",  \"description\": \"读取文件内容\"},\n    {\"name\": \"write_file\", \"description\": \"写入文件\"},\n    {\"name\": \"edit_file\",  \"description\": \"替换文件中的文字\"},\n    {\"name\": \"glob\",       \"description\": \"按名字查找文件\"},\n]\n\n# ② 工具对照表：工具名 → 处理函数\nTOOL_HANDLERS = {\n    \"bash\":       run_bash,\n    \"read_file\":  run_read,\n    \"write_file\": run_write,\n    \"edit_file\":  run_edit,\n    \"glob\":       run_glob,\n}\n\n# ③ 循环里只改一行：查表分发（其余和 s01 完全一样）\nfor block in tool_calls:\n    handler = TOOL_HANDLERS[block.name]   # 按工具名查表\n    output = handler(**block.input)       # 调用对应函数\n    results.append({\"type\": \"tool_result\",\n                    \"tool_use_id\": block.id,\n                    \"content\": output})" },
        { t: "audio", src: "audio/s02-03.mp3", title: "③ 多个工具 + 总结", transcript: "这一课还有一个现象：模型可以一次叫好几个工具。比如它说，帮我把 a 和 b 两个文件都读一下，再找找目录里所有 python 文件，它一次会返回好几个工具调用，程序就按顺序一个一个执行。所以第二课记住三句话：第一，只有 bash 一个工具，又笨又容易错；第二，给模型专门的工具，就像给工人趁手的工具；第三，用一张对照表来分发工具，加工具只加一行，循环永远不变。" },
        { t: "tip", text: "加一个工具 = 两步：① 在 `TOOLS` 里加一条描述 ② 在 `TOOL_HANDLERS` 里加一行映射。**循环一行不改。**" },
        { t: "table", head: ["组件", "s01", "s02"], rows: [["工具数量", "1 个（bash）", "5 个（+read/write/edit/glob）"], ["工具执行", "硬编码 run_bash()", "TOOL_HANDLERS 查表分发"], ["循环", "while True", "与 s01 完全一致"]] }
      ]
    }
  ]
};
