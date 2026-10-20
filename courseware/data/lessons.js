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
    }
  ]
};
