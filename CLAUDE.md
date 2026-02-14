# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Monorepo of independent quickstart projects demonstrating Claude API capabilities. Each subdirectory is a standalone project with its own dependencies, README, and setup. There is no shared build system — always `cd` into the specific project before running commands.

## Legal

When changes are made to files that have a copyright notice, add them to that subdirectory's CHANGELOG.md file (e.g., `browser-use-demo/CHANGELOG.md`).

## CI/CD

GitHub Actions (`.github/workflows/`) runs tests and Docker builds for `computer-use-demo` only:
- `tests.yaml`: ruff, pyright, pytest
- `build.yaml`: multi-platform Docker images → `ghcr.io/anthropics/anthropic-quickstarts`

Pre-commit hooks (`.pre-commit-config.yaml`) apply to `computer-use-demo/` files only: ruff lint/format + pyright.

## Project Commands

### Python Projects

All Python projects: snake_case functions/variables, PascalCase classes, type annotations on all parameters and returns.

**agents/** — Educational LLM agent implementation (<300 lines)
```
pip install anthropic mcp
python test_message_params.py          # tests
jupyter notebook agent_demo.ipynb      # demo
```
Tools use abstract base classes (`tools/base.py`). Supports both local tools and MCP server tools.

**autonomous-coding/** — Multi-session coding agent (Claude Agent SDK)
```
pip install -r requirements.txt
python autonomous_agent_demo.py --project-dir ./my_project
python autonomous_agent_demo.py --project-dir ./my_project --max-iterations 3
python test_security.py                # security tests
```
Two-agent pattern: initializer creates feature list, coding agent works through it across sessions. Bash commands restricted to an allowlist in `security.py`. Default model: `claude-sonnet-4-5-20250929`.

**browser-use-demo/** — Browser automation with Playwright (Python 3.11+)
```
pip install -e ".[dev,test]"
docker-compose up --build              # run
docker-compose up --build --watch      # run with file watching
ruff check .                           # lint
pyright                                # typecheck
pytest                                 # all tests
pytest tests/path_to_test.py::test_name -v  # single test
```
Test markers: `integration`, `slow`, `asyncio`. Main tool logic in `browser_use_demo/tools/browser.py`. Uses element `ref` targeting (not coordinates). JS utilities in `browser_use_demo/browser_tool_utils/`.

**computer-use-demo/** — Desktop control via Computer Use API (Python 3.11+)
```
./setup.sh                             # first-time setup
docker build . -t computer-use-demo:local
ruff check . && ruff format .          # lint + format
pyright                                # typecheck
pytest                                 # all tests
pytest tests/path_to_test.py::test_name -v  # single test
```
Uses custom `ToolError` for tool error handling. Coordinate-based interaction (unlike browser-use-demo's ref-based approach). Ruff line length: 88.

### TypeScript/Next.js Projects

All three use Next.js 14, React 18, TypeScript strict mode, Tailwind CSS, and shadcn/ui components. Commands are the same for each:

```
npm install
npm run dev       # development server
npm run build     # production build
npm run lint      # ESLint
```

**customer-support-agent/** — Chat UI with Amazon Bedrock Knowledge Base RAG
- Has UI layout variants: `npm run dev:left`, `npm run dev:right`, `npm run dev:chat`
- Has build variants too — see `package.json` scripts
- Sidebar inclusion controlled by `NEXT_PUBLIC_INCLUDE_*` env vars in `config.ts`
- Requires Node >=18.17.0

**financial-data-analyst/** — Data analysis with interactive Recharts visualization
- Supports multi-format upload (text, code, PDF via pdfjs-dist, images)
- Chart types: Line, Bar, Multi-Bar, Area, Stacked Area, Pie

**net-worth-tracker/** — Personal wealth dashboard
- All data persisted in browser localStorage (`lib/storage.ts`)
- API integrations for UK financial providers defined in `lib/api-connections.ts`
- Excel import/export via `xlsx` library (`lib/excel.ts`)
- Asset/liability type definitions in `lib/types.ts` (11 asset categories, 5 liability categories)
- Main state management in `components/dashboard.tsx`
- Specialized tabs: property, pension, equity exposure

## Architecture Notes

- Python demos (browser-use, computer-use) share a similar pattern: Streamlit UI → agent loop (`loop.py`) → tool collection → individual tools. Both run inside Docker with VNC access.
- Browser-use-demo's `browser.py` (~52KB) is the largest single file — it implements all browser actions. Computer-use-demo's equivalent is `tools/computer.py`.
- The three Next.js apps are independent — they don't share components or libraries despite similar stacks.
- All projects use `ANTHROPIC_API_KEY` env var. Customer-support-agent additionally needs AWS credentials for Bedrock.
