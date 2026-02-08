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
│   └── combat/          # Combat view (CombatView)
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
│   ├── actions.ts       # Action definitions
│   ├── skills.ts        # Skill definitions
│   ├── spells.ts        # Spell definitions
│   └── enemies.ts       # Enemy definitions
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

## Design Constraints

- No mobile support, no responsive design
- Complexity emerges from system interaction, not UI density
- UI must not attempt to explain everything at once

## Adding New Content

### Adding a New Action
1. Add definition to `src/data/actions.ts`:
```typescript
export const ACTION_DEFS: Record<string, ActionDefinition> = {
  'your-action': {
    id: 'your-action',
    name: 'Your Action',
    category: 'resource-producing',
    inputs: { gold: 5 },
    outputs: { scrolls: 3 },
    staminaCost: 1,
    skillXp: { arcane: 2 },
    rankBonus: (executions: number) => {
      if (executions >= 100) return 0.2;
      if (executions >= 10) return 0.1;
      return 0;
    },
  },
  // ... other actions
};
```
2. Initialize action state in `src/stores/gameStore.ts`
3. Add to action list in `src/components/actions/ActionsView.tsx`

### Adding a New Spell
1. Add definition to `src/data/spells.ts`
2. No other changes needed - will appear in SpellsView automatically

### Adding a New Enemy
1. Add definition to `src/data/enemies.ts`
2. Will spawn automatically during combat

### Adding a New Skill
1. Add definition to `src/data/skills.ts`
2. Initialize skill state in `src/stores/gameStore.ts`
