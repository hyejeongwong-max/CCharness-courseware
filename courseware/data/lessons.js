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
        { t: "audio", src: "audio/s01-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第一课，Agent Loop，智能体循环。这一课是整套课程的地基，后面的十六课，全是在这一课打下的底子上长出来的。我们从最真实的场景讲起：你对着大模型说，帮我看看我的目录里有哪些文件，然后执行某个脚本。模型很聪明，它能给你一条现成的 bash 命令。但问题在于，它说完就停了。它不会自己去终端里跑这条命令，也看不到运行结果，更不会基于结果继续推理。于是你只能手动把命令复制到终端，跑一遍，再把输出贴回对话框，它才接着给你下一条命令。下一个命令来了，你再跑一遍，再贴回去。你发现了吗？在模型和真实世界之间，每一次来回，你都在扮演那个中间人。这个中间人做得越久，你的时间浪费得越多，而且手动复制粘贴还容易出错。这就好比你在帮一个司机踩油门，明明车有油门踏板，却要你坐在副驾上替他踩。第一课要做的事，就是把你这中间人的活，彻底自动化。" },

        { t: "section", icon: "💡", title: "解决方案：一个 while 循环" },
        { t: "text", h: "", p: "一个 `while True` 循环：**模型调用工具就继续，不调用就停。**\n\n循环直接检查响应里的内容块（`tool_use` block）来决定下一步。" },
        { t: "svg", caption: "Agent Loop 流程图（来自 README 原图）", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 530" font-family="system-ui, -apple-system, sans-serif"><defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#555"/></marker><marker id="arrow-blue" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/></marker><marker id="arrow-green" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a"/></marker><linearGradient id="header" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1e3a5f"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs><rect width="720" height="530" fill="#fafbfc" rx="8"/><rect x="0" y="0" width="720" height="48" fill="url(#header)" rx="8"/><rect x="0" y="40" width="720" height="8" fill="url(#header)"/><text x="360" y="31" fill="#fff" font-size="16" font-weight="700" text-anchor="middle">Agent Loop — 一个 while 循环驱动整个 Agent</text><rect x="60" y="80" width="160" height="52" rx="8" fill="#f0f4ff" stroke="#2563eb" stroke-width="2"/><text x="140" y="102" fill="#1e3a5f" font-size="13" font-weight="600" text-anchor="middle">用户提问</text><text x="140" y="120" fill="#64748b" font-size="11" text-anchor="middle">"帮我创建 hello.py"</text><line x1="140" y1="132" x2="140" y2="162" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrow-blue)"/><rect x="60" y="164" width="160" height="48" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,2"/><text x="140" y="185" fill="#334155" font-size="12" font-weight="500" text-anchor="middle">messages[]</text><text x="140" y="201" fill="#94a3b8" font-size="10" text-anchor="middle">累积式消息列表</text><line x1="220" y1="188" x2="288" y2="188" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/><rect x="290" y="140" width="180" height="96" rx="8" fill="#fff" stroke="#2563eb" stroke-width="2"/><text x="380" y="166" fill="#1e3a5f" font-size="14" font-weight="700" text-anchor="middle">大模型 (LLM)</text><line x1="310" y1="176" x2="450" y2="176" stroke="#e2e8f0" stroke-width="1"/><text x="380" y="194" fill="#475569" font-size="11" text-anchor="middle">模型阅读消息历史</text><text x="380" y="210" fill="#475569" font-size="11" text-anchor="middle">判断：需要工具吗？</text><text x="380" y="228" fill="#64748b" font-size="10" text-anchor="middle">返回内容块</text><line x1="380" y1="236" x2="380" y2="276" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/><polygon points="380,280 470,316 380,352 290,316" fill="#fff8f0" stroke="#d97706" stroke-width="2"/><text x="380" y="312" fill="#92400e" font-size="12" font-weight="600" text-anchor="middle">tool_use block</text><text x="380" y="326" fill="#92400e" font-size="10" text-anchor="middle">存在？</text><line x1="470" y1="316" x2="540" y2="316" stroke="#16a34a" stroke-width="2" marker-end="url(#arrow-green)"/><text x="505" y="308" fill="#16a34a" font-size="10" font-weight="600" text-anchor="middle">否</text><rect x="542" y="294" width="130" height="44" rx="22" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><text x="607" y="313" fill="#166534" font-size="12" font-weight="600" text-anchor="middle">返回结果</text><text x="607" y="329" fill="#166534" font-size="10" text-anchor="middle">循环结束</text><line x1="380" y1="352" x2="380" y2="392" stroke="#d97706" stroke-width="2" marker-end="url(#arrow)"/><text x="395" y="376" fill="#d97706" font-size="10" font-weight="600">是</text><rect x="290" y="394" width="180" height="48" rx="8" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/><text x="380" y="415" fill="#92400e" font-size="12" font-weight="600" text-anchor="middle">执行工具调用</text><text x="380" y="432" fill="#92400e" font-size="10" text-anchor="middle">run_bash(command)</text><path d="M 290 418 L 40 418 L 40 188 L 58 188" fill="none" stroke="#d97706" stroke-width="1.5" marker-end="url(#arrow)" stroke-dasharray="6,3"/><text x="18" y="375" fill="#92400e" font-size="10" font-weight="500" transform="rotate(-90, 18, 375)">追加 tool_result 到 messages</text><rect x="60" y="462" width="600" height="48" rx="6" fill="#f1f5f9"/><text x="80" y="482" fill="#334155" font-size="10">核心：一个</text><text x="148" y="482" fill="#1e3a5f" font-size="10" font-weight="700" font-family="monospace">while True</text><text x="220" y="482" fill="#334155" font-size="10">循环。模型调工具 → 执行 → 喂回 → 再问。不调工具就停。</text><text x="80" y="500" fill="#64748b" font-size="10">后续所有章节都在这个循环上叠加机制。</text></svg>` },
        { t: "table", head: ["信号", "含义", "循环动作"], rows: [["包含 `tool_use` block", "模型要求调用工具", "执行 → 结果喂回去 → 继续"], ["不包含 `tool_use` block", "模型没有调用工具", "退出循环"]] },
        { t: "audio", src: "audio/s01-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案出奇的简单，核心就一个 while true 无限循环。先看整体流程：把用户的问题作为第一条消息发出去，交给模型；模型返回内容；我们检查返回内容里有没有 tool use 这个块，也就是模型有没有提出要调用工具。如果有，就执行这个工具，把结果作为新消息喂回给模型，然后回到开头，让模型继续推理；如果没有，就说明模型认为任务已经完成了，直接退出循环。注意这个判断标准有多干净：模型要调用工具，循环就继续；模型不再调用工具，循环就结束。终止权完全交给了模型自己，而不是我们预先规定它跑几步。你可以对照屏幕上的流程图，用手指跟着箭头走一遍：用户提问，进入消息列表，交给大模型，模型判断要不要工具，要，就执行、把结果喂回、再判断；不要，就结束。这一个循环，就是整个 agent 的心脏。记住一句话：模型负责想，循环负责做，谁调用工具、谁执行、结果怎么回去，全部在这个循环里运转。" },

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
        { t: "audio", src: "audio/s01-03.mp3", title: "讲解 · 工作原理", transcript: "我们把刚才的过程翻译成代码，一共五步。第一步，把用户的问题作为第一条消息，放进 messages 数组。第二步，把消息和工具定义一起发给大模型，注意工具定义也要一起传，因为模型得知道它能用什么。第三步，把模型的回答追加进消息列表，然后筛选出里面所有 tool use 类型的块，检查它有没有要调用工具。如果没有，直接返回，任务结束。第四步，如果有，就逐个执行模型要求的命令，把输出收集起来。这里有个细节：代码会先筛选出真实存在的 tool use 块，再进入执行阶段，这样就不会往消息里追加空的工具结果。第五步，把工具结果作为一条新消息追加回去，然后回到第二步，继续循环。整个过程三十多行代码，就是最小可运行的 agent harness 内核。它给模型提供了一个持续行动的最小框架：模型负责决策，要不要调工具、调哪个；harness 负责执行，调用工具、把结果喂回去。顺便提一句，这个 bash 工具自带了一层简单的关键词黑名单，比如 rm -rf /、sudo 这些危险命令会被直接挡掉，但这个我们到后面的课再深入讲。后面十六课，全是在这个循环上叠加机制，循环本身永远不变。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 为什么叫「最小可运行的 agent harness 内核」", p: "一个 Agent 产品 = **模型 + Harness**。\n\n智能（感知、推理、行动的能力）来自模型训练本身；Harness 负责给模型一个**可操作的环境**（工具、观察、行动接口）。这个循环，就是环境与模型之间最基础的那道连接。" },
        { t: "text", h: "② 一个类比", p: "模型是**司机**（做决策），Harness 是**载具**（执行）。\n\n这个循环就是驾驶过程：司机下指令 → 载具执行 → 汇报结果 → 司机再下指令。" },
        { t: "text", h: "③ 延伸", p: "你现在用的各种 AI 编程助手（Claude Code 等），剥到最里层，就是这个循环。\n\n后面 16 课（工具、权限、Hooks、记忆、任务系统……）全是在这个循环上「挂载」更多机制，循环本身不变。" },
        { t: "audio", src: "audio/s01-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识，帮你把这一课放到更大的图景里。第一，为什么这个循环叫最小可运行的 agent harness 内核？因为一个 agent 产品，本质上等于模型加 harness。智能，也就是感知、推理、行动的能力，来自模型本身的训练；而 harness，负责给模型提供一个可操作的环境，包括工具、观察、行动的接口。这个循环，就是环境与模型之间最基础的那道连接。第二，打个比方：模型是司机，负责做决策；harness 是载具，负责执行。这个循环就是驾驶过程：司机下指令，载具执行，汇报结果，司机再下指令。没有载具，司机再厉害也动不了。第三，延伸一下：你现在用的各种 AI 编程助手，剥到最里层，就是这个循环。后面十六课的工具、权限、记忆、任务系统，全是在这个循环上挂载更多机制。对产品经理来说，这堂课有个重要启示：好的 agent 产品，是把工程精力花在 harness 上，信任模型，而不是写一堆规则替模型做判断。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么用 `while True`，而不是写死「最多执行 N 次」", p: "因为任务需要多少步是**无法预知**的。\n\n写死步数：简单任务会空转浪费，复杂任务做不完。\n\n正确做法是**让模型自己决定何时停**——它不再返回 `tool_use`，就说明干完了。" },
        { t: "text", h: "难点 2：判断条件为什么是「检查 tool_use block」", p: "因为这是模型「想要行动」的**唯一明确信号**。\n\n没有 `tool_use` = 模型认为任务已完成，就该停。" },
        { t: "text", h: "易错点 3：为什么「只有实际存在的 tool_use 才进入执行阶段」", p: "这是为了**避免追加空工具结果消息**。\n\n空结果会污染上下文、浪费 token，甚至让模型犯迷糊。\n\n（代码里先用列表推导筛出真实 `tool_use`，再执行。）" },
        { t: "text", h: "核心设计决策", p: "**职责分离**：模型负责决策，Harness 负责执行。\n\n这个边界，后面所有课都不会变。" },
        { t: "audio", src: "audio/s01-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点，都是面试常考的点。第一，为什么用 while true 无限循环，而不是写死最多执行几次？因为一个任务需要多少步，是没法预先知道的。写死步数，简单任务会空转浪费，复杂任务又做不完。正确做法是让模型自己决定何时停：它不再返回 tool use，就说明它认为干完了。第二，判断条件为什么是检查 tool use 块？因为这是模型想要采取行动的唯一明确信号。没有 tool use，就等于模型认为任务完成，循环就该停。第三，一个容易踩的坑：为什么只对实际存在的 tool use 块执行，而不是对返回内容里的所有内容块都执行？因为如果内容里根本没有工具调用，你硬要执行，就会往消息列表里追加一条空的工具结果。空结果会污染上下文、浪费 token，甚至让模型犯迷糊。第四，还有一个细节值得注意：工具执行的结果，是作为 user 角色的消息追加回去的，这在 Anthropic 的 API 协议里，工具结果就属于 user 消息的一部分，模型看到的就是一个持续累积的对话。最后记住核心设计决策：模型负责决策，harness 负责执行，这个边界，后面所有课都不会变。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "什么是 AI Agent？它和「调用一次大模型 API」的本质区别是什么？", a: "核心区别在**「循环 + 反馈」**。单次调用是「一问一答」，模型输出就结束；Agent 是一个 `while` 循环：模型输出 `tool_use` → 环境执行 → 结果作为新消息喂回 → 模型再推理，直到模型不再调用工具才停止。Agency（感知-推理-行动-再感知）来自这个**反馈闭环**，而不是某一次更聪明的回答。产品经理要能说清：**Agent = 模型（决策）+ 循环（执行反馈）+ 工具（行动接口）**。" },
        { t: "qa", q: "一个最小可用的 coding agent，最少需要哪些组件？为什么「一个循环 + 一个 Bash 工具」就够了？", a: "最少三样：① 一个 LLM（决策者）；② 一个工具执行层（哪怕只有 Bash，给模型「动手」能力）；③ 一个 `while` 循环（把工具结果持续喂回，形成反馈）。够用的原因：**模型本身已具备感知、推理、行动的智能**，Harness 只需提供「能行动 + 能反馈」的最小环境。这也解释了为什么好的 agent 产品是「信任模型、把工程精力放在 harness 上」，而不是写一堆决策树替模型做判断。" },
        { t: "qa", q: "如果一个 agent 产品「感觉不聪明」，作为产品经理你会先怀疑哪一层？怎么定位？", a: "先区分是**智能问题还是 harness 问题**，逐层消融：\n\n① 看模型：换一个更强的模型，若表现明显变好 → 瓶颈在模型能力；\n② 看工具：工具描述是否清晰、是否原子化、是否给足信息；\n③ 看反馈闭环：工具结果有没有正确喂回 `messages`、上下文有没有被污染、有没有空结果被追加。\n\n这体现了「Agent = 模型 + Harness」的产品观：**不聪明的锅，不一定在模型。**" },
        { t: "qa", q: "（难点）为什么 Agent 循环不能写死「最多执行 3 步」，而要用 `while True` 让模型自己停？", a: "因为任务复杂度不可预知：步数太少 → 复杂任务做不完；步数太多 → 简单任务空转。正确做法是**让模型通过「不再返回 tool_use」来声明任务完成**，终止条件来自模型判断而非产品侧硬编码。\n\n高频追问：那模型死循环怎么办？—— 这正是后面 s03 权限、以及超时/步数上限等「安全护栏」要解决的：**护栏可以限制上限，但正常终止应由模型决定。**" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s01_agent_loop/code.py\n```\n\n试试这些 prompt：\n\n1. `Create a file called hello.py that prints “Hello, World!”`\n2. `List all Python files in this directory`\n3. `What is the current git branch?`\n\n**观察重点**：模型什么时候调用工具（循环继续）、什么时候不调用（循环结束）？" },
        { t: "audio", src: "audio/s01-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。第一课就一句话：一个循环，加一个工具，就是一个最简单的 agent。模型负责想，循环负责做。具体来说，模型说我要用工具，循环就去执行，把结果喂回去，模型再说下一步；模型不说了，循环就停。后面十六课，全是在这个循环上叠加能力：加更多工具、加权限、加记忆、加计划。但那个核心的循环，从头到尾都不会变。学完这一课，强烈建议你到试一下板块，动手跑一次代码，亲眼看看模型是怎么自动执行命令的。重点观察两个现象：模型什么时候调用工具，循环继续；什么时候不调用，循环结束。顺带说一句，如果你以后去面试，能把这个循环画出来、把模型和 harness 的分工讲清楚，就已经超过了大多数候选人。下一课，我们会给模型更多趁手的工具，看看它会变得多能干。" },

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
        { t: "lead", text: "第二课把「工具」从 1 个变成 5 个，核心思想：**循环一行不改，加工具只加一行映射**——用一张「对照表」来分发工具。" },

        { t: "section", icon: "❓", title: "问题：只有 bash 一个工具，又笨又容易错" },
        { t: "text", h: "核心问题", p: "S01 里只有 `bash` 一个工具：\n\n- 读文件 → 得拼 `cat 路径`\n- 写文件 → 得拼 `echo ... > 文件`\n- 改文件 → 得拼复杂的 `sed`\n\n**每一件事都要先翻译成命令，浪费 token，还容易拼错。**\n就像手里只有一把锤子，看什么都像钉子。" },
        { t: "audio", src: "audio/s02-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第二课，Tool Use，工具使用。先回顾一下上一课：我们的智能体循环已经跑起来了，但模型手里只有一个工具，就是 bash。这个工具听起来很万能，实际上很笨拙。我们来还原一个真实的场景：模型想读一个文件，它不能直接说，我要读这个文件，它得先翻译成一条命令，cat 空格 路径；想写一个文件，得翻译成 echo 内容 重定向到文件；想修改文件里的某句话，更麻烦，得拼一条很复杂的 sed 命令。你发现没有，模型每做一件小事，都要先在脑子里把意图翻译成命令语法，中间就多了一层翻译。翻译会带来两个问题：第一，浪费 token，因为命令本身又长又绕；第二，容易出错，路径拼错、引号漏掉、语法写错，命令就废了。打个比方，这就好比一个工人，明明有专用工具，却只发给他一把锤子，于是他看什么都像钉子，干什么都得抡锤子。第二课要解决的问题，就是给模型一套真正的、趁手的专用工具。" },

        { t: "section", icon: "💡", title: "解决方案：一张工具对照表" },
        { t: "text", h: "加一个工具只需两步", p: "1. **定义工具**：在 `TOOLS` 数组里加一条描述（告诉模型「我能做什么」）；\n2. **注册处理函数**：在 `TOOL_HANDLERS` 字典里加一个映射（告诉程序「这个工具归谁执行」）。\n\n循环逻辑一行不改。" },
        { t: "svg", caption: "工具分发：模型 → TOOL_HANDLERS 对照表 → 5 个工具", svg: `<svg viewBox='0 0 680 250' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='14' text-anchor='middle'><rect x='285' y='16' width='110' height='38' rx='9' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='340' y='40' fill='#1e1b4b' font-weight='600'>🤖 模型</text><line x1='340' y1='54' x2='340' y2='72' stroke='#6366f1' stroke-width='1.5'/><rect x='180' y='74' width='320' height='40' rx='9' fill='#fef3c7' stroke='#f59e0b' stroke-width='1.5'/><text x='340' y='99' fill='#78350f' font-weight='600'>TOOL_HANDLERS 对照表（查表分发）</text><line x1='340' y1='114' x2='85' y2='196' stroke='#6366f1' stroke-width='1.2'/><line x1='340' y1='114' x2='215' y2='196' stroke='#6366f1' stroke-width='1.2'/><line x1='340' y1='114' x2='345' y2='196' stroke='#6366f1' stroke-width='1.2'/><line x1='340' y1='114' x2='475' y2='196' stroke='#6366f1' stroke-width='1.2'/><line x1='340' y1='114' x2='605' y2='196' stroke='#6366f1' stroke-width='1.2'/><rect x='30' y='198' width='110' height='42' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='85' y='215' fill='#134e4a' font-weight='600'>bash</text><text x='85' y='231' fill='#134e4a' font-size='12'>执行命令</text><rect x='160' y='198' width='110' height='42' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='215' y='215' fill='#134e4a' font-weight='600'>read_file</text><text x='215' y='231' fill='#134e4a' font-size='12'>读文件</text><rect x='290' y='198' width='110' height='42' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='345' y='215' fill='#134e4a' font-weight='600'>write_file</text><text x='345' y='231' fill='#134e4a' font-size='12'>写文件</text><rect x='420' y='198' width='110' height='42' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='475' y='215' fill='#134e4a' font-weight='600'>edit_file</text><text x='475' y='231' fill='#134e4a' font-size='12'>改文件</text><rect x='550' y='198' width='110' height='42' rx='9' fill='#f0fdfa' stroke='#14b8a6' stroke-width='1.5'/><text x='605' y='215' fill='#134e4a' font-weight='600'>glob</text><text x='605' y='231' fill='#134e4a' font-size='12'>找文件</text></g></svg>` },
        { t: "code", lang: "python", code: `# ① 定义 5 个工具：名字 + 说明 + 参数 schema（告诉模型"我能做什么"）
TOOLS = [
    {"name": "bash",       "description": "Run a shell command.",
     "input_schema": {"type": "object", "properties": {"command": {"type": "string"}}, "required": ["command"]}},
    {"name": "read_file",  "description": "Read file contents.",
     "input_schema": {"type": "object", "properties": {"path": {"type": "string"}, "limit": {"type": "integer"}}, "required": ["path"]}},
    {"name": "write_file", "description": "Write content to a file.",
     "input_schema": {"type": "object", "properties": {"path": {"type": "string"}, "content": {"type": "string"}}, "required": ["path", "content"]}},
    {"name": "edit_file",  "description": "Replace exact text in a file once.",
     "input_schema": {"type": "object", "properties": {"path": {"type": "string"}, "old_text": {"type": "string"}, "new_text": {"type": "string"}}, "required": ["path", "old_text", "new_text"]}},
    {"name": "glob",       "description": "Find files matching a glob pattern.",
     "input_schema": {"type": "object", "properties": {"pattern": {"type": "string"}}, "required": ["pattern"]}},
]

# ② 工具对照表：工具名 → 处理函数
TOOL_HANDLERS = {
    "bash": run_bash, "read_file": run_read, "write_file": run_write,
    "edit_file": run_edit, "glob": run_glob,
}

# ③ 循环里只改一行：查表分发（其余和 s01 完全一样）
for block in tool_calls:
    handler = TOOL_HANDLERS.get(block.name)      # 按工具名查表
    output = handler(**block.input) if handler else f"Unknown: {block.name}"
    results.append({"type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output})` },
        { t: "audio", src: "audio/s02-02.mp3", title: "讲解 · 解决方案", transcript: "第二课的做法，精彩的地方不在于工具变多了，而在于它只改了一行代码。我们先看原来长什么样。上一课循环里，执行工具的那一行，写死的是 run bash，也就是说，模型只要调用工具，一律交给 bash 处理，代码里没有第二条路。这一课，它把这一行换成了查表分发，TOOL_HANDLERS 中括号 block.name，然后调用。TOOL_HANDLERS 是一张对照表，就像总机接线员：模型说我要用读文件，程序就去表里查，读文件归谁管，查到对应函数，调用它，把结果拿回来。现在加一个工具只需要两步：第一步，在 TOOLS 数组里加一条工具描述，告诉模型，你多了一个什么能力；第二步，在 TOOL_HANDLERS 表里加一行映射，告诉程序，这个工具名对应哪个函数。两步做完，工具就上线了，核心循环一行都不用改。为什么能做到？因为工具名到处理函数的对应关系，从写死在代码里的分支，变成了一张可以随时增删的数据表。代码不再需要为每个工具写一段专属逻辑，它只认一个抽象：工具名，查表，调用。这就是数据驱动的好处，后面所有课都离不开这个思想。" },

        { t: "section", icon: "⚙️", title: "工作原理：定义、注册、多工具调用" },
        { t: "table", head: ["工具", "职责", "关键实现"], rows: [["bash", "执行 shell 命令", "直接运行命令"], ["read_file", "读文件", "safe_path 校验路径"], ["write_file", "写文件", "safe_path 校验路径"], ["edit_file", "替换文字", "旧文本不存在则明确报错"], ["glob", "按模式找文件", "限定在工作目录内"]] },
        { t: "text", h: "多工具调用", p: "模型经常一次返回多个 `tool_use`：\n\n> “读一下 a.py 和 b.py，然后列出所有 .py 文件”\n\n这些调用**按 `response.content` 中的原始顺序逐个串行执行**，结果全部收集后一起喂回模型。" },
        { t: "audio", src: "audio/s02-03.mp3", title: "讲解 · 工作原理", transcript: "这一节我们深入看工作原理。先看工具定义。TOOLS 数组里每一个工具，都是一段 JSON 描述，包含名字、说明和参数 schema，告诉模型我能做什么、参数怎么填。注意，模型永远看不到函数的实现代码，它只知道这张说明书，所以说明书写得好不好，直接决定模型会不会正确使用。再看处理函数。比如读文件，run read 接收路径，通过 safe path 校验后读取内容；写文件，run write 直接写入并返回写了多少字节；改文件，run edit 先检查要替换的旧文字存不存在，找不到就明确报错，找到了才替换一次；找文件，run glob 按通配符在项目目录里搜索。这里有个细节值得注意，safe path 只保护了文件类工具，它把模型的操作限制在工作目录之内，防止越权。最后看多工具调用。模型经常一次返回好几个工具调用，比如，帮我读 a 文件和 b 文件，再列出所有 python 文件。这些调用会按照返回的原始顺序，一个一个串行执行，结果全部收集后再一起喂回给模型。这一课告诉我们：模型负责决策，harness 负责执行，而工具层，就是 harness 扩展模型行动边界的方式。加一个工具，就是给模型的世界多开一扇门。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 工具描述 = 模型与环境的接口契约", p: "模型看不到函数实现，它的**一切判断都来自 TOOLS 里的 JSON 描述**。\n\n描述写清用途、参数、边界 → 模型精准调用；描述模糊 → 模型靠猜，一猜就错。**工具描述质量 ≈ agent 产品体验**，和 API 文档决定开发者体验是同一个道理。" },
        { t: "text", h: "② 一个类比：工具清单 = 餐厅菜单", p: "顾客（模型）只能照着菜单点菜：菜单写得清楚，顾客才点得到想吃的菜；菜单语焉不详，顾客要么不点，要么点错。\n\n给工具写描述，就像给餐厅写菜单，是需要用心打磨的活儿。" },
        { t: "text", h: "③ 延伸：所有 Agent 产品的增长引擎", p: "AI 编程助手内部都是「**一张越来越长的对照表**」——表越长，agent 能干的事越多。\n\n行业标准 **MCP** 把这张表的格式协议化，让第三方工具像插件一样动态接入（s14 会讲）。理解本课，就理解了 agent 的生态化路径。" },
        { t: "audio", src: "audio/s02-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识，帮你建立更整体的认知。第一，工具描述的本质，是模型和真实环境之间的接口契约。模型看不见函数实现，它的一切判断都来自这段 JSON 描述。描述里写清楚用途、参数、边界，模型就能精准调用；描述模糊，模型就会猜，一猜就容易错。所以在一个 agent 产品里，工具描述的质量，往往直接决定了产品体验，这跟 API 文档决定开发者体验，是同一个道理。第二，打个比方，工具清单就像餐厅的菜单。顾客，也就是模型，只能照着菜单点菜，菜单上写得清楚，顾客才能点到想吃的菜；菜单上语焉不详，顾客要么不点，要么点错。给工具写描述，就像给餐厅写菜单，是个需要用心打磨的活儿。第三，延伸一下。你现在用的各种 AI 编程助手，内部都是这张表，而且表越长，agent 能干的事越多。行业里有个标准叫 MCP，就是把这个对照表的格式标准化，让第三方工具能像插件一样动态接入，这在后面的课程里会详细讲。理解这一课，你就理解了所有 agent 产品的增长引擎，就是往这张表里加行。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么查表分发，而不是 if-elif 写死", p: "if-elif 每加一个工具就要改一次判断代码：工具从 5 个变 50 个，代码膨胀到没法维护，改旧分支还有引入 bug 的风险。\n\n查表把对应关系变成**数据**：加工具只加一行，不改任何已有代码——这就是**开闭原则**：对扩展开放，对修改关闭。" },
        { t: "text", h: "难点 2：为什么 safe_path 只保护 file tools，bash 却只有一层关键词黑名单", p: "文件工具是**定向操作**，路径可以静态校验（限制在工作目录内，防越权）；bash 是**万能执行通道**，目前只有一层简单的关键词黑名单，字符串匹配很容易绕过，无法可靠预判命令安全性。\n\n所以 bash 的安全约束留给更上层的**权限系统**（s03）。这是**最小权限 + 分层防御**的典型设计。" },
        { t: "text", h: "易错点 3：工具描述写不好，模型就选错工具", p: "描述没写清参数含义 → 模型传错参数；没写清适用场景 → 模型在需要别的工具时选错工具。\n\n作为产品经理，**审工具描述要像审文案一样认真**。" },
        { t: "text", h: "核心设计决策", p: "**模型决策 / Harness 执行**的边界不变；工具层是 harness 扩展模型行动边界的**接口**。\n\n加一个工具 = 给模型的世界多开一扇门。" },
        { t: "audio", src: "audio/s02-05.mp3", title: "讲解 · 难点解读", transcript: "讲四个难点，都是面试容易考到的点。第一，为什么用查表分发，而不是写一串 if elif？因为 if elif 每加一个工具就要改一次判断代码，工具从五个变成五十个，代码会膨胀到没法维护，而且改旧分支还有引入 bug 的风险。查表把对应关系变成数据，加工具只加一行，不改任何已有代码，这就是开闭原则：对扩展开放，对修改关闭。第二，为什么 safe path 只保护文件类工具，bash 却只有一层简单的黑名单？因为文件工具是定向操作，路径可以做静态校验，把操作限制在工作目录内；而 bash 是万能执行通道，代码里目前只挡了几个危险关键词，这种字符串匹配很容易绕过，没法可靠判断一条命令安不安全，所以它需要的是更上层的权限机制，也就是下一课的权限系统。这体现的是最小权限和分层防御的思想。第三，一个容易踩的坑：工具描述写不好。描述里没说清楚参数含义，模型就会传错参数；没说清楚适用场景，模型就会在需要别的工具时选错工具。作为产品经理，审工具描述应该像审文案一样认真。最后记住核心设计决策：模型决策，harness 执行，这个边界从头到尾没有变过。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "给一个 agent 新增一个工具，工程上要做哪几步？为什么核心循环不需要改动？", a: "两步：① 在 `TOOLS` 数组新增一条工具描述（name、description、参数 schema），让模型知道有这个能力；② 在 `TOOL_HANDLERS` 新增一条「工具名 → 处理函数」的映射。\n\n循环不用改的原因：循环只依赖「工具名 → 查表 → 调用」这个抽象，**不感知具体工具**；分发是数据驱动，新增能力 = 往表里加一行。\n\n产品含义：agent 的能力边界可以低成本扩展，这也是所有 agent 产品做「插件化 / 生态化」的工程基础。" },
        { t: "qa", q: "工具描述（schema）写得好坏，为什么直接影响 agent 的效果？", a: "模型看不到函数实现，它的全部判断来自描述：**什么时候该用这个工具、参数怎么填、什么情况会失败**。\n\n描述模糊 → 模型选错工具、传错参数、把失败当成功；描述清晰 → 调用准确、失败可预期。要写清：用途一句话、适用场景、参数语义、边界与失败条件。\n\n产品经理视角：工具描述 ≈ **面向模型的 API 文档**，是 agent 产品体验的核心杠杆，应像打磨文案一样打磨。" },
        { t: "qa", q: "为什么 read/write/edit 这类文件工具要加 safe_path 校验，而 bash 不加？这反映了什么安全设计思想？", a: "文件工具是**定向操作**，路径可以做静态校验（限制在工作目录内，防止越权读改写其他路径）；bash 是**万能执行通道**，无法在执行前静态判断一条命令是否安全（当前代码里有一层简单的关键词黑名单，但字符串匹配很容易绕过，不算可靠防线）。\n\n所以对 bash 的安全约束放在更上层——权限 / 审批机制（课程 s03）。思想：**最小权限原则**（每个工具只给完成任务所需的最小能力）+ **分层防御**（静态校验在工具层、动态审批在权限层、兜底在用户）。" },
        { t: "qa", q: "（难点）模型一次返回多个工具调用时，harness 如何执行？串行还是并行？有什么考量？", a: "本课实现是**串行**：按 `response.content` 原始顺序逐个执行，结果统一收集后喂回模型。\n\n串行的好处：确定性（结果顺序可预期、依赖关系天然满足）、错误可定位、实现简单。并行能提速，但有**竞态与依赖风险**（工具 A 的结果可能影响工具 B 的参数）。\n\n产品设计考量：无依赖的只读工具可并行，有依赖 / 有副作用的操作宜串行，并配超时与重试——这也是 agent 产品设计工具执行策略时要做出的决策。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s02_tool_use/code.py\n```\n\n试试这些 prompt：\n\n1. `Read the file README.md and tell me what this project is about`\n2. `Create a file called test.py that prints “hello”, then read it back`\n3. `Find all Python files in this directory`\n4. `Read both README.md and requirements.txt, then create a summary file`\n\n**观察重点**：模型什么时候只调一个工具、什么时候一次调多个？多个工具调用的顺序和结果是否正确？" },
        { t: "audio", src: "audio/s02-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。第一，只有一个 bash 工具的时候，模型干什么都要先翻译成命令，浪费 token，还容易出错。第二，给模型一套专门的工具，就像给工人发趁手的工具，它就不用抡着锤子干所有活了。第三，用一张对照表来分发工具，加工具只加一行映射，核心循环一行不改。建议你到试一下板块，跑一遍代码，重点观察两个现象：模型什么时候只调一个工具，什么时候一次调多个；多个工具的结果是不是按顺序、正确地反馈了回来。下一课，我们会发现一个隐患：bash 工具虽然有一层简单的关键词黑名单，能挡住 rm -rf /、sudo 这些命令，但这种字符串匹配很容易绕过，换个写法就能躲过去，它不是可靠的权限控制。真正的权限这道门，就留给第三课。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "现在 Agent 有 5 个专用工具。file tools 受 `safe_path` 保护，但 bash 只有一层简单的**关键词黑名单**（拦截 `rm -rf /`、`sudo` 等），字符串匹配很容易绕过，不是可靠的权限控制。\n\n**下一课 s03 Permission** → 在工具执行之前加一道真正的门：这个操作安全吗？需要用户批准吗？" },
        { t: "tip", text: "一句话记住 S02：**加一个工具 = ① TOOLS 加一条描述 + ② TOOL_HANDLERS 加一行映射，循环一行不改。** 工具层是 Harness 扩展模型边界的接口。" }
      ]
    },
    {
      id: "s03",
      num: "03",
      title: "Permission",
      desc: "执行前三道闸门",
      color: "#ef4444",
      blocks: [
        { t: "lead", text: "第三课在工具执行前加一道门：**三道闸门权限管线**——硬拒绝 → 规则匹配 → 用户审批，都没命中就放行。循环只加一行代码。" },

        { t: "section", icon: "❓", title: "问题：bash 不受限，危险操作能直接执行" },
        { t: "text", h: "核心问题", p: "s02 的 file tools 受 `safe_path` 保护，但 **bash 是万能通道**：\n\n- 让它「清理一下项目」→ 可能执行 `rm -rf /`\n- 写工作区外的文件 → 没有拦截\n\n安全边界靠代码内部自带的薄弱黑名单是不够的——**执行之前，需要一道真正的权限门**。" },
        { t: "audio", src: "audio/s03-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第三课，Permission，权限系统。回顾一下第二课：我们的智能体有了五个工具，其中文件工具都被 safe path 保护着，操作限制在工作目录里。但是注意，bash 是例外。你让模型清理一下项目，它可能真的会去执行 rm -rf 这样的命令，把整个目录甚至磁盘删掉。上一课我们提到，bash 自带了一层关键词黑名单，能挡住 rm -rf /、sudo 这些，但你也知道，字符串匹配很容易绕过，而且它挡不住更隐蔽的危险。也就是说，靠代码内部自带的防护是不够的。安全边界应该由谁负责？这一课的做法是：由 harness 负责，在工具真正执行之前，加一道权限判断的门。执行之前先问一问：这个操作安全吗？需要用户批准吗？这就引出了本课的三道闸门权限管线。" },

        { t: "section", icon: "💡", title: "解决方案：三道闸门权限管线" },
        { t: "table", head: ["闸门", "作用", "命中后"], rows: [["1. 拒绝列表", "永远禁止的操作（`rm -rf /`、`sudo`、`mkfs`…）", "直接拒绝，不执行"], ["2. 规则匹配", "看上下文的操作（写工作区外、`rm` 文件、`chmod 777`）", "交给闸门 3"], ["3. 用户审批", "暂停，打印工具与原因，等用户确认", "y 放行，其他默认拒绝"]] },
        { t: "svg", caption: "三道闸门：执行前的权限管线", svg: `<svg viewBox='0 0 680 320' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><rect x='40' y='24' width='120' height='44' rx='9' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='100' y='42' fill='#1e1b4b' font-weight='600'>工具调用</text><text x='100' y='58' fill='#6366f1' font-size='11'>block.name</text><line x1='160' y1='46' x2='190' y2='46' stroke='#6366f1' stroke-width='1.5'/>

<rect x='192' y='24' width='150' height='44' rx='9' fill='#fef2f2' stroke='#ef4444' stroke-width='1.5'/><text x='267' y='42' fill='#991b1b' font-weight='600'>闸门1 拒绝列表</text><text x='267' y='58' fill='#ef4444' font-size='11'>rm -rf /、sudo…</text><line x1='342' y1='46' x2='372' y2='46' stroke='#6366f1' stroke-width='1.5'/>

<rect x='374' y='24' width='150' height='44' rx='9' fill='#fffbeb' stroke='#f59e0b' stroke-width='1.5'/><text x='449' y='42' fill='#78350f' font-weight='600'>闸门2 规则匹配</text><text x='449' y='58' fill='#b45309' font-size='11'>写工作区外 / rm…</text><line x1='524' y1='46' x2='554' y2='46' stroke='#6366f1' stroke-width='1.5'/>

<rect x='556' y='24' width='100' height='44' rx='9' fill='#ecfdf5' stroke='#10b981' stroke-width='1.5'/><text x='606' y='42' fill='#065f46' font-weight='600'>闸门3 审批</text><text x='606' y='58' fill='#059669' font-size='11'>y/N</text>

<text x='267' y='96' fill='#ef4444' font-size='11'>⛔ 命中 → 拒绝</text><text x='449' y='96' fill='#b45309' font-size='11'>命中 → 问用户</text><text x='606' y='96' fill='#059669' font-size='11'>y 放行 / 其他拒绝</text>

<rect x='192' y='130' width='356' height='40' rx='9' fill='#f8fafc' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='5,3'/><text x='370' y='148' fill='#334155' font-weight='600'>三道都没命中 → 直接执行</text><text x='370' y='162' fill='#94a3b8' font-size='11'>大部分日常操作走这条路</text>

<line x1='370' y1='170' x2='370' y2='196' stroke='#6366f1' stroke-width='1.5'/><rect x='250' y='198' width='240' height='40' rx='9' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='370' y='216' fill='#1e1b4b' font-weight='600'>TOOL_HANDLERS 执行工具</text><text x='370' y='232' fill='#6366f1' font-size='11'>循环只加一行 check_permission()</text>

<line x1='370' y1='238' x2='370' y2='264' stroke='#6366f1' stroke-width='1.5'/><rect x='120' y='266' width='500' height='34' rx='8' fill='#f1f5f9'/><text x='370' y='288' fill='#475569' font-size='12'>结果喂回模型：正常输出 或 “Permission denied.”</text></g></svg>` },
        { t: "code", lang: "python", code: `# 闸门 1：硬拒绝列表（静态兜底）
DENY_LIST = ["rm -rf /", "sudo", "shutdown", "reboot", "mkfs", "dd if=", "> /dev/sda"]

# 闸门 2：规则匹配（看上下文）
PERMISSION_RULES = [
    {"tools": ["read_file", "write_file", "edit_file"],
     "check": lambda args: not (WORKDIR / args.get("path", "")).resolve().is_relative_to(WORKDIR),
     "message": "Access outside workspace"},
    {"tools": ["bash"],
     "check": lambda args: any(kw in args.get("command", "") for kw in ["rm ", "> /etc/", "chmod 777"]),
     "message": "Potentially destructive command"},
]

# 闸门 3：用户审批（默认拒绝）
def ask_user(tool_name, args, reason):
    choice = input(f"  Allow? [y/N] ").strip().lower()
    return "allow" if choice in ("y", "yes") else "deny"

# 三道闸门串起来，插在工具执行之前
def check_permission(block) -> bool:
    if block.name == "bash":
        reason = check_deny_list(block.input.get("command", ""))
        if reason:
            return False
    reason = check_rules(block.name, block.input)
    if reason:
        if ask_user(block.name, block.input, reason) == "deny":
            return False
    return True

# 循环里只加一行（s02 原有逻辑不变）：
for block in tool_calls:
    if not check_permission(block):          # ← 新增
        results.append({... "content": "Permission denied."})
        continue
    output = TOOL_HANDLERS[block.name](**block.input)` },
        { t: "audio", src: "audio/s03-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案是在工具执行之前插入一个 check permission 函数，每个工具调用依次经过三道闸门。第一道闸门，硬拒绝列表。比如 rm -rf /、sudo、shutdown、reboot，这些操作任何时候都不允许，命中就直接拒绝，根本不执行。第二道闸门，规则匹配。有些操作本身不违规，但要看你用在什么上下文里。比如文件工具要写工作区以外的路径，比如 bash 命令里出现了 rm 或者往系统目录里写，这些就命中规则，需要交给第三道闸门。第三道闸门，用户审批。规则命中后，程序暂停下来，把工具名、参数、原因都打印给你，问你允许吗？默认答案是拒绝。你按 y 才放行。三道闸门都没命中，就直接执行。大部分日常操作走的都是这条路。整个过程只改了循环里的一行：执行工具之前先检查权限，不同意就记录一个权限被拒绝的结果，跳过这个工具。" },

        { t: "section", icon: "⚙️", title: "工作原理：三道闸门的实现" },
        { t: "text", h: "", p: "- **闸门 1**：`DENY_LIST` 字符串匹配，命中直接阻止。⚠️ 只是演示权限闸门的位置，**不是完整安全边界**\n- **闸门 2**：`PERMISSION_RULES` 两条规则——文件工具写出工作区 / bash 含 `rm `、`> /etc/`、`chmod 777`\n- **闸门 3**：`ask_user()` 打印原因后 `Allow? [y/N]`，**默认拒绝**\n- **循环改动**：执行前插 `check_permission(block)`，拒绝则返回 `Permission denied.` 并跳过" },
        { t: "audio", src: "audio/s03-03.mp3", title: "讲解 · 工作原理", transcript: "我们深入看一下三道闸门的实现。闸门一，拒绝列表。代码里有一张 deny list，存着 rm -rf /、sudo、shutdown、reboot、mkfs、dd if 这些模式，check deny list 函数逐个检查命令里有没有包含这些字符串，包含就返回阻止信息。注意，这里用的是字符串匹配，所以 README 里特意提醒，这张表只是用来演示权限闸门的位置，不能当作完整的安全边界。闸门二，规则匹配。PERMISSION RULES 里有两条规则：第一条管文件工具，检查路径是不是在工作区之外，是就提示访问越界；第二条管 bash，检查命令里有没有 rm 空格、往 etc 目录写、chmod 777 这类危险的模式，有就提示可能破坏性命令。闸门三，用户审批。ask user 函数把原因、工具、参数打印出来，然后问你允许吗，默认是 n，你输 y 或者 yes 才放行。最后 check permission 把三道闸门串起来，插在循环里：先查拒绝列表，再查规则，规则命中就问用户。整个过程只改了一行循环代码，其他的机制，比如模型怎么决策、工具怎么分发，全都和上一课一样。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 权限设计本质：从静态到动态的三层过渡", p: "拒绝列表（静态兜底）→ 规则匹配（半动态，看上下文）→ 用户审批（动态，交给当下的人）。\n\n成熟的权限系统 = 静态兜底 + 规则自动放行 + 关键操作真人审批。" },
        { t: "text", h: "② 一个类比：机场安检", p: "拒绝列表 = 禁飞名单，上了名单直接拦下；规则匹配 = 安检扫描，可疑物品过一遍；用户审批 = 人工开箱，安检员问你「这个可以吗？」。\n\n每层都在降低误放的概率，也都在增加一点成本。" },
        { t: "text", h: "③ 延伸：现实 Agent 产品的权限体验", p: "Claude Code 等产品把审批做成了精细规则：自动允许的、自动拒绝的、弹窗询问的。\n\n**产品金句：默认拒绝永远比默认允许安全；审批的交互体验，直接决定用户是否信任这个 agent。**" },
        { t: "audio", src: "audio/s03-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，权限模型的设计，本质是从静态到动态的过渡。拒绝列表是静态的，写死了永远不能做的事；规则匹配是半动态的，看上下文判断；用户审批是动态的，把最后的判断交给当下的人。一个成熟的权限系统，往往是这三层组合：静态的兜底、规则的自动放行、关键操作的真人审批。第二，打个比方，这三道闸门就像机场安检。拒绝列表是禁飞名单，上了名单的人直接拦下；规则匹配是安检扫描，可疑物品过一遍；用户审批就是人工开箱检查，安检员问你，这个可以吗？你要么同意要么拒绝。第三，延伸一下，现实中的 agent 产品，比如 Claude Code，权限模型也是这个思路，只是把审批做成了更精细的规则：有的命令自动允许，有的自动拒绝，有的弹窗问你。对产品经理来说，这一课最重要的一句话是：默认拒绝永远比默认允许安全，审批的交互体验，直接决定用户是否信任这个 agent。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么拒绝列表「不是完整的安全边界」", p: "字符串匹配**可被绕过**：在 `rm` 和 `-rf` 之间加空格、换引号、用通配符，黑名单就认不出来。\n\n所以它只能做兜底——真正的安全靠**多层防御**（规则 + 审批）。" },
        { t: "text", h: "难点 2：为什么审批默认是拒绝（y/N 而非 y/n）", p: "**默认拒绝原则**：拿不准就拦下来，宁可错拦，不可错放。\n\n误伤代价 = 多问一次；放错代价 = 一次事故。安全设计永远选前者。" },
        { t: "text", h: "易错点 3：权限被拒绝后，模型会怎么反应？", p: "模型收到 `Permission denied.` 会**换一种方式达成目标**：换个安全命令、或先向你解释为什么要这个操作。\n\n这就是权限系统和模型之间的**反馈循环**——拒绝消息要写得可理解、可行动。" },
        { t: "text", h: "核心设计决策", p: "**权限在 harness 层，模型专注决策，安全由基础设施负责**——两者解耦。\n\n安全边界不是模型的负担，而是环境的属性。" },
        { t: "audio", src: "audio/s03-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么说拒绝列表不是完整的安全边界？因为它是字符串匹配，聪明一点的命令换个写法就能绕过，比如在 rm 和 -rf 中间加个空格或者换个引号，黑名单就认不出来了。所以它只能做兜底，真正的安全要靠多层防御，这也是为什么需要规则和审批。第二，为什么审批默认是拒绝？你看代码，ask user 里检查的是 choice 是不是 y 或者 yes，其他的全都算拒绝。这是安全设计里的默认拒绝原则：拿不准就拦下来，宁可错拦，不可错放。误伤顶多是多问一次，放错了可能就是事故。第三，一个产品细节：权限被拒绝之后，模型收到的是 Permission denied 这个消息。模型会怎么做？它会换一种方式达成目标，比如换个安全的命令，或者向你解释为什么需要这个操作。这就是权限系统和模型之间的反馈循环。最后记住核心设计决策：权限这道门放在 harness 层，模型只需要专注决策，安全边界由基础设施负责，两者解耦。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "为什么权限系统用「三层闸门」而不是一个统一的黑名单？", a: "黑名单有两个硬伤：**永远列不全**（危险操作无限多）且**字符串匹配可绕过**。\n\n三层闸门是分层思路：① 静态黑名单兜住「永远不行」的；② 规则匹配自动化处理「看上下文」的（如写工作区外、危险命令），减少人工打扰；③ 用户审批兜住「机器判断不了」的，把决策交给当下的人。\n\n本质是**安全与效率的平衡**：越靠前的层越便宜、越机械；越靠后的层越贵、越智能。产品上对应「自动放行 / 弹窗询问 / 直接拒绝」三种体验。" },
        { t: "qa", q: "「默认拒绝」为什么比「默认允许」安全？产品上如何平衡体验？", a: "默认拒绝：拿不准就拦，**误伤代价是一次询问**；默认允许：拿不准就放，**误伤代价可能是一次事故**。两者不对称，所以安全系统一律默认拒绝。\n\n产品上的平衡手段：① 分级规则——把高频安全操作设为自动允许（如读文件、查目录），只对危险类弹窗；② 记忆用户选择——同一操作同意过一次就不再问；③ 审计日志——所有审批留痕，可追溯。核心是让用户只在他真正该做决定的时候做决定。" },
        { t: "qa", q: "（难点）权限被拒绝后 agent 会怎么反应？这对权限设计有什么启示？", a: "模型收到 `Permission denied.` 后通常：① 换个安全的命令继续（如改用受限参数）；② 停下来向用户解释「我需要这个权限是因为…」；③ 改变策略绕路完成目标。\n\n启示：**权限反馈是产品闭环的一部分**——拒绝消息要说明原因、给出可行动的方向，而不是简单挡掉。好的权限设计是 agent 的「护栏」不是「笼子」：它让模型更谨慎、更会沟通，而不是寸步难行。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s03_permission/code.py\n```\n\n试试这些 prompt：\n\n1. `Create a file called test.txt in the current directory`（应该直接通过）\n2. `Delete the file test.txt`（bash + rm 会触发闸门 2）\n3. `What files are in the current directory?`（只读，全部通过）\n4. `Try to write a file to /etc/something`（写工作区外，触发闸门 2）\n\n**观察重点**：哪些操作直接通过？哪些需要你确认？哪些被直接拒绝？" },
        { t: "audio", src: "audio/s03-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。工具执行之前，加上三道闸门：硬拒绝列表直接拦，规则匹配交给审批，用户同意才放行。三道都没命中，直接执行。整个循环只加了一行代码，安全边界就从代码内部的薄弱黑名单，升级成了有用户参与的多层防线。建议你到试一下板块跑一跑，重点体验三种结果：直接通过的操作、需要你确认的操作、被直接拒绝的操作。你会发现，有了权限系统，你才敢让模型真正放手干活。下一课，我们看看循环里慢慢变多的这类扩展逻辑，怎么用钩子的方式挂上去，让循环保持干净。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "权限检查是硬编码在循环里的。如果还想在工具执行前后加日志、在某些操作后自动触发 git commit……这些扩展逻辑会越来越多，循环很快就膨胀。\n\n**下一课 s04 Hooks** → 给循环加钩子，扩展逻辑挂在钩子上，循环保持干净。" },
        { t: "tip", text: "一句话记住 S03：**执行前过三道闸门——拒绝列表、规则匹配、用户审批，默认拒绝。** 权限在 Harness 层，模型专注决策。" }
      ]
    },
    {
      id: "s04",
      num: "04",
      title: "Hooks",
      desc: "挂在循环上，不写进循环里",
      color: "#f59e0b",
      blocks: [
        { t: "lead", text: "第四课把扩展逻辑从循环里拿出来：**hook 挂在循环上，不写进循环里**——注册表 + 四个事件，循环只调 `trigger_hooks()`。" },

        { t: "section", icon: "❓", title: "问题：每次加功能都要改循环，循环快认不出来了" },
        { t: "text", h: "核心问题", p: "想加「记录每次 bash 调用」「操作后自动 git add」……每加一个功能都要改 `agent_loop`：\n\n```python\nlog_to_file(block)      # 加一行\ncheck_permission(block) # 加一行\nnotify_slack(block)     # 又加一行\noutput = execute(block)\nauto_git_add(block)     # 再加一行\n```\n\n**你想扩展的是 Agent 的行为，但改的却是循环本身。** 循环应该稳定，扩展应该挂在外面。" },
        { t: "audio", src: "audio/s04-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第四课，Hooks，钩子。上一课我们给循环加了权限检查，效果很好，但问题也随之而来：每加一个新功能，比如记录每次 bash 调用、操作完自动 git add，都要直接修改 agent loop 这个函数。今天加一行日志，明天加一行通知，后天再加一个检查，循环很快就变得面目全非。你想扩展的是 agent 的行为，但你改的却是循环本身。循环应该是稳定的核心，就像发动机，你总不能为了加一个后视镜就把发动机拆开。这一课的做法，就是把所有扩展逻辑从循环里拿出来，挂到循环外面的事件钩子上。循环只负责喊一声，谁想听谁就来。" },

        { t: "section", icon: "💡", title: "解决方案：hook 注册表 + 四个事件" },
        { t: "table", head: ["事件", "触发时机", "典型用途"], rows: [["UserPromptSubmit", "用户输入提交后、进 LLM 前", "输入验证、注入上下文"], ["PreToolUse", "工具执行前", "权限检查、日志记录"], ["PostToolUse", "工具执行后", "副作用（自动 git add）、输出检查"], ["Stop", "循环即将退出时", "收尾清理、决定是否继续循环"]] },
        { t: "text", h: "返回值协议（控制流核心）", p: "`trigger_hooks()` 按注册顺序执行回调，**第一个返回非 `None` 的值会短路返回**：\n\n- `PreToolUse` 返回非 `None` → 阻止本次工具执行\n- `Stop` 返回非 `None` → 强制循环继续（把返回值当消息喂回）\n- `UserPromptSubmit` / `PostToolUse` 返回值**不参与控制流**" },
        { t: "svg", caption: "四个 hook 覆盖 agent 完整生命周期", svg: `<svg viewBox='0 0 680 300' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><rect x='30' y='30' width='150' height='46' rx='9' fill='#fef3c7' stroke='#f59e0b' stroke-width='1.5'/><text x='105' y='48' fill='#78350f' font-weight='600'>① UserPromptSubmit</text><text x='105' y='65' fill='#b45309' font-size='11'>输入提交后 / 进 LLM 前</text><line x1='180' y1='53' x2='238' y2='53' stroke='#6366f1' stroke-width='1.5' marker-end='url(#a1)'/><defs><marker id='a1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6366f1'/></marker></defs><rect x='240' y='30' width='160' height='46' rx='9' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='320' y='48' fill='#1e1b4b' font-weight='600'>大模型 (LLM)</text><text x='320' y='65' fill='#6366f1' font-size='11'>生成工具调用</text><line x1='400' y1='53' x2='458' y2='53' stroke='#6366f1' stroke-width='1.5' marker-end='url(#a1)'/><rect x='460' y='30' width='190' height='46' rx='9' fill='#fef2f2' stroke='#ef4444' stroke-width='1.5'/><text x='555' y='48' fill='#991b1b' font-weight='600'>② PreToolUse</text><text x='555' y='65' fill='#ef4444' font-size='11'>工具执行前 / 权限+日志</text><line x1='555' y1='76' x2='555' y2='110' stroke='#6366f1' stroke-width='1.5' marker-end='url(#a1)'/><rect x='430' y='112' width='250' height='42' rx='9' fill='#ecfdf5' stroke='#10b981' stroke-width='1.5'/><text x='555' y='130' fill='#065f46' font-weight='600'>执行工具 (TOOL_HANDLERS)</text><text x='555' y='146' fill='#059669' font-size='11'>结果收集</text><line x1='555' y1='154' x2='555' y2='186' stroke='#6366f1' stroke-width='1.5' marker-end='url(#a1)'/><rect x='460' y='188' width='190' height='46' rx='9' fill='#e0f2fe' stroke='#0ea5e9' stroke-width='1.5'/><text x='555' y='206' fill='#0c4a6e' font-weight='600'>③ PostToolUse</text><text x='555' y='223' fill='#0284c7' font-size='11'>工具执行后 / 副作用</text><path d='M 555 234 L 555 260 L 320 260 L 320 78' fill='none' stroke='#94a3b8' stroke-width='1.3' stroke-dasharray='6,4' marker-end='url(#a1)'/><text x='430' y='252' fill='#94a3b8' font-size='11'>结果喂回 → 再问 LLM</text><rect x='30' y='240' width='150' height='46' rx='9' fill='#f3e8ff' stroke='#a855f7' stroke-width='1.5'/><text x='105' y='258' fill='#581c87' font-weight='600'>④ Stop</text><text x='105' y='275' fill='#9333ea' font-size='11'>循环退出前 / 收尾</text></g></svg>` },
        { t: "code", lang: "python", code: `HOOKS = {
    "UserPromptSubmit": [], "PreToolUse": [],
    "PostToolUse": [], "Stop": [],
}

def register_hook(event: str, callback):
    HOOKS[event].append(callback)

def trigger_hooks(event: str, *args):
    for callback in HOOKS[event]:
        result = callback(*args)
        if result is not None:      # 返回非 None → hook 说"停"
            return result
    return None

# 挂载：权限 + 日志 + 大输出提醒 + 收尾统计
register_hook("PreToolUse", permission_hook)   # s03 的权限逻辑移到 hook
register_hook("PreToolUse", log_hook)
register_hook("PostToolUse", large_output_hook)
register_hook("Stop", summary_hook)

# 循环里只改一处：硬编码 → trigger_hooks
for block in tool_calls:
    blocked = trigger_hooks("PreToolUse", block)   # s03: check_permission(block)
    if blocked:
        results.append({"type": "tool_result", "tool_use_id": block.id,
                        "content": str(blocked)})
        continue
    handler = TOOL_HANDLERS.get(block.name)
    output = handler(**block.input) if handler else f"Unknown: {block.name}"
    trigger_hooks("PostToolUse", block, output)
    results.append(...)

# 退出前：Stop hook 可返回消息强制继续
if not tool_calls:
    force = trigger_hooks("Stop", messages)
    if force:
        messages.append({"role": "user", "content": force})
        continue
    return` },
        { t: "audio", src: "audio/s04-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案是引入 hook 注册表。核心是四个事件，正好覆盖 agent 完整的一生：用户输入提交后、进入大模型之前，触发 UserPromptSubmit，典型用途是输入验证和注入上下文；工具执行之前，触发 PreToolUse，典型用途是权限检查和日志；工具执行之后，触发 PostToolUse，典型用途是副作用，比如自动提交代码、检查输出；循环即将退出时，触发 Stop，典型用途是收尾统计，甚至可以决定要不要继续跑。实现上是一个字典，事件名映射到回调列表。你要加扩展，就调用 register hook 把回调挂到对应事件上；循环里只调用 trigger hooks，把所有回调跑一遍。这一课最关键的设计是返回值协议：hook 返回非空值，就代表这个 hook 有话要说，PreToolUse 返回非空会阻止工具执行，Stop 返回非空会让循环继续；而另外两个事件的返回值不参与控制流。" },

        { t: "section", icon: "⚙️", title: "工作原理：注册表、回调、控制流" },
        { t: "text", h: "", p: "- **注册表**：字典 `event → [callbacks]`，`register_hook()` 追加，`trigger_hooks()` 顺序执行、遇非 `None` 短路\n- **PreToolUse 示例**：`permission_hook`（s03 逻辑搬来）、`log_hook`（打印 `[HOOK]` 日志）、`large_output_hook`（输出 >100000 字符时警告）\n- **Stop 示例**：`summary_hook` 统计本轮 `tool_result` 数量；返回字符串 = 强制续跑\n- **循环零侵入**：只调用 `trigger_hooks()`，不感知任何具体扩展" },
        { t: "audio", src: "audio/s04-03.mp3", title: "讲解 · 工作原理", transcript: "我们深入看工作原理。先看注册表本身，一个字典，四个键，每个键对应一个回调列表。register hook 就是往对应列表里追加回调，trigger hooks 就是按顺序把所有回调跑一遍，只要有一个返回非空，立刻停止并返回那个值。这个返回值协议是整套机制的控制核心。然后看几个具体的 hook。权限检查从上一课移过来了，变成了 permission hook：bash 命令命中黑名单就返回拒绝消息，文件工具越界就问用户，同意才放行。再看日志 hook，每次工具调用前打印一行。还有大输出提醒，如果工具输出超过十万字符就警告。最后是 Stop 钩子，统计这次会话一共用了多少次工具调用。这些钩子挂上去之后，循环变得非常干净：执行工具之前，trigger hooks PreToolUse，返回非空就跳过；执行之后，trigger hooks PostToolUse；没有工具调用了，退出之前 trigger hooks Stop，如果它返回了消息，就把消息喂回给模型继续循环。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：事件驱动架构在 agent 里的落地", p: "循环是**事件源**，hook 是**订阅者**，通过事件解耦——观察者模式。\n\nClaude Code、CI 系统、浏览器插件全是这个思路。" },
        { t: "text", h: "② 一个类比：插座与电器", p: "hook 是插座，循环是电路。插座位置固定，但插什么电器由你决定：加摄像头、加音响，不需要改电路。\n\n想加什么能力，插上对应的钩子就行。" },
        { t: "text", h: "③ 延伸：为什么 hook 对 agent 产品至关重要", p: "agent 能力会被不断扩展：日志、审计、监控、权限、自动提交。全部写进核心循环 → 无法维护。\n\n**产品启示：好的架构让功能像插件一样长出来，而不是焊死在骨架上**——团队可并行开发、各自挂事件互不干扰。" },
        { t: "audio", src: "audio/s04-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，hook 机制的本质，是事件驱动架构在 agent 里的落地。循环是事件源，钩子是订阅者，两者通过事件解耦。这是软件开发里最经典的观察者模式，Claude Code、各种 CI 系统、浏览器插件，全都是这个思路。第二，打个比方，hook 就像插座，循环是电路，插座的位置是固定的，但插什么电器由你决定。你想加摄像头就插摄像头，想加音响就插音响，不需要改动电路本身。第三，延伸一下，为什么这个设计对 agent 产品特别重要？因为 agent 的能力会被不断扩展：日志、审计、监控、权限、自动提交，这些功能如果都写进核心循环，任何产品都没法维护。hook 让产品团队可以并行开发各种能力，各自挂在事件上互不干扰。对产品经理来说，这一课要记住的是：好的架构是让功能像插件一样长出来，而不是把功能焊死在骨架上。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么用「返回值协议」统一控制，而不是每个事件各写一套", p: "统一协议让机制**简单可预测**：返回非 `None` 就是有话要说，具体语义由事件类型决定。\n\n每个事件各写一套 → 学习成本与出错概率飙升。" },
        { t: "text", h: "难点 2：为什么 UserPromptSubmit / PostToolUse 的返回值不参与控制流", p: "这两个事件天生是**旁路**：输入验证可以改内容但不会拒绝任务，输出检查只是看看不会撤回结果。\n\n真正能改变流程的只有「执行前拦截」和「退出前挽留」。" },
        { t: "text", h: "易错点 3：同事件挂多个回调，顺序和隔离谁负责？", p: "课程按**注册顺序**执行，第一个返回非空的优先。\n\n真实产品需要：hook 优先级、回调隔离（一个回调抛错不拖垮其他）、失败可观测。" },
        { t: "text", h: "核心设计决策", p: "**循环只负责触发，逻辑全在回调里**——循环稳定，能力持续生长。\n\n扩展点不侵入核心，这是 agent 可扩展性的基石。" },
        { t: "audio", src: "audio/s04-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么 hook 用返回值协议来控制流程，而不是每个事件各写一套？因为统一协议让机制简单可预测：返回非空就是有话要说，具体怎么处理由事件类型决定。PreToolUse 的非空等于拦下，Stop 的非空等于继续。如果每个事件定义一套不同的控制方式，学习成本和出错概率都会上升。第二，一个容易混淆的点：UserPromptSubmit 和 PostToolUse 的返回值为什么不参与控制流？因为这两个事件天生是旁路，输入验证可以改内容但不会拒绝任务，输出检查只是看看不会撤回结果。真正能改变流程的，只有执行前的拦截和退出前的挽留。第三，产品视角的难点：hook 的顺序问题。同一个事件挂多个回调，比如日志和权限都挂在 PreToolUse，先跑哪个？课程里按注册顺序执行，第一个返回非空的优先。真实产品里 hook 需要定义优先级，还要防止回调之间互相影响。最后记住核心设计：循环只负责触发，逻辑全在回调里，循环保持稳定，能力持续生长。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "hook 机制解决的核心问题是什么？为什么不能继续硬编码？", a: "解决**扩展与核心的解耦**（开闭原则：对扩展开放、对修改关闭）。\n\n硬编码的问题：每加一个能力就改一次循环，循环快速膨胀、不可维护；多个团队改同一文件 → 冲突不断；核心逻辑被埋在业务细节里，出问题难定位。\n\nhook 的价值：核心循环只调用 `trigger_hooks()` 一个入口，能力以回调方式注册，增删能力不动核心。对应到产品：agent 的日志、审计、权限、自动化等能力可**并行研发、按需插拔**。" },
        { t: "qa", q: "为什么 PreToolUse 和 Stop 的返回值能控制流程，UserPromptSubmit / PostToolUse 不能？", a: "由**事件的语义位置**决定：\n\n- `PreToolUse` 在动作发生前 → 返回非空 = **拦下动作**（阻止执行）；\n- `Stop` 在循环退出前 → 返回非空 = **挽留循环**（注入消息续跑）；\n- `UserPromptSubmit` 在输入侧 → 只能**修改/补充输入**，不能拒绝任务；\n- `PostToolUse` 在动作完成后 → 只能**观察/记录**，不能撤回结果。\n\n设计原则：只有「临门一脚」的位置才有资格改变流程；旁路事件保持无副作用，让机制可预测。" },
        { t: "qa", q: "（难点）设计一个 hook 系统，有哪些工程与产品考量？", a: "工程：① **顺序与优先级**——同事件多回调的执行序（注册序/优先级字段）；② **隔离**——单个回调抛错不影响其他回调与主循环；③ **失败可观测**——hook 运行要有日志与审计；④ **幂等**——副作用类 hook（如自动 git add）不能重复触发。\n\n产品：① **事件命名与文档**——让第三方开发者理解在何时挂什么钩子；② **控制流透明**——用户能感知「哪个 hook 拦下了我的操作」（对应到 UI 是权限弹窗、审计面板）；③ **扩展生态**——开放的 hook 注册表是 agent 插件化的基础（后续 s14 MCP 是协议级扩展）。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s04_hooks/code.py\n```\n\n试试这些 prompt：\n\n1. `Read the file README.md`（应该直接通过，观察 hook 日志）\n2. `Create a file called test.txt`（通过后观察 PostToolUse 是否触发）\n3. `Delete all temporary files in /tmp`（bash + rm 触发权限 hook）\n\n**观察重点**：每次工具执行前，是否出现了 `[HOOK]` 日志？权限被拒时，是 hook 拦截的还是循环里硬编码的？" },
        { t: "audio", src: "audio/s04-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。循环这个核心，从此不再被各种扩展逻辑侵入。四个事件覆盖 agent 的完整生命周期：输入提交、工具执行前、工具执行后、循环退出。你要加任何能力，注册一个 hook 就行：加日志、加审计、加自动提交、加权限，全都挂在钩子上，循环只负责喊一声。建议你到试一下板块跑一跑，重点观察两件事：每次工具执行前，是不是都出现了带 HOOK 标记的日志；权限被拦截的时候，是 hook 拦的，还是循环里硬编码拦的。看完你就明白，一个稳定的循环加上一群听话的钩子，就是 agent 可扩展性的基础。下一课，我们要给 agent 一个更厉害的能力：自己列计划，然后照着计划干活。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "Agent 现在能安全执行操作了。但拿到一个复杂任务，它是一上来就动手，还是**先列个计划再动手**？\n\n**下一课 s05 Todo Write** → 给 Agent 一个计划工具：先列清单，再做。" },
        { t: "tip", text: "一句话记住 S04：**循环只调 trigger_hooks()，扩展全挂在钩子上。** 四个事件覆盖 agent 一生：输入 → 执行前 → 执行后 → 退出。" }
      ]
    },
    {
      id: "s05",
      num: "05",
      title: "TodoWrite",
      desc: "先列计划，再做",
      color: "#10b981",
      blocks: [
        { t: "lead", text: "第五课给 Agent 一个**计划工具**：`todo_write` + reminder 提醒器——先列步骤再动手，长任务不再做着做着就偏。" },

        { t: "section", icon: "❓", title: "问题：没有计划的 Agent，做着做着就偏了" },
        { t: "text", h: "核心问题", p: "任务：「把所有 Python 文件改成 snake_case 命名，跑测试，修好失败。」\n\n- Agent 改了 3 个文件 → 跑测试发现 2 个失败 → 开始修 → **忘了最初的 snake_case 目标**\n- 对话越长越严重：工具结果不断填满上下文，**系统提示的影响力被稀释**\n- 一个 10 步重构，做完 1-3 步就开始即兴发挥，因为 4-10 步已被挤出注意力\n\n**计划不是可选项，而是长任务的必需品。**" },
        { t: "audio", src: "audio/s05-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第五课，TodoWrite，计划工具。上一课我们学会了用钩子扩展循环，这一课要解决一个更隐蔽的问题：agent 没有计划，做着做着就偏了。想象你给它一个复杂任务：把所有 Python 文件改成蛇形命名，然后跑测试，修好失败。它开始干活，改了三个文件，跑测试发现两个失败，开始修。修着修着，它忘了最初的目标是改命名，测试失败把它的注意力全吸走了。对话越长，这个问题越严重：工具结果不断填满上下文，系统提示的影响力被一点点稀释。一个十步的重构，做完一到三步就开始即兴发挥，因为后面四到十步已经被挤出注意力了。这就像一个人进了超市，本来要买牛奶和鸡蛋，路过零食区就忘了正事。解决方案不是换一个更聪明的模型，而是给它一个外部计划，让它随时能看得到自己该干什么。" },

        { t: "section", icon: "💡", title: "解决方案：todo_write 工具 + reminder 提醒器" },
        { t: "text", h: "两个关键机制", p: "- **`todo_write`**：新工具，Agent 用它**列计划、更新状态**（pending → in_progress → completed）——实际工作仍由原有工具完成\n- **Reminder**：连续 3 个工具调用轮次没用 `todo_write`，Harness 就把 `<reminder>Update your todos.</reminder>` 追加进第三轮结果，然后计数器清零" },
        { t: "svg", caption: "Todo 状态机：三态流转", svg: `<svg viewBox='0 0 680 190' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><rect x='60' y='60' width='160' height='56' rx='12' fill='#f1f5f9' stroke='#94a3b8' stroke-width='1.5'/><text x='140' y='82' fill='#334155' font-weight='600'>[ ] pending</text><text x='140' y='100' fill='#94a3b8' font-size='11'>待办</text><line x1='220' y1='88' x2='268' y2='88' stroke='#6366f1' stroke-width='1.6' marker-end='url(#t1)'/><defs><marker id='t1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6366f1'/></marker></defs><text x='244' y='78' fill='#6366f1' font-size='11'>开始做</text><rect x='270' y='60' width='160' height='56' rx='12' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='350' y='82' fill='#1e1b4b' font-weight='600'>[>] in_progress</text><text x='350' y='100' fill='#6366f1' font-size='11'>进行中（唯一）</text><line x1='430' y1='88' x2='478' y2='88' stroke='#10b981' stroke-width='1.6' marker-end='url(#t1)'/><text x='454' y='78' fill='#059669' font-size='11'>做完</text><rect x='480' y='60' width='160' height='56' rx='12' fill='#ecfdf5' stroke='#10b981' stroke-width='1.5'/><text x='560' y='82' fill='#065f46' font-weight='600'>[x] completed</text><text x='560' y='100' fill='#059669' font-size='11'>已完成</text><path d='M 560 116 C 560 150, 140 150, 140 116' fill='none' stroke='#94a3b8' stroke-width='1.3' stroke-dasharray='6,4' marker-end='url(#t1)'/><text x='350' y='164' fill='#94a3b8' font-size='11'>看下一个 pending → 继续</text><rect x='20' y='30' width='640' height='20' rx='5' fill='#fef3c7'/><text x='340' y='44' fill='#b45309' font-size='11'>连续 3 轮不用 todo_write → Harness 注入 reminder，计数器清零</text></g></svg>` },
        { t: "code", lang: "python", code: `class TodoManager:
    def __init__(self):
        self.items = []

    def update(self, todos) -> str:
        # 校验规则：≤20 项；content 非空；status ∈ pending/in_progress/completed；
        # 同一时间只能有一个 in_progress；字符串解析用 JSON / ast.literal_eval（不用 eval）
        ...
        self.items = validated
        return self.render()

    def render(self) -> str:
        return "\\n".join(f"{marker} {t['content']}" for t in self.items)  # [ ] [>] [x]

TODO = TodoManager()
TOOL_HANDLERS["todo_write"] = run_todo_write

# Reminder：连续 3 轮没用 todo_write → 注入提醒
rounds_since_todo = 0 if used_todo else rounds_since_todo + 1
if rounds_since_todo >= 3:
    results.append({"type": "text", "text": "<reminder>Update your todos.</reminder>"})
    rounds_since_todo = 0` },
        { t: "audio", src: "audio/s05-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案是给 agent 一个计划工具，todo write。它保留上一课的工具分发、权限检查和 hooks，只新增一个工具。todo write 做的事情非常纯粹：管理一份任务清单。agent 收到复杂任务后的典型流程是这样的：先调用 todo write，列出所有步骤，全部标记为待办；然后开始做第一步，把它标记为进行中；做完改成已完成；接着看下一个待办，继续。除了工具本身，还有一个配套的提醒机制：连续三个工具调用轮次都没有使用 todo write，harness 就会在第三轮的结果里追加一条提醒，告诉模型，更新一下你的任务清单，然后计数器清零。注意，todo write 不给 agent 增加任何执行能力，它增加的是规划能力。工具本身不能创建文件、不能跑命令，它只是让 agent 的意图变得可见、可追踪，让模型自己对自己的计划负责。" },

        { t: "section", icon: "⚙️", title: "工作原理：TodoManager + 校验 + reminder" },
        { t: "text", h: "", p: "- **TodoManager**：内存任务列表，`update()` 校验后整体替换，`render()` 渲染 `[ ]` / `[>]` / `[x]` + `(done/total completed)`\n- **校验规则**：最多 20 项；每项 `content` 非空；`status` 三选一；**同时只有一个 in_progress**；字符串解析用 JSON / `ast.literal_eval`（**不用 `eval`**，避免注入）\n- **Reminder 计数**：`used_todo` 每轮置位；3 轮未用 → 追加 `<reminder>` 文本块进工具结果 → 清零\n- **SYSTEM 提示**：加入「先计划再执行」引导\n- **关键洞察**：todo_write 增加的是**规划能力**，不是执行能力" },
        { t: "audio", src: "audio/s05-03.mp3", title: "讲解 · 工作原理", transcript: "我们深入看工作原理。核心是一个 TodoManager 类，它持有内存里的任务列表。update 方法负责校验和更新：校验规则有四条，一次更新最多二十项，每一项都必须有非空的 content，status 只能是 pending、in_progress、completed 三选一，并且同一时间只能有一个进行中的任务。如果模型传过来的是字符串，解析用的是 JSON 或者 Python 的字面量解析，绝不使用 eval，因为 eval 会执行任意代码，是安全漏洞。校验通过后整体替换旧列表，然后 render 方法把它渲染成人类可读的清单，待办是方括号空格，进行中是方括号大于号，已完成是方括号叉，最后还会附上一行完成统计。run todo write 把这个渲染结果返回给模型，同时打印到终端。工具定义跟其他五个工具一起放进分发表，这就是全部。Reminder 的逻辑在循环里：每一轮检查这一轮有没有用过 todo write，用过就清零计数器，没用过就加一，加到三就注入提醒。agent 的整个计划能力，就是这么简单直白。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：把「注意力」外置", p: "模型的上下文是**有限的工作记忆**，工具结果一多，早期目标就被挤出去。\n\ntodo_write 把计划**外置**到模型随时可见的地方——不靠记忆，靠工具。" },
        { t: "text", h: "② 一个类比：购物清单", p: "进超市前写下清单，就不会在零食区忘了牛奶。\n\n清单本身不帮你拿东西（执行），但它**防止你走偏**（规划）。" },
        { t: "text", h: "③ 延伸：为什么「规划能力≠执行能力」很重要", p: "给 agent 加能力有两种：执行型（多一个能干活的手）和规划型（多一个会想事的脑）。\n\n**产品启示**：先补规划型能力，执行型工具再多，没有计划也会乱套。人类协作同理：先对齐目标，再分工干活。" },
        { t: "audio", src: "audio/s05-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质，是把注意力外置。模型的上下文是有限的工作记忆，工具结果一多，早期的目标就被挤出去了。todo write 把计划外置到一个模型随时能看见的地方，不靠记忆，靠工具。这就像考试的时候把关键公式写在草稿纸上，而不是全靠脑子记。第二，打个比方，这就是购物清单。进超市之前写下清单，就不会在零食区忘了买牛奶。清单本身不帮你拿东西，那是执行；它防止你走偏，这才是规划。第三，延伸一下，给 agent 加能力有两种：执行型，多一个能干活的手；规划型，多一个会想事的脑。这一课想强调的是，先补规划型能力，因为执行型工具再多，没有计划也会乱套。人类协作也是一样：先对齐目标，再分工干活。对产品经理来说，判断一个 agent 产品靠不靠谱，先看它有没有计划能力，再看它有多少工具，这个顺序很重要。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么 Reminder 是「每 3 轮注入」而不是更频繁？", p: "太频繁 → 打断模型工作流、浪费 token、变成噪音；太稀疏 → 防不住走偏。\n\n3 轮是**成本与效果的平衡点**——注意力还没丢太久，就把目标拉回来。" },
        { t: "text", h: "难点 2：为什么「同一时间只能有一个 in_progress」？", p: "强制 agent **串行聚焦**：一个没做完就开下一个，等于没有计划。\n\n单进行中项也让渲染和追踪更简单、可预期。" },
        { t: "text", h: "易错点 3：字符串解析为什么用 literal_eval 而不是 eval？", p: "`eval` 会执行任意代码——模型传一段恶意字符串就直接注入。\n\n`ast.literal_eval` 只解析字面量（列表/字典/数字/字符串），**无执行副作用**。" },
        { t: "text", h: "核心设计决策", p: "**计划是状态，不是一次性提示。** todo_write 用带状态的结构（三态+进度统计）让计划持续在场；reminder 在它缺席时把它拉回来。" },
        { t: "audio", src: "audio/s05-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么提醒是每三轮注入一次，而不是更频繁？如果每一轮都提醒，模型的工作流会被反复打断，浪费 token，提醒变成噪音；如果太稀疏，又防不住走偏。三轮是一个平衡点：注意力还没有丢太久，就把目标拉回来。第二，为什么同一时间只能有一个进行中的任务？这是强制 agent 串行聚焦。一个没做完就开下一个，等于没有计划。单进行中项也让渲染和追踪更简单、更可预期。第三，一个安全细节：字符串解析为什么用 ast 的 literal eval，而不是 eval？因为 eval 会执行任意代码。模型是被外部输入驱动的，如果它传进来一段恶意字符串，eval 就会真的执行。literal eval 只解析字面量，没有执行副作用，这是底线。最后记住核心设计：计划是状态，不是一次性提示。todo write 用带状态的结构让计划持续在场，reminder 在计划缺席的时候把它拉回来。执行能力不变，规划能力上线。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "为什么 Agent 做长任务会「走偏」？todo_write 是如何解决的？", a: "走偏的根源：模型的上下文是**有限工作记忆**，工具结果不断累积，早期目标（系统提示中的指令）被后续信息稀释挤出。\n\ntodo_write 的解法：把计划**外置为可见状态**——Agent 每一步都能通过工具看到「我还有哪些没做」，从依赖记忆变成依赖工具；reminder 机制在 Agent 连续 3 轮不碰计划时主动拉回注意力。\n\n本质：**不提升模型的记忆容量，而是降低对记忆的依赖**。产品上对应：目标可视化（进度看板）+ 偏差提醒（防走偏机制）。" },
        { t: "qa", q: "「todo_write 增加的是规划能力而不是执行能力」，这句话怎么理解？", a: "执行能力 = 能对世界产生实际效果的工具（bash 改文件、write_file 建文件）；规划能力 = 让 Agent 的意图可见、可追踪的状态（TODO 列表）。\n\ntodo_write 本身不能创建文件、不能跑命令，它只改变 Agent 的**行为方式**：先列步骤、按步执行、更新状态、可见进度。\n\n产品启示：给 Agent 加能力时先判断补的是「手」还是「脑」。很多产品疯狂加工具（手），但 Agent 没有计划（脑），工具越多越乱。好的产品先让 Agent 会规划，再让它会干活。" },
        { t: "qa", q: "（难点）TodoManager 的校验规则有哪些？为什么字符串解析不用 eval？", a: "规则：① ≤20 项；② content 非空；③ status 必须是 pending/in_progress/completed；④ 同一时间只能有一个 in_progress。\n\n不用 eval：eval 会执行任意代码——模型输入不可信，恶意字符串（如 `__import__('os').system(...)`）会被直接执行，形成**代码注入**。\n\n正确做法：JSON 解析 + `ast.literal_eval`（只解析字面量，无副作用）。这是 LLM 工具系统的通用安全底线——**任何来自模型/用户的内容都不能进 eval**。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s05_todo_write/code.py\n```\n\n试试这些 prompt：\n\n1. `Refactor s05_todo_write/example/hello.py: add type hints, docstrings, and a main guard`（先列 3 步再执行）\n2. `Create a Python package under s05_todo_write/example/demo_pkg with __init__.py, utils.py, and tests/test_utils.py`\n3. `Review Python files under s05_todo_write/example and fix any style issues`\n\n**观察重点**：第一次工具调用是不是 `todo_write`？TODO 列了几步？执行过程中状态有没有从 `pending` → `in_progress` → `completed`？" },
        { t: "audio", src: "audio/s05-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。给 agent 加一个计划工具，todo write，再加一个提醒器：连续三轮不用计划就提醒它。校验规则保证计划是干净的结构，最多二十项、状态合法、同时只有一个进行中。这一课最关键的洞察是：todo write 增加的是规划能力，不是执行能力。它不会让 agent 更会干活，但会让它干活不跑偏。建议你到试一下板块跑一跑，重点观察三件事：第一次工具调用是不是 todo write；计划列了几步；执行过程中状态有没有按待办、进行中、已完成流转。看到模型老老实实按清单推进，你就明白计划工具的分量了。下一课，我们要解决另一个问题：任务太大，一个 agent 装不下，怎么办？答案是派出子 agent。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "Agent 能计划了。但如果任务太大——比如「重构整个认证模块」——一个对话装不下几十个小任务，上下文会互相污染。\n\n**下一课 s06 Subagent** → 把大任务拆成子任务，每个子任务派一个独立 Agent，各占一个干净上下文。" },
        { t: "tip", text: "一句话记住 S05：**先列清单，再做。** todo_write 增加的是规划能力（不靠记忆靠工具），连续 3 轮不用就提醒——计划是状态，不是一次性提示。" }
      ]
    },
    {
      id: "s06",
      num: "06",
      title: "Subagent",
      desc: "子任务独立上下文",
      color: "#a855f7",
      blocks: [
        { t: "lead", text: "第六课给大任务开一条**独立上下文**：`task` 工具派出 Subagent，用全新的 `messages[]` 处理子任务，只把最终文本带回父循环。" },

        { t: "section", icon: "❓", title: "问题：中间细节全堆在父上下文里" },
        { t: "text", h: "核心问题", p: "Agent 修 bug 时要追踪调用链，读了很多文件：\n\n- 每次工具调用和结果都留在父循环的 `messages[]` 里\n- 调用链弄清后，**多数中间细节不再需要，却仍然占用上下文**\n\n对话越来越重、越来越慢、越来越容易走偏——**父上下文成了稀缺资源，需要按需隔离。**" },
        { t: "audio", src: "audio/s06-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第六课，Subagent，子智能体。前面几课我们一直在解决上下文的问题：第五课用计划工具防止模型在长任务里走偏，但还有一个更根本的问题：对话本身会越来越臃肿。比如 agent 在修一个 bug，为了追踪调用链，它读了许多文件。每一次工具调用和结果都会留在父循环的消息列表里。等到调用链终于弄清楚了，那些中间读过的文件内容其实大多不再需要，但它们仍然占着上下文。上下文一满，模型就看不全重要的信息，思考质量下降，每一轮调用也变慢、变贵。这就像你的办公桌堆满了翻过的资料，真正要用的时候反而找不着。这一课的解法很直接：给子任务一段独立的上下文，干完活只交一份总结回来，中间过程不占父上下文。" },

        { t: "section", icon: "💡", title: "解决方案：task 工具 → 嵌套 Agent Loop" },
        { t: "text", h: "核心机制", p: "调用 `task` 时，**同步运行一个使用全新 `messages[]` 的嵌套 Agent Loop**：\n\n1. 子 Agent 从干净上下文开始，拥有 5 个基础工具（**没有 task**，只允许一层委派）\n2. 循环结束后，**只把最终文本**作为工具结果返回给父对话\n3. 隔离的是**消息**，不是进程或文件系统——父子共享 `WORKDIR` 与权限/生命周期 Hooks" },
        { t: "svg", caption: "父循环 ↔ 子循环：消息隔离、文件共享", svg: `<svg viewBox='0 0 680 250' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><rect x='30' y='30' width='250' height='170' rx='12' fill='#faf5ff' stroke='#a855f7' stroke-width='1.5'/><text x='155' y='52' fill='#581c87' font-weight='600'>父 Agent（父 messages[]）</text><text x='155' y='68' fill='#9333ea' font-size='11'>5 工具 + task</text><rect x='55' y='84' width='200' height='30' rx='6' fill='#f3e8ff'/><text x='155' y='104' fill='#581c87' font-size='12'>task("去读 s01 的代码…")</text><rect x='55' y='124' width='200' height='30' rx='6' fill='#f3e8ff'/><text x='155' y='144' fill='#581c87' font-size='12'>← 只收最终文本</text><rect x='55' y='164' width='200' height='30' rx='6' fill='#f3e8ff'/><text x='155' y='184' fill='#581c87' font-size='12'>中间过程不进入父上下文</text><line x1='280' y1='110' x2='330' y2='110' stroke='#a855f7' stroke-width='1.6' marker-end='url(#s1)'/><defs><marker id='s1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#a855f7'/></marker></defs><text x='305' y='100' fill='#9333ea' font-size='11'>prompt</text><text x='305' y='130' fill='#9333ea' font-size='11'>text</text><rect x='332' y='30' width='250' height='170' rx='12' fill='#f0fdf4' stroke='#10b981' stroke-width='1.5'/><text x='457' y='52' fill='#065f46' font-weight='600'>子 Agent（全新 messages[]）</text><text x='457' y='68' fill='#059669' font-size='11'>5 基础工具，无 task</text><rect x='357' y='84' width='200' height='30' rx='6' fill='#dcfce7'/><text x='457' y='104' fill='#065f46' font-size='12'>read_file / bash / glob …</text><rect x='357' y='124' width='200' height='30' rx='6' fill='#dcfce7'/><text x='457' y='144' fill='#065f46' font-size='12'>最多 30 轮</text><rect x='357' y='164' width='200' height='30' rx='6' fill='#dcfce7'/><text x='457' y='184' fill='#065f46' font-size='12'>同 WORKDIR，同权限 Hooks</text><rect x='30' y='214' width='552' height='26' rx='7' fill='#fef9c3'/><text x='306' y='232' fill='#854d0e' font-size='11'>共享 WORKDIR：子 Agent 写文件，父 Agent 能看到</text></g></svg>` },
        { t: "code", lang: "python", code: `SUB_TOOLS = list(BASE_TOOLS)          # 没有 task → 只允许一层委派

def run_subagent(prompt: str) -> str:
    messages = [{"role": "user", "content": prompt}]
    for _ in range(30):                       # 轮次上限，防死循环
        response = client.messages.create(model=MODEL, system=SUB_SYSTEM,
                                          messages=messages, tools=SUB_TOOLS, max_tokens=8000)
        messages.append({"role": "assistant", "content": response.content})
        tool_calls = [b for b in response.content if b.type == "tool_use"]
        if not tool_calls:
            return extract_text(response.content) or "(no summary)"   # 只返回最终文本
        results = []
        for block in tool_calls:
            output = execute_tool(block, SUB_HANDLERS)   # 同一套权限/生命周期 Hooks
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": output})
        messages.append({"role": "user", "content": results})
    return "Subagent stopped after 30 turns without a final answer."

# 父 Agent 像用其他工具一样分发 task
TASK_TOOL = {"name": "task",
             "description": "Run a subagent with fresh conversation context and return its final text.",
             "input_schema": {"type": "object", "properties": {"prompt": {"type": "string"}}, "required": ["prompt"]}}
TOOLS = [*BASE_TOOLS, TASK_TOOL]
TOOL_HANDLERS = {**BASE_HANDLERS, "task": run_subagent}` },
        { t: "audio", src: "audio/s06-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案是给父 agent 加一个 task 工具。父 agent 调用 task 时，会同步运行一个使用全新消息列表的嵌套 agent 循环，这就是子 agent。子 agent 从干净的上下文开始，拥有五个基础工具，但没有 task 工具，所以这一课只允许一层委派，子 agent 不能再派孙子。循环结束后，子 agent 的最终文本会成为父对话中的一条工具结果。注意，这里隔离的是消息，不是进程也不是文件系统。父 agent 和子 agent 共享同一个工作目录，子 agent 写的文件、跑的命令，都会影响同一个工作区。同时，子 agent 的工具调用和父 agent 使用同一组权限和生命周期钩子，安全边界不因为委派而打折。父 agent 调用 task，就像调用其他工具一样，走同一个分发管道，没有任何特殊待遇。" },

        { t: "section", icon: "⚙️", title: "工作原理：run_subagent 与边界设计" },
        { t: "table", head: ["边界", "选择", "原因"], rows: [["对话", "全新的 messages[]", "不把父对话复制给子 Agent"], ["执行", "同一进程和 WORKDIR", "两个循环都能看到文件系统修改"], ["返回值", "只返回最终文本", "子 Agent 的工具调用和结果不进入父消息列表"], ["委派深度", "SUB_TOOLS 中无 task", "本章只允许一层委派"], ["工具策略", "共享 Hooks", "父子循环使用相同的权限检查"]] },
        { t: "audio", src: "audio/s06-03.mp3", title: "讲解 · 工作原理", transcript: "我们深入看工作原理。run subagent 函数，第一步，创建一条全新的消息列表，把传入的 prompt 作为第一条用户消息。第二步，进入一个最多三十轮的循环，每一轮都调用大模型，系统提示用子 agent 专用的 SUB SYSTEM，工具用子 agent 的工具列表。第三步，检查模型有没有调用工具：如果这轮没有工具调用，说明子 agent 认为任务完成了，就提取返回内容里的所有文本，作为最终结果返回；如果提取不到文本，就返回一个占位说明。第四步，如果有工具调用，就逐个执行，这里复用父循环的 execute tool，所以权限钩子、日志钩子全部生效，只是打印的时候带上 sub 前缀。第五步，把工具结果追加回子 agent 的消息列表，继续循环。如果三十轮还没完，就返回一条超时消息。父循环这边，task 工具和其他工具一样注册进工具列表和分发表，父 agent 只需要说一句，派个子 agent 去干这个活，然后等着收总结就行。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：上下文隔离是 agent 的「工作记忆管理」", p: "父上下文是稀缺资源，工具结果越堆越多，模型越难聚焦。\n\nSubagent = **把一段探索过程从工作记忆里卸载**，只把结论装回来。" },
        { t: "text", h: "② 一个类比：外包团队", p: "你不会把整个项目的每个细节都同步给外包，只给**任务书**，收**交付报告**。\n\nsubagent 就是一次外包：给 prompt（任务书），收最终文本（交付报告）。" },
        { t: "text", h: "③ 延伸：为什么「只允许一层委派」是刻意的", p: "无限递归委派 → 上下文虽省，但**协调成本爆炸**、难以追踪。\n\n先学会一层委派，再逐步放开深度——工程上叫**渐进式复杂化**。" },
        { t: "audio", src: "audio/s06-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是上下文隔离，也就是 agent 的工作记忆管理。父上下文是稀缺资源，工具结果越堆越多，模型越难聚焦。Subagent 把一段探索过程从工作记忆里卸载出去，只把结论装回来。第二，打个比方，这就是外包团队。你不会把整个项目的每个细节都同步给外包，你只给任务书，收交付报告。Subagent 就是一次外包：给 prompt 作为任务书，收最终文本作为交付报告，中间它怎么翻资料的，你不需要全程围观。第三，延伸一下，为什么只允许一层委派是刻意的？如果允许无限递归，子 agent 再派子 agent，上下文倒是省了，但协调成本爆炸，出了问题很难追踪是谁干的。先学会一层委派，再逐步放开深度，这叫渐进式复杂化。对产品经理来说，这提醒我们：给 agent 加能力时，边界一开始要收紧，跑通了再放开。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么隔离消息而不隔离文件系统？", p: "隔离文件系统 → 父子无法协作（子改文件父看不见）。\n\n共享 WORKDIR 让委派真正能**推进实际工作**，而不仅仅是思考。" },
        { t: "text", h: "难点 2：30 轮上限的意义", p: "子 agent 可能陷入死循环（一直调工具不总结）。\n\n30 轮是**兜底熔断**：超限返回明确消息，父 agent 能感知失败并调整策略。" },
        { t: "text", h: "易错点 3：子 agent 也触发 Stop hook，说明什么？", p: "生命周期钩子对父子一视同仁——**安全与可观测不因委派层级而降级**。\n\n子 agent 也能被 Stop hook 挽留续跑，行为与父一致。" },
        { t: "text", h: "核心设计决策", p: "**父收结论，子扛过程。** 消息隔离（省上下文）+ 文件共享（能干活）+ 一层委派（可掌控），三者缺一不可。" },
        { t: "audio", src: "audio/s06-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么隔离消息而不隔离文件系统？如果文件系统也隔离，父子就没法协作，子 agent 改的文件父 agent 看不见，委派就变成了纯聊天。共享工作目录，让委派真正能推进实际工作，而不只是思考。第二，三十轮上限的意义是什么？子 agent 有可能陷入死循环，一直调用工具就是不总结。三十轮是一个兜底熔断，超限就返回一条明确的消息，父 agent 能感知到失败并调整策略。第三，一个容易忽略的细节：子 agent 在退出前也会触发 Stop 钩子，这说明生命周期钩子对父子一视同仁，安全与可观测不会因为委派层级而降级。最后记住核心设计：父收结论，子扛过程。消息隔离省上下文，文件共享能干活，一层委派可掌控，三者缺一不可。这一课的代码量不大，但它是后面团队协作课的地基。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "Subagent 隔离的是什么？为什么返回值只取最终文本？", a: "隔离的是**对话上下文（messages[]）**，不是进程、不是文件系统——父子共享 WORKDIR，子 Agent 的文件修改父 Agent 可见。\n\n只返回最终文本的原因：子 Agent 的中间过程（每次工具调用+结果）如果全部进入父消息列表，就失去了隔离的意义，父上下文依旧会被细节塞满。\n\n本质是**信息压缩**：父 Agent 需要的是「结论」（这个模块是干嘛的、测试框架是什么），不是「推导过程」。产品上对应：汇报机制只同步结论、异步过程，避免上级被细节淹没。" },
        { t: "qa", q: "为什么 SUB_TOOLS 里没有 task 工具？如果允许无限委派会怎样？", a: "没有 task = **只允许一层委派**（子 Agent 不能再派子 Agent）。\n\n无限委派的问题：① 协调成本爆炸——多层循环互相等待、难以追踪「当前到底谁在干活」；② 故障定位难——某层出错，错误消息层层包裹；③ 上下文隔离收益递减——每层都要维护委派状态；④ 安全隐患——权限边界在多层传递中可能被绕过。\n\n工程原则：**先收紧边界，跑通后再渐进放开**。真实产品（如 Claude Code 的 Task 工具、OpenAI 的 sandbox）也是从单层委派逐步演进到受控多层的。" },
        { t: "qa", q: "（难点）30 轮上限、共享 Hooks 这两个设计分别解决什么问题？", a: "30 轮上限 = **熔断机制**：防子 Agent 陷入「一直调工具不总结」的死循环；超限返回明确消息，父 Agent 可感知失败、调整或放弃。\n\n共享 Hooks = **安全与可观测的等价性**：子 Agent 的工具调用与父 Agent 走完全相同的权限检查（PreToolUse）、日志（PreToolUse）、输出检查（PostToolUse）、收尾（Stop）。用户不需要担心「委派出去的活没经过安全门」。\n\n产品启示：委派（多智能体）能力必须**不降级安全基线**，这是用户信任的前提。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s06_subagent/code.py\n```\n\n试试这些 prompt：\n\n1. `Use a subtask to find what testing framework this project uses`（子 Agent 去读文件，主 Agent 只收结论）\n2. `Delegate: read all .py files in s01_agent_loop/ and summarize what each one does`\n3. `Use a task to create s06_subagent/example/string_tools.py with a slugify(text: str) function, then verify it from the parent agent`\n\n**观察重点**：是否出现 `[Subagent started]` / `[Subagent done]`？子 Agent 的工具调用是否以 `[sub] ...` 输出？父 Agent 是否只收到 `task` 返回的最终文本？" },
        { t: "audio", src: "audio/s06-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。当任务太大，一个对话装不下的时候，派出子 agent。子 agent 用全新的消息列表，从干净上下文开始干活，最多三十轮，干完只交一份最终文本。父 agent 通过 task 工具发起委派，就像调用普通工具一样。这一课有四个边界要记住：对话全新、文件系统共享、只返回最终文本、只允许一层委派，再加上父子共用一套权限钩子。建议你到试一下板块跑一跑，观察终端里的 Subagent started 和 done 标记，还有带 sub 前缀的子 agent 工具调用，看看父 agent 收到的确实只有总结。下一课，我们要解决知识加载的问题：不同的任务需要不同的知识，怎么做到用的时候才加载。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "Agent 能拆任务了。但不同任务需要不同知识：改 Python 要 PEP 8 规范，写 SQL 要知道表结构。全塞进 system prompt，上下文直接爆了。\n\n**下一课 s07 Skill Loading** → 技能按需注入，用的时候才加载，像读文件一样自然。" },
        { t: "tip", text: "一句话记住 S06：**父收结论，子扛过程。** 全新 messages + 共享 WORKDIR + 只返回最终文本 + 一层委派。" }
      ]
    },
    {
      id: "s07",
      num: "07",
      title: "Skill Loading",
      desc: "用到时再加载",
      color: "#0ea5e9",
      blocks: [
        { t: "lead", text: "第七课把知识**按需注入**：system prompt 只放技能目录（名称+描述），`load_skill(name)` 用的时候才加载完整 `SKILL.md`。" },

        { t: "section", icon: "❓", title: "问题：知识全塞 system prompt，上下文直接爆" },
        { t: "text", h: "核心问题", p: "项目有三份规范：React 组件规范、SQL 风格指南、API 设计文档。最直接的做法是全部拼进 system prompt：\n\n```python\nSYSTEM = (\n    \"You are a coding agent. \"\n    + open(\"guides/react-style.md\").read()\n    + open(\"guides/sql-style.md\").read()\n    + open(\"guides/api-design.md\").read()\n)\n```\n\n问题：**每次调用 LLM，三份文档全文都一起发送**。只改 React 组件时，SQL 指南和 API 文档与任务无关，却仍占输入 token 和上下文窗口——留给代码、对话和工具结果的空间就少了。" },
        { t: "audio", src: "audio/s07-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第七课，Skill Loading，技能加载。假设你的项目有一套 React 组件规范、一份 SQL 风格指南、一份 API 设计文档，你希望 agent 在开发时遵守这些规范。最直接的做法，就是把它们全部放进 system prompt，打开文件读进来拼在一起。这么做 agent 确实读到了所有规范，但问题在于：三份文档被固定地塞进了 system prompt，每次调用大模型，它们的全文都会一起发送。当当前任务只是修改 React 组件，实际需要的只有 React 规范，SQL 风格指南和 API 设计文档与任务无关，却仍然占用输入 token 和上下文窗口，留给代码、对话和工具结果的空间就变少了。文档越多，浪费越严重。这就像把所有工具书都摊开摆在桌上，要用哪本拿哪本，而不是全堆在眼前。这一课的解法，就是用到时再加载。" },

        { t: "section", icon: "💡", title: "解决方案：目录常驻，内容按需加载" },
        { t: "table", head: ["内容", "进入模型的位置", "何时加入"], rows: [["技能名称和描述", "system prompt", "启动时"], ["完整 SKILL.md", "tool_result", "调用 load_skill 时"]] },
        { t: "svg", caption: "技能目录 ↔ 按需加载", svg: `<svg viewBox='0 0 680 250' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><rect x='30' y='30' width='280' height='190' rx='12' fill='#f0f9ff' stroke='#0ea5e9' stroke-width='1.5'/><text x='170' y='52' fill='#0c4a6e' font-weight='600'>启动时：SkillLoader.scan()</text><text x='170' y='70' fill='#0284c7' font-size='11'>扫描 skills/*/SKILL.md → 注册表</text><text x='170' y='100' fill='#334155' font-size='12'>skills/</text><text x='170' y='118' fill='#334155' font-size='12'>├─ code-review/SKILL.md</text><text x='170' y='134' fill='#334155' font-size='12'>├─ pdf/SKILL.md</text><text x='170' y='150' fill='#334155' font-size='12'>├─ mcp-builder/SKILL.md</text><text x='170' y='166' fill='#334155' font-size='12'>└─ agent-builder/SKILL.md</text><rect x='50' y='180' width='240' height='30' rx='6' fill='#e0f2fe'/><text x='170' y='200' fill='#0c4a6e' font-size='12'>目录（name + description）→ system prompt</text><line x1='310' y1='90' x2='360' y2='90' stroke='#0ea5e9' stroke-width='1.6' marker-end='url(#k1)'/><defs><marker id='k1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#0ea5e9'/></marker></defs><text x='335' y='80' fill='#0284c7' font-size='11'>catalog()</text><rect x='362' y='50' width='290' height='150' rx='12' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='507' y='72' fill='#1e1b4b' font-weight='600'>模型运行时</text><text x='507' y='100' fill='#334155' font-size='12'>看到目录 → 判断哪条技能适用</text><text x='507' y='122' fill='#334155' font-size='12'>调用 load_skill("code-review")</text><rect x='392' y='134' width='230' height='34' rx='6' fill='#c7d2fe'/><text x='507' y='156' fill='#3730a3' font-size='12'>完整 SKILL.md → tool_result</text><text x='507' y='184' fill='#94a3b8' font-size='11'>name 按注册表查询，绝不当作文件路径</text><rect x='30' y='228' width='622' height='22' rx='5' fill='#fef9c3'/><text x='341' y='244' fill='#854d0e' font-size='11'>只加载用到的技能：无关文档不占 token</text></g></svg>` },
        { t: "code", lang: "python", code: `class SkillLoader:
    def scan(self):
        # 扫描 skills/*/SKILL.md，读 YAML frontmatter
        # name 兜底 = 目录名；description 兜底 = 正文第一行
        for manifest in sorted(self.skills_dir.glob("*/SKILL.md")):
            metadata, body = self.parse_frontmatter(manifest.read_text())
            name = str(metadata.get("name") or "").strip() or manifest.parent.name
            desc = str(metadata.get("description") or "").strip() or body.split("\\n", 1)[0]
            self.skills[name] = {"name": name, "description": " ".join(desc.lstrip("# ").split()), "content": manifest.read_text()}

    def catalog(self) -> str:     # 只输出名称和描述
        return "\\n".join(f"- {s['name']}: {s['description']}" for s in self.skills.values())

    def load(self, name: str) -> str:    # name 不是文件路径，是注册表键
        skill = self.skills.get(name)
        if skill:
            return skill["content"]
        return f"Error: Unknown skill '{name}'. Available: {', '.join(self.skills) or 'none'}"

SKILL_LOADER = SkillLoader(SKILLS_DIR); SKILL_LOADER.scan()

def build_system_prompt() -> str:
    return (f"You are a coding agent at {WORKDIR}. Use tools to solve tasks. Act, don't explain.\\n\\n"
            f"Skills available:\\n{SKILL_LOADER.catalog()}\\n\\n"
            "Use load_skill to read the full instructions when a skill applies.")

TOOL_HANDLERS["load_skill"] = SKILL_LOADER.load` },
        { t: "audio", src: "audio/s07-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案分两步走。第一步，启动的时候，SkillLoader 扫描技能目录，读取每个技能的元信息，把技能的目录清单放进 system prompt。这份清单只包含技能的名称和一句话描述，非常轻量。第二步，模型发现某个技能和自己的任务相关，就调用 load skill 工具，传入技能名称，返回完整的 SKILL.md 内容，作为工具结果追加到消息列表。这样，名称和描述常驻 system prompt，帮助模型知道有什么可用；完整内容按需加载，用到才进上下文。用一张表概括就是：技能名称和描述进入 system prompt，在启动时加入；完整 SKILL.md 进入工具结果，在调用 load skill 时加入。两者分工明确，一个负责让人知道有什么，一个负责真正用起来。这就是目录常驻、内容按需的经典模式。" },

        { t: "section", icon: "⚙️", title: "工作原理：scan → catalog → load" },
        { t: "text", h: "", p: "- **scan**：扫描 `skills/*/SKILL.md`，解析 YAML frontmatter；`name` 缺失时兜底为目录名，`description` 缺失时兜底为正文首行；**只收录在 skills 根目录内的文件**（防路径逃逸）\n- **catalog**：只输出 `- name: description` 清单，注入 system prompt\n- **load**：`name` 是**注册表键，不是文件路径**（天然防注入）；未知技能返回错误 + 可用列表\n- **关键**：完整 SKILL.md 作为 `tool_result` 进入消息列表，与其他工具结果同路径" },
        { t: "audio", src: "audio/s07-03.mp3", title: "讲解 · 工作原理", transcript: "我们深入看工作原理。先看 scan，SkillLoader 在启动时扫描 skills 目录下的所有 SKILL.md 文件。解析 YAML frontmatter 拿 name 和 description：name 没有就兜底用目录名，description 没有就兜底用正文第一行，把开头的井号去掉，压缩空白。扫描时还检查文件必须位于 skills 根目录之内，防止路径逃逸。扫描结果存进一个注册表，也就是字典。再看 catalog，它只输出每条的名称和描述，一行一条，非常轻量，这就是注入 system prompt 的全部内容。最后看 load，模型传进来一个 name，load 直接查注册表字典：命中就返回完整的 SKILL.md 内容；没命中就返回一条错误，附上当前可用的技能列表，帮助模型自我纠正。注意，name 是注册表键，不是文件路径，模型永远无法用这个工具去读任意文件，这是设计上的安全点。加载回来的内容作为工具结果追加进消息列表，后续模型就能看到完整规范并遵守它。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：上下文管理的「目录-内容」分层", p: "永远不把全部知识塞进常驻区——**轻量目录常驻（让模型知道有什么）+ 重内容按需加载（用到才取）**。\n\n这是所有 RAG、MCP、技能系统的公共底座。" },
        { t: "text", h: "② 一个类比：图书馆", p: "system prompt 是**书目卡片**，load_skill 是**借书**。\n\n你不会把整个图书馆搬进自习室，只会查目录、借需要的书。" },
        { t: "text", h: "③ 延伸：为什么「name 不是文件路径」是关键设计", p: "如果 load 接受路径，模型就能读任意文件 → **安全漏洞**。\n\n注册表键值化 = 能力范围白名单化，是工具系统安全的通用做法。" },
        { t: "audio", src: "audio/s07-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是上下文管理的目录内容分层。永远不要把全部知识塞进常驻区，正确的是：轻量目录常驻，让模型知道有什么；重内容按需加载，用到才取。这是所有 RAG、MCP、技能系统的公共底座，你之后看到的 MCP 插件那一课，底层思路和这一课完全一致。第二，打个比方，这就是图书馆。system prompt 是书目卡片，load skill 是借书。你不会把整个图书馆搬进自习室，只会查目录、借需要的书，看完还回去。第三，一个关键的安全设计：为什么 name 不是文件路径？如果 load 函数接受路径，模型就能读任意文件，这是安全漏洞。把 name 变成注册表里的键，等于把能力范围白名单化，模型只能在技能库范围内取东西。对产品经理来说，这一课教我们：给 AI 提供知识，不是把知识全喂进去，而是提供一份目录加一个按需取用的通道。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：目录里应该写什么？（description 的黄金法则）", p: "目录是模型选择技能的**唯一依据**——写得太空（「处理文件」）模型不知道怎么用，写得太长又浪费常驻 token。\n\n好描述 = **何时用 + 能做什么 + 关键效果**一句话讲清。" },
        { t: "text", h: "难点 2：为什么不直接把目录也做成 tool？", p: "目录做成 tool → 模型每次要先调工具才知道有什么 → **多一轮往返、浪费 token、依赖模型主动想起**。\n\nsystem prompt 常驻目录 = 零成本的全景感知，选择发生在推理前。" },
        { t: "text", h: "易错点 3：description 兜底逻辑的顺序", p: "frontmatter → 正文首行 → 兜底。\n\n看似细节，实则是**可运维性**：每个技能至少能给人一句话，目录永远可读。" },
        { t: "text", h: "核心设计决策", p: "**模型先知道「有什么」，再决定「取什么」。** 目录在常驻区，内容在加载区，两条通道各司其职。" },
        { t: "audio", src: "audio/s07-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，目录里应该写什么？目录是模型选择技能的唯依据，description 写得太空，模型不知道怎么用；写得太长，又浪费常驻 token。好描述的标准是一句话讲清楚：什么时候用、能做什么、关键效果是什么。第二，为什么不直接把目录也做成一个工具？因为做成工具，模型每次要先调用才能知道有什么，多一轮往返，浪费 token，而且依赖模型主动想起去查。放在 system prompt 里，模型零成本获得全景感知，选择发生在推理之前。第三，一个容易忽略的细节：description 的兜底顺序，frontmatter 里写了用 frontmatter，没写用正文第一行。看似细节，实则是可运维性：保证每个技能至少有一句话描述，目录永远可读。最后记住核心设计：模型先知道有什么，再决定取什么。目录在常驻区，内容在加载区，两条通道各司其职。这个模式你会反复见到，它是上下文管理的万金油。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "「技能目录放 system prompt、内容按需加载」解决的是什么问题？", a: "解决**上下文窗口的浪费**：把所有知识文档固定拼进 system prompt，每次调用 LLM 都会发送全部全文，无关文档占用输入 token，挤占代码/对话/工具结果的空间。\n\n目录常驻+内容按需的收益：① **token 节省**——只有轻量目录常驻，完整内容用到才加载；② **聚焦**——模型看到的常驻知识永远是紧凑的，决策质量更高；③ **可扩展**——技能数量可以无限增长，因为常驻部分不随数量膨胀。\n\n这是 RAG、MCP、插件系统共同的基础模式：**元数据进上下文，本体按需取**。" },
        { t: "qa", q: "为什么 load_skill 的 name 参数是「注册表键」而不是文件路径？", a: "安全设计：如果参数是文件路径，模型就能读任意文件（如 `../../etc/passwd`），形成**任意文件读取漏洞**——而模型输入不可信，prompt 注入场景下这等于把系统钥匙交出去了。\n\n注册表键的设计：① 能力**白名单化**——只能取启动时扫描到的技能；② 与实现解耦——目录结构变了，接口不变；③ 错误可引导——未知键返回「Available: ...」帮助模型自我纠正。\n\n通用原则：**凡是由模型控制的参数，能枚举就枚举，能查表就查表，绝不直接进文件系统/命令拼接**。" },
        { t: "qa", q: "（难点）description 写得好坏如何影响 Agent 行为？你会怎么写？", a: "description 是模型**选择技能的唯一依据**，写不好 Agent 就不会用：太空泛（「处理文件」）→ 模型不知道何时适用；太长 → 常驻 token 浪费且稀释其他指令；有歧义 → 模型选错技能。\n\n好的写法（面向模型而非面向人）：**触发场景 + 能力边界 + 关键效果**。例如「Perform thorough code reviews of Python files: check imports, error handling, style, and tests. Returns a structured report.」\n\n产品启示：技能/插件的「发现体验」决定其使用率——用户市场里，description 就是技能的标题和摘要，直接决定点击率和装机量。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s07_skill_loading/code.py\n```\n\n试试这些 prompt：\n\n1. `What skills are available?`\n2. `Load the code-review skill and follow its instructions`\n3. `Review README.md and load the relevant skill first`\n\n**观察重点**：system prompt 中是否只有技能目录？调用 `load_skill` 后是否出现完整的 `SKILL.md` 内容？" },
        { t: "audio", src: "audio/s07-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。知识注入的正确姿势：system prompt 里只放技能目录，名称加一句话描述；模型判断哪个技能适用，就调用 load skill 按名称加载完整内容。目录常驻让模型知道有什么，按需加载让内容用到才进上下文，token 不浪费，上下文不膨胀。三个关键点：扫描时做好 name 和 description 的兜底；catalog 保持轻量；load 用注册表键而不是文件路径，守住安全底线。建议你到试一下板块跑一跑，先问有哪些技能，再让模型加载一个技能执行，观察完整 SKILL.md 是怎么作为工具结果进入对话的。下一课，我们要处理另一个上下文问题：对话太长了怎么办？答案是压缩。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "技能按需加载省了输入侧，但随着工具调用增加，`messages[]` 会积累较早的文件内容和工具结果。\n\n**下一课 s08 Context Compact** → 缩短较早的消息，为后续调用保留上下文空间。" },
        { t: "tip", text: "一句话记住 S07：**目录常驻，内容按需。** 模型先知道有什么，再决定取什么；name 是注册表键，不是文件路径。" }
      ]
    },
    {
      id: "s08",
      num: "08",
      title: "Context Compact",
      desc: "先腾地方，再总结",
      color: "#f43f5e",
      blocks: [
        { t: "lead", text: "第八课解决「上下文总会满」：**四步压缩管线**——先转存大结果、再裁剪旧消息、替换旧结果，最后才让模型做摘要。" },

        { t: "section", icon: "❓", title: "问题：上下文总会满，要有人腾地方" },
        { t: "text", h: "核心问题", p: "Agent 持续工作时，读过的文件、执行过的命令、模型回复都留在 `messages` 里。消息越积越多，最终会超过模型能接收的上下文长度 → API 返回 `prompt_too_long`。\n\n**工具结果最占空间**：读长文件、几十 KB 的测试日志、持续追加的搜索结果……\n\n上下文窗口像一张**固定大小的草稿纸**——满了就写不下了。" },
        { t: "audio", src: "audio/s08-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第八课，Context Compact，上下文压缩。前面七课，我们在不断往这个智能体上加能力，但也带来了一个新问题：对话会越来越长。Agent 持续工作时，读过的文件、执行过的命令、模型的回复，全都留在消息列表里。消息越积越多，最终会超过模型能接收的上下文长度，API 就会拒绝请求，返回 prompt too long 的错误。你可以把上下文窗口想象成一张固定大小的草稿纸，用户消息、模型回复、工具调用、工具结果，都按顺序写在这张纸上，模型每次继续工作时都要重新读一遍。草稿纸的大小是固定的，满了就写不下了。在代码任务里，工具结果通常占最多的空间：读一个长文件，文件内容进上下文；测试和构建日志，一次可能产生几十 KB 文本；搜索多个文件，结果持续追加。任务持续越久，消息就越大。所以我们要做的，是控制其中的信息量，同时尽可能保留当前目标、用户约束和正在进行的工作。一句话：上下文总会满，要有办法腾地方。" },

        { t: "section", icon: "💡", title: "解决方案：四步压缩管线，低成本的操作优先" },
        { t: "text", h: "为什么先整理工具结果？", p: "直接让模型总结整段历史，**一定漏细节**，还多一次模型调用。\n\n工具结果更适合优先处理：大文件可存盘再读、旧命令可重跑、最新结果更贴近当前工作、**文本裁剪不需要调用模型**。" },
        { t: "svg", caption: "四步压缩管线：按信息损失和调用成本排序", svg: `<svg viewBox='0 0 680 300' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><rect x='20' y='24' width='640' height='26' rx='6' fill='#f1f5f9'/><text x='340' y='42' fill='#64748b' font-size='12'>每一轮调用模型前：COMPACTOR.prepare(messages)</text><rect x='30' y='70' width='145' height='76' rx='10' fill='#ecfdf5' stroke='#10b981' stroke-width='1.5'/><text x='102' y='92' fill='#065f46' font-weight='600'>① tool_result_budget</text><text x='102' y='110' fill='#059669' font-size='11'>大结果落盘</text><text x='102' y='126' fill='#059669' font-size='11'>>3 万字符 → .txt</text><text x='102' y='138' fill='#94a3b8' font-size='10'>批量超 20 万触发</text><line x1='175' y1='108' x2='195' y2='108' stroke='#10b981' stroke-width='1.6' marker-end='url(#c1)'/><defs><marker id='c1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#10b981'/></marker></defs><rect x='197' y='70' width='145' height='76' rx='10' fill='#e0f2fe' stroke='#0ea5e9' stroke-width='1.5'/><text x='269' y='92' fill='#0c4a6e' font-weight='600'>② snip_compact</text><text x='269' y='110' fill='#0284c7' font-size='11'>消息>50 条</text><text x='269' y='126' fill='#0284c7' font-size='11'>留前3 + 最近47</text><text x='269' y='138' fill='#94a3b8' font-size='10'>归档 → .transcripts/</text><line x1='342' y1='108' x2='362' y2='108' stroke='#0ea5e9' stroke-width='1.6' marker-end='url(#c1)'/><rect x='364' y='70' width='145' height='76' rx='10' fill='#fef3c7' stroke='#f59e0b' stroke-width='1.5'/><text x='436' y='92' fill='#78350f' font-weight='600'>③ micro_compact</text><text x='436' y='110' fill='#b45309' font-size='11'>旧结果占位</text><text x='436' y='126' fill='#b45309' font-size='11'>留最近 3 条已读</text><text x='436' y='138' fill='#94a3b8' font-size='10'>>120 字符 → 占位符</text><line x1='509' y1='108' x2='529' y2='108' stroke='#f59e0b' stroke-width='1.6' marker-end='url(#c1)'/><rect x='531' y='70' width='128' height='76' rx='10' fill='#fef2f2' stroke='#ef4444' stroke-width='1.5'/><text x='595' y='92' fill='#991b1b' font-weight='600'>④ compact</text><text x='595' y='110' fill='#ef4444' font-size='11'>模型摘要</text><text x='595' y='126' fill='#ef4444' font-size='11'>>5 万字符才触发</text><text x='595' y='138' fill='#94a3b8' font-size='10'>唯一费 API 的</text><rect x='30' y='168' width='630' height='30' rx='8' fill='#f8fafc' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='5,3'/><text x='345' y='188' fill='#475569' font-size='12'>前三步：确定性结构/文本操作，0 API 调用 · 第四步：才请模型总结</text><rect x='30' y='212' width='630' height='52' rx='8' fill='#f5f3ff' stroke='#a855f7' stroke-width='1.2'/><text x='345' y='232' fill='#6d28d9' font-size='12'>兜底：API 返回 prompt_too_long → reactive_compact（保留最近 5 条，最多补救 1 次）</text><text x='345' y='250' fill='#8b5cf6' font-size='12'>主动：模型可调 compact 工具，阶段结束后主动压缩</text></g></svg>` },
        { t: "audio", src: "audio/s08-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案是一条四步压缩管线，原则是低成本的操作优先执行。先讲为什么不是直接让模型总结：摘要一定会遗漏部分细节，而且多产生一次模型调用，又贵又丢。而工具结果适合优先处理：大文件可以保存到磁盘，需要时重新读；旧命令可以重新执行；最新几条结果通常比早期结果更贴近当前工作；文本裁剪和结构调整不需要调用模型。所以压缩顺序按信息损失和调用成本排列：第一步 tool result budget，把大工具结果转存到磁盘；第二步 snip compact，消息太多时裁剪掉中间的历史，归档到 transcript 文件；第三步 micro compact，把模型已经读过的旧结果替换成占位符；第四步 compact history，前三步做完还是超阈值，才请求模型生成摘要。前两步控制大小，第三步控制数量，第四步兜底。每一步都比后一步更贵、更不可逆，所以顺序固定：先做便宜且容易恢复的。" },

        { t: "section", icon: "⚙️", title: "工作原理（上）：前三步，零 API 调用" },
        { t: "text", h: "① tool_result_budget —— 大结果落盘", p: "一批工具结果总字符数 > **200_000** 时触发，从**最大的结果开始**处理：超过 **30_000** 字符的结果完整写入 `.task_outputs/tool-results/<tool_use_id>.txt`，上下文只保留文件路径 + 前 2000 字符预览。" },
        { t: "text", h: "② snip_compact —— 消息太多就裁剪", p: "消息数 > **50** 条时：完整历史写入 `.transcripts/`，保留**最初 3 条 + 最近 47 条**，中间放一条 marker 写明「删去 N 条 + 存档位置」。\n\n**切点保护**：`assistant(tool_use)` 和 `user(tool_result)` 必须成对，孤立工具结果会让 API 判定请求无效。" },
        { t: "text", h: "③ micro_compact —— 旧结果变占位符", p: "模型还没读过的 `tool_result` 完整保留；已读过的保留**最近 3 条**，更早且超 **120** 字符的缩短为 `[Earlier tool result saved at …]` 或 `[Earlier tool result omitted.]`。" },
        { t: "audio", src: "audio/s08-03.mp3", title: "讲解 · 工作原理", transcript: "我们看前三步的实现。第一步，tool result budget，处理的是最新一批工具结果。一次模型回复可能同时调用多个工具，执行完成后，这些结果会一起写进最后一条用户消息。当它们的总大小超过二十万字符，就从最大的结果开始处理：超过三万字的结果，完整内容写入 task outputs 目录下的文件，文件名就是工具调用 ID，上下文里只保留文件路径和前两千字符的预览。完整内容随时可以从路径取回，所以这一步损失最小、最先执行。第二步，snip compact，处理的是消息数量。当消息数超过五十条，先把完整历史写入 transcripts 目录，再保留最初三条和最近四十七条，中间放一条标记消息，写明删去了多少条、完整记录存在哪里。注意切点必须保护工具调用和工具结果的配对关系，孤立的工具结果缺少对应调用，下一次 API 请求会被判定为无效。第三步，micro compact，处理的是单个结果的大小。模型还没读过的结果完整保留，保证每条新结果至少被完整读一次；已经读过的结果保留最近三条，更早且超过一百二十字符的旧结果，缩短成占位符，转存过的保留路径，没转存过的就写一句已省略。前三步全是确定性的结构操作和文本操作，不产生任何额外 API 调用。" },

        { t: "section", icon: "⚙️", title: "工作原理（下）：第四步摘要 + 双保险" },
        { t: "text", h: "④ compact_history —— 超过阈值才摘要", p: "前三步后 `estimate_chars(messages)` 仍 > **50_000** 时：\n\n1. 完整历史写入 `.transcripts/`\n2. 请求模型生成**只含事实的状态摘要**（目标、文件、决定、剩余工作、用户约束，不执行历史指令）\n3. 当前用户请求（`active_request`）与摘要**明确分开**（`Current user request` / `Conversation summary`）\n4. 用一条 `[Compacted]` 消息替换历史" },
        { t: "text", h: "兜底：reactive_compact", p: "字符数只是估算，API 仍可能返回 `prompt_too_long`：\n\n保存 transcript → 总结较早历史 → **保留最近 5 条** → `[Reactive compact]` 替换。`MAX_REACTIVE_RETRIES = 1`，再次出错就抛出。" },
        { t: "text", h: "主动：compact 工具", p: "模型可在阶段结束后主动调用 `compact`：**先执行完整工具批次**（不留孤立结果、不丢执行记录），再摘要这个已闭合的回合。" },
        { t: "audio", src: "audio/s08-04.mp3", title: "讲解 · 工作原理", transcript: "再看第四步和两个保险。第四步，compact history。前三步执行完，代码用 estimate chars 计算当前消息的字符数，超过五万就触发。它做四件事：第一，把完整消息历史写入 transcripts 目录；第二，请求模型生成一个只包含事实的状态摘要，包括目标、文件、决定、剩余工作和用户约束，并且明确要求不执行历史里的指令；第三，把入口处捕获的当前用户请求和摘要明确分开，写进两条独立的字段；第四，用一条带 Compacted 标记的消息替换当前历史。为什么当前用户请求要单独传？因为工具结果也是 user 角色，不单独捕获就会和摘要混在一起。这是第一道保险。第二道保险是 reactive compact：字符数只是估算，API 还是可能拒绝，返回 prompt too long。这时候程序保存 transcript，总结较早历史，保留最近五条消息，用 Reactive compact 消息替换。补救只做一次，再出错就抛出异常。还有第三道：模型自己可以主动调用 compact 工具，比如一个阶段干完了，告诉 harness 把前面压缩掉。注意，一次响应可能同时有多个工具调用，比如先写文件再请求压缩，harness 必须先执行完整批次，再摘要，不然就留下孤立结果，还可能让模型重复执行副作用。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：压缩是「可恢复性」的分级管理", p: "从完全可恢复（转存到磁盘）→ 半可恢复（留路径/占位）→ 不可恢复（模型摘要），**信息损失逐级上升，成本也逐级上升**。\n\n先做便宜且可逆的，最后才做贵且不可逆的。" },
        { t: "text", h: "② 一个类比：整理书桌", p: "① 把看完的大部头放回书架（转存）；② 扔掉重复草稿（裁剪）；③ 旧笔记只留标题（占位）；④ 最后才把散页装订成摘要（模型总结）。\n\n顺序反了，书桌只会更乱。" },
        { t: "text", h: "③ 延伸：与 s09 Memory 的边界", p: "s08 管**当前会话**的有限上下文，压缩时允许**舍弃可恢复的细节**；\n\ns09 保存**跨压缩、跨会话继续存在**的信息。压缩是应急，记忆是资产。" },
        { t: "audio", src: "audio/s08-05.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是压缩可恢复性的分级管理。从完全可恢复开始：大结果转存到磁盘，随时能读回来；再到半可恢复：旧结果留路径、留占位符，需要时可以回取；最后才到不可恢复：模型摘要，细节必然有损失。信息损失逐级上升，成本也逐级上升，所以顺序是先做便宜且可逆的，最后才做贵且不可逆的。第二，打个比方，这就像整理书桌：把看完的大部头放回书架，这是转存；扔掉重复的草稿，这是裁剪；旧笔记只留标题，这是占位；最后才把散页装订成一份摘要，这是模型总结。顺序反了，书桌只会更乱。第三，一个重要的边界，这一课和下一课的边界：s08 管理的是当前会话的有限上下文，压缩时允许舍弃可恢复的细节，它是应急机制；s09 保存的是需要跨压缩、跨会话继续存在的信息，那是长期记忆。一句话：压缩是应急，记忆是资产。对产品经理来说，这一课告诉我们：长任务的稳定性，靠的不是更大的窗口，而是聪明的腾挪。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么前三步不调用模型、第四步才调用？", p: "模型调用 = 钱 + 时间 + **信息损失**（摘要必丢细节）。\n\n确定性文本操作 0 成本且可恢复 → 先用尽；摘要作为最后手段，**能不上就不上**。" },
        { t: "text", h: "难点 2：为什么切点要保护 tool_use/tool_result 配对？", p: "剪掉 tool_use 却留下 tool_result（或反之）→ API 协议校验失败 → 整个请求作废。\n\n**配对保护是压缩的合法性前提**：再省空间也不能产出无效消息序列。" },
        { t: "text", h: "易错点 3：active_request 为什么要单独传？", p: "工具结果也是 `role=user`，混在历史里没法区分「用户要求」和「工具输出」。\n\n单独捕获 → 压缩后用户意图依然在摘要中**显式在场**，模型不会迷失方向。" },
        { t: "text", h: "核心设计决策", p: "**先腾地方，再总结。** 确定性操作优先，模型摘要兜底；主动压缩（compact 工具）+ 被动补救（reactive_compact）双保险。" },
        { t: "audio", src: "audio/s08-06.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么前三步不调用模型，第四步才调用？因为模型调用意味着钱、时间，还有信息损失，摘要必然丢细节。确定性的文本操作零成本而且可恢复，所以先用尽；摘要是最后手段，能不上就不上。第二，为什么切点要保护工具调用和工具结果的配对？如果剪掉工具调用却留下工具结果，或者反过来，API 的协议校验就会失败，整个请求作废。再省空间也不能产出无效的消息序列，这是压缩的合法性前提。第三，一个容易踩的坑：当前用户请求为什么要单独传？因为工具结果也是 user 角色，混在历史里没法区分用户的要求和工具的输出。单独捕获，压缩之后用户的意图依然在摘要里显式在场，模型不会迷失方向。第四，为什么大结果转存必须早于占位符替换？因为先落盘，路径才会写进上下文，之后旧结果才能安全地变成占位符；顺序反了，完整内容就找不回来了。最后记住核心设计：先腾地方，再总结。确定性操作优先，模型摘要兜底，主动压缩加被动补救，双保险。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "上下文压缩为什么是「四步管线」而不是直接做摘要？", a: "摘要的两大代价：① **信息损失**——摘要必然遗漏细节，可能丢掉关键约束或决定；② **成本**——每次摘要都是一次模型调用（钱+延迟）。\n\n四步管线按「信息损失 + 调用成本」排序：大结果转存（完全可恢复）→ 消息裁剪（归档后可恢复）→ 旧结果占位（留路径可恢复）→ 模型摘要（不可恢复）。前三步是确定性操作，0 API 调用；第四步才产生模型调用。\n\n产品启示：**能用规则解决的不要用 AI，用 AI 是最后手段**——稳定、可预测、可审计的路径优先。" },
        { t: "qa", q: "snip_compact 为什么必须保护 tool_use / tool_result 的配对？", a: "API 协议要求消息序列合法：`tool_use`（assistant 角色）后必须紧跟对应的 `tool_result`（user 角色）。如果剪掉工具调用却留下孤立的结果（或反之），API 会判定请求无效 → 整次调用作废。\n\n实现：切点时向前/向后调整边界，直到落在配对的完整单元上；归档文件保留了完整历史，被裁部分可回溯。\n\n通用原则：**任何对消息序列的裁剪/压缩，都必须保证协议层合法性**——这是压缩的第一约束，节省空间是第二约束。" },
        { t: "qa", q: "（难点）「先执行完整工具批次，再摘要」这条规则解决什么问题？", a: "场景：一次响应同时包含多个工具调用（如「先写文件，再调用 compact」）。\n\n如果先摘要再执行：① 留下**孤立的 tool_use**（协议非法）；② 已发生的文件写入**丢失执行记录** → 模型不知道文件已经写了，可能重复执行同样的副作用（重复写入、重复提交）。\n\n正确顺序：执行完整批次 → 为每个 tool_use 追加对应 tool_result → 再对已闭合的回合做摘要。\n\n产品启示：**压缩不能破坏「动作-结果」的因果完整性**；副作用类操作尤其需要执行留痕，防止 AI 重复干同一件事。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s08_context_compact/code.py\n```\n\n**实验一 · 较早的结果被替换**：读 s01~s05 的 README 并比较标题 → 后续轮次旧的长结果会变成 `[Earlier tool result omitted.]`\n\n**实验二 · 大结果转存**：分析 `s16_workflow_runtime/code.py` 的结构 → `.task_outputs/tool-results/` 出现完整结果文件\n\n**实验三 · 自动摘要**：比较 s08 和 s09 的 code.py → 超过 5 万字符时打印 `[auto compact]` + transcript 路径，后续用 `[Compacted]` 摘要继续\n\n**观察重点**：`.transcripts/`（历史留档）与 `.task_outputs/tool-results/`（大结果转存）目录的内容。" },
        { t: "audio", src: "audio/s08-07.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。上下文总会满，解决办法是四步压缩管线，按信息损失和成本排序：大结果转存、消息裁剪、旧结果占位，前三步零 API 调用；超过阈值才让模型生成摘要。整个管线每次调用模型前自动跑一遍，还有两道保险：API 拒绝时 reactive compact 补救一次，模型可以主动调 compact 工具压缩。这一课的关键词是顺序：先做便宜且可逆的，最后做贵且不可逆的；以及配对：任何裁剪都不能拆散工具调用和结果。建议你到试一下板块跑三个实验，亲眼看看旧结果怎么变成占位符、大结果怎么落盘、摘要怎么接管对话。下一课，我们要做一件不一样的事：不是腾地方，而是真正把重要的东西记下来，跨会话保存。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "压缩让 Agent 能在有限窗口里继续长任务，但压缩会丢细节。真正需要**跨压缩、跨会话**保留的信息，要进独立的持久记忆系统。\n\n**下一课 s09 Memory** → 记忆的写入、检索与整理。" },
        { t: "tip", text: "一句话记住 S08：**先腾地方，再总结。** 转存→裁剪→占位→摘要，前三步零成本，模型摘要是最后手段。" }
      ]
    },
    {
      id: "s09",
      num: "09",
      title: "Memory",
      desc: "重要信息跨会话保留",
      color: "#0d9488",
      blocks: [
        { t: "lead", text: "第九课让重要信息**跨会话保留**：Memory = 文件存储 + 索引 + 相关性选择 + 按需召回，四件事：**存储、召回、提取、整理**。" },

        { t: "section", icon: "❓", title: "问题：新会话不记得上次的事" },
        { t: "text", h: "核心问题", p: "Agent 开始新会话时，`messages` 里**没有上一次的对话**。用户说过的编码偏好、项目背景、排查线索，下次任务可能还用得上——没有持久存储，只能让用户重新说一遍。\n\n把完整 transcript 留下适合归档，**却不适合每次都发给模型**：对话越来越长、当前需要的信息难定位、旧事实可能已过期。" },
        { t: "audio", src: "audio/s09-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第九课，Memory，记忆系统。上一课我们处理了上下文太满的问题，这一课要解决另一件完全不同的事：跨会话的记忆。想象一下，agent 开始一个新会话时，消息列表里没有上一次的对话。用户之前说过的编码偏好、项目背景、排查线索，下次任务可能还用得上。没有持久存储，这些信息只能由用户重新说一遍，这体验很差。那直接把完整的 transcript 留下来发给模型行不行？适合归档，但不适合每次都发。对话会越来越长，当前任务需要的信息很难定位，旧事实也可能已经过期。所以 Memory 要解决的是两个问题：第一，哪些信息值得跨会话保存；第二，当前任务应该取回哪几条。这一课，我们要实现记忆的写入、检索与整理，四个子系统：存储、召回、提取、整理。这正好也呼应了第七课技能加载的思路：目录常驻、正文按需。" },

        { t: "section", icon: "💡", title: "解决方案：存储 + 召回 + 提取 + 整理" },
        { t: "text", h: "为什么不全部写进 system prompt？", p: "最直接的做法是把用户偏好写进固定文件、启动时全量注入——能记住，但**每次调用 LLM 都重发全部内容**，记忆越多、无关内容越多、token 越浪费。\n\ns07 已示范正确姿势：**保留简短索引，只在需要时加载正文**。Skill 由人编写且只读；Memory 由 Agent **从对话中提取**、后续任务再用。" },
        { t: "svg", caption: "记忆四子系统：存 → 选 → 取 → 写 → 理", svg: `<svg viewBox='0 0 680 260' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><rect x='24' y='30' width='200' height='86' rx='10' fill='#ecfdf5' stroke='#10b981' stroke-width='1.5'/><text x='124' y='52' fill='#065f46' font-weight='600'>存储</text><text x='124' y='70' fill='#059669' font-size='11'>.memory/*.md</text><text x='124' y='86' fill='#059669' font-size='11'>frontmatter:</text><text x='124' y='102' fill='#059669' font-size='11'>name / description / type</text><rect x='24' y='128' width='200' height='40' rx='8' fill='#f1f5f9' stroke='#94a3b8' stroke-width='1.2'/><text x='124' y='153' fill='#475569' font-size='12'>MEMORY.md 索引（每行一条）</text><line x1='224' y1='78' x2='268' y2='78' stroke='#10b981' stroke-width='1.6' marker-end='url(#m1)'/><defs><marker id='m1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#10b981'/></marker></defs><rect x='270' y='30' width='200' height='86' rx='10' fill='#e0f2fe' stroke='#0ea5e9' stroke-width='1.5'/><text x='370' y='52' fill='#0c4a6e' font-weight='600'>召回</text><text x='370' y='70' fill='#0284c7' font-size='11'>请求时：轻量模型选</text><text x='370' y='86' fill='#0284c7' font-size='11'>最多 5 条（失败退关键词）</text><text x='370' y='102' fill='#0284c7' font-size='11'>→ 才加载正文</text><rect x='270' y='128' width='200' height='40' rx='8' fill='#f1f5f9' stroke='#94a3b8' stroke-width='1.2'/><text x='370' y='153' fill='#475569' font-size='12'>build_system：背景知识 ≠ 命令</text><line x1='470' y1='78' x2='514' y2='78' stroke='#0ea5e9' stroke-width='1.6' marker-end='url(#m1)'/><rect x='516' y='30' width='140' height='86' rx='10' fill='#fef3c7' stroke='#f59e0b' stroke-width='1.5'/><text x='586' y='52' fill='#78350f' font-weight='600'>提取</text><text x='586' y='70' fill='#b45309' font-size='11'>回合结束后</text><text x='586' y='86' fill='#b45309' font-size='11'>候选要带 scope</text><text x='586' y='102' fill='#b45309' font-size='11'>persistent 才存</text><rect x='516' y='128' width='140' height='40' rx='8' fill='#f1f5f9' stroke='#94a3b8' stroke-width='1.2'/><text x='586' y='153' fill='#475569' font-size='12'>临时要求不持久</text><line x1='586' y1='168' x2='586' y2='196' stroke='#f59e0b' stroke-width='1.4' stroke-dasharray='5,3'/><rect x='516' y='198' width='140' height='46' rx='10' fill='#fef2f2' stroke='#ef4444' stroke-width='1.5'/><text x='586' y='218' fill='#991b1b' font-weight='600'>整理</text><text x='586' y='234' fill='#ef4444' font-size='11'>达 10 条 → 合并+快照回滚</text><rect x='24' y='200' width='466' height='44' rx='10' fill='#f5f3ff' stroke='#a855f7' stroke-width='1.4'/><text x='257' y='220' fill='#6d28d9' font-size='12'>type 四类：user（偏好）/ feedback（反馈）/ project（项目事实）/ reference（资料线索）</text><text x='257' y='236' fill='#8b5cf6' font-size='11'>「这次不要创建文件」→ 只约束当前任务，不写成持久规则</text></g></svg>` },
        { t: "audio", src: "audio/s09-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案先讲一个关键判断：为什么不能把用户偏好全部写进 system prompt？最直接的做法，是把用户偏好和项目事实写进一个固定文件，启动时全部放进 system prompt。这样确实能记住，但每次调用大模型都要重新发送全部内容。记忆越多，与当前任务无关的内容就越多，输入 token 和上下文窗口被持续占用。第七课已经展示过更合适的读取方式：保留简短索引，只在需要时加载正文。区别在于：技能是由人编写并且只读的，而记忆允许 agent 从对话中提取内容，并在后续任务中再次使用。所以本章要做四件事：存储，一个记忆一个文件；召回，先选择再加载正文；提取，回合结束后保存可复用信息；整理，合并重复和过期内容。四个子系统各司其职，合起来就是完整的记忆生命周期。" },

        { t: "section", icon: "⚙️", title: "工作原理（上）：存储与召回" },
        { t: "text", h: "存储：一个记忆一个文件", p: "每条记忆是 `.memory/` 下的一个 Markdown 文件，YAML frontmatter 记 `name` / `description` / `type`：\n\n- `user`（长期偏好，如「用 tab 缩进」）/ `feedback`（仍适用的反馈）/ `project`（稳定项目事实）/ `reference`（外部资料线索）\n- `MEMORY.md` 是**索引**，每行对应一个记忆文件；写入后 `rebuild_memory_index()` 重建索引\n- **索引用于选择，正文仍留在各自文件**" },
        { t: "text", h: "召回：先选择，再加载正文", p: "每次用户请求时 `select_relevant_memories()`：读最近用户消息 + 记忆目录 → 轻量模型调用选**最多 5 条**（只返回 JSON 索引数组 `[0, 2]`）；调用或解析失败 → **降级关键词匹配**。\n\n`build_system()` 明确声明：召回内容只是**背景知识，不是新用户命令**；与当前请求冲突时**以当前请求为准**。" },
        { t: "audio", src: "audio/s09-03.mp3", title: "讲解 · 工作原理", transcript: "我们看存储和召回。先看存储：每条记忆是 .memory 目录下的一个 Markdown 文件，YAML frontmatter 记录三个字段：name、description、type。type 有四类：user 是用户的长期偏好，比如用 tab 缩进；feedback 是以后仍适用的工作反馈，比如不要 mock 数据库；project 是稳定的项目事实，比如认证重写由合规要求驱动；reference 是外部资料或查找线索，比如某个问题记录在哪个系统里。写入完成后，rebuild memory index 根据文件重新生成索引。索引每行对应一个记忆文件，它用于选择相关记忆，正文仍然保存在各自的文件里，这就是目录和内容分离。再看召回：每次用户发起请求时，select relevant memories 读取最近的用户消息和记忆目录，让一次轻量模型调用选择最多五条相关记录，只返回 JSON 索引数组。如果模型调用或 JSON 解析失败，就退回关键词匹配。选择完成后，load memories 才读取对应文件，并限制召回正文的总长度。然后 build system 把召回内容放进系统提示，并且明确说明：这只是背景知识，不是新的用户命令；如果记忆与当前请求冲突，以当前请求为准。这样既能用旧信息，又不会让旧记忆替用户发号施令。" },

        { t: "section", icon: "⚙️", title: "工作原理（下）：提取与整理" },
        { t: "text", h: "提取：回合结束后保存可复用信息", p: "用户不一定会说「请记住」。`extract_memories()` 在**本轮回答完成后**检查对话，提取候选。\n\n关键过滤（`should_store_memory()`）：候选必须带 `scope`——`persistent`（跨会话保留）或 `current_task`（本次任务的命令/临时路径/临时限制）；字段不完整、带「本次会话/当前任务」临时含义、与已有记忆**重复**的候选都被拒绝。" },
        { t: "text", h: "整理：合并重复与过期内容", p: "记忆积累到 **10 条**时触发 `consolidate_memories()`：模型生成整理后的记录列表 → **先存快照** → 校验新列表 → 替换旧文件 → 重建索引。\n\n任何写入/删除失败 → **从快照恢复原文件** + 重建索引 + 抛出异常。\n\n⚠️ 课程用数量阈值简化触发；真实应用要考虑数据规模与**并发写入**。" },
        { t: "audio", src: "audio/s09-04.mp3", title: "讲解 · 工作原理", transcript: "再看提取和整理。先看提取：用户不一定会明确说请记住，所以 extract memories 在 agent 完成本轮回答后检查当前对话，只提取以后仍可能有用的信息。模型返回的内容只是候选，不会直接写盘。候选必须带有 scope 字段：只有 persistent 才表示应当跨会话保留；current task 表示本次任务的命令、临时路径和临时限制。should store memory 函数负责最后的检查：字段不完整的、带有本次会话或当前任务这种临时含义的、或者与已有记忆重复的候选，都会被拒绝。比如这次不要创建文件，只约束当前任务，就不应该写成下一次会话的持久规则。再看整理：记忆文件积累到一定数量后，内容可能重复、矛盾或过期。课程实现是达到十条时调用 consolidate memories，让模型生成一份整理后的记录列表。整理过程先解析并校验新列表，再替换旧文件。替换前保存快照；删除或写入失败时，从快照恢复原文件并重建索引。这里有个工程提醒：课程用数量阈值简化触发条件，真实应用还需要根据数据规模和并发方式，决定何时整理、如何避免多个进程同时改写同一份存储。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：记忆是「可复用知识的资产化」", p: "压缩（s08）是**应急**——允许丢细节；记忆是**资产**——选择性地把值得留的留下来。\n\n索引常驻、正文按需（同 s07），是上下文管理的同一套哲学。" },
        { t: "text", h: "② 一个类比：人脑的记忆机制", p: "短期记忆 = 上下文窗口（会满）；长期记忆 = 记忆文件（跨会话）。\n\n提取 = 事后复盘哪些值得记；整理 = 定期整理笔记、合并重复、划掉过期。" },
        { t: "text", h: "③ 延伸：为什么「以当前请求为准」是产品底线", p: "旧记忆可能过期、可能冲突。若让旧记忆压过新指令 → 用户会觉得 AI 不听话。\n\n**记忆永远低于用户当前意图的优先级**，这是信任的基础。" },
        { t: "audio", src: "audio/s09-05.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是记忆的可复用知识资产化。上一课的压缩是应急机制，允许丢细节；记忆是资产，选择性地把值得留的留下来。索引常驻、正文按需，和第七课技能加载是同一套哲学。第二，打个比方，这就是人脑的记忆机制：短期记忆是上下文窗口，会满；长期记忆是记忆文件，跨会话。提取就是事后复盘哪些值得记，整理就是定期整理笔记、合并重复的、划掉过期的。第三，一个产品底线：为什么记忆以当前请求为准？旧记忆可能过期、可能冲突，如果让旧记忆压过新指令，用户会觉得 AI 不听话。记忆永远低于用户当前意图的优先级，这是信任的基础。对产品经理来说，这一课最重要的问题是：你愿意让 AI 记住关于你的什么？好的记忆产品，是让用户对 AI 记住的东西有掌控感。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么召回先做「选择」再「加载」？", p: "选择 = 只读索引（轻、便宜），加载 = 读正文（重、占上下文）。\n\n如果全加载，就是回到「全量塞 system prompt」的老路；**选择是召回的成本闸门**。" },
        { t: "text", h: "难点 2：模型召回失败为什么降级关键词匹配？", p: "记忆系统不能因模型抖动而瘫掉。\n\n关键词匹配 = **确定性兜底**：效果差一些，但永远可用、可预期。" },
        { t: "text", h: "易错点 3：scope 检查为什么是关键安全点", p: "没有 scope → 模型把临时命令（「这次别建文件」）当成持久偏好存下来 → **下次会话执行过期约束**，用户困惑。\n\nscope 是「记忆污染」的过滤器。" },
        { t: "text", h: "核心设计决策", p: "**提取是候选制、写盘要审批。** 模型可以提议记忆，harness 负责筛选（scope + 非临时 + 非重复），最后才落盘。" },
        { t: "audio", src: "audio/s09-06.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么召回是先选择再加载？选择只读索引，便宜；加载读正文，贵而且占上下文。如果全加载，就回到了全量塞 system prompt 的老路。选择是召回的成本闸门。第二，为什么模型召回失败要降级关键词匹配？记忆系统不能因为模型抖动就瘫掉。关键词匹配是确定性兜底，效果差一些，但永远可用、可预期。第三，一个容易踩的安全点：scope 检查。如果没有 scope，模型可能把临时命令，比如这次别建文件，当成持久偏好存下来，下次会话就会执行过期约束，用户会很困惑。scope 是记忆污染的过滤器。第四，核心设计决策：提取是候选制，写盘要审批。模型可以提议记忆，但 harness 负责筛选，看 scope、看是否临时、看是否重复，最后才落盘。这和我们真实生活的记忆管理一样：不是每句话都值得记，值得记的才记，而且要定期整理。下一课，我们把记忆的粒度升级：从偏好到可协调的任务状态。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "Memory 与 s07 Skill Loading 有何异同？为什么不能直接全量注入 system prompt？", a: "同：都是「**索引常驻 + 正文按需**」的上下文管理模式——目录/索引进 system prompt，完整内容按需加载。\n\n异：Skill 由人编写、只读、内容稳定；Memory 由 Agent **从对话中提取**、动态增长、会过期，需要校验与整理。\n\n不能全量注入：每次调用 LLM 都重发全部记忆，记忆越多 → 无关内容越多 → token 与上下文窗口被持续占用 → 相关指令被稀释。\n\n产品启示：记忆功能的价值不在「存得多」，而在「找得准、注入得少」。" },
        { t: "qa", q: "「提取是候选制、写盘要审批」——scope 机制解决了什么问题？", a: "问题：模型在回合结束后自动提取记忆，但**模型提议 ≠ 值得保存**——可能把临时命令（「这次别建文件」）、会话细节（「临时路径 /tmp/x」）、重复内容当成持久偏好。\n\n解法：候选必须带 `scope`（persistent / current_task），`should_store_memory()` 过滤：① scope 不是 persistent 就拒；② 带「本次会话/当前任务」临时含义就拒；③ 与已有记忆重复就拒。\n\n本质：**写入权限不在模型，在 harness 的规则层**。防止「记忆污染」——过期约束跨会话生效会让用户觉得 AI 不听话。" },
        { t: "qa", q: "（难点）consolidate_memories 为什么要「先存快照、失败回滚」？", a: "整理是**批量替换**：解析新列表 → 删除旧文件 → 写入新文件 → 重建索引。\n\n风险：中途失败（写入中断、模型输出不合法）会留下**半替换状态**——部分旧记忆已删、部分新记忆未写、索引错乱，等于记忆库损坏。\n\n快照回滚保证：任何一步失败 → 恢复全部原文件 + 重建索引 + 抛出异常。\n\n产品启示：任何「批量重写持久数据」的操作都必须**原子化**（全成功或全回滚）；真实系统还要处理并发写入与数据规模。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s09_memory/code.py\n```\n\n1. 输入 `I prefer using tabs for indentation. Remember that.` → 检查 `.memory/` 新增文件、`MEMORY.md` 出现索引\n2. 输入 `q` 退出并重跑，问 `What indentation style do I prefer?` → 新会话能召回\n3. 再存一条与代码格式无关的偏好，问缩进问题 → 只加载相关记忆\n4. 输入 `Do not create files in this session.` → 这条临时要求**不会**成为下会话的持久规则\n\n**观察重点**：`.memory/` 保存了什么？新会话是否只取回相关内容？" },
        { t: "audio", src: "audio/s09-07.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。记忆系统四件事：存储，一个记忆一个文件，frontmatter 记录名字、描述和类型；召回，先选择最多五条相关记忆，再加载正文，失败降级关键词匹配；提取，回合结束后模型提出候选，harness 用 scope 和重复检查把关，只有 persistent 的才落盘；整理，达到十条就合并整理，失败从快照回滚。一个记忆文件，就是 agent 跨会话的资产。建议你到试一下板块跑四个实验，特别留意最后一条：说一句本次会话不要创建文件，然后重开程序，看看它有没有变成持久规则——应该没有。这就是记忆系统的分寸感。下一课，我们要从偏好记忆升级到任务状态：把任务、状态、依赖关系保存到磁盘，让进度可恢复。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "Memory 解决了跨会话保留信息，但复杂任务还需要**记录每一步的状态和依赖关系**——仅靠对话里的 TODO，程序退出后就没法追踪进度了。\n\n**下一课 s10 Task System** → 把任务、状态和依赖关系保存到磁盘。" },
        { t: "tip", text: "一句话记住 S09：**值得留的才留，留了能找回来。** 提取是候选制、写盘要审批；索引常驻、正文按需。" }
      ]
    },
    {
      id: "s10",
      num: "10",
      title: "Task System",
      desc: "可协调的任务状态",
      color: "#4f46e5",
      blocks: [
        { t: "lead", text: "第十课把任务从「执行清单」升级为「可协调的任务系统」：**大目标拆成小任务、排好序、持久化**——`.tasks/{id}.json` + `blockedBy` 依赖图 + `owner` 分工。" },

        { t: "section", icon: "❓", title: "问题：TodoWrite 管不了依赖和分工" },
        { t: "text", h: "核心问题", p: "s05 的 TodoWrite 让 Agent 记录**当前任务**的执行步骤，每项只有内容和状态。\n\n但真实项目是：「建数据库表」→「写 API」→「加测试」——**数据库表完成才能写 API，API 定下来才能加测试**。Harness 需要知道这些关系、谁负责哪个任务：\n\n- `blockedBy`：记录前置任务（依赖）\n- `owner`：记录负责执行的 Agent\n- **TodoWrite 没有这些**——它只能显示「还没做完」，无法判断「能不能开始」" },
        { t: "audio", src: "audio/s10-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第十课，Task System，任务系统。第五课我们实现了 TodoWrite，让 agent 记录当前任务的执行步骤，清单里的每一项只有内容和状态，用来提醒它接下来还要做什么。但真实项目要复杂得多：比如项目被拆成创建数据库表、编写 API、添加测试三个任务，harness 还需要知道它们之间的关系——数据库表完成后才能编写 API，API 接口确定后才能添加测试。每个任务还要记录由谁负责。TodoWrite 没有记录这些依赖和分工。它可以显示编写 API 仍未完成，但 harness 无法据此判断这个任务是否可以开始。更关键的是，TodoWrite 存在进程里，程序一退出，进度就没了。这一课我们加入 Task System：每个任务都有独立的 ID 和状态，blockedBy 记录前置任务，owner 记录负责执行的 agent，任务以 JSON 文件的形式持久化到磁盘。从执行清单，升级到可协调、可恢复的任务系统。" },

        { t: "section", icon: "💡", title: "解决方案：Task System vs TodoWrite" },
        { t: "table", head: ["维度", "TodoWrite (s05)", "Task System (s10)"], rows: [["定位", "当前任务的执行清单", "可恢复的任务系统"], ["存储", "进程内 / 会话状态", ".tasks/{id}.json"], ["依赖", "无", "blockedBy 依赖图"], ["生命周期", "当前会话", "跨会话保留"], ["分工", "不负责任务认领", "owner / claim"], ["粒度", "Agent 自己的步骤", "可认领、追踪、解锁的任务"]] },
        { t: "svg", caption: "任务 DAG：依赖图与解锁链", svg: `<svg viewBox='0 0 680 260' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><defs><marker id='d1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6366f1'/></marker></defs><rect x='40' y='80' width='180' height='54' rx='11' fill='#ecfdf5' stroke='#10b981' stroke-width='1.6'/><text x='130' y='103' fill='#065f46' font-weight='600'>schema ✅ completed</text><text x='130' y='121' fill='#059669' font-size='11'>task_a1b2c3d4</text><rect x='290' y='30' width='180' height='54' rx='11' fill='#eef2ff' stroke='#6366f1' stroke-width='1.6'/><text x='380' y='53' fill='#1e1b4b' font-weight='600'>endpoints</text><text x='380' y='71' fill='#6366f1' font-size='11'>in_progress · owner=agent</text><rect x='290' y='140' width='180' height='54' rx='11' fill='#eef2ff' stroke='#6366f1' stroke-width='1.6'/><text x='380' y='163' fill='#1e1b4b' font-weight='600'>tests 🔒</text><text x='380' y='181' fill='#6366f1' font-size='11'>pending · blockedBy endpoints</text><rect x='520' y='140' width='140' height='54' rx='11' fill='#f1f5f9' stroke='#94a3b8' stroke-width='1.5'/><text x='590' y='163' fill='#475569' font-weight='600'>docs</text><text x='590' y='181' fill='#94a3b8' font-size='11'>pending · 等 schema</text><line x1='220' y1='107' x2='288' y2='70' stroke='#6366f1' stroke-width='1.6' marker-end='url(#d1)'/><line x1='470' y1='70' x2='560' y2='140' stroke='#94a3b8' stroke-width='1.4' stroke-dasharray='5,3' marker-end='url(#d1)'/><line x1='470' y1='107' x2='220' y2='107' stroke='#94a3b8' stroke-width='1.4' stroke-dasharray='5,3' marker-end='url(#d1)'/><line x1='380' y1='107' x2='380' y2='138' stroke='#6366f1' stroke-width='1.6' marker-end='url(#d1)'/><text x='250' y='56' fill='#6366f1' font-size='11'>完成→解锁 endpoints+docs</text><text x='443' y='130' fill='#6366f1' font-size='11'>完成→解锁 tests</text><rect x='30' y='216' width='630' height='28' rx='7' fill='#fef9c3'/><text x='345' y='235' fill='#854d0e' font-size='11'>两阶段构建：先 create_task 拿 ID，再用 update_task 加 blockedBy 边（防环、防自依赖）</text></g></svg>` },
        { t: "audio", src: "audio/s10-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案的核心是把任务变成一等公民。每个任务是一个独立的 JSON 文件，存在 .tasks 目录下，里面有六个字段：ID、主题、描述、状态、负责人、前置任务列表。ID 用 task 前缀加八位随机十六进制字符，创建文件时用排他写入，如果 ID 撞了，就重新生成。任务系统提供六个工具：创建任务、更新依赖、认领任务、完成任务、查看详情、列举任务。其中 create task 只负责创建节点，返回运行时生成的 ID；update task 用返回的 ID 加依赖边，把 blockedBy 填上。为什么要两阶段构建？因为模型可能在一条回复里同时发出多个工具调用，而这些同级调用在任何工具结果产生之前就已经确定了，所以一个 create task 无法直接使用另一个调用刚生成的 ID。先建节点，后建边，这就是任务图的构建顺序。依赖检查是 can start：一个任务只有在它的所有前置任务全部完成后才能开始。认领任务时，如果状态不是待办，或者依赖没完成，就拒绝。完成任务时，扫描所有其他任务，找出刚刚被解锁的下游任务，一并报告。整个系统持久化在 .tasks 目录，跨会话进度可恢复。" },

        { t: "section", icon: "⚙️", title: "工作原理：数据结构与状态机" },
        { t: "code", lang: "python", code: `@dataclass
class Task:
    id: str            # task_ + 8 位随机 hex（排他写入，撞了就重生成）
    subject: str
    description: str
    status: str        # pending | in_progress | completed
    owner: str | None  # 负责的 Agent
    blockedBy: list[str]

def can_start(task_id) -> bool:
    return not incomplete_dependencies(load_task(task_id))

def claim_task(task_id, owner="agent") -> str:
    # pending 且依赖全部 completed 才可认领 → owner + in_progress
    ...
def complete_task(task_id, owner="agent") -> str:
    # in_progress 且 owner 匹配 → completed + 解锁下游（报告 Unblocked: ...）
    ...

# 两阶段构建：
schema    = create_task("setup database schema")
endpoints = create_task("create API endpoints")
update_task(endpoints.id, addBlockedBy=[schema.id])   # 用返回的 ID 建边
claim_task(schema.id)      # ✓ pending → in_progress → completed
complete_task(schema.id)   # ✓ → 解锁 endpoints / docs` },
        { t: "text", h: "", p: "- **状态机**：`pending —claim→ in_progress —complete→ completed`（动作 vs 状态）\n- **update_task 校验**：目标与依赖必须存在；目标必须 pending 且无人认领；**不能自依赖、不能成环**（传递依赖检测）；重复加边安全\n- **can_start**：`blockedBy` 全部 completed（文件缺失也算未完成）\n- **complete 解锁**：完成后扫描，报告「刚刚解锁」的下游任务\n- **跨会话**：`.tasks/` 还在，Agent 读文件即可恢复进度" },
        { t: "audio", src: "audio/s10-03.mp3", title: "讲解 · 工作原理", transcript: "我们深入看实现。先看数据结构：Task 是一个 dataclass，六个字段。ID 是 task 前缀加八位随机十六进制字符，TaskStore 用排他写入创建文件，如果 ID 已存在就重新生成，保证唯一。create task 检查主题，分配随机 ID，把任务写入 JSON 文件，新任务的 blockedBy 固定为空，工具结果把运行时生成的 ID 返回给模型。update task 用这个 ID 添加依赖。它会先校验整次修改，再统一保存：目标任务和依赖必须存在；目标必须仍是待办且无人认领；不能形成自依赖或环——代码里做了传递依赖检测，如果加这条边会形成环就拒绝；重复添加已有依赖是安全的，不会产生重复边。can start 判断依赖是否全部完成。claim task 是认领：状态不是待办，或者依赖没完成，都拒绝；通过就设置 owner，状态改成进行中。complete task 完成：状态必须是进行中，owner 必须匹配，完成后扫描所有其他任务，找出刚刚被解锁的下游任务，在返回消息里报告。get task 返回完整 JSON，list tasks 返回一行摘要。跨会话时，.tasks 目录还在，agent 读文件就能恢复进度。这就是从执行清单到可协调任务状态的升级。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：任务系统 = 持久化的「目标分解 + 依赖调度」", p: "TodoWrite 是**单任务步骤提醒**；Task System 是**多任务调度**：谁先做、谁等谁、谁负责，全部落盘。\n\n这是多 Agent 协作（s13）与产品项目管理的公共底座。" },
        { t: "text", h: "② 一个类比：工程排期", p: "前置任务是打地基，后续任务是盖楼、装门窗。\n\n`blockedBy` = 紧前工序；`can_start` = 工序能否开工；`complete 解锁` = 完成一项、放行下一项（关键路径思维）。" },
        { t: "text", h: "③ 延伸：为什么「两阶段构建 + 防环」是调度正确性的前提", p: "同级工具调用之间拿不到对方的运行时 ID → 必须先建节点再建边。\n\n环 = 死锁（谁也等不到谁）→ 防环校验是**调度不会卡死**的保证。" },
        { t: "audio", src: "audio/s10-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是持久化的目标分解加依赖调度。TodoWrite 是单任务步骤提醒，Task System 是多任务调度：谁先做、谁等谁、谁负责，全部落盘。这是后面多 agent 协作课和产品项目管理的公共底座。第二，打个比方，这就是工程排期：前置任务是打地基，后续任务是盖楼、装门窗。blockedBy 对应紧前工序，can start 对应工序能否开工，完成解锁对应完成一项放行下一项，这背后是项目管理里的关键路径思维。第三，为什么两阶段构建加防环是调度正确性的前提？因为模型在一条回复里发出的同级工具调用，在任何工具结果产生之前就已经确定，拿不到彼此的运行时 ID，所以必须先建节点再建边。而环意味着死锁：A 等 B、B 等 A，谁也等不到谁。防环校验是调度不会卡死的保证。对产品经理来说，这一课告诉我们：任务系统的价值不只是列清单，而是让整个团队知道现在该做什么、下一步谁解锁谁。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么 create 和 update 必须分两阶段？", p: "同级 tool_use 在**结果产生前就已确定**，create 的 ID 是运行时生成的——另一条调用拿不到。\n\n**先建节点拿 ID，再建边**；这是工具并行调用的协议约束。" },
        { t: "text", h: "难点 2：防环校验为什么用「传递依赖检测」？", p: "只检查直接依赖不够——A 依赖 B、B 依赖 C、C 想依赖 A，直接看是干净的，实际成环。\n\n沿 `blockedBy` 链传递探测目标，**能发现间接环**。" },
        { t: "text", h: "易错点 3：complete 为什么要校验 owner？", p: "多 Agent 场景（s13）下，谁认领谁负责——**别的 Agent 不能替别人完成任务**。\n\nowner 校验是任务所有权边界的起点。" },
        { t: "text", h: "核心设计决策", p: "**状态可恢复、调度可推理。** 一切落盘 + 依赖成图 + 动作受规则约束（认领/完成/加边都有前置条件）。" },
        { t: "audio", src: "audio/s10-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么 create 和 update 必须分两阶段？因为模型在一条回复里发出的同级工具调用，在任何工具结果产生之前就已经确定，而 create task 返回的 ID 是运行时生成的，另一条调用根本拿不到。所以必须先建节点拿到 ID，再建边。这是工具并行调用的协议约束。第二，防环校验为什么用传递依赖检测？只检查直接依赖是不够的：A 依赖 B、B 依赖 C、C 想依赖 A，直接看每一对都是干净的，但整体已经成环。代码沿 blockedBy 链传递探测目标，能发现间接环。第三，一个容易忽略的点：complete 为什么要校验 owner？在多 agent 场景下，谁认领谁负责，别的 agent 不能替别人完成任务。owner 校验是任务所有权边界的起点。第四，核心设计决策：状态可恢复、调度可推理。一切落盘、依赖成图、动作受规则约束，认领、完成、加边都有前置条件。这套规则保证了无论模型多激进，任务系统都不会陷入死锁或者被随意篡改。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "Task System 相比 TodoWrite 解决了哪三个本质问题？", a: "① **依赖缺失**：TodoWrite 每项只有内容+状态，无法判断「能不能开始」；Task System 用 `blockedBy` 依赖图 + `can_start` 决定可执行性。\n② **分工缺失**：TodoWrite 无归属；Task System 有 `owner` / claim / complete 的 owner 校验，多 Agent 各司其职。\n③ **持久化缺失**：TodoWrite 在进程内，退出即丢；Task System 存 `.tasks/{id}.json`，跨会话读文件恢复进度。\n\n本质升级：从「提醒 Agent 别忘了步骤」（无状态）→「让 Harness 能调度与恢复」（有状态、可推理）。" },
        { t: "qa", q: "为什么任务图要「两阶段构建」（先建节点再建边）？直接建边不行吗？", a: "协议约束：一条回复里的**同级工具调用在结果产生前就已确定**——`create_task` 的 ID 是运行时生成并返回的，另一条并发的 `update_task` 拿不到这个 ID。\n\n所以必须：① 先 create 全部节点（拿到各自 ID）；② 再用返回的 ID 调 update 加 `blockedBy` 边。\n\n产品启示：**依赖运行时产物（ID、token、结果）的操作，必须按阶段串行**；这也是为什么工具系统里「先创建后引用」是通用模式。" },
        { t: "qa", q: "（难点）`update_task` 的防环校验为什么必须做传递检测？", a: "直接检查只能发现 `A→A` 自依赖。间接环更隐蔽：A→B、B→C、再加 C→A，直接依赖列表各自合法，整体却死锁——没有任何任务能解锁。\n\n传递检测：沿目标任务的 `blockedBy` 链递归/迭代探测，若发现目标依赖链上已包含自己，则拒绝加边。\n\n环 = 调度死锁（谁都在等别人）。防环是**任务系统不会自我卡死**的底线，也是 DAG 语义（有向无环）的强制保证。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s10_task_system/code.py\n```\n\n试试这些 prompt：\n\n1. `Create tasks: setup database schema, create API endpoints (depends on schema), write tests (depends on endpoints), write docs (depends on schema)`\n2. `List all tasks and their statuses`\n3. `Claim the first unblocked task and complete it`\n4. `List tasks again — which ones are now unblocked?`\n\n**观察重点**：`.tasks/` 下是否生成 JSON 文件？完成任务后，被阻塞的任务是否解锁？" },
        { t: "audio", src: "audio/s10-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。Task System 把任务升级成可协调、可恢复的系统：每个任务一个 JSON 文件，有独立的 ID、状态、负责人和前置依赖。两阶段构建先建节点再建边，防环校验保证不卡死，can start 决定谁能开工，claim 认领、complete 完成并解锁下游。相比 TodoWrite，它多了依赖、分工和持久化。建议你到试一下板块跑一跑，重点观察：.tasks 目录里的 JSON 文件、完成任务后报告里出现的一行 Unblocked 列表。你会看到，一个任务完成后，下游任务像多米诺骨牌一样被依次放行。下一课，我们要解决另一个工程问题：有些任务特别慢，比如全量测试、安装依赖、部署，能不能放到后台跑，agent 先干别的？" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "任务图有了，但全量测试、安装依赖、部署这类命令**可能跑很久**——同步执行时 Agent Loop 会一直卡在工具调用上，什么都干不了。\n\n**下一课 s11 Background Tasks** → 把慢操作放后台，Agent 继续干别的，完成后再收通知。" },
        { t: "tip", text: "一句话记住 S10：**先建节点，再建边；认领才做，完成解锁。** 任务落盘，进度可恢复，调度可推理。" }
      ]
    },
    {
      id: "s11",
      num: "11",
      title: "Background Tasks",
      desc: "慢操作放后台",
      color: "#0891b2",
      blocks: [
        { t: "lead", text: "第十一课让**慢操作放后台**：`run_in_background: true` → 后台线程执行 → 先回占位结果，Agent Loop 继续跑，后续轮次再收 `<task_notification>`。" },

        { t: "section", icon: "❓", title: "问题：慢命令同步执行，整个 Loop 被卡住" },
        { t: "text", h: "核心问题", p: "读文件、跑 `git status` 很快，同步等没问题；但**安装依赖、完整测试、构建项目**可能持续几分钟。\n\n命令返回前：Harness 无法处理当前响应里的下一个工具调用，也进不了下一轮。\n\n**如果后续工作不依赖这条命令，继续等待就没必要**——Agent 启动完整测试后，本可以同时检查文档、整理文件，同步执行却让整个 Loop 停在那次 Bash 调用上。" },
        { t: "audio", src: "audio/s11-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第十一课，Background Tasks，后台任务。前面所有的工具调用都是同步执行的：读文件、跑 git status，这些很快，等一下就等一下就无所谓。但有一类命令特别慢：安装依赖、执行完整测试、构建项目，可能持续几分钟。命令返回之前，harness 无法处理当前响应中的下一个工具调用，也不能进入下一轮。如果后续工作并不依赖这条命令，继续等待就没有必要了。比如 agent 启动完整测试后，本来还可以检查文档、整理其他文件，但同步执行会让整个 agent loop 停在这条 bash 调用上。这就好像你点了一份外卖要等四十分钟，结果你在收银台站着等，什么别的事都不做。这一课要解决的问题就是：让耗时的 bash 命令在后台执行，agent loop 可以继续处理其他工作，完成后再来收集结果。核心思想一句话：慢操作放后台，主循环继续跑。" },

        { t: "section", icon: "💡", title: "解决方案：显式后台 + 占位结果 + 通知收集" },
        { t: "table", head: ["", "同步 (s04)", "后台 (s11)"], rows: [["慢操作", "当前工具调用被阻塞", "后台线程执行"], ["Agent Loop", "等待命令返回", "收到占位结果后继续运行"], ["结果", "命令结束后返回", "先返回 bg_id，后续轮次收集"], ["判断标准", "—", "bash 的 run_in_background 参数"]] },
        { t: "svg", caption: "后台执行：占位返回 → 继续工作 → 通知收集", svg: `<svg viewBox='0 0 680 300' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><defs><marker id='b1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6366f1'/></marker></defs><rect x='24' y='24' width='150' height='40' rx='8' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='99' y='48' fill='#1e1b4b' font-size='12'>LLM 请求 bash</text><text x='99' y='62' fill='#6366f1' font-size='10'>run_in_background=true</text><line x1='174' y1='44' x2='208' y2='44' stroke='#6366f1' stroke-width='1.5' marker-end='url(#b1)'/><rect x='210' y='24' width='200' height='40' rx='8' fill='#ecfdf5' stroke='#10b981' stroke-width='1.5'/><text x='310' y='41' fill='#065f46' font-weight='600'>后台线程执行</text><text x='310' y='56' fill='#059669' font-size='11'>BackgroundManager.start()</text><rect x='210' y='76' width='200' height='30' rx='7' fill='#d1fae5'/><text x='310' y='96' fill='#047857' font-size='11'>立即返回占位：[bg_0001 started]</text><line x1='410' y1='44' x2='444' y2='44' stroke='#6366f1' stroke-width='1.5' marker-end='url(#b1)'/><rect x='446' y='24' width='210' height='40' rx='8' fill='#fef3c7' stroke='#f59e0b' stroke-width='1.5'/><text x='551' y='41' fill='#78350f' font-weight='600'>Agent Loop 继续跑</text><text x='551' y='56' fill='#b45309' font-size='11'>下轮：read_file 等照常执行</text><rect x='210' y='150' width='200' height='36' rx='8' fill='#e0f2fe' stroke='#0ea5e9' stroke-width='1.5'/><text x='310' y='166' fill='#0c4a6e' font-weight='600'>完成 → 结果入队</text><text x='310' y='181' fill='#0284c7' font-size='11'>_ready 队列（加锁）</text><line x1='310' y1='112' x2='310' y2='148' stroke='#10b981' stroke-width='1.4' stroke-dasharray='5,3' marker-end='url(#b1)'/><line x1='310' y1='186' x2='310' y2='218' stroke='#0ea5e9' stroke-width='1.5' marker-end='url(#b1)'/><rect x='24' y='220' width='490' height='54' rx='10' fill='#f5f3ff' stroke='#a855f7' stroke-width='1.5'/><text x='269' y='242' fill='#6d28d9' font-weight='600'>下一轮开始时 inject_background_results()</text><text x='269' y='260' fill='#8b5cf6' font-size='12'>以 &lt;task_notification&gt; 独立事件加入对话</text><text x='269' y='274' fill='#8b5cf6' font-size='11'>不复用 tool_use_id → 一个 tool_use 只对应一个 tool_result</text><rect x='520' y='220' width='136' height='54' rx='10' fill='#fef2f2' stroke='#ef4444' stroke-width='1.5'/><text x='588' y='240' fill='#991b1b' font-weight='600'>退出清理</text><text x='588' y='257' fill='#ef4444' font-size='11'>独立进程组</text><text x='588' y='272' fill='#ef4444' font-size='11'>SIGTERM 停原组</text></g></svg>` },
        { t: "code", lang: "python", code: `def should_run_background(tool_name, tool_input) -> bool:
    # 不猜 install/build/test 关键词，只看显式参数
    return tool_name == "bash" and tool_input.get("run_in_background") is True

class BackgroundManager:
    def start(self, block) -> str:
        # 登记任务 → daemon 线程跑 _run() → 立即返回 bg_id
    def _run(self, task_id, command):
        output, exit_code = _run_bash_process(command)   # 独立进程组
        status = "completed" if exit_code == 0 else "failed"
        with self._lock:
            self.tasks[task_id]["status"] = status
            self.results[task_id] = _format_bash_result(output, exit_code)
            self._ready.append(task_id)

def inject_background_results(messages):
    # 下一轮开始时：_ready 队列 → <task_notification> 独立事件
    for note in BACKGROUND.collect():
        messages.append({"role": "user", "content": note})

# 循环里：
while True:
    inject_background_results(messages)      # 先收已完成的后台结果
    response = client.messages.create(...)

def execute_tool(block) -> str:
    blocked = trigger_hooks("PreToolUse", block)
    if should_run_background(block.name, block.input):
        task_id = start_background_task(block)
        return f"[Background task {task_id} started]"
    return call_tool(block)                  # 其余仍同步` },
        { t: "audio", src: "audio/s11-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案分三块：显式请求、后台执行、通知收集。第一，显式请求。模型通过 bash 工具的 run in background 参数请求后台执行，只有参数明确为 true 并且工具是 bash，才会进入后台执行路径，其他调用仍然同步。这里特别强调：不再根据 install、build、test 这些关键词猜测是否后台。为什么？关键词猜测不可靠，也可能误伤快命令。是否进后台，由工具调用明确决定。第二，后台执行。BackgroundManager 保存任务状态和完成队列。start 先登记任务，再启动一个 daemon 线程执行命令，并立即返回 bg id。命令以非零状态退出，或者 worker 抛出异常，任务就进入 failed。Shell 在独立的进程组中启动，命令完成、超时，或者 agent 正常退出，运行时都会停止原进程组。注意，这只是生命周期清理，不是沙箱。第三，通知收集。后续轮次开始时，collect 从完成队列取出结果，格式化成 task notification 通知。通知不复用原始的 tool use ID，因为原始调用已经用占位结果回复过了，后续收集用独立事件的形式加入对话。一个工具调用仍然只对应一个工具结果，协议上保持干净。三块合起来，就是慢操作放后台、主循环继续跑、完成再收通知。" },

        { t: "section", icon: "⚙️", title: "工作原理：生命周期与协议细节" },
        { t: "text", h: "", p: "- **should_run_background**：只看 `run_in_background is True` + `bash`，**不猜关键词**——显式优先，可预期\n- **BackgroundManager**：`tasks`（状态）+ `results`（输出）+ `_ready` 队列 + `threading.Lock`；daemon 线程执行，**独立进程组**运行，退出时清理（完成/超时/正常路径/SIGTERM 停止原进程组）\n- **通知协议**：`<task_notification>` 是**独立事件**，不复用 `tool_use_id`——一个 tool_use 永远只对应一个 tool_result（先占位，后通知）\n- **循环集成**：每次调 LLM 前 `inject_background_results()` 收集已完成结果；后台结果**不主动唤醒** Agent，下一轮才可见\n- **权限不降级**：`PreToolUse` 仍在主线程先执行，后台执行也过权限钩子" },
        { t: "audio", src: "audio/s11-03.mp3", title: "讲解 · 工作原理", transcript: "我们深入看工作原理。BackgroundManager 有四个数据结构：tasks 字典存任务状态，results 字典存输出，ready 队列存已完成的任务 ID，还有一个线程锁保护并发访问。start 方法先登记任务，再启动 daemon 线程运行 run 方法，然后立刻返回 bg id。run 方法在后台执行命令，根据退出码判断 completed 还是 failed，加锁更新状态、写入结果、把任务 ID 追加进 ready 队列。Shell 在独立的进程组里启动：命令完成、超时，或者 agent 经正常路径、SIGTERM 退出时，运行时都会停止原进程组。这里要强调，这只是生命周期清理，不是沙箱——另建 session 的进程仍可能离开该进程组。循环的集成点有两个：每次调用大模型之前，先执行 inject background results，把 ready 队列里的结果格式化成 task notification 事件，追加进对话；execute tool 在主线程执行 PreToolUse 钩子，然后根据 should run background 决定同步还是后台。有一个关键设计：后台结果不会主动唤醒 agent，而是等下一轮进入循环时才被收集。所以你可能多等一轮，但绝不会有消息风暴打断主循环。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：异步执行 = 把「等待」还给系统，把「时间」还给 Agent", p: "同步模型里，慢命令阻塞的是一整个 Loop；异步模型里，慢命令和主循环**并行**。\n\n这是从「单线程办事」到「事件驱动」的第一步（s12 的定时器继续这个方向）。" },
        { t: "text", h: "② 一个类比：外卖与堂食", p: "同步 = 站在收银台等外卖做完；后台 = 点完单先逛商场，取餐提醒响了再去拿。\n\n通知收集 = 顺路看手机有没有取餐通知，而不是守着出餐口。" },
        { t: "text", h: "③ 延伸：为什么「不主动唤醒」是深思熟虑的设计", p: "后台完成即插队进对话 → 模型上下文被随意打断、每轮多一次调用。\n\n**轮询式收集**（下一轮才可见）牺牲一点实时性，换**可控、可预期**的上下文节奏。" },
        { t: "audio", src: "audio/s11-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是异步执行，把等待还给系统，把时间还给 agent。同步模型里，慢命令阻塞的是一整个 loop；异步模型里，慢命令和主循环并行。这是从单线程办事到事件驱动的第一步，下一课的定时任务继续这个方向。第二，打个比方，同步就是站在收银台等外卖做完，后台就是点完单先逛商场，取餐提醒响了再去拿。这里的通知收集，就是顺路看一眼手机有没有取餐通知，而不是守在出餐口。第三，一个深思熟虑的设计：为什么后台结果不主动唤醒 agent？如果完成就立刻插队进对话，模型的上下文会被随意打断，每一轮都可能多一次调用。轮询式收集，也就是下一轮才可见，牺牲一点实时性，换来可控、可预期的上下文节奏。对产品经理来说，这一课有个很朴素的启示：异步交互的产品，用户会觉得它更聪明——因为它等待的时候，还在干活。这就是用户体验里的并发感。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么不用关键词（install/test/build）判断后台？", p: "关键词猜测**不可靠且不可预期**：`pip install` 可能很快、`echo test` 可能误判。\n\n**显式参数**把决策权交给模型与调用方——意图明确，行为可预测。" },
        { t: "text", h: "难点 2：为什么通知不复用 tool_use_id？", p: "原始 tool_call 已用占位 `tool_result` 回复过——**一个 tool_use 只能对应一个 tool_result**（协议约束）。\n\n复用会破坏一对一；`<task_notification>` 作为独立事件，协议干净。" },
        { t: "text", h: "易错点 3：后台 ≠ 沙箱（进程组清理的边界）", p: "独立进程组 + 退出清理只保证**生命周期**；另建 session 的子进程仍可能存活。\n\n权限与隔离仍是 s03 权限管线 + s14 之后的职责，后台不包办安全。" },
        { t: "text", h: "核心设计决策", p: "**主循环永不被慢操作阻塞。** 显式后台 + 占位返回 + 轮询收集（不唤醒、不插队、一对一的协议）。" },
        { t: "audio", src: "audio/s11-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么不用关键词判断后台？install、build、test 这些关键词猜测不可靠也不可预期：pip install 可能很快，echo test 可能被误判。显式参数把决策权交给模型和调用方，意图明确，行为可预测。这是工程上最朴素的道理：不要猜，要问。第二，为什么通知不复用 tool use ID？因为原始的工具调用已经用占位结果回复过了，一个工具调用只能对应一个工具结果，这是协议约束。复用会破坏一对一，所以后台完成结果用 task notification 作为独立事件加入对话，协议保持干净。第三，一个容易误解的点：后台不等于沙箱。独立进程组和退出清理只保证生命周期——命令完成、超时、agent 退出时停掉原进程组。但另建 session 的子进程仍可能离开进程组存活。真正的权限和隔离，是权限管线和后面 MCP 插件的职责，后台执行不包办安全。最后记住核心设计：主循环永不被慢操作阻塞，显式后台、占位返回、轮询收集，不唤醒、不插队、协议一对一。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "后台任务的核心价值是什么？「异步」对 Agent 产品意味着什么？", a: "核心价值：**主循环不被慢操作阻塞**。同步模型里，一条几分钟的命令让整个 Loop 停摆，其他工具调用和推理全部排队；异步模型里，慢命令在后台线程跑，Agent 同时处理其他工作（读配置、整理文件），完成后再收通知。\n\n对产品意味着「**并发感**」：AI 等待时还在干活，用户感知为高效；同时异步让长任务（安装、测试、部署）变得可用，否则 Agent 只能做短平快的事。\n\n实现要点：显式 `run_in_background` 参数（不猜关键词）+ 占位返回 + 后续轮次轮询收集。" },
        { t: "qa", q: "为什么后台通知必须用独立的 `<task_notification>` 而不是复用 tool_use_id？", a: "协议约束：**一个 tool_use 只能对应一个 tool_result**。原始 tool_call 已经用占位 `tool_result`（`[Background task bg_0001 started]`）回复过了，复用 ID 会破坏一对一关系，产生孤立或重复结果，API 校验失败。\n\n正确做法：完成结果以独立事件（`<task_notification>`）在后续轮次加入对话——它是「新消息」，不是「旧调用的结果」。\n\n通用原则：**异步任务的「提交」与「完成」是两次独立事件**，各走各的协议通道。" },
        { t: "qa", q: "（难点）「后台结果不主动唤醒 Agent」是缺陷还是设计？", a: "是设计。若完成即唤醒：① 模型上下文被**随意打断**，推理节奏不可控；② 每完成一个任务就插队一次，长任务多时会形成**消息风暴**；③ 实现复杂（回调、中断处理）。\n\n轮询式（下一轮 `inject_background_results()` 才收集）：牺牲一点实时性（可能多等一轮），换来**可控、可预期**的上下文节奏。\n\n产品权衡：实时性敏感的场景（如用户等待的 UI 反馈）可以轮询得更勤；后台长任务的最终通知可以做成用户主动问「装好了吗」才注入——本质是**谁决定上下文节奏**的问题。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s11_background_tasks/code.py\n```\n\n试试这些 prompt：\n\n1. `Run pip list in the background and find all Python files in this directory`\n2. `Run npm install (use run_in_background) and while waiting, read package.json`\n3. `Run a short sleep in the background, then list all Markdown files`\n\n**观察重点**：显式设 `run_in_background` 后命令是否进后台？`bg_id` 是否返回？后续轮次是否以 `<task_notification>` 收集完成结果？" },
        { t: "audio", src: "audio/s11-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。慢操作放后台，主循环继续跑。模型通过 run in background 参数显式请求后台执行，harness 先回一个带 bg id 的占位结果，agent 继续干别的活，下一轮开始时再收集完成的结果，以 task notification 的独立事件加入对话。三个要点：显式参数不猜关键词；占位结果保证工具调用和结果的一对一；后台结果不主动唤醒，轮询收集保持上下文节奏可控。还有一句提醒：后台是生命周期清理，不是沙箱，安全靠权限管线。建议你到试一下板块跑一跑，观察 bg id 的返回和 task notification 的收集。下一课，我们把异步再往前推一步：不是等命令自己跑完，而是给 agent 装上闹钟，定时去做某件事。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "后台任务解决了「慢操作不阻塞」，但还缺**定时触发**：「每天早上 9 点跑测试」「每 5 分钟检查一次服务器状态」。\n\n**下一课 s12 Cron Scheduler** → 给 Agent 装一个闹钟。" },
        { t: "tip", text: "一句话记住 S11：**慢操作放后台，主循环继续跑。** 显式参数、占位返回、轮询收集；后台是异步，不是沙箱。" }
      ]
    },
    {
      id: "s12",
      num: "12",
      title: "Cron Scheduler",
      desc: "按时间启动任务",
      color: "#7c3aed",
      blocks: [
        { t: "lead", text: "第十二课给 Agent 装一个**闹钟**：`schedule_cron` 保存执行时间 → 调度线程到点入队 → Agent 空闲时把 `[Scheduled] …` 作为新任务交给 Loop。" },

        { t: "section", icon: "❓", title: "问题：没有组件检查「现在几点了」" },
        { t: "text", h: "核心问题", p: "s11 解决了命令开始后怎么跑（后台），但**不记录某项工作应该在什么时间开始**，也没有组件持续检查当前时间。\n\n「每天早上 9 点跑测试」「每 30 分钟检查 CI 状态」——只靠当前 Agent Loop，用户每次到点还得**重新发一次 prompt**。\n\nHarness 需要：保存执行时间 → 到点把 prompt 放进待执行队列 → Agent 空闲时交给 Loop。" },
        { t: "audio", src: "audio/s12-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第十二课，Cron Scheduler，定时任务调度器。上一课我们让慢命令在后台跑，但这解决的是命令开始之后的执行方式，它不记录某项工作应该在什么时间开始，也没有组件持续检查当前时间。比如用户说每天早上九点跑测试，每三十分钟检查一次 CI 状态。只靠当前的 agent loop，用户每次到点还得重新发一次 prompt，这体验太原始了。Harness 需要做三件事：保存执行时间；到点之后把对应的 prompt 放进待执行队列；再在 agent 空闲的时候，把队列里的任务交给 agent loop 处理。这一课，我们给 agent 装一个闹钟：注册定时任务，时间到了，闹钟响，agent 自动开工。实现上需要调度线程和队列处理线程两个后台角色，再加上三个新工具：schedule cron 注册、list crons 查看、cancel cron 取消。" },

        { t: "section", icon: "💡", title: "解决方案：CronJob + 双线程 + 三工具" },
        { t: "text", h: "一个例子", p: "注册 `0 9 * * *` + `run tests` → 调度线程在本地时间 **09:00** 匹配 → 把 `[Scheduled] run tests` 放进 `cron_queue` → 队列处理线程等 Agent **空闲**后启动一轮 Loop → 模型调用 Bash 执行测试。" },
        { t: "code", lang: "python", code: `@dataclass
class CronJob:
    id: str
    cron: str            # 五段式：分 时 日 月 周
    prompt: str          # 触发后交给 Agent 的任务
    recurring: bool
    durable: bool        # True → 持久化到 .scheduled_tasks.json
    pending_delivery: bool = False   # 已到期、尚未被模型接收
    last_fired: str | None = None    # 防同分钟重复入队

# 调度线程：每秒读本地时间，到期先入队
def poll_due_jobs(moment):
    minute_marker = moment.strftime("%Y-%m-%d %H:%M")
    for job in list(scheduled_jobs.values()):
        if job.pending_delivery or job.last_fired == minute_marker:
            continue
        if cron_matches(job.cron, moment):
            _enqueue_due_job(job, minute_marker)   # 先保存状态，再入队；失败恢复

# 队列处理线程：不看时间，只等 Agent 空闲
def queue_processor_loop(stop_event=RUNTIME_STOP):
    while not stop_event.wait(0.2):
        if not has_cron_queue() or not agent_lock.acquire(blocking=False):
            continue
        try:
            if has_cron_queue():
                run_agent_turn_locked()
        finally:
            agent_lock.release()

# Agent Loop 取出到期任务，作为新用户消息
fired = consume_cron_queue()
for job in fired:
    messages.append({"role": "user", "content": f"[Scheduled] {job.prompt}"})` },
        { t: "audio", src: "audio/s12-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案是三个新工具加两个后台线程。三个工具：schedule cron 注册定时任务，list crons 查看所有任务，cancel cron 取消任务。每个定时任务是一个 CronJob，保存 cron 表达式、要执行的 prompt、是否重复、是否持久化，还有两个运行期字段：pending delivery 表示任务已经到期但还没被模型接收，last fired 防止同一分钟重复入队。两个线程分工明确：调度线程每秒读取一次本地时间，检查有没有到期的任务，有就把对应 prompt 放进内存队列；队列处理线程不看时间，只检查队列是不是空的，并且用一把非阻塞的锁确认 agent 当前空闲，空闲就把队列里的任务取出来，启动一轮 agent loop。为什么不用同一个线程干两件事？因为调度是时间敏感的，必须准时；而交付要等 agent 空闲，不能打断用户正在进行的回合。分工之后，时间归时间，交付归交付，互不干扰。到期先入队有个细节：入队前先保存 pending delivery 和 last fired 状态，如果持久化失败就恢复原状态，绝不把只存在于内存里的任务暴露给队列处理线程。" },

        { t: "section", icon: "⚙️", title: "工作原理：五段式 Cron 与交付协议" },
        { t: "text", h: "五段式 cron 表达式", p: "`分钟 小时 日 月 星期`：\n\n- `* * * * *` 每分钟 · `0 9 * * *` 每天 09:00 · `*/5 * * * *` 每 5 分钟 · `0 9 * * 1-5` 工作日 09:00\n- 支持 `*` / `*/N` / `N` / `N-M` / `N,M,...`；`schedule_job()` 先 `validate_cron()` 拒绝字段数或取值范围错误的表达式" },
        { t: "text", h: "交付协议（至少一次交付）", p: "- 模型调用**失败** → 从会话移除消息，任务**放回队列**重试\n- 模型**成功接收** → 一次性任务删除；周期任务清除 `pending_delivery` 等下次匹配\n- **至少一次交付**：进程若在「模型接收后、状态写回前」退出，重启后同一任务可能再次交付（可接受，任务应幂等）" },
        { t: "text", h: "持久化与运行边界", p: "- `durable=True` → `.scheduled_tasks.json`（临时文件 + `os.replace()` 原子更新；损坏时启动日志报错，不静默忽略）；重启后重新加载\n- 调度用**本地时间**；进程关闭调度线程停止；`durable` 只保留任务定义；**重启不补跑停机期间错过的触发点**\n- 定时回合运行在队列线程：需交互确认的工具调用会被拒绝（不与主终端抢输入）；导入 `code.py` 不启动线程" },
        { t: "audio", src: "audio/s12-03.mp3", title: "讲解 · 工作原理", transcript: "我们深入看工作原理。先看 cron 表达式，五段式：分钟、小时、日、月、星期。星号是每分钟，零九是每天九点，斜杠五开头是每五分钟，零九加周一到周五是工作日九点。本章支持星号、斜杠 N、单值、范围 N-M 和列表 N 逗号 M。注册任务时先调用 validate cron 校验，字段数量不对或者取值范围错误直接拒绝。再看到期交付：调度线程每秒读一次本地时间，用当前分钟做一个标记，任务已经到期、或者这一分钟已经触发过，就跳过；表达式匹配就把任务入队。入队前先写 pending delivery 和 last fired，持久化失败就恢复，保证内存状态和磁盘一致。队列处理线程每零点二秒醒来一次：队列空，或者 agent 锁拿不到，就继续等；拿到了锁说明 agent 空闲，就跑一轮 loop，把队列里的到期任务作为带 Scheduled 前缀的用户消息追加进对话。如果模型调用失败，这些消息会从会话移除，任务重新放回队列。成功接收后，一次性任务删除，周期任务清掉 pending delivery 等下一次。最后是持久化边界：durable 为真就写进 scheduled tasks JSON 文件，用临时文件加原子替换更新；重启后重新加载。至少要交付一次：进程若在模型接收后、状态写回前退出，同一任务重启后可能再次交付，所以任务最好设计成幂等的。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：从「轮询世界」到「事件驱动」", p: "s11 是命令跑完**等下一轮问**；s12 是**时间到了主动注入**——Agent 从被动响应变成主动工作。\n\n调度线程（感知时间）+ 队列线程（协调交付）+ 主循环（执行），是经典生产者-消费者模型。" },
        { t: "text", h: "② 一个类比：闹钟与秘书", p: "闹钟负责「时间到」（调度线程），秘书负责「老板空了再汇报」（队列线程）。\n\n老板（Agent Loop）不被闹钟打断手头的事，忙完自然看到新任务。" },
        { t: "text", h: "③ 延伸：为什么要区分 durable 与内存任务", p: "一次性临时任务（「一小时后提醒我」）写盘是浪费；长期任务（「每天 9 点跑测试」）必须写盘防丢失。\n\n**按价值选持久化**——磁盘是有代价的，不是所有状态都值得落盘。" },
        { t: "audio", src: "audio/s12-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是从轮询世界到事件驱动。上一课，命令跑完了要等下一轮才问；这一课，时间到了会主动注入。agent 从被动响应变成主动工作。调度线程感知时间，队列线程协调交付，主循环执行，这是经典的生产者消费者模型。第二，打个比方，闹钟和秘书：闹钟负责时间到，秘书负责老板空了再汇报。老板就是 agent loop，它不被闹钟打断手头的事，忙完自然看到新任务。第三，为什么区分 durable 和内存任务？一次性临时任务，比如一小时后提醒我，写盘是浪费；长期任务，比如每天九点跑测试，必须写盘防止丢失。按价值选持久化，磁盘是有代价的，不是所有状态都值得落盘。对产品经理来说，这一课的价值在于理解：让 AI 主动工作，是产品从工具变成伙伴的关键一步。闹钟就是那个让 AI 记住承诺、按时履约的机制。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么「到期先入队」要先持久化状态？", p: "先入队再写盘 → 进程崩溃时队列里出现**磁盘上不存在的任务**（幽灵任务）。\n\n先保存 `pending_delivery`/`last_fired` 再入队；持久化失败 → **恢复状态、不入队**。" },
        { t: "text", h: "难点 2：为什么交付要「Agent 空闲」而不是到点就插入？", p: "定时任务直接插进正在进行的对话 → 打断用户回合、模型上下文被注入异物。\n\n`agent_lock` 非阻塞获取 = 忙时排队，闲时交付——**不打断，只提醒**。" },
        { t: "text", h: "易错点 3：为什么重启不补跑错过的触发点？", p: "补跑 = 停机期间攒一堆过期任务轰炸模型。\n\n「重启只恢复定义、不追历史」——错过就错过，保证行为可预期。" },
        { t: "text", h: "核心设计决策", p: "**时间归调度器，交付归协调器，执行归主循环。** 生产者-消费者解耦，各管一摊。" },
        { t: "audio", src: "audio/s12-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么到期先入队之前要先持久化状态？如果先入队再写盘，进程刚好在中间崩溃，队列里就会出现磁盘上不存在的幽灵任务。所以代码先保存 pending delivery 和 last fired，持久化失败就恢复状态、不入队，保证内存和磁盘一致。第二，为什么交付要等 agent 空闲而不是到点就插入？如果到点直接把定时任务插进正在进行的对话，会打断用户回合，模型上下文被注入异物。用 agent lock 非阻塞获取，忙的时候排队，闲的时候交付。不打断，只提醒。第三，为什么重启不补跑错过的触发点？补跑意味着停机期间攒了一堆过期任务，一启动就轰炸模型。重启只恢复定义、不追历史，错过就错过，行为可预期。第四，核心设计决策：时间归调度器，交付归协调器，执行归主循环。生产者消费者解耦，各管一摊。这一课的设计原则，在后面 agent 团队协作课里还会以更复杂的形式出现，值得现在先吃透。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "Cron Scheduler 如何实现「到点触发但又不打扰 Agent 当前工作」？", a: "两个线程分工 + 一把锁：\n\n① 调度线程：每秒读本地时间，表达式匹配且该分钟未触发过 → 把 prompt 入队（先持久化状态再入队，防幽灵任务）；\n② 队列处理线程：每 0.2 秒检查队列，用 `agent_lock.acquire(blocking=False)` **非阻塞**获取——Agent 忙（锁被占）就跳过，空闲才启动一轮 Loop 交付 `[Scheduled] …` 消息。\n\n效果：任务准时到期、但不打断用户回合，模型上下文不会被随意注入；实现上是生产者-消费者模型。\n\n产品价值：让 Agent「**主动履约**」（每天 9 点跑测试）而不是「等用户想起」。" },
        { t: "qa", q: "为什么设计成「至少一次交付」而不是「恰好一次」？有哪些取舍？", a: "至少一次：进程在「模型已接收 prompt、但确认状态未写回」的窗口崩溃 → 重启后同一任务可能再次交付。\n\n恰好一次需要：两阶段提交/事务性写回 + 幂等去重，复杂度高、延迟大；对 Agent 定时任务来说，重复执行一次测试/检查的代价远低于**漏执行**。\n\n取舍结论：任务应设计为**幂等**（重复跑无害），接受偶发重复，换取实现的简单与可靠。\n\n产品通用原则：**通知/任务系统里「漏了」比「重了」更不可接受**——重了可以幂等消解，漏了无法自动弥补。" },
        { t: "qa", q: "（难点）durable 与非 durable 任务、重启不补跑，这两个设计分别解决什么问题？", a: "durable：解决**进程重启后任务丢失**。长期任务（每天 9 点测试）写 `.scheduled_tasks.json`（临时文件 + `os.replace()` 原子替换，损坏时启动日志报错不静默），重启加载；一次性临时提醒只在内存，重启消失——**按价值选持久化**。\n\n不补跑：解决**过期任务轰炸**。若重启时把停机期间错过的每个触发点都补一轮 Loop，模型一启动就被一堆过期指令淹没，行为不可预期。重启只恢复定义、不追历史。\n\n工程要点：至少一次交付 + 幂等任务 + 原子持久化 + 不补跑，组合成可靠的定时语义。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s12_cron_scheduler/code.py\n```\n\n依次输入：\n\n1. `Schedule「run date」every 2 minutes and keep it after restart.`\n2. `List all cron jobs.`\n3. `Cancel the cron job you just created.`\n\n**观察重点**：`.scheduled_tasks.json` 内容；到期后出现的 `[Scheduled] run date` 消息（测试分钟级任务需保持进程运行）。" },
        { t: "audio", src: "audio/s12-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。给 agent 装一个闹钟：三个工具注册、查看、取消定时任务；两个线程分工——调度线程看时间、到期入队，队列处理线程等 agent 空闲再交付。设计要点：先持久化再入队，防幽灵任务；非阻塞锁，不打断用户回合；至少一次交付，任务尽量幂等；durable 决定重启后是否存活；重启不补跑错过的触发点。记住一句总纲：时间归调度器，交付归协调器，执行归主循环。建议你到试一下板块注册一个两分钟的任务，观察 Scheduled 前缀的消息是怎么被注入的，再取消它。下一课，我们进入多智能体时代：不是一堆任务排队等一个 agent 做，而是一群 agent 分工协作。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "调度器能在指定时间启动一轮 Loop，但这一轮**仍由一个 Agent 处理**。面对「同时调查多个模块、并行修改并汇总」的任务，需要把工作分给多个 Agent。\n\n**下一课 s13 Agent Teams** → Lead 分配任务，队友独立执行，通过收件箱返回结果。" },
        { t: "tip", text: "一句话记住 S12：**闹钟响了不打断，agent 空了再开工。** 到期先入队、非阻塞交付、至少一次、幂等任务。" }
      ]
    },
    {
      id: "s13",
      num: "13",
      title: "Agent Teams",
      desc: "团队运行时与协作协议",
      color: "#c026d3",
      blocks: [
        { t: "lead", text: "第十三课让**多个 Agent 组队干活**：Lead 提方案等你确认 → 持久队友独立 Loop（WORK/IDLE）→ 文件收件箱通信 → 共享任务板原子认领 → 可选 worktree 隔离并行修改。" },

        { t: "section", icon: "❓", title: "问题：一个 Agent 装不下整项工作" },
        { t: "text", h: "核心问题", p: "重构整个后端（配置加载、认证、测试）——一个 Agent 可以依次做，但**总耗时更长、早期细节逐渐离开上下文**。这类工作适合并行，但用户只描述目标，不会替运行时设计团队。\n\nHarness 要回答一串相互关联的问题：谁判断并行有用、队友如何保留身份、结果如何自动回给 Lead、空闲队友能否自己接活、并行冲突用哪个目录、关机与审批如何可追踪……" },
        { t: "audio", src: "audio/s13-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第十三课，Agent Teams，团队运行时与协作协议。假设我们让 agent 重构整个后端，工作涉及配置加载、认证和测试。一个 agent 可以依次处理，但总耗时更长，早期细节也会逐渐离开上下文。这类工作适合并行，可用户通常只描述目标，不会替运行时设计团队。Harness 需要回答一组相互关联的问题：谁判断并行是否有用，新增 agent 又由谁确认？每个队友如何跨任务保留身份和上下文？结果如何自动返回给 lead，而不是让模型轮询收件箱？空闲队友能不能直接接手 ready task，不再等 lead 逐项派发？并行修改可能冲突时，任务应该用哪个工作目录？关机和计划审批如何成为可追踪、可执行的协议？这一课，我们给 harness 加一套由 lead 管理的团队运行时：队友独立循环、文件收件箱通信、共享任务板、可选 worktree，加上类型化协议。一句话：一个 agent 装不下整项工作时，就让队友分头完成。" },

        { t: "section", icon: "💡", title: "解决方案：Lead 领导、队友执行、总线通信" },
        { t: "table", head: ["机制", "作用"], rows: [["Lead", "负责用户对话，提分工方案并等确认"], ["队友", "独立 Agent Loop，WORK / IDLE 之间切换"], ["MessageBus", "文件收件箱（.mailboxes/*.jsonl）传消息/结果/控制事件"], ["运行时投递", "消费 Lead 收件箱，把团队事件注入下一轮对话"], ["共享任务板", "空闲队友发现 ready task，锁内原子认领"], ["worktree（可选）", "并行冲突时把任务绑定到另一工作目录"], ["协议与闸门", "类型化关机 + 计划审批；获批前锁修改型工具"]] },
        { t: "svg", caption: "团队架构：Lead 协调、队友执行、总线通信", svg: `<svg viewBox='0 0 680 300' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><defs><marker id='g1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6366f1'/></marker></defs><rect x='24' y='30' width='170' height='64' rx='10' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='109' y='52' fill='#1e1b4b' font-weight='600'>Lead</text><text x='109' y='70' fill='#6366f1' font-size='11'>用户对话 + 提方案</text><text x='109' y='86' fill='#6366f1' font-size='11'>spawn_teammate</text><rect x='24' y='120' width='170' height='40' rx='8' fill='#f8fafc' stroke='#94a3b8' stroke-width='1.2'/><text x='109' y='145' fill='#475569' font-size='11'>任务板（.tasks/）</text><line x1='194' y1='62' x2='252' y2='62' stroke='#6366f1' stroke-width='1.5' marker-end='url(#g1)'/><rect x='254' y='30' width='170' height='64' rx='10' fill='#f5f3ff' stroke='#a855f7' stroke-width='1.5'/><text x='339' y='52' fill='#581c87' font-weight='600'>MessageBus</text><text x='339' y='70' fill='#9333ea' font-size='11'>.mailboxes/*.jsonl</text><text x='339' y='86' fill='#9333ea' font-size='11'>消息/结果/控制事件</text><line x1='424' y1='62' x2='482' y2='62' stroke='#a855f7' stroke-width='1.5' marker-end='url(#g1)'/><rect x='484' y='30' width='172' height='64' rx='10' fill='#ecfdf5' stroke='#10b981' stroke-width='1.5'/><text x='570' y='52' fill='#065f46' font-weight='600'>队友（多个）</text><text x='570' y='70' fill='#059669' font-size='11'>独立 Loop WORK/IDLE</text><text x='570' y='86' fill='#059669' font-size='11'>认领任务 → 干活 → 回结果</text><rect x='484' y='120' width='172' height='40' rx='8' fill='#f0fdf4' stroke='#10b981' stroke-width='1.2'/><text x='570' y='145' fill='#047857' font-size='11'>可选 worktree 隔离目录</text><rect x='24' y='192' width='632' height='84' rx='10' fill='#fef9c3' stroke='#f59e0b' stroke-width='1.4'/><text x='340' y='212' fill='#854d0e' font-weight='600'>关键流程</text><text x='340' y='230' fill='#b45309' font-size='12'>① Lead 提方案 → 用户确认 → 才 spawn_teammate（先认领任务再启动，失败不启动）</text><text x='340' y='248' fill='#b45309' font-size='12'>② 队友 IDLE：先看收件箱，再扫任务板，原子认领（进程锁+文件锁）</text><text x='340' y='266' fill='#b45309' font-size='12'>③ 完成 → 发两个事件：result（干了啥）+ idle_notification（还能接活）→ 运行时注入 Lead 下一轮</text></g></svg>` },
        { t: "audio", src: "audio/s13-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案由七个机制组成。第一，Lead，负责用户对话，收到任务先提出分工方案，明确写出启动队友会改变成本、并发度和可修改工作区的角色集合，等用户确认后才能调用 spawn teammate。第二，队友，是持久执行单元，运行独立 agent loop，在 WORK 和 IDLE 之间切换，直到关机。第三，MessageBus，通过文件收件箱传递普通消息、结果和控制事件，每个 agent 有自己的邮箱文件。第四，运行时投递，消费 lead 的收件箱，把团队事件注入下一轮对话。第五，共享任务板，让空闲队友发现 ready task，并在锁内完成认领。第六，可选 worktree，需要时把任务绑定到另一个工作目录，未绑定任务仍用仓库目录。第七，类型化协议和计划闸门，显式记录关机与审批状态，并在计划获批前阻止修改型工具。任务图继续沿用上一课的两阶段契约：lead 先建节点、再建边、最后分配 ready task。只有 lead 能用 update task，队友只能列举、认领和完成，团队运行期间不能改写任务图结构。注意，后台任务和定时任务没有被带进本章，它们不参与队友通信。" },

        { t: "section", icon: "⚙️", title: "工作原理（上）：Lead 确认、队友循环、文件总线" },
        { t: "text", h: "① Lead 先提团队，等用户确认", p: "system prompt 写明：`When parallel work would help, first propose a small team ... wait for the user's confirmation. Do not call spawn_teammate before the user confirms.`\n\n收到需求 → Lead 只提方案（config/auth/tests 分工）→ 用户说「开始吧」→ 才 `spawn_teammate`（先创建任务、把初始 task_id 传给队友）。**用户给目标，Lead 设计团队，用户确认执行边界。**" },
        { t: "text", h: "② 队友是持久执行单元（vs s06 一次性 Subagent）", p: "- 生命周期：`WORK → IDLE → WORK` 直到关机（s06 一次调用就结束）\n- 上下文：跨任务保留（s06 只服务一个任务）\n- 通信：接收消息并发出事件（s06 单向委派）\n- `spawn_teammate` 在线程启动前**认领初始任务，失败就不启动**；无任务时文件/Shell 工具要求先认领，不回退仓库目录" },
        { t: "text", h: "③ MessageBus：通信放在模型上下文之外", p: "Lead 和队友**不能共享同一个 messages 数组**（否则工具结果互相污染推理）。\n\n每个 Agent 一个 `.mailboxes/<name>.jsonl` 收件箱：`send()` 追加 JSON 行并唤醒（Condition）；`wait_for_messages()` 支持阻塞等待与短时超时。**锁保护并发读写。**" },
        { t: "audio", src: "audio/s13-03.mp3", title: "讲解 · 工作原理", transcript: "先看前三个机制的实现。第一，lead 先提团队再等确认。系统提示词里明确写着：当并行有帮助时，先提出一个分工清晰的小团队，等待用户确认，在用户确认前不要调用 spawn teammate。所以收到第一条需求，lead 只提方案：我建议并行处理三个方向，配置、认证、测试，你确认后我再启动队友。用户回复开始吧，lead 才能 spawn teammate，并且先创建任务，把初始任务 ID 传给队友。这个设计保证：启动队友这种改变成本、并发度和可修改工作区角色集合的动作，永远发生在用户确认之后。第二，队友是持久执行单元，和第六课的一次性 subagent 完全不同：生命周期上，subagent 一次调用就结束，队友在 WORK 和 IDLE 之间切换直到关机；上下文上，subagent 只服务一个任务，队友跨任务保留；通信上，subagent 单向委派返回一次结果，队友双向协作。spawn teammate 在线程启动前认领初始任务，认领失败就不启动队友；队友没有任务时，文件和 shell 工具会要求它先认领，而不是回退到仓库目录。第三，MessageBus 把通信放在模型上下文之外。lead 和队友不能共享同一个消息数组，否则一个队友的工具结果会进入另一个队友的推理上下文。每个 agent 有自己的收件箱文件，send 追加一条 JSON 消息并唤醒等待者，wait for messages 支持阻塞等待。锁保护收件箱文件，避免并发读写。这就是团队通信的地基。" },

        { t: "section", icon: "⚙️", title: "工作原理（中）：运行时投递、结果事件、原子认领" },
        { t: "text", h: "④ 收件箱事件由运行时投递", p: "`read_inbox()` 读取并**删除**收件箱文件 → Lead 只有一个消费者 `consume_lead_inbox()`。\n\n消息到达 → 更新协议状态 → 把 `[Team events]` 注入 history → 启动新一轮 Lead 调用。**`check_inbox` 不是模型工具**——消息到达和消费属于运行时，模型只处理已投递的上下文。" },
        { t: "text", h: "⑤ result 与 idle_notification 是两个事件", p: "队友完成后按顺序发两个事件：\n\n- `result`：这项任务**产出了什么**（「认证已重构，测试通过」）\n- `idle_notification`：这个队友**能否继续接任务**（「Waiting for more work.」）\n\n一个含糊的「完成了」无法同时表达两种状态。空闲队友不退出，直接消息或 ready task 让它回 WORK，`shutdown_request` 触发平滑关机。" },
        { t: "text", h: "⑥ 任务板：发现与认领分离，认领原子化", p: "`scan_unclaimed_tasks()` 只找候选（快照）；所有权变更放进 `claim_task()`，由 `task_store_lock()` 同时取**进程内锁 + 文件锁**：\n\n多个队友可同时发现同一候选，**但只有一个 claim 能推进到 in_progress**；写入用临时文件 + 原子替换；队友完成当前任务才能认领下一项；worktree 绑定损坏 → 认领直接失败，不回退仓库目录。" },
        { t: "audio", src: "audio/s13-04.mp3", title: "讲解 · 工作原理", transcript: "再看三个关键机制。第四，收件箱事件由运行时投递。read inbox 读取并删除收件箱文件，所以 lead 只有一个消费者。消息到达时，CLI 主循环同时等待终端输入和 lead 收件箱：先消费收件箱、更新协议状态、把团队事件注入历史、再启动新一轮 lead 调用。lead 启动队友后结束当前轮次，不用反复调用 list teammates 或 get task 去等结果。注意，check inbox 不是模型工具，消息的到达和消费属于运行时，模型只处理已经投递到上下文里的事件。第五，结果和 IDLE 是两个事件。队友完成一项任务后，按顺序发送两个事件：result 回答这项任务产出了什么，idle notification 回答这个队友能否继续接任务。一个含糊的完成了无法同时表达这两种状态。空闲队友不会退出，直接消息或 ready task 会让它回到工作状态。第六，任务板的发现和认领分成两步，认领必须原子执行。扫描只找候选，候选只是某一时刻的快照，其他队友甚至另一个进程也可能看到同一任务。所以所有权变更放进 claim task，由锁同时取得进程内锁和文件锁：多个队友可以同时发现同一候选，但只有一个认领能推进到进行中。任务内容先写临时文件再原子替换正式文件，队友完成当前任务才能认领下一项。这就是共享任务板的正确性保证。" },

        { t: "section", icon: "⚙️", title: "工作原理（下）：worktree 与类型化协议" },
        { t: "text", h: "⑦ worktree：任务选择工作目录", p: "`Task.worktree` 可选字段。`create_worktree(name, task_id)` **只给 Lead**：任务须 pending、无人认领、未绑定 → 校验名称/路径/分支/Git 注册 → 创建 checkout → 才写绑定。\n\n- 认领时解析目录写入 `teammate_assignments`，队友的 bash/文件/glob 工具都从 assignment 读目录\n- 未绑定任务 → `WORKDIR`；**没认领任务 → 不能用工作区工具**\n- ⚠️ worktree 只分开 Git 目录与分支，**不是安全沙箱**；移除由宿主负责（`remove_worktree` 只供已获用户确认的宿主调用，保留 `wt/<name>` 分支）" },
        { t: "text", h: "⑧ 控制消息：类型 + request_id", p: "关机与审批不能靠猜消息意图，用结构化消息：\n\n```text\nLead 创建 pending 关机请求 → shutdown_request 进队友收件箱\n→ 队友完成当前步骤 → shutdown_response 返回\n→ request_id 找到原请求 → pending→approved → 队友循环退出\n```\n\n**ID 把回复关联到请求，类型阻止不匹配回复，状态阻止重复生效。**" },
        { t: "text", h: "⑨ 计划审批约束执行", p: "`spawn_teammate(..., require_plan=True)` 先认领任务、打开闸门、再启动线程。\n\n闸门：状态是 `required/pending/rejected` 时，队友**可读文件、可提交计划，但不能跑 Shell/写/编辑**；计划获批（`approved`）才放行。认领/释放任务改变 work version → 旧审批失效。" },
        { t: "audio", src: "audio/s13-05.mp3", title: "讲解 · 工作原理", transcript: "再看最后两个机制。第七，worktree，由任务选择工作目录。Task 有一个可选的 worktree 字段。当并行修改需要分开目录时，lead 可以创建并绑定 worktree，比如给认证重构任务绑定 auth refactor。create worktree 只提供给 lead，要求任务处于待办、无人认领且尚未绑定，然后检查名称、路径、分支和 Git 注册信息，创建 checkout，最后才写入任务绑定。如果 Git 报告失败却已经留下分支或注册的 checkout，运行时报告 partial operation，让任务保持未绑定，保留现场供人工恢复。认领任务时，运行时把解析后的目录写入队友分配表，这个队友的 bash、读、写、编辑、glob 工具都从分配表读目录。没有绑定 worktree 的任务解析到仓库目录；没有认领任务的队友不能用这些工作区工具。进程重启后，分配表可以根据持久化任务里的 owner 和 worktree 绑定恢复。要记住：worktree 只分开 Git 工作目录和分支，不是安全沙箱。第八，控制消息用类型加 request id。关机路径：lead 创建待处理请求，进入队友收件箱，队友完成当前步骤，返回响应，request id 找到原请求，状态从待处理变成已批准，队友循环退出。ID 把回复关联到请求，类型阻止不匹配的回复修改状态，状态阻止同一回复重复生效。第九，计划审批约束执行：需要计划的队友，在计划获批前，可以读文件、提交计划，但不能跑 shell、写文件、编辑文件。提交计划时记录当前任务和工作版本，审批返回时两者一致才生效。认领或释放任务会改变工作版本，让旧审批失效。这就是把审批变成可追踪、可执行的协议。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：多 Agent = 「状态分离 + 通信协议化」", p: "上下文**物理隔离**（各自 messages）、通信**文件化**（收件箱）、协作**协议化**（类型 + request_id）、调度**市场化**（共享任务板自取）。\n\n这是一套完整的「组织设计」，不是把循环复制几份。" },
        { t: "text", h: "② 一个类比：项目团队 vs 外包", p: "s06 Subagent = 一次性外包（给任务书收报告）；s13 队友 = **全职团队成员**（有工位、有邮箱、干完自动领下一个活）。\n\nLead = 项目经理，用户 = 老板，老板只批方案，不参与执行细节。" },
        { t: "text", h: "③ 延伸：为什么「先确认再 spawn」是产品底线", p: "并行 = 更多 API 调用、更多并发修改工作区的角色。\n\n**成本与风险的变更必须经用户同意**——这是用户对团队的授权，不是技术细节。" },
        { t: "audio", src: "audio/s13-06.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质，是多 agent 的状态分离加通信协议化。上下文物理隔离，各自有自己的消息列表；通信文件化，靠收件箱；协作协议化，用类型加请求 ID；调度市场化，共享任务板谁有空谁取。这是一套完整的组织设计，不是把循环复制几份那么简单。第二，打个比方，第六课的 subagent 是一次性外包，给任务书、收报告；这一课的队友是全职团队成员：有工位、有邮箱、干完一个自动领下一个活。Lead 是项目经理，用户是老板，老板只批方案，不参与执行细节。第三，为什么先确认再启动是产品底线？因为并行意味着更多的 API 调用，更多的并发修改工作区的角色，这是成本和风险的变更，必须经用户同意。用户对团队的授权，是对方案和边界的授权，不是技术细节。对产品经理来说，这一课给了多智能体产品一个最核心的交互范式：AI 提出分工方案，用户一键确认，AI 各自执行。这个模式，你在很多企业级 agent 产品里都会见到。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么认领必须「进程内锁 + 文件锁」双锁？", p: "进程内锁防本进程队友竞争；**文件锁防多个 Harness 进程**（另一个进程也读写同一任务目录）。\n\n单锁 → 双进程同时认领同一任务 → 所有权撕裂。" },
        { t: "text", h: "难点 2：为什么 result 与 idle_notification 必须分开？", p: "「完成了」既包含产出、又包含空闲状态——一个消息无法同时表达。\n\n分开后：Lead 能区分「队友交活了」和「队友还能接活」，调度信息不失真。" },
        { t: "text", h: "易错点 3：work version 让旧审批失效，解决了什么？", p: "审批针对的是「当前任务 + 当前代码状态」。任务换人、目录换了，旧审批就**不该继续有效**。\n\nversion 变化 → 旧 approval 作废，防止拿着旧批条干新活。" },
        { t: "text", h: "核心设计决策", p: "**发现与认领分离、审批与执行分离、通信与推理分离。** 每个会变的状态都有锁、有 ID、有版本。" },
        { t: "audio", src: "audio/s13-07.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么认领必须进程内锁加文件锁双锁？进程内锁防的是本进程的队友竞争；文件锁防的是多个 harness 进程，因为另一个进程也可能读写同一个任务目录。只加单锁，两个进程就可能同时认领同一个任务，所有权撕裂。第二，为什么 result 和 idle notification 必须分开？因为完成了这三个字，既包含产出信息，又包含空闲状态，一个消息无法同时表达两件事。分开之后，lead 能区分队友交活了和队友还能接活，调度信息不失真。第三，一个容易踩的坑：work version 让旧审批失效。审批针对的是当前任务加当前代码状态，任务换人、目录换了，旧审批就不该继续有效。版本一变，旧 approval 作废，防止队友拿着旧批条去干新活。第四，核心设计决策：发现与认领分离、审批与执行分离、通信与推理分离。每个会变的状态，都有锁、有 ID、有版本。这套组织纪律，是团队运行时不出乱子的根本保证。你会发现，s10 的任务系统、s12 的调度锁、s13 的收件箱与闸门，全部是同一套工程哲学：让并发正确，而不是让并发碰运气。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "s06 Subagent 与 s13 队友的本质区别是什么？分别适合什么场景？", a: "Subagent（s06）：**一次性、单向、轻量**——干净上下文跑一个明确子任务，返回最终文本就结束；适合「读文件总结」「查个测试框架」这类短平快委派。\n\n队友（s13）：**持久、双向、有状态**——WORK/IDLE 循环、跨任务保留上下文、文件收件箱双向通信、可自动认领任务；适合「并行重构多个模块」「长期协作」这类需要身份与协作的工作。\n\n产品决策点：**任务是一次性的还是持续的？** 一次性用 Subagent（便宜简单），持续协作用 Team（贵但值得）。" },
        { t: "qa", q: "「先提方案、等用户确认，再 spawn 队友」这个流程设计想解决什么？", a: "① **成本确认**：并行 = 更多 API 调用、更多并发修改工作区的角色，成本与风险变更必须经用户同意；\n② **边界确认**：分工方案（谁干什么、是否用 worktree）由用户拍板，Lead 不擅自决定；\n③ **可预期性**：系统提示明确「确认前不调用 spawn_teammate」，行为可复现，避免 AI 自作主张启动昂贵流程。\n\n产品范式：**AI 提议 → 用户批准 → AI 执行**。这是多智能体产品与用户的信任契约——把「启动团队」这种高成本动作永远放在用户确认之后。" },
        { t: "qa", q: "（难点）为什么需要「进程内锁 + 文件锁」双锁？只用一个不行吗？", a: "场景：多个队友（线程）**和**另一个 Harness 进程都可能认领同一任务。\n\n- 只有进程内锁：本进程的队友不会撞，但另一个进程的队友照样抢同一任务 → 两个进程都把 owner 写给自己 → 任务所有权撕裂、双份执行。\n- 只有文件锁：进程间安全，但同一进程内多线程排队成本高、易死锁。\n\n双锁：先取进程内锁（快、防线程竞争），再取文件锁（跨进程互斥），任务内容写临时文件后原子替换正式文件。\n\n通用原则：**并发写共享状态，锁的粒度要覆盖所有写入者**——线程、进程、机器（分布式再加分布式锁）。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s13_agent_teams/code.py\n```\n\n输入：\n\n```\n把后端重构拆到共享任务板，在依赖允许时并行完成配置、认证和测试。\n认证任务使用 worktree，保持现有接口，并在最后汇总结果。\n```\n\nLead 提出方案后回复：`开始吧`\n\n**观察重点**：`.tasks/` 的 pending → in_progress → completed；`.mailboxes/` 的 result 与 idle_notification；`.worktrees/` 是否只为绑定任务创建；直接消息是否先于任务板扫描。" },
        { t: "audio", src: "audio/s13-08.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。多 agent 组队干活：lead 提方案、用户确认后才启动队友；队友是持久执行单元，WORK 和 IDLE 之间切换；MessageBus 文件收件箱把通信放在模型上下文之外；运行时自动投递团队事件，模型不用轮询收件箱；共享任务板让空闲队友原子认领 ready task；并行冲突时用 worktree 隔离工作目录；关机与审批用类型加请求 ID 的协议，计划获批前修改型工具被锁住。一句话：上下文分离、通信文件化、认领原子化、审批协议化。建议你到试一下板块跑一次完整流程，观察任务状态流转、邮箱里的两个事件、worktree 目录的出现。下一课，我们要解决外部服务接入的问题：Jira、部署平台、知识库，怎么让它们变成 agent 随手可用的工具。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "Lead 和队友目前只能调用直接写在 `code.py` 里的工具。接入 Jira、部署平台、知识库时，得为每个外部系统**单独写工具定义和调用逻辑**，外部系统一变，课程代码也要跟着改。\n\n**下一课 s14 MCP Tools** → 通过统一的发现与调用协议，在运行时连接外部服务并把它们的工具加入工具池。" },
        { t: "tip", text: "一句话记住 S13：**Lead 提议、用户批准、队友自取。** 状态分离 + 通信文件化 + 认领原子化 + 审批协议化。" }
      ]
    },
    {
      id: "s14",
      num: "14",
      title: "MCP Tools",
      desc: "发现并调用外部工具",
      color: "#0284c7",
      blocks: [
        { t: "lead", text: "第十四课把外部服务变成**动态工具**：MCP 拆成两个角色——server 提供工具列表与调用入口，Harness 负责连接、命名、权限，并把发现的工具交给模型。" },

        { t: "section", icon: "❓", title: "问题：每接一个服务，就要手写一套工具代码" },
        { t: "text", h: "核心问题", p: "基础工具都直接写在 `code.py` 里。接入文档系统、部署平台时，可以继续手写 `search_docs`、`deploy_status`、`trigger_deploy`……但**每增加一个服务**：\n\n- 要重新维护工具定义、参数格式、调用代码\n- 外部系统改了接口 → 课程代码跟着改\n- 工具越来越多，`code.py` 无限膨胀\n\n**MCP 的拆法**：server 提供工具列表和调用入口；Harness 负责连接、命名、权限检查，并把发现的工具交给模型。" },
        { t: "audio", src: "audio/s14-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第十四课，MCP Tools，外部工具协议。前面的基础工具都直接写在 code.py 里。接入文档系统和部署平台时，我们还可以继续手写 search docs、deploy status、trigger deploy 这些工具，但每增加一个服务，都要重新维护工具定义、参数格式和调用代码。服务多了，代码无限膨胀，外部系统一变，课程代码就得跟着改。MCP 把这件事拆成两个角色：server 提供工具列表和调用入口，harness 负责连接、命名、权限检查，并把发现的工具交给模型。连接新 server 之后，模型下一轮就能看到它的工具，就像它们本来就在工具池里一样。这一课的实现有三个部分：MCPClient 保存 server 返回的工具定义和调用入口；connect mcp 连接一个 server 并取得工具列表；assemble tool pool 把基础工具和已连接的 MCP 工具组装到同一个工具池。课程里的 docs 和 deploy 是进程内模拟 server，用来展示 tools list、tools call 和动态工具池，真实的 MCP 传输协议不在本章实现，但协议边界在这里看得清清楚楚。" },

        { t: "section", icon: "💡", title: "解决方案：MCPClient + connect_mcp + 动态工具池" },
        { t: "svg", caption: "MCP 架构：server 提供工具，Harness 连接与分发", svg: `<svg viewBox='0 0 680 300' width='100%' style='max-width:680px' xmlns='http://www.w3.org/2000/svg'><g font-family='system-ui,-apple-system,PingFang SC,sans-serif' font-size='13' text-anchor='middle'><defs><marker id='p1' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6366f1'/></marker></defs><rect x='24' y='30' width='180' height='80' rx='10' fill='#eef2ff' stroke='#6366f1' stroke-width='1.5'/><text x='114' y='52' fill='#1e1b4b' font-weight='600'>Agent Loop</text><text x='114' y='70' fill='#6366f1' font-size='11'>每轮 assemble_tool_pool()</text><text x='114' y='86' fill='#6366f1' font-size='11'>模型只见带前缀工具名</text><line x1='204' y1='70' x2='252' y2='70' stroke='#6366f1' stroke-width='1.5' marker-end='url(#p1)'/><rect x='254' y='30' width='190' height='80' rx='10' fill='#f5f3ff' stroke='#a855f7' stroke-width='1.5'/><text x='349' y='52' fill='#581c87' font-weight='600'>Harness（宿主侧）</text><text x='349' y='70' fill='#9333ea' font-size='11'>前缀 mcp__server__tool</text><text x='349' y='86' fill='#9333ea' font-size='11'>权限策略 allow/confirm</text><line x1='444' y1='70' x2='492' y2='70' stroke='#a855f7' stroke-width='1.5' marker-end='url(#p1)'/><rect x='494' y='30' width='162' height='80' rx='10' fill='#ecfdf5' stroke='#10b981' stroke-width='1.5'/><text x='575' y='52' fill='#065f46' font-weight='600'>MCP Server</text><text x='575' y='70' fill='#059669' font-size='11'>docs / deploy（模拟）</text><text x='575' y='86' fill='#059669' font-size='11'>tools/list + tools/call</text><rect x='24' y='140' width='632' height='40' rx='8' fill='#f8fafc' stroke='#94a3b8' stroke-width='1.2'/><text x='340' y='166' fill='#475569' font-size='12'>connect_mcp("docs") → 下一轮模型看到 mcp__docs__search / mcp__docs__get_version</text><rect x='24' y='196' width='200' height='80' rx='10' fill='#fef3c7' stroke='#f59e0b' stroke-width='1.5'/><text x='124' y='216' fill='#78350f' font-weight='600'>命名规范</text><text x='124' y='234' fill='#b45309' font-size='11'>mcp__{server}__{tool}</text><text x='124' y='250' fill='#b45309' font-size='11'>非法字符→下划线</text><text x='124' y='266' fill='#b45309' font-size='11'>冲突检测 + ≤64 字符</text><rect x='244' y='196' width='200' height='80' rx='10' fill='#fef2f2' stroke='#ef4444' stroke-width='1.5'/><text x='344' y='216' fill='#991b1b' font-weight='600'>权限底线</text><text x='344' y='234' fill='#ef4444' font-size='11'>宿主策略为准</text><text x='344' y='250' fill='#ef4444' font-size='11'>readOnlyHint 不自动放行</text><text x='344' y='266' fill='#ef4444' font-size='11'>未配置 → 默认 confirm</text><rect x='464' y='196' width='192' height='80' rx='10' fill='#e0f2fe' stroke='#0ea5e9' stroke-width='1.5'/><text x='560' y='216' fill='#0c4a6e' font-weight='600'>错误边界</text><text x='560' y='234' fill='#0284c7' font-size='11'>MCP error 返回模型</text><text x='560' y='250' fill='#0284c7' font-size='11'>模型下轮修正参数</text><text x='560' y='266' fill='#0284c7' font-size='11'>不结束 Agent Loop</text></g></svg>` },
        { t: "code", lang: "python", code: `class MCPClient:
    def register(self, tool_defs, handlers):
        self.tools = list(tool_defs)
        self._handlers = dict(handlers)

    def call_tool(self, tool_name, args):
        handler = self._handlers.get(tool_name)
        if not handler:
            return f"MCP error: unknown tool '{tool_name}'"
        try:
            return str(handler(**args))
        except Exception as error:
            return f"MCP error: {type(error).__name__}: {error}"

def connect_mcp(name: str) -> str:
    if name in mcp_clients:
        return f"MCP server '{name}' already connected"
    factory = MOCK_SERVERS.get(name)     # docs / deploy
    if not factory:
        return f"Unknown server '{name}'"
    mcp_clients[name] = factory()
    return f"Connected MCP server '{name}'"

def assemble_tool_pool():
    tools, handlers = list(BASE_TOOLS), dict(BASE_HANDLERS)
    for server, client in mcp_clients.items():
        for tool_def in client.tools:
            prefixed = normalize_mcp_name(server, tool_def["name"])   # mcp__{server}__{tool}
            if prefixed in origins:   # 规范化冲突检测（≤64 字符）
                raise ValueError("MCP tool name collision after normalization")
            tools.append({"name": prefixed, "description": ...,
                          "input_schema": tool_def.get("input_schema")})
            handlers[prefixed] = (lambda *, client=client, tool=tool_def["name"], **kwargs:
                                  client.call_tool(tool, kwargs))     # 默认参数绑定，防闭包陷阱

# 宿主侧权限策略（不信 server 的 readOnlyHint）
MCP_HOST_POLICY = {
    ("docs", "search"): "allow", ("docs", "get_version"): "allow",
    ("deploy", "status"): "allow", ("deploy", "trigger"): "confirm",
}  # 未配置 → 默认 confirm` },
        { t: "audio", src: "audio/s14-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案是三个部分加一套协议约定。第一，MCPClient 保存 server 返回的工具定义和调用入口：register 方法对应工具发现结果，把工具定义和处理函数存下来；call tool 方法对应调用入口，按名字找处理函数，找不到就返回未知工具的错误，执行出错也返回 MCP error，错误不会直接结束 agent loop，而是作为工具结果返回给模型。第二，connect mcp 只负责连接和发现：传一个名字，已经连过就提示已连接，没有这个 server 就提示未知服务器，有就用工厂函数创建 server 并存进客户端表。开始时模型只看到五个基础工具和 connect mcp；调用 connect mcp 连接 docs 之后，下一轮模型就能看到带前缀的工具。第三，assemble tool pool 每轮调用模型前组装工具池：基础工具加上所有已连接 server 的工具，全部塞进同一个工具和处理器表。连接新 server 后，下一轮组装就会把新工具加入模型输入，工具执行结果仍然作为 tool result 追加到消息列表。基础 agent loop 本身不需要任何改动，动态工具池让外部能力像流水一样汇进来。" },

        { t: "section", icon: "⚙️", title: "工作原理：命名、权限、错误边界" },
        { t: "text", h: "前缀命名：mcp__{server}__{tool}", p: "多个 server 都可能提供 `search` / `status` → 用 `mcp__{server}__{tool}` 区分。\n\n`normalize_mcp_name()` 把不适合模型工具名的字符替换为下划线；组装时检查**规范化后的冲突**（`docs.one/get.version` 与 `docs_one/get_version` 不会悄悄撞名）+ **64 字符长度限制**。" },
        { t: "text", h: "handler 闭包陷阱（关键细节）", p: "循环里创建 lambda：`lambda *, client=server, tool=raw_name, **kwargs: client.call_tool(tool, kwargs)`\n\n**默认参数即时绑定** client 和 tool，否则所有 lambda 都指向循环里最后一个工具。" },
        { t: "text", h: "权限由宿主配置决定", p: "server 可能提供 `readOnlyHint` / `destructiveHint`，但**来自 server 的信息不能直接作为授权依据**。\n\n`permission_hook()` 按规范化工具名查 `MCP_HOST_POLICY`：配置了 `allow` 的直接执行、`confirm` 的问用户；**未配置的外部工具默认 confirm**；就算 description 写 readOnly 也不自动放行。" },
        { t: "text", h: "错误留在工具边界内", p: "模型漏传参数、传入 server 不接受的字段 → `execute_tool()` 与 `call_tool()` 捕获异常 → 返回 `MCP error: TypeError: ...` 工具结果。\n\n模型下一轮修正参数，脚本不退出。" },
        { t: "audio", src: "audio/s14-03.mp3", title: "讲解 · 工作原理", transcript: "我们深入看工作原理的四个要点。第一，命名。多个 server 都可能提供 search 或者 status，所以用前缀区分：mcp 双下划线 server 双下划线 tool。normalize 函数把不适合模型工具名的字符替换成下划线，组装工具池时还要检查规范化后的名称冲突和六十四字符长度限制。为什么要检查规范化后的冲突？因为 docs.one 加斜杠 get.version 和 docs 下划线 one 加斜杠 get 下划线 version，规范化之后可能撞成同一个名字，代码会直接报错而不是悄悄映射。第二，闭包陷阱。在循环里创建 lambda 处理函数，必须用默认参数把当前的 client 和 tool 绑进去：lambda 星号、client 等于 server、tool 等于原始名。如果不绑定，Python 闭包捕获的是循环变量，所有 lambda 都会指向循环里最后一个工具。第三，权限。MCP server 可以提供只读提示或者破坏性提示，但这些信息来自 server，不能直接作为授权依据。课程用宿主侧策略：一张表，docs 的 search 和 get version 是允许，deploy 的 status 是允许，trigger 是要确认。permission hook 按规范化后的工具名查这张表，未配置的外部工具默认需要用户确认，就算描述里写着只读也不会自动放行。第四，错误边界。模型可能漏传参数，也可能传入 server 不接受的字段，execute tool 和 call tool 都会捕获异常，返回 MCP error 开头的工具结果，模型下一轮修正参数，脚本不会退出。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：MCP = 工具的「标准化插座」", p: "没有 MCP：每个服务一套自定义接口，Harness 为每个服务写适配代码。\n\n有 MCP：server 实现统一协议（list/call），Harness 一套代码接所有服务——**接口归协议，能力归服务**。" },
        { t: "text", h: "② 一个类比：USB 接口", p: "设备（server）只要做 USB 接口，电脑（Harness）不用为每个设备装专用驱动。\n\n即插即用：连接 → 发现设备 → 设备出现在系统里可用。" },
        { t: "text", h: "③ 延伸：为什么「不信 server 的 readOnlyHint」是安全底线", p: "server 可能配置错误、被攻破或撒谎。**授权依据必须来自宿主侧可信策略**。\n\n外部声明只能作参考，不能作凭据。" },
        { t: "audio", src: "audio/s14-04.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质，是工具的标准化插座。没有 MCP，每个服务一套自定义接口，harness 要为每个服务写适配代码；有 MCP，server 实现统一的协议，提供工具列表和调用入口，harness 一套代码接所有服务。接口归协议，能力归服务。第二，打个比方，这就是 USB 接口：设备只要做 USB 接口，电脑不用为每个设备装专用驱动，插上就能用。MCP 就是 agent 世界的 USB。连接、发现、工具出现在系统里可用，即插即用。第三，一个安全底线：为什么不信 server 的只读提示？因为 server 可能配置错误、被攻破或者撒谎。授权依据必须来自宿主侧的可信策略，外部声明只能作参考，不能作凭据。对产品经理来说，MCP 的意义在于生态：谁掌握了工具接入的标准，谁就掌握了 agent 的能力边界。这也是为什么各家都在推自己的工具协议标准。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：为什么工具池要「每轮组装」而不是连接时固定？", p: "连接发生在对话中途——模型刚连完 docs，这一轮就把新工具交给它。\n\n**每轮组装**让「连接→发现→可用」在同一次对话内闭环，Agent Loop 零改动。" },
        { t: "text", h: "难点 2：为什么 handler 要用默认参数绑定 client/tool？", p: "循环闭包陷阱：所有 lambda 若捕获循环变量，最后全指向**最后一个工具**。\n\n默认参数在定义时求值 → 每个 lambda 绑住自己的 client 和 tool。" },
        { t: "text", h: "易错点 3：为什么权限不信 server 声明？", p: "readOnlyHint 是 server 自报的，可配置错、可被攻破、可撒谎。\n\n**授权必须宿主侧裁决**；未配置默认 confirm（拿不准就问），是权限系统的最低防线。" },
        { t: "text", h: "核心设计决策", p: "**发现与执行走协议，授权与安全归宿主。** 模型只按名字用工具，Harness 管权限与兜底。" },
        { t: "audio", src: "audio/s14-05.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么工具池要每轮组装而不是连接时固定？因为连接发生在对话中途，模型刚连完 docs，这一轮就应该能看到它的工具。每轮组装让连接、发现、可用在同一次对话里闭环，agent loop 本身零改动，这是动态工具池的核心价值。第二，为什么 handler 要用默认参数绑定？这是经典的闭包陷阱：在循环里创建 lambda，如果不把 client 和 tool 作为默认参数绑进去，所有 lambda 捕获的都是循环变量，最后全部指向最后一个工具。默认参数在定义时求值，所以每个 lambda 都绑住自己的那份。第三，一个安全细节：为什么权限不信 server 声明？readOnlyHint 是 server 自报的，可能配置错、可能被攻破、可能撒谎。授权必须由宿主侧裁决，未配置的外部工具默认 confirm，拿不准就问用户，这是权限系统的最低防线。第四，核心设计决策：发现与执行走协议，授权与安全归宿主。模型只按名字用工具，harness 管权限与兜底。这个分工，和第三课权限管线的思路一脉相承：工具可以越来越多，安全底线永远在宿主手里。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "MCP 解决了什么本质问题？没有它会怎样？", a: "本质问题：**外部工具接入的标准化**。没有 MCP，每接一个服务（文档系统、部署平台、Jira）都要手写工具定义、参数格式、调用代码，服务一多，code.py 无限膨胀，外部接口一变就得改代码。\n\nMCP 拆解：server 负责「提供工具列表 + 调用入口」（统一协议 tools/list、tools/call）；Harness 负责「连接 + 命名 + 权限 + 交给模型」（统一实现）。\n\n收益：**一套 Harness 代码接所有 MCP server**，能力即插即用；生态上，谁掌握工具接入标准，谁掌握 agent 能力边界。\n\n产品视角：MCP 是 agent 的「应用商店」——第三方开发者按协议开发 server，用户连接即得能力。" },
        { t: "qa", q: "工具命名为什么用 `mcp__{server}__{tool}` 前缀？直接叫 tool 名不行吗？", a: "① **防同名冲突**：多个 server 都可能提供 `search` / `status`，无前缀 → 工具池里两个同名的工具，模型无法区分、调用歧义；\n② **溯源**：带前缀的模型能看到工具来自哪个 server，调试和权限配置都清晰；\n③ 规范化：非法字符转下划线 + 冲突检测（防止 `docs.one/get.version` 与 `docs_one/get_version` 撞名）+ 64 字符上限。\n\n通用原则：**合并多个来源的同名资源时，命名必须带上来源维度**——这是命名空间的本质。" },
        { t: "qa", q: "（难点）为什么权限要「宿主侧策略」而不是信任 server 的 readOnlyHint？", a: "readOnlyHint/destructiveHint 来自 server 自报：① 可能**配置错误**（开发把破坏性操作标成只读）；② server 可能**被攻破**（提示被篡改）；③ 可能是**恶意的**（诱导授权）。\n\n所以授权依据必须在宿主侧可信配置：`MCP_HOST_POLICY` 显式列出 allow/confirm；未配置默认 confirm（拿不准就问）；description 写 readOnly 也不自动放行。\n\n通用原则：**安全边界永远由信任侧（宿主）裁决，不可由被检查对象（server）自证**——与浏览器不信任网页自报权限同理。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s14_mcp_plugin/code.py\n```\n\n输入：\n\n```\n连接 docs server，搜索 agent hooks，并告诉我当前文档 API 版本。\n```\n\n典型轨迹：`connect_mcp「docs」` → `mcp__docs__search(query=「agent hooks」)` → `mcp__docs__get_version()`\n\n再输入：\n\n```\n连接 deploy server，查看 web 服务状态，不要触发部署。\n```\n\n`status` 按宿主策略直接执行；`trigger` 需要用户确认。\n\n**观察重点**：连接后模型是否看到带前缀的新工具？未配置的工具是否默认要求确认？" },
        { t: "audio", src: "audio/s14-06.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。MCP 把外部服务变成动态工具：server 负责提供工具列表和调用入口，harness 负责连接、命名、权限和分发。connect mcp 连接并发现，assemble tool pool 每轮组装工具池，模型下一轮就能用上新工具，基础循环零改动。三个关键点：前缀命名 mcp 双下划线 server 双下划线 tool，规范化和冲突检测防止撞名；权限由宿主侧策略裁决，未配置默认确认，不信 server 自报的只读提示；错误留在工具边界内，返回给模型让它修正，而不是退出脚本。建议你到试一下板块连接 docs 和 deploy，观察带前缀的工具出现、status 直接执行、trigger 弹确认。下一课，我们终于要把前面所有能力装进同一个运行时：基础工具、hooks、技能、上下文、记忆、任务、后台、定时、团队、MCP，全部合并。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "目前 MCP 还是一条独立的课程分支。\n\n**下一课 s15 Integrated Harness** → 把基础工具、Hooks、Skills、Context、Memory、Task、Background、Cron、Teams 和 MCP 放进**同一个运行时**。" },
        { t: "tip", text: "一句话记住 S14：**接口归协议，能力归服务，授权归宿主。** 连接→发现→命名→权限→交给模型，动态工具池即插即用。" }
      ]
    },
    {
      id: "s15",
      num: "15",
      title: "Integrated Harness",
      desc: "多种机制，一个循环",
      color: "#16a34a",
      blocks: [
        { t: "lead", text: "第十五课把前 14 课的机制**装进同一个循环**：工具、权限、hooks、计划、任务、记忆、技能、压缩、后台、cron、团队、worktree、MCP——多种机制，一个 while True。" },

        { t: "section", icon: "❓", title: "问题：机制很多，但没有一个能长期工作的运行时" },
        { t: "text", h: "核心问题", p: "前面各章把不同机制放在**各自独立的示例**里。一个能长期工作的 coding agent 需要同时拥有：工具分发 + 权限边界、hooks、todo 计划 + 任务图、技能 + 记忆 + prompt 组装、压缩 + 错误恢复、后台 + cron、团队 + 协议 + idle 认领、worktree、MCP 外部工具。\n\n**S15 不引入新机制**，而是展示：现有机制从哪里进入模型循环、它们产生的事件如何回到同一段对话。" },
        { t: "audio", src: "audio/s15-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第十五课，Integrated Harness，集成运行时。前面十四课，我们每课都在独立示例里实现了一个机制：工具分发、权限、hooks、计划、任务、记忆、技能、压缩、后台、定时、团队、worktree、MCP。但一个能长期工作的 coding agent，需要同时拥有所有这些能力。如果它们不能协同，harness 就是一盘散沙。S15 不再引入新机制，而是做一件更重要的事：把前面各章的组件集成到同一个 harness 里，展示每个机制从哪里进入模型循环，以及它们产生的事件如何回到同一段对话。核心目标一句话：多种机制，一个循环。所有的能力，都挂在同一个 while true 上：调用模型，检查响应里有没有 tool use，执行工具，把结果追加回消息列表，继续还是停止，由响应里有没有实际的 tool use 块决定。这个骨架我们从第一课就认识，现在它要承载全部能力。" },

        { t: "section", icon: "💡", title: "解决方案：一个循环，按位置挂全部组件" },
        { t: "text", h: "循环仍是最初的结构", p: "```text\n用户输入 → UserPromptSubmit hooks\n→ cron/background 通知注入 → context compact\n→ memory + skills + MCP 状态组装 system prompt\n→ LLM → 有 tool_use？\n    否 → Stop hooks → 返回\n    是 → PreToolUse hooks + permission\n        → TOOL_HANDLERS / MCP handlers / background dispatch\n        → PostToolUse hooks → tool_result 回 messages → 下一轮\n```" },
        { t: "table", head: ["位置", "组件", "作用"], rows: [["用户输入前后", "UserPromptSubmit hooks", "记录、注入、审计输入"], ["LLM 前", "cron queue", "定时 prompt 注入 messages"], ["LLM 前", "background notifications", "后台完成以 <task_notification> 注入"], ["LLM 前", "compaction pipeline", "大输出→裁历史→旧结果→摘要"], ["LLM 前", "memory / skills / MCP", "组装 system prompt（目录常驻、正文按需）"], ["LLM 调用", "error recovery", "429/529 重试、max_tokens 升级、reactive compact"], ["工具执行前", "PreToolUse + permission", "拦危险命令、越界写、破坏性 MCP"], ["工具分发", "assemble_tool_pool", "内置 + MCP 动态工具"], ["工具执行时", "background dispatch", "显式标记的 bash 入 daemon 线程"], ["工具执行后", "PostToolUse hooks", "大输出告警、日志"], ["停止时", "Stop hooks", "统计、清理、审计"]] },
        { t: "audio", src: "audio/s15-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案是给每个组件在循环里找一个固定的位置。看这张组件位置表：用户输入前后，UserPromptSubmit hooks 负责记录、注入、审计；进入 LLM 之前，cron 队列把到期的定时任务注入消息列表，后台通知把完成的后台任务以 task notification 注入；接着是压缩管线，先压大输出、再裁历史、再压旧工具结果、必要时摘要；然后 memory、skills、MCP 的状态一起组装 system prompt，让模型看到当前能力和长期上下文。LLM 调用这层包了错误恢复：429、529 指数退避重试，max tokens 不够就升级，prompt too long 就触发 reactive compact。工具执行前，PreToolUse hooks 加权限，拦截危险命令、越界写、破坏性 MCP 工具；工具分发由 assemble tool pool 组装内置工具和 MCP 动态工具；显式标记的 bash 进后台线程，主循环先收占位结果；工具执行后 PostToolUse hooks 做告警和日志；本轮没有 tool use 或者要停的时候，Stop hooks 收尾。注意权限没有写死在工具执行行里，而是作为 PreToolUse hook，这样权限、日志、审计都挂在同一个点上，Lead、一次性 subagent、队友的工具都先过这道门。" },

        { t: "section", icon: "⚙️", title: "工作原理（上）：权限、两层计划、两种委派" },
        { t: "text", h: "权限与 hooks（不写死在执行行）", p: "`blocked = trigger_hooks(「PreToolUse」, block)` → 拒绝则追加 `tool_result(block.id, blocked)` 并 continue。\n\n- 权限判断**不信 MCP server 自写 description**：宿主维护已知只读工具名单，其他 MCP 工具一律询问用户\n- 文件工具越 `WORKDIR` 直接拒绝；每条 bash 命令执行前询问\n- **只有前台用户轮次可弹交互确认**；异步轮次直接拒绝需确认的操作（不与主 CLI 抢输入）" },
        { t: "text", h: "两层计划并存", p: "- `todo_write`：当前会话内的轻量计划（内存，整表替换）——帮单个 Agent 不漂移\n- **task graph**：跨会话、可依赖、可认领的任务文件（`.tasks/task_*.json`，稳定 ID + 单条生命周期）——支撑团队协作\n- ⚠️ 单独的 `task` 工具 = 一次性隔离 subagent，不是 Task System" },
        { t: "text", h: "两种委派", p: "- `task`：一次性 subagent——独立 messages，中间过程丢弃，只返回最终摘要（上下文隔离）\n- `spawn_teammate`：持久队友线程——传 `task_id` 则启动前认领；不传则 IDLE 等待；无 assignment 不能用文件/Shell 工具；按 `WORK → result → IDLE` 运行；模型/分发失败发出 `error`，线程清理把未完成 assignment 释放回任务板；**每次调模型前先读收件箱**（直接消息与关机请求不被连续 tool-use 轮次饿死）" },
        { t: "audio", src: "audio/s15-03.mp3", title: "讲解 · 工作原理", transcript: "深入看三个关键机制。第一，权限和 hooks。权限不写死在工具执行行里，而是作为 PreToolUse hook：执行前先 trigger hooks，返回被拦截就给工具结果里写拦截消息并跳过。这样 permission、日志、审计都挂在同一个钩子点上，lead、一次性 subagent、队友的工具都会先经过 PreToolUse。权限判断不会把 MCP server 自己写的描述当成授权依据：宿主维护一份精确的已知只读工具名单，其他 MCP 工具都要询问用户。文件工具越过工作目录直接拒绝，每条 bash 命令执行前询问。还有一个细节：只有前台用户轮次可以弹出交互确认，异步轮次直接拒绝需要确认的操作，不和主 CLI 争抢输入。第二，两层计划并存。todo write 是当前会话内的轻量计划，存在内存里，整表替换，帮单个 agent 不漂移；task graph 是跨会话、可依赖、可认领的任务文件，稳定 ID 加单条生命周期，支撑团队协作。注意，单独出现的 task 工具表示一次性派发隔离 subagent，不是任务系统。第三，两种委派。task 是一次性 subagent，独立消息列表，中间过程丢弃，只返回最终摘要，解决上下文隔离；spawn teammate 是持久队友线程，传入任务 ID 时启动前认领，不传就 idle 等待，没有 assignment 的队友不能用文件和 shell 工具，按 WORK、result、IDLE 运行。每次调用模型前都会先读收件箱，所以直接消息和关机请求不会被连续的 tool use 轮次饿死。一句话：一次性 subagent 解决上下文隔离，持久队友解决长期并行协作。" },

        { t: "section", icon: "⚙️", title: "工作原理（下）：记忆、恢复、后台、worktree、MCP" },
        { t: "text", h: "记忆、技能与 prompt 组装", p: "复用 s09 Memory runtime：每轮调模型前读 `.memory/MEMORY.md` → 选相关记录 → 正文交给 `assemble_system_prompt(context)`；本轮结束 `extract_memories()` 提取，有新记录再 `consolidate_memories()`。\n\n同一份 system prompt 加入：身份、工具说明、workspace、skills catalog、已连接 MCP server。**技能只放目录，完整内容 `load_skill(name)` 按需加载。**" },
        { t: "text", h: "压缩与错误恢复（双保险）", p: "LLM 前：`tool_result_budget → snip_compact → micro_compact → compact_history`。\n\n调用时：429 指数退避重试；529 指数退避，连续失败可切 fallback model；`max_tokens` 不够先升级再要求 continuation；prompt too long → reactive compact 后重试。" },
        { t: "text", h: "后台与 cron", p: "`run_in_background=true` → 占位结果 → 完成后 `<task_notification>` 下一轮注入；非零退出/异常发 `failed`；独立进程组 + 退出清理。\n\ncron 独立 daemon 每秒检查；durable 一次性任务先持久化为 `pending_delivery` 再入队；交付语义**至少一次**。CLI 同时监听 cron_queue、Lead 收件箱、已结束后台任务——任一事件都能自动唤醒一轮 Agent。" },
        { t: "text", h: "worktree 与 MCP", p: "任务级 worktree 管理任务工作目录：pending 未认领任务可绑定独立分支/目录；idle 队友原子认领一个就绪 task（assignment 记 task_id + cwd）；只有 task owner 能完成任务；`remove_worktree()` 保留在宿主侧（模型不能调）。\n\nMCP：`connect_mcp(name)` 连接 mock server；`assemble_tool_pool()` 组装并拒绝规范化冲突；工具名统一 `mcp__server__tool`。" },
        { t: "audio", src: "audio/s15-04.mp3", title: "讲解 · 工作原理", transcript: "再看集成运行时的另外四个部分。记忆、技能和 prompt 组装：复用第九课的 memory runtime，每轮调用模型前，读取记忆目录，根据当前请求选择相关记录，把选中的正文交给 assemble system prompt；本轮结束后，extract memories 提取可跨会话使用的信息，有新记录再 consolidate。同一份 system prompt 还会加入身份、工具说明、workspace、技能目录和已连接的 MCP server。技能只放目录，完整内容按需加载。压缩和恢复是双保险：LLM 前先跑压缩管线，tool result budget、snip、micro、必要时摘要；调用模型时再包一层恢复——429 指数退避，529 指数退避加 fallback 模型切换，max tokens 不够先升级再要 continuation，prompt too long 就 reactive compact 后重试。后台和 cron：显式标记的 bash 进后台，主循环先收占位结果，完成以 task notification 在下一轮注入；cron 独立线程每秒检查，durable 任务先持久化再入队，交付至少一次。CLI 同时监听 cron 队列、lead 收件箱、后台任务完成，任何一个事件都能自动唤醒一轮 agent。worktree 和 MCP：任务级 worktree 管工作目录，idle 队友原子认领，只有 owner 能完成任务，移除保留在宿主侧；MCP 负责外部能力，工具名统一前缀，冲突检测。至此，十五课的所有机制，在一个循环里各就各位。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：集成 = 「机制进循环，事件回对话」", p: "每个组件都有一个**确定的挂载点**（LLM 前/执行前/执行后/停止时），每个机制产生的事件（cron prompt、后台通知、团队事件、工具结果）都回到**同一段 messages**。\n\n这是事件驱动架构的集大成：一个循环，多个生产者，一个消费者。" },
        { t: "text", h: "② 一个类比：工厂流水线", p: "同一个车间（while True）：来料检验（hooks）、物料清单（prompt 组装）、质检门（权限）、包装（PostToolUse）、出货（Stop）。\n\n每道工序有固定工位，新增工序只加工位，不改车间结构。" },
        { t: "text", h: "③ 延伸：为什么「异步轮次不弹确认」是必要的", p: "后台/定时/团队轮次没有用户在场——弹输入框会**与主终端抢输入、或永远等不到人**。\n\n权限交互只在用户在场的前台轮次发生；异步轮次直接拒绝。**确认的前提是有人在。**" },
        { t: "audio", src: "audio/s15-05.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是集成，机制进循环，事件回对话。每个组件都有一个确定的挂载点：LLM 前、执行前、执行后、停止时；每个机制产生的事件，不管是定时 prompt、后台通知、团队事件还是工具结果，都回到同一段消息列表。这是事件驱动架构的集大成：一个循环，多个生产者，一个消费者。第二，打个比方，这就是工厂流水线。同一个车间，也就是 while true，来料检验是 hooks，物料清单是 prompt 组装，质检门是权限，包装是 PostToolUse，出货是 Stop。每道工序有固定工位，新增工序只加工位，不改车间结构。第三，一个必要约束：为什么异步轮次不弹确认？因为后台、定时、团队轮次没有用户在场，弹输入框要么和主终端抢输入，要么永远等不到人。权限交互只在用户在场的前台轮次发生，异步轮次直接拒绝需要确认的操作。确认的前提是有人在。对产品经理来说，这一课告诉你：一个成熟的 agent 产品，能力的叠加不是功能的堆砌，而是每个能力都要在系统里有一个稳定的位置、一条确定的事件路径。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：集成课为什么「不加新机制」反而是重点？", p: "新机制容易做，**让已有机制正确协同**才是生产级难点：事件顺序、权限统一、上下文一致。\n\nS15 检验的是架构是否**可组合**——每一课的能力能否在同一循环里互不干扰。" },
        { t: "text", h: "难点 2：为什么权限必须挂在 hook 上而不是执行行？", p: "Lead、subagent、队友、MCP 工具都要过同一道权限门。\n\n写在执行行 = 每个执行路径各写一份（必然漏）；**挂在 PreToolUse = 一次实现，处处生效**。" },
        { t: "text", h: "易错点 3：task 工具 vs Task System vs todo_write，怎么区分？", p: "同一课三个名字很像的东西：\n\n- `todo_write`：会话内轻量计划（内存）\n- task graph（create/claim/complete）：跨会话任务文件（磁盘）\n- `task` 工具：**一次性 subagent**（不是任务系统）\n\n名字混淆是集成系统最常见的坑。" },
        { t: "text", h: "核心设计决策", p: "**循环结构不变，能力按位置挂载。** 所有事件回到同一段对话，所有工具过同一道权限门，所有轮次走同一套恢复逻辑。" },
        { t: "audio", src: "audio/s15-06.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，为什么集成课不加新机制反而是重点？因为新机制容易做，让已有机制正确协同才是生产级难点：事件顺序、权限统一、上下文一致。S15 检验的是架构是否可组合，每一课的能力能否在同一个循环里互不干扰。第二，为什么权限必须挂在 hook 上而不是执行行？因为 lead、subagent、队友、MCP 工具都要过同一道权限门。写在执行行，每个执行路径就要各写一份，必然漏；挂在 PreToolUse，一次实现，处处生效。第三，一个非常容易混淆的点：同一课里三个名字很像的东西。todo write 是会话内轻量计划，存在内存里；task graph，create、claim、complete 这一套，是跨会话的任务文件；而单独的 task 工具，是一次性 subagent，不是任务系统。名字混淆是集成系统最常见的坑，面试也爱考。第四，核心设计决策：循环结构不变，能力按位置挂载，所有事件回到同一段对话，所有工具过同一道权限门，所有轮次走同一套恢复逻辑。这就是一个可以长期工作的 agent 运行时该有的样子。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "S15 为什么不引入新机制？「集成」在工程上难在哪？", a: "新机制容易做，**让已有机制正确协同**才是难点：\n\n① **事件顺序**：cron 注入、后台通知、团队事件、工具结果，必须按确定顺序汇入同一段 messages，否则上下文错乱；\n② **权限统一**：Lead、subagent、队友、MCP 工具都要过同一道权限门（挂 PreToolUse，一次实现处处生效）；\n③ **恢复一致性**：任何一轮都可能 429/529/超长，恢复逻辑要包住所有轮次；\n④ **命名空间**：task 工具 vs Task System vs todo_write 极易混淆。\n\n产品启示：**架构的可组合性比功能数量重要**——能力再多，不能在同一运行时里互不干扰，就不是可用的 agent 产品。" },
        { t: "qa", q: "「只有前台用户轮次可以弹确认，异步轮次直接拒绝」解决了什么？", a: "后台、cron、团队轮次**没有用户在场**：\n\n- 弹输入框 → 与主终端**抢输入**（两条线程同时读 stdin，行为不可预测）；\n- 或者**永远等不到人**（异步轮次无人响应，卡死）。\n\n所以：权限交互只在用户在场的前台轮次发生；异步轮次对需要确认的操作**直接拒绝**（返回 Permission denied 类结果，由模型换路径）。\n\n产品启示：**交互式确认是「人在回路」能力**——先判断人在不在，再决定能不能问；无人值守场景要么自动放行（白名单）要么自动拒绝。" },
        { t: "qa", q: "（难点）「机制进循环、事件回对话」这个设计原则怎么理解？", a: "两层含义：\n\n① **机制进循环**：每个组件有一个确定挂载点（UserPromptSubmit/LLM 前/PreToolUse/PostToolUse/Stop），不游离于循环之外——否则组件之间无法共享上下文与调度。\n② **事件回对话**：所有事件（cron prompt、后台 `<task_notification>`、团队事件、tool_result）都追加到**同一段 messages**，模型始终基于完整对话推理——而不是各组件各带一段私聊。\n\n收益：模型视角统一（一段对话）、调试视角统一（一条事件流）、扩展视角统一（新机制=新挂载点+新事件类型）。\n\n这就是一个长期运行 agent 的「操作系统」形态。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s15_integrated_harness/code.py\n```\n\n可以试：\n\n1. `检查这个仓库，告诉我哪些 Python 文件最重要。`\n2. `从已连接的文档中查一下 agent loop 的相关说明。`\n3. `请在独立的 worktree 中并行重构认证模块和登录页，修改前先把各自的计划给我看。`\n4. `3 分钟后提醒我开会。`\n5. `在后台安装依赖，同时继续阅读 README.md。`\n\n**观察重点**：工具调用前是否过 hooks/permission；`connect_mcp` 后下一轮是否出现 MCP 工具；后台 bash 是否返回占位结果；到点是否自动提醒；队友是否在 plan 获批前暂停；idle 队友是否只原子认领一个任务。" },
        { t: "audio", src: "audio/s15-07.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。十五课的全部机制，装进同一个循环：用户输入过 UserPromptSubmit hooks，LLM 前注入 cron 和后台通知、跑压缩、组装 prompt，调用时带错误恢复，工具执行前过 PreToolUse 权限门，分发时组装内置加 MCP 工具，显式后台 bash 走占位加通知，执行后 PostToolUse 收尾，停止时 Stop hooks 统计。两层计划并存，两种委派分工，记忆技能按需加载，权限交互只在人在场的前台轮次。核心思想：循环结构不变，能力按位置挂载，所有事件回到同一段对话。建议你到试一下板块把五个场景都跑一遍，你会第一次看到一个 agent 同时具备计划、记忆、团队、定时、后台和外部工具的样子。下一课，我们还要解决一个问题：同样的流程，能不能写死成代码，让 agent 按固定路径稳定执行？那就是工作流运行时。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "S15 的 Agent 很全能，但**同样的编排路径每次都要让模型重新推理**——不稳定、不可审计。\n\n**下一课 s16 Workflow Runtime** → 把固定编排路径写在代码里，记录运行进度，同一次运行可以继续执行。" },
        { t: "tip", text: "一句话记住 S15：**多种机制，一个循环。** 每个组件有固定挂载点，所有事件回同一段对话，所有工具过同一道权限门。" }
      ]
    },
    {
      id: "s16",
      num: "16",
      title: "Workflow Runtime",
      desc: "模型决定单步，脚本决定编排",
      color: "#ea580c",
      blocks: [
        { t: "lead", text: "第十六课把固定流程**写进代码**：Workflow 工具一次 tool_use 启动可恢复的脚本运行时，模型决定单步，脚本决定编排——并行、稳定结果、断了能续。" },

        { t: "section", icon: "❓", title: "问题：固定流程靠模型一轮轮凑，不可并行、不可恢复" },
        { t: "text", h: "核心问题", p: "s01~s15，每一轮都由模型决定调用哪些工具——后续路径取决于上一步发现了什么时，这种方式很合适。\n\n但有些任务**重复一套固定流程**：代码审查同时检查多个维度 → 逐条验证发现 → 合并重复 → 按严重程度排序。执行前已知道步骤与先后关系，这时宿主需要：\n\n- **并行**：别一个一个串着等\n- **稳定的结果结构**：即使每个 agent 的回答会变化\n- **可恢复**：跑到一半断了，做过的部分别从头再来\n\n如果编排只存在于对话历史里，**步骤顺序和检查点也只存在于历史里**。" },
        { t: "audio", src: "audio/s16-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第十六课，Workflow Runtime，工作流运行时。从第一课到第十五课，每一轮都由模型决定调用哪些工具：工具结果进入消息列表，模型再根据更新后的上下文决定下一步。当后续路径取决于上一步发现了什么，这种方式很合适。但有些任务会重复一套固定流程。比如代码审查：同时检查多个维度，再逐条验证发现、合并重复项、按严重程度排序。执行之前，我们已经知道步骤和先后关系。这时宿主需要三样东西：第一，并行，别一个一个串着等；第二，稳定的结果结构，即使每个 agent 的回答会变化；第三，可恢复，跑到一半断了，已经做完的部分别从头再来。如果这套编排只存在于对话历史里，步骤顺序和检查点也只存在于历史里。保存好的 workflow 把固定流程写进代码，并在 journal 里记录已经完成的调用。核心转变：从模型每轮即兴决定，变成一次 tool use 跑完一整套编排。" },

        { t: "section", icon: "💡", title: "解决方案：Workflow 工具 + 宿主可信脚本 + journal 续跑" },
        { t: "code", lang: "python", code: `# 模型只提供这三个字段，不提交可执行代码
WORKFLOW_TOOL = {
    "name": "Workflow",
    "input_schema": {
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "args": {"type": "object"},
            "resume_from_run_id": {"type": "string"},
        },
        "required": ["name"],
        "additionalProperties": False,
    },
}

# 宿主注册可信脚本（agent / parallel / pipeline / phase 原语）
SAMPLE_META = {"name": "review-changes", "description": "审查代码改动", "phases": ["Review", "Verify"]}

async def sample_workflow(ctx, args):
    ctx.phase("Review")
    results = await ctx.pipeline(DIMENSIONS, audit, verify)   # 每个维度独立走 审计 → 验证
    confirmed = [f for r in results if r for f in r["confirmed"]]
    ctx.log(f"确认了 {len(confirmed)} 个真实问题")
    return {"confirmed": confirmed}

async def run_workflow(name, args=None, resume_from_run_id=None):
    meta, script_fn = WORKFLOWS[name]
    out = await WorkflowTool().call(meta, script_fn, args=args,
                                    resume_from_run_id=resume_from_run_id)
    return {"launched": out["launched"], "result": out["result"],
            "task": serialize_task(out["task"])}` },
        { t: "audio", src: "audio/s16-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案是把编排从对话历史搬到代码里。第一步，在工具池里加入 Workflow 工具。模型可见的 schema 只接受三个字段：name、args 和 resume from run id，名称未知或参数格式错误时，适配器返回错误工具结果，不会让宿主循环退出。模型只提供保存好的 workflow 名称、参数和可选的续跑 ID，不提交可执行代码或元数据——可执行代码永远来自宿主 registry。第二步，宿主注册可信脚本。脚本由 agent、parallel、pipeline、phase 这几个编排原语组成，比如 review changes 这个示例工作流：先标记 Review 阶段，然后让每个审查维度独立走审计到验证的管线，最后汇总被确认的真实问题。workflow 以一次 tool use 进入主循环，脚本运行时发出生命周期和进度事件，并把每一步写进磁盘上的 journal。脚本结束后，这次调用返回启动信息、结果和任务状态。脚本里的中间结果存在变量里，不塞进对话历史。下次用 resume from run id 重启时，没改过的 agent 调用会直接使用 journal 中的结果。模型决定单步，脚本决定编排，这就是第十六课的分工。" },

        { t: "section", icon: "⚙️", title: "工作原理（上）：元数据校验、编排原语" },
        { t: "text", h: "Workflow 元数据：启动前先校验", p: "每个保存好的 workflow 注册可信元数据（`name` / `description` / 可选 `phases`），执行前校验：\n\n- 注册不合法 → 启动前抛 `WorkflowInputError`（和 s12 校验 cron 表达式同一思路：**保存好的 workflow 有问题，不要等到执行时才发现**）\n- `meta.name` 用于本地产物文件名 → 必须是 1-64 字符的安全 slug（仅字母、数字、`.`、`_`、`-`）" },
        { t: "table", head: ["原语", "作用"], rows: [["agent(prompt, {schema, label, phase})", "派一个子 agent 干活"], ["parallel(thunks)", "等齐屏障：所有任务并行跑完，一起等结果"], ["pipeline(items, *stages)", "每个 item 分阶段跑，不等齐，跑完一个往下走"], ["phase(title)", "标记当前进度阶段（更新进度条）"], ["log(message)", "打一行进度日志"], ["workflow(name, args)", "嵌套子工作流（只支持一层）"]] },
        { t: "text", h: "parallel vs pipeline（重点区别）", p: "- `pipeline`：item A 跑到第 3 阶段时，item B 可能还在第 1 阶段——**不等齐**，适合「每个 item 独立走相同步骤」\n- `parallel`：下一步必须同时使用上一阶段全部结果时——**等齐屏障**\n\n```python\nasync def pipeline(self, items, *stages):\n    async def run_item(item, idx):\n        value = item\n        for stage in stages:          # 每个 item 独立跑完所有 stage\n            value = await stage(value, item, idx)\n        return value\n    return await asyncio.gather(*[run_item(it, i) for i, it in enumerate(items)])\n```" },
        { t: "audio", src: "audio/s16-03.mp3", title: "讲解 · 工作原理", transcript: "深入看工作原理。第一，元数据校验。每个保存好的 workflow 注册一份可信元数据，包含 name、description 和可选的 phases。运行时在执行 workflow 代码前校验它：name 和 description 用来标识任务，phases 给进度显示分组命名。注册内容不合法时，启动前抛出 WorkflowInputError，这和第十二课校验 cron 表达式是同一个思路：保存好的 workflow 有问题，不要等到执行时才发现。meta 的 name 会用于本地产物文件名，所以必须是安全 slug，一到六十四个字符，只能包含字母、数字、点、下划线、横线。第二，编排原语。脚本收到一个只暴露少量编排原语的 ExecutionState，本身不直接读写文件，也不运行 shell。agent 派一个子 agent 干活；parallel 是等齐屏障，所有任务并行跑完，一起等结果回来；pipeline 是每个 item 分阶段跑，不等齐，跑完一个往下走一个。第三，重点区别：item A 跑到第三阶段时，item B 可能还在第一阶段，这就是 pipeline；下一步必须同时使用上一阶段全部结果时，再用 parallel 等待所有调用完成。举个例子，审查代码改动：每个维度独立走审计到验证，用 pipeline；验证阶段要对抗性地逐条验证所有发现，再用 parallel 同时验证。默认交互模式把 agent 接到与宿主相同的真实 API client，demo 和单元测试使用 MockAgentRunner，便于重复观察事件和 journal。" },

        { t: "section", icon: "⚙️", title: "工作原理（下）：结构化输出、事件流、journal 续跑" },
        { t: "text", h: "结构化输出：别让子 agent 回来写散文", p: "`agent({schema})` 要求子 agent 只返回匹配 schema 的 JSON 对象 → 解析校验 → 不符合重试一次 → 还不对抛 `WorkflowInputError`。\n\ns05 说过工具参数不能全信；这里是同一个道理反过来：**子 agent 的输出也不能全信**。加一层校验，把不确定性挡在编排层外面。" },
        { t: "text", h: "任务状态与进度事件", p: "`LocalWorkflowTask` 维护状态和 token 用量，事件流：`task_started` → 一串 `task_progress`（阶段切换、子 agent 启动、日志输出）→ 最后一个 `task_notification`（完成/失败，带输出文件、agent 数和 token 数）。" },
        { t: "text", h: "存储与续跑", p: "运行数据在 `s16_workflow_runtime/.runtime/`：快照 `<runId>.json`、输出 `.output.json`、journal `.journal.jsonl`、协调 `.lock`。\n\n- 新运行先用**排他式文件创建**预留新 runId；整次执行与最终持久化期间持有 run lock，另一进程不能同时 resume 同一次运行\n- journal 一条条记每个 `agent()` 结果；resume 时验证快照与 journal，再改动原有成功产物" },
        { t: "text", h: "稳定调用键（关键细节）", p: "resume 时每个 `agent()` 计算**确定性语义 key**：`类型|标签|prompt|schema` 的稳定哈希。\n\n**key 不能依赖并发顺序**——parallel/pipeline 里完成顺序不确定，用「第几个完成」当 key，两次跑缓存就对错位。\n\n```python\ndef key(self, kind, label, prompt, schema):\n    basis = f'{kind}|{label}|{prompt}|{json.dumps(schema, sort_keys=True)}'\n    return f'{kind}-{_stable_hash(basis) % 10**10:010d}'\n```" },
        { t: "audio", src: "audio/s16-04.mp3", title: "讲解 · 工作原理", transcript: "再看三个关键机制。第一，结构化输出。agent 带 schema 时，要求子 agent 只返回匹配 schema 的 JSON 对象，运行时解析并校验，不符合就重试一次，再不对就报错。第五课说过，工具的参数不能全信；这里是同一个道理反过来：子 agent 的输出也不能全信。加一层校验，不对就给一次机会重试，把不确定性挡在编排层外面。下游代码拿到的是对象，不必再从自然语言里提取字段。第二，任务状态和进度事件。LocalWorkflowTask 维护状态和 token 用量，向外发一条 SDK 风格的事件流：task started 开头，一串 task progress，包含阶段切换、子 agent 启动和日志输出，最后一条 task notification 收尾，完成或失败，带输出文件、agent 数和 token 数。第三，journal 和续跑。运行数据存在 runtime 目录：快照、输出、journal 和锁文件。新运行在打开 journal 前用排他式文件创建预留新的 run id，整次执行期间持有 run lock，另一个进程不能同时 resume 同一次运行。journal 一条一条记下每个 agent 调用的结果。续跑时脚本重新执行，但每个 agent 调用会计算一个确定的语义 key：key 在 journal 里有记录，就直接返回缓存结果；只有改过的调用以及依赖它的后续步骤才会真的运行。关键点：key 不能依赖并发顺序，因为 parallel 和 pipeline 里 agent 完成的顺序不确定。所以 key 是根据调用内容算的稳定哈希：类型、标签、prompt、schema。只要调用内容没变，resume 就直接用 journal 里保存的结果。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：Workflow = 「编排确定性」", p: "自由模式：模型每轮即兴决定，灵活但不可预测、不可审计。\n\nWorkflow：固定路径写进宿主代码，进度写进 journal——**灵活让给模型，稳定留给脚本**。" },
        { t: "text", h: "② 一个类比：剧本 vs 即兴表演", p: "s01~s15 是即兴表演：演员（模型）看临场反应接话。\n\ns16 是剧本演出：导演（脚本）定流程，演员（子 agent）演单幕——**同一出戏，每次演出的结果稳定，还能从打断的地方接着演**。" },
        { t: "text", h: "③ 延伸：为什么「模型不提交代码」是安全边界", p: "Workflow 的 schema 只收 name/args/resume_id——**可执行内容永远来自宿主 registry**。\n\n模型最多选一个已注册流程，不能凭空塞一段编排代码进工具。" },
        { t: "audio", src: "audio/s16-05.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是编排确定性。自由模式里，模型每轮即兴决定下一步，灵活但不可预测、不可审计；Workflow 把固定路径写进宿主代码，把进度写进 journal，灵活让给模型，稳定留给脚本。第二，打个比方：前十五课是即兴表演，演员看临场反应接话；这一课是剧本演出，导演定流程，演员演单幕。同一出戏，每次演出的结构稳定，还能从打断的地方接着演。第三，一个安全边界：为什么模型不提交代码？因为 Workflow 的 schema 只收 name、args 和 resume id，可执行内容永远来自宿主 registry。模型最多选一个已注册的流程，不能凭空塞一段编排代码进工具。对产品经理来说，这一课的价值是：当你要把 agent 能力做成产品时，自由对话适合探索，工作流适合交付。审查、周报、质检这类固定流程，写成 workflow 才能保证每一次输出都符合规范、出了问题能追溯能续跑。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：resume 的 key 为什么不能依赖并发顺序？", p: "parallel/pipeline 里 agent 完成顺序不确定——用「第几个完成」当 key，两次跑缓存就对错位了。\n\n**按调用内容算稳定哈希**（类型|标签|prompt|schema），同一份 workflow + 同样参数 = 同一批 key。" },
        { t: "text", h: "难点 2：parallel 与 pipeline 的区别什么时候体现？", p: "pipeline 不等齐（item 各自往前跑）——item 间独立、无汇合点；parallel 等齐（全部跑完再继续）——下一步需要**同时**用全部结果。\n\n选错会怎样？pipeline 用在需要全部结果时 → 拿不齐数据；parallel 用在独立流水时 → 白白互相等待。" },
        { t: "text", h: "易错点 3：为什么说「模型不提交可执行代码」是三层防护的一层？", p: "① 可信元数据：宿主 registry 校验后才执行；② 结构化输出：子 agent 输出过 schema 校验；③ 编排原语：ExecutionState 不暴露文件/Shell。\n\n模型能造成的伤害被限制在「选哪个已注册流程 + 传什么参数」。" },
        { t: "text", h: "核心设计决策", p: "**可执行脚本在宿主，模型只选流程。** 进度进 journal，结果进变量，缓存靠稳定哈希——跑多久都断得了、续得上。" },
        { t: "audio", src: "audio/s16-06.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，resume 的 key 为什么不能依赖并发顺序？因为 parallel 和 pipeline 里 agent 完成的顺序不确定，用第几个完成当 key，两次跑缓存就对错位了。所以 key 按调用内容算稳定哈希：类型、标签、prompt、schema。同一份 workflow 加同样的参数，产生同一批 key；真实模型的回答可以变化，只要调用内容没变，resume 就复用 journal 里的结果。第二，parallel 和 pipeline 的区别什么时候体现？pipeline 不等齐，item 各自往前跑，适合 item 之间独立、没有汇合点的流程；parallel 等齐，全部跑完再继续，适合下一步需要同时使用全部结果的场景。选错会怎样？pipeline 用在需要全部结果时，数据拿不齐；parallel 用在独立流水时，白白互相等待。第三，为什么模型不提交可执行代码是三层防护的一层？第一层，可信元数据，宿主 registry 校验后才执行；第二层，结构化输出，子 agent 的输出过 schema 校验；第三层，编排原语，ExecutionState 不暴露文件和 shell。模型能造成的伤害，被限制在选哪个已注册流程、传什么参数。第四，核心设计决策：可执行脚本在宿主，模型只选流程；进度进 journal，结果进变量，缓存靠稳定哈希。跑多久都断得了、续得上。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "Workflow 运行时解决了什么本质问题？为什么不能靠模型在对话里完成编排？", a: "本质问题：**固定流程的并行、稳定与可恢复**。\n\n- 并行：代码审查等任务有明确步骤，可并行执行（pipeline/parallel）；\n- 稳定结果：每次执行结构一致（schema 校验子 agent 输出），不像自由对话每次跑偏；\n- 可恢复：journal 记录每次 agent 调用，`resume_from_run_id` 续跑，断点后不重来。\n\n为什么不能靠对话编排？编排只存在于对话历史 → **步骤顺序和检查点也只存在于历史**——不可并行、不可恢复、不可审计；而且模型每轮都要重新推理同样的路径，不稳定。\n\n产品视角：**探索用对话，交付用工作流**——固定流程写成 workflow 才能保证输出规范、可追溯、可续跑。" },
        { t: "qa", q: "resume 时「稳定调用键」的设计解决了什么？如何实现？", a: "问题：续跑需要把当前 agent 调用与 journal 里的旧调用**一一对应**；而 parallel/pipeline 中 agent 完成顺序不确定，用「第几个完成」做 key 会导致缓存错位。\n\n实现：按**调用内容**算稳定哈希——`类型|标签|prompt|schema` → 确定性 key；同一份 workflow + 同样参数 = 同一批 key。\n\n行为：key 命中 journal 缓存 → 直接返回缓存结果（`agents=0 tokens=0`）；只有改过的调用及其依赖步骤才真正重跑。\n\n通用原则：**缓存键必须来自输入本身，而不是执行时序**——执行顺序不稳定，时序键就不可靠。" },
        { t: "qa", q: "（难点）「模型不提交可执行代码」的防护有几层？分别防什么？", a: "三层：\n\n① **可信元数据 + 宿主 registry**：Workflow schema 只收 name/args/resume_id，脚本只能来自宿主注册表，执行前 validate_meta（防注入任意编排代码）；\n② **结构化输出**：子 agent 输出必须过 schema 校验，不符重试一次（防格式污染、防下游解析崩溃）；\n③ **编排原语边界**：ExecutionState 只暴露 agent/parallel/pipeline/phase/log，不暴露文件与 Shell（防脚本越权读写）。\n\n模型能做的极限 = 选哪个已注册流程 + 传什么参数；**可执行能力永远掌握在宿主手里**。\n\n产品启示：给模型的能力越抽象，攻击面越小——「选流程」远安全于「写流程」。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**运行**：\n\n```\npython s16_workflow_runtime/code.py            # 主模型和子 agent 都用真实 API\npython s16_workflow_runtime/code.py demo      # 固定数据跑 review-changes，观察事件流\npython s16_workflow_runtime/code.py resume    # 用上次 runId 续跑，命中 journal 缓存\n```\n\n`demo` 便于重复观察生命周期与续跑；续跑命中全部缓存时显示 `agents=0 tokens=0`。\n\n**观察重点**：`.runtime/` 里的快照、output、journal、lock；`task_started → task_progress → task_notification` 事件流；resume 后未改动的 agent 调用直接走缓存。" },
        { t: "audio", src: "audio/s16-07.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。Workflow 运行时把固定流程写进代码：模型只提供 name、args 和 resume id，脚本来自宿主 registry；一次 tool use 进入主循环，背后是一个可恢复的脚本运行时。编排原语里，pipeline 让每个 item 独立走阶段不等齐，parallel 是等齐屏障，下一步需要全部结果时用。结构化输出用 schema 校验子 agent 结果，不对重试一次。进度事件从 task started 到 task progress 到 task notification。journal 一条条记下每次 agent 调用的结果，resume 时按稳定语义键命中缓存，没改的调用不重跑。核心思想：可执行脚本在宿主，模型只选流程；进度进 journal，结果进变量，缓存靠稳定哈希。建议你跑一遍 demo 观察事件流，再跑 resume 看 agents 等于零、tokens 等于零的缓存命中。下一课，我们把视角转到更宏观的目标层：一个更小、独立的循环，检查既定目标是否已经达成，决定是否还需要下一轮。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "Workflow 解决的是「固定流程稳定执行」。但 agent 面对开放目标时，怎么知道**自己干完了没有**？\n\n**下一课 s17 Goal Loop** → 一个更小、独立的循环，检查既定目标是否达成，据此决定是否还需要下一轮。" },
        { t: "tip", text: "一句话记住 S16：**模型决定单步，脚本决定编排。** 可执行脚本在宿主，进度进 journal，断了用 runId 续跑。" }
      ]
    },
    {
      id: "s17",
      num: "17",
      title: "Goal Loop",
      desc: "独立判断器决定是否继续",
      color: "#0891b2",
      blocks: [
        { t: "lead", text: "第十七课解决「怎么知道干完了」：模型不再调用工具只代表这一轮想停，目标是否完成，交给一个**独立判断器**——/goal，会话级 Stop hook，没完成就回到同一个循环。" },

        { t: "section", icon: "❓", title: "问题：模型不调用工具 ≠ 目标完成" },
        { t: "text", h: "核心问题", p: "s01 起，Agent Loop 的退出条件一直很简单：**模型不再调用工具，程序就返回**。\n\n这对普通对话足够，但对「修到测试全部通过」「完成所有验收项」不够：模型可能认为做完，也可能只做了一部分。**没有新的 tool_use 只能说明当前轮次结束，不能证明整个目标达成。**\n\n`/goal` 在真正返回之前，再加一次**独立判断**。" },
        { t: "audio", src: "audio/s17-01.mp3", title: "讲解 · 问题", transcript: "欢迎来到第十七课，Goal Loop，目标循环。从第一课开始，agent loop 的退出条件一直很简单：模型不再调用工具，程序就返回。这对普通对话足够，但对修到测试全部通过、完成所有验收项这样的任务不够。模型可能认为已经做完，也可能只完成了一部分。没有新的 tool use，只能说明当前轮次结束了，不能直接证明整个目标已经达成。这一课在真正返回之前，再加一次独立判断：/goal。把完成条件保存下来，立即交给主模型开始干活；当主模型不再调用工具时，不立刻返回，而是先运行一个目标停止钩子，由独立判断器检查完成条件：满足了才结束，没满足就带着理由回到同一个循环继续干。模型提出停止，独立判断器决定是否继续，这就是第十七课的核心。" },

        { t: "section", icon: "💡", title: "解决方案：/goal = 会话级 Stop hook + 独立判断器" },
        { t: "code", lang: "python", code: `# 输入：/goal pytest tests/auth 退出码为 0，并且 lint 没有错误
# 主循环结束位置的 Stop hook：
if tool_results:
    messages.append({"role": "user", "content": tool_results})
    continue

decision = await self.goal.evaluate_after_turn(self.messages)   # 独立模型调用
if decision.action == "block":
    self.messages.append({"role": "user", "content": decision.reason})  # 理由回循环
    continue

return SessionResult(text=text, status=decision.action)

# 判断器没有工具，只读对话做判断：
# {"ok": true, "reason": "", "impossible": false}
# ok=true 条件满足；ok=false 还要继续；impossible=true 目标无法完成` },
        { t: "text", h: "判断器和干活的模型分开", p: "主模型负责改代码、跑命令、解决问题。**Goal 判断器是另一次独立模型调用**，只负责判断完成条件；由 `GoalController` 持有，是 Goal Gate 的内部依赖，不是主循环外的另一条退出路径。\n\n判断器看到：当前 Goal 完成条件 + 对话记录 + 工具结果。**没有工具**——不能自己读文件、不能重跑测试，只能根据对话中已出现的内容判断。" },
        { t: "text", h: "本课没有单独的 CommandQueue", p: "判断未通过时，controller 把理由**直接追加到同一份 messages**，然后进入下一轮。\n\n更大的宿主可用共享队列回送用户输入/后台结果/继续命令，但那条队列服务整个宿主、只负责传递，不归 Goal Gate 所有。" },
        { t: "audio", src: "audio/s17-02.mp3", title: "讲解 · 解决方案", transcript: "解决方案分三步。第一步，/goal 是会话级 Stop hook。输入 /goal 加完成条件，程序保存条件，并立即把这段条件作为本轮任务交给主模型，用户不需要再输入一条开始执行。主循环里：有工具结果就追加进消息列表继续；没有工具结果时不立刻返回，先运行 Goal Stop hook，调用独立判断器。第二步，判断器和干活的模型分开。主模型负责修改代码、运行命令、解决问题；Goal 判断器是另一次独立的模型调用，只负责判断完成条件。判断器由 Goal Controller 持有，是 Goal Gate 的内部依赖，不是主循环之外的另一条退出路径。判断器会看到：当前 Goal 的完成条件、到目前为止的对话记录、主模型运行工具后写回来的结果。它没有工具，不能自己读文件，不能重新运行测试，只能根据对话中已经出现的内容做判断，返回 ok、reason 和 impossible 三个字段：ok 为真表示条件满足，ok 为假表示还要继续，目标已经无法完成就返回 impossible 为真。第三步，没完成就回到同一个循环。判断器认为条件尚未满足时，给出简短原因，比如对话中还没有出现完整测试结果，请运行 pytest 并报告退出码。程序把原因加入消息列表，在当前 while 循环里直接 continue，主模型立即开始下一轮，不需要用户再次输入继续。注意，本课没有单独的 continuation queue，Goal 检查就在主循环的结束位置，未满足时也从这里回到主循环。" },

        { t: "section", icon: "⚙️", title: "工作原理（上）：判断依据、完成条件、defer" },
        { t: "text", h: "对话记录就是判断依据", p: "判断器读取当前对话：工具结果、主模型说明、后台任务通知都以消息进入；**最终判断取决于这些消息实际写了什么**。\n\n- 保留最近完整消息；最新一条过长则只留开头+结尾（防一条工具结果占满判断请求）\n- 模型说一句「测试通过了」**不一定会被接受**——提示明确要求根据具体结果判断，不能把没有结果支撑的宣称当完成\n- 因此主模型 system prompt 要求：**运行验证命令后，把命令和结果明确写进对话**，让独立判断器能够检查\n\n⚠️ Goal Loop 不是测试框架——真正的验证由工具执行，它只负责判断验证结果是否已出现在工作记录中。" },
        { t: "text", h: "好的完成条件要能检查（三件事）", p: "「把代码弄好」太模糊。合适条件写清：\n\n1. **结束状态**：最终要达到什么结果\n2. **验证方式**：用什么命令/输出证明\n3. **限制条件**：完成过程中不能破坏什么\n\n示例：`/goal 完成登录模块迁移，直到 pytest tests/auth 退出码为 0，并且没有修改 tests/auth 之外的测试文件`" },
        { t: "text", h: "后台任务未结束时：先 defer，不判断", p: "Workflow、后台命令可能在主模型结束当前轮时仍在运行 → 立即判断没意义（关键结果还没回对话）。\n\nGoal Stop hook 返回 `defer`：保留当前 Goal、不调用判断器；后台结束后 `submit_background_result()` 把通知送进同一份 messages，主循环再继续。\n\nWorkflow 完成通知**没有机械上的特殊权限**——和其他消息一样进对话，判断器按实际结果判断。" },
        { t: "audio", src: "audio/s17-03.mp3", title: "讲解 · 工作原理", transcript: "深入看三个要点。第一，对话记录就是判断依据。判断器读取当前对话：工具结果、主模型的说明、后台任务通知都会作为消息进入其中，最终判断取决于这些消息实际写了什么。送给判断器的内容会保留最近的完整消息；如果最新一条消息本身过长，就只保留开头和结尾，避免一条工具结果占满整次判断请求。这并不表示模型说一句测试通过了就一定会被接受：判断器的提示明确要求根据对话中的具体结果判断，不能把没有结果支撑的宣称当成完成。它终究只是一个只读对话的模型，可靠性取决于对话里有没有把关键结果说清楚。所以主模型的系统提示会要求：运行验证命令后，把命令和结果明确写进对话，让独立判断器能够检查。要记住，Goal Loop 不是测试框架，真正的验证仍然由工具执行，它只负责判断验证结果是否已经出现在当前工作记录中。第二，好的完成条件要能检查。把代码弄好太模糊，判断器不知道什么算好。合适的条件写清三件事：结束状态，最终要达到什么结果；验证方式，用什么命令或输出证明；限制条件，完成过程中不能破坏什么。第三，后台任务没有结束时，先不要判断。Workflow、后台命令可能在主模型结束当前轮时仍在运行，这时立即判断通常没有意义，因为关键结果还没有回到对话。Goal Stop hook 返回 defer，保留当前 Goal，也不调用判断器；后台任务结束后，宿主把完成通知交给 submit background result，通知进入同一个消息列表，主循环再继续。Workflow 完成通知没有机械上的特殊权限，它和其他消息一样进入对话。" },

        { t: "section", icon: "⚙️", title: "工作原理（下）：自动继续的出口、查看/替换/清除" },
        { t: "text", h: "自动继续也必须有出口", p: "Goal 没有默认「最多 20 轮」——是否满足由判断器**每轮重新判断**。但任何自动机制都不能无限占住一次请求，保留两道通用出口：\n\n- 主循环的全局 `max_turns`\n- Stop hook **连续阻止结束的次数上限**\n\n达到上限 → 控制权还给用户，**不把目标伪装成完成，不自动清除目标**；判断器调用失败同样原则：停止自动续轮、保留目标、把错误交给用户，不在无法判断时宣称成功。\n\n限制自动轮数用全局：`MAX_TURNS=20 python s17_goal_loop/code.py /goal 修复类型错误，直到 npm run typecheck 退出码为 0`" },
        { t: "text", h: "查看、替换、清除", p: "每个会话**同时只有一个活跃 Goal**：\n\n- `/goal` → 查看当前条件、判断次数、经过时间、token 用量、最近一次判断原因\n- `/goal 新的完成条件` → 替换旧 Goal，立即按新条件开工\n- `/goal clear` → 清除（`stop`/`off`/`reset`/`none`/`cancel` 是别名）\n\n`GoalController.restore()` 从宿主保存的 `goal_status` 事件恢复活跃 Goal；已完成/失败/清除的不重启；恢复后保留条件，但重算轮数、时间和 token 用量。" },
        { t: "audio", src: "audio/s17-04.mp3", title: "讲解 · 工作原理", transcript: "再看两个要点。第一，自动继续也必须有出口。Goal 本身没有一个默认的最多二十轮，是否满足完成条件由判断器每轮重新判断。但任何自动机制都不能无限占住一次请求，这一课在 Stop hook 外保留两道通用出口：主循环的全局 max turns；以及 Stop hook 连续阻止结束的次数上限。达到上限时，程序把控制权还给用户，但不会把目标伪装成完成，也不会自动清除目标。用户可以查看状态、补充信息后继续，或者主动清除。判断器调用失败时采用同样原则：停止自动续轮，保留目标，并把错误交给用户，而不是在无法判断时宣称成功。想限制自动执行轮数，用主循环的全局限制，比如 MAX TURNS 等于二十，而不是给 Goal 偷偷加一个固定预算。第二，查看、替换和清除。每个会话同时只有一个活跃 Goal。输入 /goal 查看当前条件、已经判断的次数、经过时间、主 agent 的 token 使用量和最近一次判断原因；输入 /goal 加新的完成条件，直接替换旧 Goal，并立即按新条件开始工作；输入 /goal clear 清除当前 Goal，stop、off、reset、none、cancel 都可以作为清除别名。Goal Controller 的 restore 方法可以从宿主保存的 goal status 事件中恢复仍然活跃的 Goal；已经完成、失败或主动清除的 Goal 不会重新启动。恢复后保留完成条件，但重新计算轮数、时间和 token 使用量。四个新增部件：GoalState 保存条件、判断次数、开始时间和最近原因；PromptGoalEvaluator 用一次独立模型调用读取对话并返回判断；GoalController 设置、查看、清除 Goal 并实现 Stop hook；AgentSession 在原来的退出位置接入 Goal 判断，接入点只有几行。" },

        { t: "section", icon: "📚", title: "知识补充" },
        { t: "text", h: "① 本质：Goal Loop = 「停止权的分离」", p: "s01 前：停止权在模型（不调工具就停）→ 自评完成，可能自欺。\n\ns17：**模型提出停止，独立判断器裁决**——决策权与执行权分离，完成判定不再由干活的人说了算。" },
        { t: "text", h: "② 一个类比：审计 vs 做账", p: "主模型是会计，把每笔账（命令+结果）记进对话；判断器是审计师，只看账本判断目标是否达成。\n\n会计不能自己盖章说通过——**审计要独立**。" },
        { t: "text", h: "③ 延伸：为什么完成条件必须「可检查」", p: "判断器是只读对话的模型，无法亲验。「把代码弄好」无法从对话证据判定；「pytest 退出码为 0」可以从工具结果判定。\n\n**让目标可验证，判断才可能可靠**——这也是给所有自动系统提需求的标准。" },
        { t: "audio", src: "audio/s17-05.mp3", title: "讲解 · 知识补充", transcript: "补充三个背景知识。第一，这一课的本质是停止权的分离。之前，停止权在模型手里：不调工具就停，等于自己评价自己完成，可能自欺。第十七课把停止权拆开：模型提出停止，独立判断器裁决。决策权与执行权分离，完成判定不再由干活的人说了算。这在产品上是一个很强的信号：凡是让 AI 自己验收自己工作的系统，都要加一道独立的检查。第二，打个比方：主模型是会计，把每笔账记进对话，命令和结果都写清楚；判断器是审计师，只看账本判断目标是否达成。会计不能自己盖章说通过，审计要独立。第三，为什么完成条件必须可检查？因为判断器是只读对话的模型，无法亲验。把代码弄好这句话无法从对话证据判定，而 pytest 退出码为零可以从工具结果判定。让目标可验证，判断才可能可靠。这也是我们向任何自动系统提需求的标准：不说做得更好，而说满足什么条件才算完成。对产品经理来说，这一课给出了 agent 产品里最实用的一环：用自然语言设定可检查的目标，让 agent 自主干到条件满足，或者诚实地说做不到。" },

        { t: "section", icon: "🎯", title: "难点解读" },
        { t: "text", h: "难点 1：判断器「只读对话」——可靠性上限在哪？", p: "判断器不能重跑测试，可靠性取决于**对话里有没有把关键结果说清楚**。所以主模型 prompt 强制要求「写命令+结果进对话」。\n\n这不是缺陷而是设计：验证归工具，判定归判断器，**责任单点化**。" },
        { t: "text", h: "难点 2：为什么后台未结束时 defer 而不是「等」？", p: "Stop hook 在轮次结束处同步运行——**等**会卡住主循环。\n\ndefer 表示「本次不判断」，后台通知稍后作为普通消息回来，触发下一轮时再判断。异步结束是事件，不是等待。" },
        { t: "text", h: "易错点 3：为什么「不把目标伪装成完成」？", p: "到达轮数上限 ≠ 目标完成。\n\n把超限标成成功 = 对用户撒谎，也会让判断器学到「喊停就能过关」。超限只移交控制权，目标原样保留。" },
        { t: "text", h: "核心设计决策", p: "**停止提议归模型，完成裁决归判断器，验证证据进对话，自动循环留出口。**" },
        { t: "audio", src: "audio/s17-06.mp3", title: "讲解 · 难点解读", transcript: "讲几个难点。第一，判断器只读对话，可靠性上限在哪？判断器不能重跑测试，可靠性取决于对话里有没有把关键结果说清楚。所以主模型的系统提示强制要求：运行验证命令后，把命令和结果明确写进对话。这不是缺陷而是设计：验证归工具，判定归判断器，责任单点化。第二，为什么后台未结束时 defer 而不是等？因为 Stop hook 在轮次结束处同步运行，等会卡住主循环。defer 表示本次不判断，后台通知稍后作为普通消息回来，触发下一轮时再判断。异步结束是事件，不是等待。第三，一个容易踩的坑：为什么不能把目标伪装成完成？因为到达轮数上限不等于目标完成。把超限标成成功，是对用户撒谎，也会让判断器学到喊停就能过关。超限只移交控制权，目标原样保留。第四，核心设计决策：停止提议归模型，完成裁决归判断器，验证证据进对话，自动循环留出口。这四句，是持续执行类 agent 产品的设计纲领。" },

        { t: "section", icon: "💼", title: "AI 产品经理面试题" },
        { t: "qa", q: "「模型不再调用工具」为什么不能等于「任务完成」？/goal 怎么解决？", a: "不调用工具只说明**当前轮次结束**：模型可能自认为做完（实际没做）、可能做了一部分、也可能放弃。没有工具调用 ≠ 目标达成。\n\n/goal 方案：① 保存完成条件，立即作为本轮任务交给主模型；② 主循环在返回前运行 Goal Stop hook，由**独立判断器**（另一次模型调用、无工具、只读对话）检查条件；③ ok=true 才返回，ok=false 带 reason 回循环继续，impossible=true 诚实认输。\n\n本质：**把「停止权」从干活模型手里分离**——模型提议停止，独立判断器裁决，避免自评完成的自欺问题。" },
        { t: "qa", q: "完成条件应该怎么写才可靠？为什么「把代码弄好」不行？", a: "可靠条件写清三件事：\n\n① **结束状态**：最终要达到什么结果（如登录模块迁移完成）；\n② **验证方式**：用什么命令/输出证明（pytest tests/auth 退出码为 0）；\n③ **限制条件**：不能破坏什么（不修改 tests/auth 之外的测试文件）。\n\n「把代码弄好」不行：判断器是**只读对话的模型**，无法亲验代码质量，也从对话证据里无法判定「好」——条件必须能从对话中的命令结果得到验证。\n\n产品启示：给 agent 下目标，本质是**写验收标准**——结束状态 + 验证方式 + 限制条件，缺一不可。" },
        { t: "qa", q: "（难点）自动继续为什么必须留出口？怎么保证不失控？", a: "任何自动机制都不能无限占住一次请求：\n\n① 主循环全局 `max_turns`（如 MAX_TURNS=20）；\n② Stop hook **连续阻止结束的次数上限**。\n\n达到上限 → 控制权还给用户，但**不把目标伪装成完成、不自动清除**；判断器调用失败同原则（停止续轮、保留目标、错误交用户，不在无法判断时宣称成功）。\n\n保证可控的三原则：**有界**（两道轮数上限）、**诚实**（超限不是完成）、**可恢复**（目标保留，用户可查看/续跑/清除）。\n\n产品启示：任何自主执行功能都必须自带「停止条件 + 逃生出口」，这是无人值守系统的安全基线。" },

        { t: "section", icon: "🧪", title: "试一下" },
        { t: "text", h: "", p: "> **安全提示**：代码会执行模型生成的 shell 命令，建议在临时目录中运行。\n\n**准备**：`pip install -r requirements.txt` + `.env` 配 `ANTHROPIC_API_KEY`、`MODEL_ID`（可选 `GOAL_EVALUATOR_MODEL_ID` 用更小模型）。\n\n**运行**：\n\n```\npython s17_goal_loop/code.py /goal python -m pytest 退出码为 0\n```\n\n交互模式输入 `/goal` 查看、`/goal 新条件` 替换、`/goal clear` 清除。\n\n**观察重点**：主模型停手后判断器是否被调用；未满足时 reason 是否回循环继续；`impossible` 时是否诚实收场；后台未结束时是否 defer；超限后控制权是否还给用户且目标未伪装完成。" },
        { t: "audio", src: "audio/s17-07.mp3", title: "讲解 · 总结", transcript: "最后总结这一课。Goal Loop 解决怎么知道干完了：模型不再调用工具只代表这一轮想停，目标是否完成交给独立判断器。/goal 是会话级 Stop hook：保存完成条件，立即交给主模型开工；主模型停手时，判断器另起一次模型调用，只读对话做判断——ok 为真才结束，为假带理由回循环，impossible 诚实认输。判断依据是对话里的实际结果，所以主模型被要求把命令和结果写清楚；完成条件要写清结束状态、验证方式、限制条件；后台未结束时 defer，不急着判断。自动循环留两道出口：全局 max turns 和 Stop hook 连续阻止上限，超限只交控制权，不伪装完成。核心四句：停止提议归模型，完成裁决归判断器，验证证据进对话，自动循环留出口。建议你在命令行设置一个目标，观察停手、判断、续跑、认输的完整生命周期。到这里，十七课全部讲完——从基础工具到权限、记忆、任务、团队、MCP、工作流、目标循环，你已经拥有一个完整 agent 运行时的全景图。" },

        { t: "section", icon: "➡️", title: "下一步" },
        { t: "text", h: "", p: "十七课全部完成：s01~s04 基础与权限 → s05~s08 上下文与工具 → s09~s12 记忆/任务/后台/定时 → s13~s14 团队与外部工具 → s15~s17 集成、工作流与目标循环。\n\n**至此，你已拥有一个完整 Agent 运行时的全景图。** 下一步：把这些知识装进自己的产品——从一个最小 Harness 开始，逐步叠加机制。" },
        { t: "tip", text: "一句话记住 S17：**模型提议停止，判断器裁决完成。** 验证证据进对话，自动循环留出口。十七课收官：一个循环，全套机制。" }
      ]
    }
  ]
};
