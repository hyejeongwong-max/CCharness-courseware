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
    }
  ]
};
