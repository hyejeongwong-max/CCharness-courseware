#!/usr/bin/env python3
"""从 data/lessons.js 提取 audio block，批量合成语音（Edge TTS 晓晓）。

用法（在 courseware 目录下）：
    <项目 .venv>/python tools/gen_audio.py            # 生成全部缺失音频
    <项目 .venv>/python tools/gen_audio.py --force    # 强制重新生成

依赖：edge-tts（已装在项目 .venv 中）
"""
import re
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "lessons.js"
VOICE = "zh-CN-XiaoxiaoNeural"  # 晓晓：温柔女声


def extract_audio_blocks() -> list[tuple[str, str]]:
    """从 lessons.js 中提取 (src, transcript) 列表。"""
    content = DATA.read_text(encoding="utf-8")
    pairs = []
    # 匹配每个 audio block（t: "audio" ... }）
    for block in re.findall(r"\{[^{}]*t:\s*\"audio\"[^{}]*\}", content):
        src = re.search(r"src:\s*\"([^\"]+)\"", block)
        transcript = re.search(r"transcript:\s*\"([^\"]*)\"", block)
        if src and transcript:
            pairs.append((src.group(1), transcript.group(1)))
    return pairs


async def synthesize(text: str, out_path: Path) -> None:
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(str(out_path))


async def main() -> int:
    force = "--force" in sys.argv
    pairs = extract_audio_blocks()
    if not pairs:
        print("未找到 audio block，请检查 data/lessons.js")
        return 1

    print(f"共 {len(pairs)} 段音频，音色：{VOICE}\n")
    done = skip = 0
    for src, transcript in pairs:
        out = ROOT / src
        out.parent.mkdir(parents=True, exist_ok=True)
        if out.exists() and not force:
            skip += 1
            print(f"  跳过（已存在）{out.name}")
            continue
        await synthesize(transcript, out)
        done += 1
        print(f"  ✓ {out.name}  ({len(transcript)} 字)")
    print(f"\n完成：生成 {done} 段，跳过 {skip} 段。")
    return 0


if __name__ == "__main__":
    import asyncio
    raise SystemExit(asyncio.run(main()))
