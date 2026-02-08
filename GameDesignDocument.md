Game Design Document
Title: **Theory of the Arcane**

---

### 1. High-Level Overview

Theory of the Arcane is a **desktop-only**, browser-based idle / incremental game focused on actions, resources, skills, spells, and automated combat.

The core gameplay loop is:

* Execute actions
* Spend stamina and resources
* Gain resources and skill experience
* Improve actions through repetition
* Unlock stronger actions, spells, and character upgrades
* Engage in automated combat to acquire additional resources
* Repeat

The game is explicitly designed to be modular, data-driven, and unambiguous for implementation with LLM assistance.

---

### 2. Technical Overview

* Platform: Browser (desktop only)
* Framework: React
* Language: TypeScript
* Build Tool: Vite
* Styling: Tailwind CSS
* No mobile support, no responsive design considerations

Desktop-only design is a hard constraint.

---

### 3. Visual Style & UI Philosophy

* Dark mode only
* Very simple, minimal, uncluttered UI
* Warm, slightly warm gray color palette
* No visual noise
* No excessive numbers, meters, or micro-stats

Only essential information is shown to the player.

The UI should never attempt to explain everything at once. The goal is clarity, not completeness.

---

### 4. Core UI Layout

The game uses a **three-column desktop layout** at all times.

#### Left Column: Navigation

* Vertical tab-based navigation
* Always visible

Initial tabs:

1. Actions
2. Skills
3. Spells
4. Combat / Exploration

---

#### Center Column: Main Content

* Changes based on selected navigation tab
* Displays:

  * Action buttons
  * Skill summaries
  * Spell configuration
  * Combat view

Actions are the primary visual focus of the game.

---

#### Right Column: Resources

* Always visible on all screens
* Displays current player resources
* Includes:

  * Standard resources (gold, scrolls, etc.)
  * Special resources (health, stamina)

Resources are shown in a compact list without unnecessary detail.

---

### 5. Resources

Resources are numeric values owned by the player.

#### 5.1 Standard Resources

* Produced and consumed by actions, spells, and combat
* Examples:

  * Gold
  * Scrolls
  * Enchanted scrolls
  * Combat drops

The system must not assume specific resource types.

---

#### 5.2 Special Resources

Two resources have special behavior:

**Stamina**

* Used as a cost for most actions
* Has:

  * Current value
  * Maximum capacity
  * Regeneration rate
* Initial values:

  * Max stamina: 10
  * Regeneration: 0.2 stamina per second
* Most actions consume stamina on execution

Stamina exists to:

* Prevent rushing the early game
* Gate progression naturally
* Create upgrade paths (capacity, regen, efficiency)

**Health**

* Used primarily in combat
* Has:

  * Current value
  * Maximum capacity
  * Regeneration (initially slow or minimal)
* Health is not fixed and must regenerate over time

Health and stamina are treated as resources, but with regeneration and caps.

---

### 6. Actions System (Core System)

Actions are the primary player interaction.

Initially, the player has access to **only one or two actions**.

Example starting actions:

* Gain gold
* Write scrolls

---

#### 6.1 Action Categories

Actions fall into explicit categories:

1. **Resource-Producing Actions**

   * Generate base resources
   * Example: gain gold, write scrolls

2. **Resource-Processing Actions**

   * Convert or enhance existing resources
   * Example:

     * Enchant scrolls
     * Bind scrolls
     * Refine materials

3. **Timed / Continuous Actions**

   * Repeat automatically over time
   * Continue as long as requirements are met

4. **Unlock Actions**

   * One-time actions
   * Unlock:

     * New actions
     * Spell slots
     * Permanent boosts
   * Can only be executed once
   * After execution, they are removed or hidden

---

#### 6.2 Action Properties

Each action has:

* Inputs (resources, stamina, skill requirements)
* Outputs (resources, skill XP, unlocks)
* Duration (0 for instant, >0 for timed)
* Category
* Rank (see below)

---

#### 6.3 Action Execution Rules

* An action can only be executed if all requirements are met
* On execution:

  * Inputs are immediately consumed
* Timed actions:

  * Iterate automatically
  * Stop when requirements are no longer satisfied

---

#### 6.4 Action Rank System

Each action has a **rank** that improves through repeated use.

* Rank increases based on number of executions
* Rank provides a percentage bonus to the action’s effectiveness

Example progression (illustrative, not fixed):

* 10 executions → +10% effectiveness
* 100 executions → +20% effectiveness

Rank bonuses apply to:

* Resource output
* Action efficiency
* Possibly stamina cost reduction (later)

This system exists to:

* Reward repeated use
* Encourage specialization
* Provide progression independent of skills

---

### 7. Action UI Rules (Important Constraint)

Action buttons display **minimal information only**.

Visible on the button:

* Action name

Information shown via tooltip on hover:

* Required inputs
* Outputs
* Duration (if timed)

Explicit non-goals:

* No full stat breakdowns
* No XP numbers on buttons
* No hidden calculations exposed to the player

The UI must remain clean and flexible.

---

### 8. Skills System

Skills are a progression layer tied to actions and combat.

* Skills have levels and experience
* Some actions grant skill XP
* Skills unlock:

  * New actions
  * New spells
  * Increased effectiveness

Example skills:

* Arcane (general magical power)
* Pyromancy
* Hydromancy
* Herbalism
* Smithing
* Cooking

Skills are extensible and data-driven.

---

### 9. Spells System

Spells are automated combat enhancements.

#### 9.1 Spell Slots

* The player starts with **one spell slot**
* Additional spell slots must be unlocked via **unlock actions**
* Unlocking spell slots costs significant resources

Spell slots represent character investment via resource spending.

---

#### 9.2 Spell Behavior

* Equipped spells are cast automatically
* Each spell has:

  * Cooldown
  * Effect (initially damage only)
* Spells operate independently and in parallel

No manual spell casting.

---

### 10. Combat System

Combat is automated and time-based.

#### 10.1 Combat Entry

* Accessed via the Combat / Exploration tab
* Player selects a dungeon or location
* Combat starts immediately

Initial implementation:

* One dungeon (e.g. Dark Forest)

---

#### 10.2 Combat Mechanics

* Player and enemies have:

  * Health
  * Auto-attack damage
  * Attack interval

* Player auto-attacks:

  * Fixed base interval (e.g. 2.5 seconds)

* Enemies:

  * Variable attack intervals

Each attack reduces the opponent’s health.

---

#### 10.3 Spells in Combat

* Spells trigger automatically
* Independent of auto-attacks
* Multiple spells may trigger simultaneously

---

#### 10.4 Combat Outcome

* Enemy reaches 0 health:

  * Player wins
  * Rewards granted
* Player reaches 0 health:

  * Combat ends (penalty undefined for now)

---

### 11. Combat Rewards

Combat provides:

* Resources
* Possibly skill XP
* Materials used for actions and unlocks

Combat feeds directly back into the action and progression systems.

---

### 12. Design Constraints & Philosophy

* Desktop-only
* Minimal UI clutter
* Systems must be modular and data-driven
* No hardcoded assumptions about:

  * Resources
  * Skills
  * Actions
  * Spells
* Complexity emerges from system interaction, not UI density

---

### 13. Explicit Non-Goals (For Now)

* No mobile support
* No manual combat input
* No complex status effects
* No story or narrative systems
* No full stat dashboards
* No real-time micromanagement
