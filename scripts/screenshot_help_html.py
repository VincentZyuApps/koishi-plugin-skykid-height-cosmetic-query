#!/usr/bin/env python3
# /// script
# dependencies = [
#   "playwright>=1.40.0",
# ]
# ///
r"""
📸 使用本机浏览器对离线活动二维码 HTML 指南页面进行全页高清截图。

本脚本符合 PEP 723 标准，使用 uv 运行无需手动搭建虚拟环境，依赖环境自动管理与隔离。

========================================
【UV 运行使用方法】
========================================

1. 基础运行（自动探测本机 Chrome / Edge，并自动截图保存为 index.png）：
   uv run scripts/screenshot_help_html.py

2. 显式指定本机的 Chrome 路径：
   uv run scripts/screenshot_help_html.py --browser-path "C:\Program Files\Google\Chrome\Application\chrome.exe"

3. 自定义视口宽度与超采样清晰度：
   uv run scripts/screenshot_help_html.py --width 800 --scale 2.0

4. 显式指定输入 HTML 与目标输出 PNG 路径：
   uv run scripts/screenshot_help_html.py --input docs/images/help/offline-qrcode/index.html --output docs/images/help/offline-qrcode/index.png
========================================
"""
import argparse
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

def find_default_browser():
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c
    return None

def main():
    parser = argparse.ArgumentParser(description="使用本机浏览器对 HTML 页面进行高质量全页截图")
    parser.add_argument(
        "--browser-path",
        default=None,
        help="本机浏览器可执行文件路径（如 chrome.exe），未指定时自动探测常用路径",
    )
    parser.add_argument(
        "--input",
        default=str(
            Path(__file__).resolve().parent.parent
            / "docs"
            / "images"
            / "help"
            / "offline-qrcode"
            / "index.html"
        ),
        help="输入的 HTML 文件路径或 HTTP URL",
    )
    parser.add_argument(
        "--output",
        default=str(
            Path(__file__).resolve().parent.parent
            / "docs"
            / "images"
            / "help"
            / "offline-qrcode"
            / "index.png"
        ),
        help="截图输出 PNG 图片路径",
    )
    parser.add_argument("--width", type=int, default=800, help="视口宽度（默认 800）")
    parser.add_argument("--scale", type=float, default=2.0, help="设备像素比（默认 2.0 高清截图）")
    parser.add_argument("--wait", type=int, default=1200, help="页面加载后额外等待毫秒数（默认 1200ms）")

    args = parser.parse_args()

    browser_path = args.browser_path or find_default_browser()
    if not browser_path or not os.path.isfile(browser_path):
        print(f"❌ 未找到可用的浏览器可执行文件: {browser_path}", file=sys.stderr)
        print("请通过 --browser-path 参数指定本机的 chrome.exe 路径。", file=sys.stderr)
        sys.exit(1)

    input_path = args.input
    if not input_path.startswith("http://") and not input_path.startswith("https://") and not input_path.startswith("file://"):
        abs_input = Path(input_path).resolve()
        if not abs_input.is_file():
            print(f"❌ 输入的 HTML 文件不存在: {abs_input}", file=sys.stderr)
            sys.exit(1)
        url = abs_input.as_uri()
    else:
        url = input_path

    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"🚀 启动浏览器: {browser_path}")
    print(f"📄 加载页面: {url}")
    print(f"📐 视口配置: width={args.width}, scale={args.scale}")

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=browser_path, headless=True)
        page = browser.new_page(
            viewport={"width": args.width, "height": 1080},
            device_scale_factor=args.scale,
        )
        page.goto(url)
        page.wait_for_load_state("networkidle")
        if args.wait > 0:
            page.wait_for_timeout(args.wait)

        page.screenshot(path=str(output_path), full_page=True)
        browser.close()

    print(f"✅ 截图生成成功！产物路径: {output_path}")
    print(f"📊 文件大小: {os.path.getsize(output_path) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
