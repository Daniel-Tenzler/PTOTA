# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Theory of the Arcane** - A desktop-only, browser-based idle/incremental game.

## Tech Stack

- React + TypeScript + Vite
- **Zustand** - State management
- Tailwind CSS (dark mode only)
- Package manager: **yarn** (preferred over npm)

## Commands

```bash
# Install dependencies
yarn install

# Development server
yarn dev

# Build
yarn build

# Type checking
yarn typecheck

# Linting
yarn lint

# Format code with Prettier
yarn format

# Check code formatting
yarn format:check
```

## Architecture

### Project Structure

```
src/
├── components/           # React UI components
│   ├── layout/          # Column layout components (LeftColumn, CenterColumn)
│   ├── resources/       # Resource display (ResourcePanel)
│   ├── actions/         # Action buttons and tooltips (ActionButton, ActionsView)
│   ├── skills/          # Skill display (SkillsView)
│   ├── spells/          # Spell management (SpellsView)
│   ├── combat/          # Combat view (CombatView)
│   ├── tooltip/         # Tooltip components
│   │   ├── GenericTooltip.tsx   # Generic tooltip renderer
│   │   └── positioning.tsx      # Tooltip positioning logic
│   └── housing/         # Housing components
│       ├── ItemsCatalog.tsx      # Item catalog
│       ├── HouseSelector.tsx      # House selection
│       └── housingIcons.tsx        # Housing icons/colors
├── stores/              # Zustand stores
│   ├── gameStore.ts     # Main game state
│   └── saveStore.ts     # Save/load utilities
├── systems/             # Game logic (pure functions)
│   ├── actions.ts       # Action execution
│   ├── skills.ts        # Skill calculations
│   ├── spells.ts        # Spell cooldowns/effects
│   ├── combat.ts        # Combat logic
│   └── resources.ts     # Resource management
├── data/                # Data definitions
│   ├── actions/        # Action definitions (modular)
│   │   ├── factories.ts          # Action factory functions
│   │   ├── resourceActions.ts    # Resource-producing actions
│   │   └── housingUnlockActions.ts # Housing unlock actions
│   ├── actions.ts       # Main action exports (re-exports from actions/)
│   ├── skills.ts        # Skill definitions
│   ├── spells.ts        # Spell definitions
│   ├── housing.ts       # House and item definitions
│   └── enemies.ts       # Enemy definitions
├── utils/               # Utility functions
│   ├── immutableUpdates.ts  # Immutable state update utilities
│   ├── rankBonus.ts      # Rank bonus calculations
│   └── housingEffects.ts  # Housing effect formatting
├── hooks/               # Custom React hooks
│   ├── useGameLoop.ts   # Game loop (requestAnimationFrame)
│   └── useSave.ts       # Auto-save hook
├── types/               # TypeScript types
│   └── index.ts         # All type definitions
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

### Core Systems (Data-Driven)

All systems are designed to be modular and data-driven with **no hardcoded assumptions** about:
- Resources (standard and special)
- Skills
- Actions
- Spells

### Three-Column Layout

```
┌─────────────┬──────────────────┬─────────────┐
│ Navigation  │ Main Content     │ Resources   │
│ (Tabs)      │ (Actions/Skills/ │ (Always     │
│             │  Spells/Combat)  │  visible)   │
└─────────────┴──────────────────┴─────────────┘
```

### Key Systems

**Resources**
- Standard resources: gold, scrolls, enchanted scrolls, combat drops
- Special resources with regen and caps: Stamina, Health
- Stamina starts at 10 max, 0.2/sec regen

**Actions** (Core system)
- Categories: Resource-Producing, Resource-Processing, Timed/Continuous, Unlock
- Properties: inputs, outputs, duration, category, rank
- Rank improves through repeated use, provides % bonus effectiveness
- **Starter actions**: "Gain Gold" (free, produces gold), "Write Scrolls" (costs 2 gold, produces scrolls)
- Rank bonuses: 10 executions → +10%, 100 executions → +20%

**Skills**
- Levels and experience
- Some actions grant skill XP
- Unlocks: new actions, spells, effectiveness boosts
- **Starter skill**: Arcane (levels 1-10, unlocks at level 2: enchant-scrolls, level 5: spell slot)

**Spells**
- Automated combat only (no manual casting)
- Start with 1 spell slot, unlock more via unlock actions
- Independent cooldowns and effects
- **Available spells**: Fireball (10 dmg, 5s cooldown), Ice Shard (7 dmg, 3s cooldown)

**Combat**
- Fully automated, time-based with auto-spawning enemies
- Player auto-attack: 2.5 second interval (base 5 dmg + arcane level)
- Spells cast independently when cooldowns are ready
- **Enemies**: Slime (20 HP, 3 dmg), Goblin (35 HP, 5 dmg), Skeleton (50 HP, 8 dmg)
- Rewards feed back into action/skill progression

**Game Loop**
- `requestAnimationFrame` with delta-time capping (max 0.5s)
- Updates: resources (regen), skills (level-ups), combat (attacks), spells (cooldowns)
- Auto-saves every 30 seconds via `useSave` hook

**Persistence**
- localStorage-based save system
- Auto-saves every 30 seconds and on component unmount
- Save key: `theoryOfTheArcane_save`

### UI Philosophy

- Desktop-only (hard constraint)
- Dark mode only
- Warm, slightly warm gray palette
- Minimal, uncluttered
- No visual noise or excessive numbers
- Action buttons show only name on hover tooltip (inputs, outputs, duration)
- **Use custom Tooltip component for all tooltips** - Do NOT use native browser tooltips

## Design Constraints

## Code Quality Improvements (2025-02)

### Modular Action Definitions
Action definitions are split into focused modules:
- `src/data/actions/factories.ts` - Factory functions for creating actions
- `src/data/actions/resourceActions.ts` - Base resource-producing actions
- `src/data/actions/housingUnlockActions.ts` - Housing unlock actions
- `src/data/actions.ts` - Main export point (re-exports from above)

### Generic Tooltip Component
- `src/components/tooltip/GenericTooltip.tsx` - Unified tooltip renderer
- Works for both housing items and houses
- Reduces code duplication

### Immutable Update Utilities
- `src/utils/immutableUpdates.ts` - Type-safe state update functions
- Eliminates manual state spreading throughout codebase
- Functions: `updateHousingEquippedItems`, `removeHousingItemLocation`, `mergeUpdates`, etc.

### Generic Affordability Check
- `src/systems/resources.ts` exports `canAfford()` generic utility
- Works for any cost object (houses, items, actions)
- `canAffordHouse()` and `canAffordItem()` are convenience wrappers

## Design Constraints

- No mobile support, no responsive design
- Complexity emerges from system interaction, not UI density
- UI must not attempt to explain everything at once

## Adding New Content

### Adding a New Action
1. Add definition using appropriate factory function in `src/data/actions/`:
   - Use `createResourceAction()` for resource-producing actions
   - Use `createTimedAction()` for timed actions
   - Use manual definition for unlock actions (in `housingUnlockActions.ts`)
2. Initialize action state in `src/stores/gameStore.ts`
3. Add to action list in `src/components/actions/ActionsView.tsx`
4. If unlocked by default, add to `STARTER_ACTIONS` in `src/config/initialState.ts`

### Adding a New Spell
1. Add definition to `src/data/spells.ts`
2. No other changes needed - will appear in SpellsView automatically

### Adding a New Enemy
1. Add definition to `src/data/enemies.ts`
2. Will spawn automatically during combat

### Adding a New Skill
1. Add definition to `src/data/skills.ts`
2. Initialize skill state in `src/stores/gameStore.ts`

## Workflow Preferences

### Development Workflow
- **NO git worktrees** - Work directly in the main workspace
- **Direct implementation** - Proceed with implementation immediately after design approval
- **Subagent-driven development** - Use Task tool with specialized agents for implementation
- **NO confirmation prompts** - Do not ask "Ready to implement?" or similar questions
- **User handles all git operations** - Never run git commands (add, commit, push, etc.)

### When Planning Features
1. Explore and design the solution
2. Create design document in `docs/plans/`
3. Proceed directly to implementation using subagent-driven development
4. NO stopping to ask for approval or readiness

### Implementation Approach
- Break down work into independent tasks
- Launch parallel agents when possible
- Focus on one task at a time in order
- Complete all work before presenting results
