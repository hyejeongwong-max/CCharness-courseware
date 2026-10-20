# History — 项目改动记录

> 每次产品改动在此留档。版本号按 V0.1.x 递增。

## V0.1.0（2026-10-21）
- **初始版本**：克隆 learn-claude-code 课件仓库，17 课制作前端课件（courseware/）。
- **s01 Agent Loop**：完成（继承原仓库）。
- **s02 Tool Use**：按最终规格重做 —— 补齐「知识补充 / 难点解读 / 面试题」板块，6 段结构化深度讲解音频（晓晓音色）；对照 `code.py` 核验并修正 3 处不准确表述（bash 关键词黑名单、工具定义含 `input_schema`、代码块与真实实现对齐）。
- **HANDOFF.md**：落档「最终版规格」（音频为第一交付物；知识补充、面试题足量优质；其余板块从简；节省 token 开发机制）。
- **工程基建**：新建 `.venv` 并安装 edge-tts；`gen_audio.py` 支持按文件/课程过滤生成；`requirements.txt` 补 edge-tts；`courseware/README.md` 更新为新规格；新增本文件与每课校验清单。
- **全局语音速率控制器**：单课页右上角悬浮控件（− / + 微调 + 预设档位 0.75~2.0×），所有音频统一生效，localStorage 持久化。

## V0.1.1（2026-10-21）
- **s01 按新规格回补**：6 段讲解音频重写至 323~489 字/段（达"透彻"量化标准 350~600 字），内容对照 `code.py` 核验（含 bash 关键词黑名单、工具结果以 user 角色消息追加、仅真实 tool_use 进入执行等细节）。

## V0.1.2（2026-10-21）
- **s03~s08 批次1 完成**：Permission（三道闸门权限管线）、Hooks（4 事件注册表）、TodoWrite（≤20 项协议）、Subagent（一次性委派）、Skill Loading（注册表防注入）、Context Compact（四步压缩管线）。每课 6~7 段结构化讲解音频。
- **s09~s13 批次2 完成**：Memory（四子系统记忆）、Task System（任务依赖图 + 两阶段构建）、Background Tasks（后台线程池）、Cron Scheduler（定时调度器）、Agent Teams（团队运行时 + 收件箱 + 原子认领）。每课 6~8 段音频。
- **s14~s17 批次3 完成**：MCP Tools（外部工具动态接入）、Integrated Harness（多种机制一个循环）、Workflow Runtime（脚本编排 + journal 续跑）、Goal Loop（独立判断器决定是否继续）。每课 6~7 段音频。
- **17 课全部完成**：109 段讲解音频齐备（晓晓音色），全局语速控制器持久生效。
- **GitHub 部署**：推送至公开仓库，启用 GitHub Pages，课程入口 `https://hyejeongwong-max.github.io/CCharness-courseware/`；建存档分支 `V.0.1.2`。
