# Link Verification Log — Thư viện tài nguyên YODY Product Builder

> **Phiên bản:** 1.0 · **Ngày verify:** 2026-06-24 · verified by Phase 1b (webfetch batch)
> **Nguồn URLs:** `03_Giao-An-Trien-Khai.md` §6 (29 unique) + per-session "Tài nguyên" refs (cùng tập URLs).
> **Verify method:** webfetch each URL (HTTP status + topic match + canonical suggestion). Batch parallel.

## Audit table — 29 URLs

| # | URL | Group | HTTP | Topic match | Ghi chú |
|---|---|---|---|---|---|
| 1 | anthropic.skilljar.com/ai-capabilities-and-limitations | L1 | 200 | yes | Course landing; curriculum khớp. Canonical OK. |
| 2 | anthropic.skilljar.com/claude-101 | L1 | 200 | yes | "Claude 101" course. Canonical OK. |
| 3 | claude.com/resources/tutorials/why-do-ai-models-hallucinate | L1 | 200 | yes | Tutorial hallucination. Canonical OK. |
| 4 | claude.com/resources/tutorials/what-is-sycophancy-in-ai-models | L1 | 200 | yes | Tutorial sycophancy. Canonical OK. |
| 5 | claude.com/resources/tutorials/the-4-ds-of-ai-fluency-behavioral-indicators | L1 | 200 | yes | 4D behavioral indicators. Canonical OK. |
| 6 | claude.com/resources/tutorials/writing-an-ai-diligence-statement | L1 | 200 | yes | Diligence statement tutorial. Canonical OK. |
| 7 | anthropic.skilljar.com/ai-fluency-framework-foundations | L2 | 200 | yes | "AI Fluency: Framework & Foundations" course. Canonical OK. |
| 8 | www.anthropic.com/ai-fluency/deep-dive-2-effective-prompting-techniques | L2 | 200 | partial | Redirect → Skilljar AI Fluency course (same shell as #7); "Deep Dive 2" là lesson trong #7, không phải page riêng. **Giữ URL** (alive, dẫn đúng course). |
| 9 | platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview | L2 | 200 | yes | "Prompt engineering overview" alive. **PREFERRED canonical** — Anthropic đang migrate docs→platform.claude.com. |
| 10 | docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought | L2 | 200 | no (consolidated) | Redirect tới page "Prompting best practices" — slug `chain-of-thought` cũ không còn standalone. **CANONYCIZE → #10b**. |
| 10b | platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | L2 (replace #10) | 200 | yes | Trang consolidated "Prompting best practices" trên platform.claude.com (cùng domain #9, consistent migration). |
| 11 | anthropic.skilljar.com/introduction-to-claude-cowork | L3 | 200 | yes | "Introduction to Claude Cowork" course. Canonical OK. |
| 12 | claude.com/resources/use-cases | L3 | 200 | yes | Use cases hub (filterable). Canonical OK. |
| 13 | claude.com/resources/courses | L3 | 200 | yes | Courses hub. Canonical OK. |
| 14 | anthropic.skilljar.com/claude-code-101 | L4 | 200 | yes | "Claude Code 101" course. Canonical OK. |
| 15 | anthropic.skilljar.com/claude-code-in-action | L4 | 200 | yes | "Claude Code in Action" course. Canonical OK. |
| 16 | anthropic.skilljar.com/claude-with-the-anthropic-api | L4 | 200 | yes | Title "Building with the Claude API"; slug khác title. Canonical OK. |
| 17 | anthropic.skilljar.com/claude-platform-101 | L4 | 200 | yes | "Claude Platform 101" course. Canonical OK. |
| 18 | anthropic.skilljar.com/introduction-to-model-context-protocol | L5 | 200 | yes | "Introduction to Model Context Protocol" course. Canonical OK. |
| 19 | anthropic.skilljar.com/model-context-protocol-advanced-topics | L5 | 200 | yes | "MCP: Advanced Topics" course. Canonical OK. |
| 20 | anthropic.skilljar.com/introduction-to-subagents | L5 | 200 | yes | "Introduction to subagents" course. Canonical OK. |
| 21 | anthropic.skilljar.com/introduction-to-agent-skills | L5 | 200 | yes | "Introduction to agent skills" course. Canonical OK. |
| 22 | walkinglabs.github.io/learn-harness-engineering/vi/ | L5 | 200 | yes | Vietnamese localization của "Learn Harness Engineering" OER. Canonical OK (vi locale). |
| 23 | www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | L5 | 200 | yes | Engineering blog (26/11/2025). Canonical OK. |
| 24 | www.anthropic.com/engineering/harness-design-long-running-apps | L5 | 200 | yes | Engineering blog (24/03/2026). Canonical OK. |
| 25 | www.anthropic.com/learn | Hub | 200 | yes | "Anthropic Academy" hub. Canonical OK. |
| 26 | anthropic.skilljar.com/ | Hub | 200 | yes | Skilljar "Anthropic courses" catalog. Canonical OK. |
| 27 | claude.com/resources/tutorials | Hub | 200 | yes | Tutorials hub (filter grid). Canonical OK. |
| 28 | platform.claude.com/docs | Hub | 200 | partial | SPA shell (`<HomePage />`), content JS-rendered — alive nhưng không extract via text-fetch. URL alive, topic assumed yes. |
| 29 | aifluencyframework.org/ | Hub | 200 | yes | AI Fluency Framework OER site. Canonical OK. |

## RECONCILE DECISION (#9 vs #10)

- **#9 wins** — `platform.claude.com/.../prompt-engineering/overview` alive và là PREFERRED canonical (Anthropic đang migrate docs.anthropic.com → platform.claude.com). Giữ nguyên.
- **#10 → canonicalize thành #10b** — `docs.anthropic.com/.../chain-of-thought` chỉ còn redirect. Slug `chain-of-thought` đã merge vào trang "Prompting best practices" trên cả 2 domain (probe `platform.claude.com/.../chain-of-thought` cũng redirect tới best-practices). → Đổi URL #10 thành `https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices` (cùng domain với #9, consistent migration). Giữ link label "Chain-of-thought prompting" (topic vẫn được cover trong best-practices, label giữ cho nhận dạng context).
- **Không drop #10** — giữ entry để vẫn cover CoT topic nhưng trỏ tới URL sống canonical.

## Files updated bởi reconcile (#10 → #10b)

| File | Vị trí | Trước | Sau |
|---|---|---|---|
| 03_Giao-An-Trien-Khai.md | §6 L2 (line 336) | docs.anthropic.com/.../chain-of-thought | platform.claude.com/.../claude-prompting-best-practices |
| 03_Giao-An-Trien-Khai.md | line 320 verify date | Kiểm tra lần cuối: 21/06/2026 | Kiểm tra lần cuối: 24/06/2026 |
| Sessions/I2.1-Advanced-Prompting.md | Tài nguyên line 36, 108 | docs.anthropic.com/.../chain-of-thought | platform.claude.com/.../claude-prompting-best-practices |
| Sessions/I2.3-Prompt-de-Insight-Spec.md | Tài nguyên line 36, 119 | docs.anthropic.com/.../chain-of-thought | platform.claude.com/.../claude-prompting-best-practices |
| Teaching-Kit-I2.1/...md | Tài nguyên line 282 | docs.anthropic.com/.../chain-of-thought | platform.claude.com/.../claude-prompting-best-practices |
| Teaching-Kit-I2.3/...md | Tài nguyên line 266 | docs.anthropic.com/.../chain-of-thought | platform.claude.com/.../claude-prompting-best-practices |

> Link label giữ "Chain-of-thought & prompting best practices" khi thay đổi lần đầu trong 03 doc; các session/kit giữ label "Chain-of-thought prompting" để minimise diff — URL đã trỏ tới best-practices (người dùng click ra đúng nhất).

## Verified URLs — endpoint rate-limit note

- Webfetch hàng loạt không rate-limit (Skilljar, anthropic.com, claude.com, aifluencyframework.org, walkinglabs.github.io — all 200).
- Nếu screenshot tươi sau này: đọc log này + re-fetch, update `Ngày verify`.

---

*v1.0 · 2026-06-24 · Phase 1b · audit log 29 + 1 reconcile probe (#R) = 30 webfetch.*