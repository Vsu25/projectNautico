# Workspace Rules & Guidelines for Antigravity

This file defines the global project rules and agent guidelines for this workspace. Antigravity must follow these rules without exception.

## Global Project Rules

### 1. Commit and Sync Protocol

> [!IMPORTANT]
> Every time a commit is asked, always sync and create a comment with the changes made and the files that were modified. They should be described in detail but kept simple, focusing on key changes and categorized (e.g., UI design, Hotfix, Bug, Feature, Refactor, etc.).

## Installed Workspace Skills

The following skills are installed under `.agents/skills/` and are available for task-specific execution:

### UI & UX Design Skills
- [ui-ux-pro-max](file:///.agents/skills/ui-ux-pro-max/SKILL.md) - Core UI/UX design intelligence.
- [design-system](file:///.agents/skills/design-system/SKILL.md) - Guidelines for constructing consistent UI component systems.
- [design](file:///.agents/skills/design/SKILL.md) - General layout and user flow design patterns.
- [ui-styling](file:///.agents/skills/ui-styling/SKILL.md) - CSS, Tailwind, and styling rules.
- [banner-design](file:///.agents/skills/banner-design/SKILL.md) - Creative assets and banner guidelines.
- [brand](file:///.agents/skills/brand/SKILL.md) - Branding integration rules.
- [slides](file:///.agents/skills/slides/SKILL.md) - Presentation and slide layout design.

### Prose & Quality Control
- [stop-slop](file:///.agents/skills/stop-slop/SKILL.md) - Rules to remove predictable AI writing patterns and filler from text/docs.

### Agent & Context Engineering Skills
- [context-compression](file:///.agents/skills/context-compression/SKILL.md) - Techniques for reducing token usage.
- [context-fundamentals](file:///.agents/skills/context-fundamentals/SKILL.md) - Core context assembly principles.
- [context-optimization](file:///.agents/skills/context-optimization/SKILL.md) - Optimizing agent memory and file scopes.
- [context-degradation](file:///.agents/skills/context-degradation/SKILL.md) - Debugging state decay in long runs.
- [filesystem-context](file:///.agents/skills/filesystem-context/SKILL.md) - Formatting folder-tree summaries for context.
- [latent-briefing](file:///.agents/skills/latent-briefing/SKILL.md) - KV cache sharing protocols.
- [memory-systems](file:///.agents/skills/memory-systems/SKILL.md) - Structuring persistent memory files.
- [multi-agent-patterns](file:///.agents/skills/multi-agent-patterns/SKILL.md) - Orchestration protocols.
- [harness-engineering](file:///.agents/skills/harness-engineering/SKILL.md) - Constructing mock evaluation layers.
- [evaluation](file:///.agents/skills/evaluation/SKILL.md) - General evaluation criteria.
- [advanced-evaluation](file:///.agents/skills/advanced-evaluation/SKILL.md) - High-fidelity benchmark logic.
- [bdi-mental-states](file:///.agents/skills/bdi-mental-states/SKILL.md) - Belief-Desire-Intention modeling patterns.
- [hosted-agents](file:///.agents/skills/hosted-agents/SKILL.md) - Multi-tenant cloud execution rules.
- [project-development](file:///.agents/skills/project-development/SKILL.md) - Software development lifecycle standards.
- [tool-design](file:///.agents/skills/tool-design/SKILL.md) - Principles for robust MCP and local tool development.

### Creative & Planning Skills
- [brainstorming](file:///.agents/skills/brainstorming/SKILL.md) - Transform rough ideas into fullyformed designs.
- [writing-plans](file:///.agents/skills/writing-plans/SKILL.md) - Structure and document complex plans.
- [executing-plans](file:///.agents/skills/executing-plans/SKILL.md) - Enforce discipline during execution.
- [writing-skills](file:///.agents/skills/writing-skills/SKILL.md) - Guidelines for constructing new agent skills.

### Git & Branch Management Skills
- [using-git-worktrees](file:///.agents/skills/using-git-worktrees/SKILL.md) - Isolation of development tasks via Git worktrees.
- [finishing-a-development-branch](file:///.agents/skills/finishing-a-development-branch/SKILL.md) - Checklists for closing development branches.

### Collaboration & Review Skills
- [requesting-code-review](file:///.agents/skills/requesting-code-review/SKILL.md) - Preparing PRs and code reviews.
- [receiving-code-review](file:///.agents/skills/receiving-code-review/SKILL.md) - Processing and incorporating review feedback.

### Multi-Agent Orchestration Skills
- [dispatching-parallel-agents](file:///.agents/skills/dispatching-parallel-agents/SKILL.md) - Parallel task execution.
- [subagent-driven-development](file:///.agents/skills/subagent-driven-development/SKILL.md) - Subagent coordination.

### Debugging & Quality Skills
- [systematic-debugging](file:///.agents/skills/systematic-debugging/SKILL.md) - Structured root cause analysis and fix validation.
- [test-driven-development](file:///.agents/skills/test-driven-development/SKILL.md) - Writing tests before implementing features.
- [verification-before-completion](file:///.agents/skills/verification-before-completion/SKILL.md) - Final checks before finishing.

### Meta & References Skills
- [using-superpowers](file:///.agents/skills/using-superpowers/SKILL.md) - Guidelines for discovering and executing workspace skills.
- [awesome-claude-skills](file:///.agents/skills/awesome-claude-skills/SKILL.md) - A searchable catalog of specialized community skills.
