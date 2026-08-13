# Segue o Fluxo

## Product Specification & AI-Driven Development Plan

**Project:** Segue o Fluxo
**Type:** Local party game / mobile-first web application
**Stack:** Next.js + TypeScript + Tailwind CSS
**Architecture:** Frontend-only MVP
**Persistence:** LocalStorage
**Primary device:** Smartphone
**Development methodology:** Spec-Driven Development + Multi-Agent AI Workflow

---

# 1. Product Vision

Segue o Fluxo is a local party game designed to be played by a group of people around a single smartphone.

One player acts as the **Game Manager** and controls the application.

The other players interact physically using paper and pen.

The application is responsible for:

- configuring the game;
- registering players;
- selecting questions;
- managing rounds;
- managing timers;
- recording scores;
- preventing repeated questions;
- calculating the final ranking;
- presenting the winner and loser;
- providing a polished, playful game experience.

The application must NOT require:

- login;
- backend;
- database;
- WebSockets;
- multiple devices;
- internet connection after initial page load.

The MVP should prioritize:

1. simplicity;
2. excellent mobile UX;
3. game atmosphere;
4. fast interactions;
5. visual feedback;
6. animations;
7. maintainable architecture.

---

# 2. Product Principles

Every implementation decision should follow these principles.

## 2.1 Mobile First

The application will primarily be used on phones.

Design for:

```txt
375px
390px
393px
430px
```

Desktop should work but is not the priority.

---

## 2.2 One-Hand Friendly

Primary actions should remain accessible near the bottom of the screen.

Avoid important actions in the top corners.

Use large touch targets.

Minimum interactive target:

```txt
44x44px
```

Preferred primary button height:

```txt
52-60px
```

---

## 2.3 Fast Game Flow

Players should rarely need more than one tap to proceed.

Avoid unnecessary confirmation modals.

The primary loop should be:

```txt
Question
   ↓
Start Timer
   ↓
Reveal Answers
   ↓
Score Players
   ↓
Next Question
```

---

## 2.4 Fun Before Complexity

Do not introduce backend infrastructure or complex abstractions unless required.

Prefer:

```txt
simple
predictable
testable
local
```

over:

```txt
distributed
generic
over-engineered
```

---

# 3. Target Game Flow

```txt
Home
 ↓
New Game
 ↓
Players Setup
 ↓
Game Settings
 ↓
Game Ready
 ↓
Round
 ↓
Question
 ↓
Timer
 ↓
Reveal Answers
 ↓
Score Round
 ↓
Next Round
 ↓
...
 ↓
Final Ranking
 ↓
Winner
 ↓
Play Again
```

---

# 4. MVP Screens

The MVP contains six primary screens.

```txt
/
Home

/setup
Game Setup

/ready
Game Ready

/game
Current Round

/game/score
Round Scoring

/results
Final Results
```

Routing can also be implemented as a state machine in a single game route if this produces better UX.

Prefer URL routes where refresh and navigation behavior remain predictable.

---

# 5. Home Screen

## Objective

Immediately communicate that this is a party game.

The page should feel energetic and interactive.

## UI

```txt
            SEGUE
             O
           FLUXO

     ⚡ Pense igual ao grupo

      [ COMEÇAR JOGO ]

        Como jogar?
```

Optional decorative elements:

- animated cards;
- floating question marks;
- subtle blobs;
- game tokens;
- animated gradient;
- rotating symbols.

## Primary action

```txt
Começar jogo
```

Routes to:

```txt
/setup
```

---

# 6. Game Setup

Setup should preferably be a multi-step interface rather than one huge form.

Example:

```txt
1 ─── 2 ─── 3

Jogadores
```

Then:

```txt
Rodadas
```

Then:

```txt
Tempo
```

---

# 7. Players Setup

The manager chooses the number of players.

Minimum:

```txt
3
```

Recommended maximum:

```txt
10
```

Allow names to be entered individually.

Example:

```txt
Quem vai jogar?

Pedro
Lucas
Marina
João

[ + Adicionar jogador ]

[ Continuar ]
```

Player validation:

- name is required;
- trim whitespace;
- max 20 characters;
- names should preferably be unique;
- prevent empty players.

Player structure:

```ts
export interface Player {
  id: string;
  name: string;
  score: number;
  roundWins: number;
}
```

Use:

```ts
crypto.randomUUID();
```

for IDs.

---

# 8. Number of Rounds

Available presets:

```txt
5
10
15
20
```

UI:

```txt
Quantas rodadas?

┌─────────┐ ┌─────────┐
│    5    │ │   10    │
│ RÁPIDO  │ │ NORMAL  │
└─────────┘ └─────────┘

┌─────────┐ ┌─────────┐
│   15    │ │   20    │
│ LONGO   │ │ ÉPICO   │
└─────────┘ └─────────┘
```

Recommended default:

```txt
10
```

---

# 9. Timer Configuration

Available values:

```txt
30 seconds
45 seconds
60 seconds
```

Recommended default:

```txt
45 seconds
```

Reason:

30 seconds can feel too rushed for groups.

60 seconds can slow the pace.

45 seconds provides a good middle ground.

UI:

```txt
Tempo para responder

30s
Rápido

45s
Recomendado

60s
Relaxado
```

---

# 10. Ready Screen

Before starting the match, show a summary.

Example:

```txt
Tudo pronto?

👥 5 jogadores

🎯 10 rodadas

⏱ 45 segundos

Pedro
Lucas
Marina
João
Carlos


[ COMEÇAR JOGO ]
```

Use this screen to create anticipation.

Animation:

- player names appear sequentially;
- game card scales into view;
- CTA receives subtle pulse.

---

# 11. Question Database

Questions must initially live locally.

File:

```txt
src/data/questions.ts
```

Structure:

```ts
export type QuestionCategory =
  | "geral"
  | "pessoas"
  | "lugares"
  | "comida"
  | "entretenimento"
  | "internet"
  | "relacionamentos"
  | "situacoes"
  | "absurdo";

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  enabled: boolean;
}
```

Example:

```ts
export const questions: Question[] = [
  {
    id: "q-001",
    text: "Qual comida quase todo mundo gosta?",
    category: "comida",
    enabled: true,
  },
];
```

---

# 12. Question Writing Guidelines

Questions are one of the most important parts of the product.

Good questions should:

- have multiple plausible answers;
- still create some overlap between players;
- be immediately understandable;
- be answerable within seconds;
- generate funny discussions;
- avoid requiring specialist knowledge.

Good:

```txt
Qual animal seria o pior para ter dentro de casa?
```

Good:

```txt
Qual comida você levaria para uma ilha deserta?
```

Good:

```txt
Qual aplicativo você abre primeiro quando acorda?
```

Bad:

```txt
Qual é a capital do Cazaquistão?
```

This is trivia and has a single correct answer.

Bad:

```txt
Qual é seu maior trauma?
```

Too personal.

---

# 13. Question Selection Algorithm

Questions must never repeat during the same game.

At the start of the game:

```ts
selectedQuestions = shuffle(
  questions.filter((question) => question.enabled),
).slice(0, rounds);
```

Use a proper Fisher-Yates implementation.

Do NOT use:

```ts
array.sort(() => Math.random() - 0.5);
```

Implement:

```txt
src/lib/shuffle.ts
```

---

# 14. Persistent Question History

Optional but recommended.

Store recently played question IDs:

```txt
segue-o-fluxo:used-questions
```

This prevents players from repeatedly seeing the same questions across sessions.

Algorithm:

```txt
Available questions
-
Recently used questions
=
Candidate pool
```

If there are insufficient new questions:

```txt
reset old history automatically
```

Suggested maximum history:

```txt
100 questions
```

---

# 15. Current Game Model

```ts
export interface GameState {
  id: string;

  status: "setup" | "ready" | "playing" | "scoring" | "finished";

  players: Player[];

  settings: {
    rounds: 5 | 10 | 15 | 20;
    timerSeconds: 30 | 45 | 60;
  };

  questions: Question[];

  currentRound: number;

  currentQuestionId: string | null;

  roundResults: RoundResult[];

  startedAt?: string;

  completedAt?: string;
}
```

---

# 16. Round Result

```ts
export interface RoundResult {
  round: number;
  questionId: string;

  scores: {
    playerId: string;
    points: number;
  }[];
}
```

---

# 17. Scoring Strategy

The application should initially remain neutral about how answers are evaluated.

Players reveal their written answers.

The group decides which players earn points.

The manager records the score.

UI:

```txt
Quem pontuou?

Pedro
[-] 0 [+]

Lucas
[-] 1 [+]

Marina
[-] 0 [+]

João
[-] 2 [+]

[ CONFIRMAR RODADA ]
```

Recommended allowed score per round:

```txt
0–3
```

This provides flexibility if game rules evolve.

Alternative simplified MVP:

```txt
tap player = +1 point
```

---

# 18. Main Game Screen

Layout:

```txt
Rodada 4 de 10

████████░░░░░░░░

┌────────────────────────────┐
│                            │
│ Qual animal seria o pior   │
│ para ter dentro de casa?   │
│                            │
└────────────────────────────┘


             00:45


       [ INICIAR TIMER ]


          Trocar pergunta
```

The question must visually dominate the page.

---

# 19. Question Card

The question card should feel like a physical party-game card.

Possible design:

```txt
rounded-3xl

large typography

subtle border

large shadow

slight rotation

decorative symbol

dynamic gradient
```

Example animation when changing question:

```txt
old card
  ↓
rotate(-4deg)
translateX(-120%)
opacity 0

new card
  ↓
translateX(120%)
rotate(5deg)
  ↓
translateX(0)
rotate(0)
```

Duration:

```txt
350–500ms
```

---

# 20. Timer

States:

```txt
idle
running
finished
```

Idle:

```txt
00:45
```

Running:

```txt
00:32
```

Last 10 seconds:

Timer receives stronger visual emphasis.

Example:

```txt
10
9
8
7
...
```

Each second:

```txt
scale 1 → 1.15 → 1
```

Last 5 seconds:

Optional vibration API when available.

```ts
navigator.vibrate?.(50);
```

Timer completed:

```txt
00:00
```

Trigger:

- vibration pattern;
- visual flash;
- timer shake;
- result CTA.

Example:

```ts
navigator.vibrate?.([100, 50, 100]);
```

Must gracefully degrade if vibration is unsupported.

---

# 21. Timer Technical Requirements

Do not rely only on decrementing state with `setInterval`.

Browsers can throttle timers.

Instead store:

```ts
endsAt = Date.now() + duration;
```

Calculate:

```ts
remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
```

This keeps timer accuracy even with scheduling delays.

---

# 22. Score Screen

After answers are revealed:

```txt
Rodada 4

Quem pontuou?

Pedro       3 pts
      [-] 0 [+]

Lucas       2 pts
      [-] 1 [+]

Marina      4 pts
      [-] 0 [+]

João        1 pt
      [-] 2 [+]


[ PRÓXIMA RODADA ]
```

Tapping `+`:

- increments;
- produces subtle scale animation;
- optionally fires haptic feedback.

---

# 23. Round Transition

After confirming scores:

Show a very brief transition.

Example:

```txt
Rodada concluída!

+1 Lucas

+2 João
```

Then:

```txt
Rodada 5
```

Animation duration should not block gameplay for too long.

Target:

```txt
700–1200ms
```

Allow tap to skip.

---

# 24. Final Ranking

After the last round:

Do not immediately show a static table.

Create anticipation.

Sequence:

```txt
Fim de jogo
```

then:

```txt
Calculando o fluxo...
```

then:

```txt
3º place
```

then:

```txt
2º place
```

then:

```txt
1º place
```

Winner receives strong celebration.

---

# 25. Winner Screen

Example:

```txt
          🏆

      REI DO FLUXO

         PEDRO

        12 PONTOS


🥈 Lucas             9

🥉 Marina            7

   João              4


[ JOGAR NOVAMENTE ]

[ NOVA PARTIDA ]
```

Animations:

- confetti;
- trophy scale;
- glow;
- score count-up;
- winner name reveal.

---

# 26. Loser Presentation

Avoid language that feels hostile.

Possible playful labels:

```txt
Fora do Fluxo
```

or:

```txt
Lobo Solitário
```

or:

```txt
Pensou diferente 😅
```

Example:

```txt
Mais fora do fluxo

João

4 pontos
```

---

# 27. Game Restart Options

## Play Again

Keep:

```txt
players
round settings
timer
```

Generate:

```txt
new questions
scores reset
```

## New Game

Reset everything.

Route:

```txt
/setup
```

---

# 28. Persistence

Use LocalStorage.

Keys:

```txt
segue-o-fluxo:game

segue-o-fluxo:used-questions

segue-o-fluxo:preferences
```

Create abstraction:

```txt
src/lib/storage.ts
```

Never access LocalStorage directly throughout components.

---

# 29. State Management

For MVP use Zustand.

Recommended:

```txt
zustand
zustand/persist
```

Store:

```txt
src/store/game-store.ts
```

Responsibilities:

```txt
createGame
addPlayer
removePlayer
updatePlayer
configureRounds
configureTimer
startGame
startRound
completeRound
addScore
nextRound
finishGame
restartGame
resetGame
```

Avoid putting UI state into the global store unless necessary.

Examples of local UI state:

```txt
modal open
animation active
button loading
```

---

# 30. Recommended Project Structure

```txt
src/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── setup/
│   │   └── page.tsx
│   │
│   ├── ready/
│   │   └── page.tsx
│   │
│   ├── game/
│   │   ├── page.tsx
│   │   └── score/
│   │       └── page.tsx
│   │
│   └── results/
│       └── page.tsx
│
├── components/
│   │
│   ├── ui/
│   │
│   ├── game/
│   │   ├── question-card.tsx
│   │   ├── game-timer.tsx
│   │   ├── round-progress.tsx
│   │   ├── player-score.tsx
│   │   └── score-stepper.tsx
│   │
│   ├── setup/
│   │   ├── player-form.tsx
│   │   ├── player-list.tsx
│   │   ├── rounds-selector.tsx
│   │   └── timer-selector.tsx
│   │
│   └── results/
│       ├── leaderboard.tsx
│       ├── winner-card.tsx
│       └── confetti.tsx
│
├── data/
│   └── questions.ts
│
├── hooks/
│   ├── use-game-timer.ts
│   ├── use-haptics.ts
│   └── use-mounted.ts
│
├── lib/
│   ├── shuffle.ts
│   ├── storage.ts
│   ├── game.ts
│   └── cn.ts
│
├── store/
│   └── game-store.ts
│
└── types/
    ├── game.ts
    └── question.ts
```

---

# 31. Design Direction

The project should NOT visually resemble:

```txt
corporate SaaS
admin dashboard
generic shadcn application
banking app
```

It should feel like:

```txt
party game
board game
game night
mobile game
card game
```

References in spirit:

```txt
Jackbox
Heads Up!
UNO
Exploding Kittens
party card games
arcade interfaces
```

Do not directly copy any brand.

---

# 32. Visual Language

Use:

- large typography;
- exaggerated cards;
- bold gradients;
- playful shadows;
- rounded shapes;
- small rotations;
- depth;
- animated decorative elements;
- high contrast.

Avoid:

- excessive glassmorphism;
- tiny text;
- gray SaaS dashboards;
- overly minimal interfaces.

---

# 33. Suggested Color System

Primary visual identity can use a dark background combined with energetic accents.

Example tokens:

```css
--background: #15131b;

--surface: #211e2a;

--surface-raised: #2b2737;

--primary: #7c5cff;

--secondary: #ff4f8b;

--accent: #f8d448;

--success: #4ade80;

--danger: #ff5d5d;

--text: #ffffff;

--text-muted: #aaa6b5;
```

Gradient examples:

```css
linear-gradient(
  135deg,
  #7c5cff,
  #ff4f8b
)
```

Alternative energetic gradient:

```css
linear-gradient(
  135deg,
  #8b5cf6,
  #ec4899,
  #f59e0b
)
```

Use gradients selectively.

Do not make every component a gradient.

---

# 34. Typography

Prefer a playful display font for headings and a highly readable font for content.

Possible combinations:

```txt
Display:
Fredoka
Baloo 2
Nunito ExtraBold

Body:
Inter
Nunito
Geist
```

Recommended:

```txt
Fredoka + Geist
```

Question text should be:

```txt
font-weight: 700–800
```

---

# 35. Card System

Cards should have:

```txt
border-radius: 24–32px

shadow

border

subtle internal gradient
```

Some cards can have:

```txt
rotate(-1deg)
rotate(1deg)
```

to create physical-card personality.

---

# 36. Motion System

Use Motion / Framer Motion where animations improve experience.

Do not animate everything.

Primary motion categories:

```txt
Page transitions

Card transitions

Button feedback

Score feedback

Timer urgency

Winner celebration
```

---

# 37. Motion Timing

Fast interactions:

```txt
120–180ms
```

Normal UI transitions:

```txt
200–300ms
```

Game card transitions:

```txt
350–500ms
```

Celebration sequences:

```txt
500–1200ms
```

Use spring animations for:

```txt
cards
buttons
winner
score
```

---

# 38. Reduced Motion

Respect:

```css
prefers-reduced-motion
```

Provide a graceful experience without unnecessary movement.

---

# 39. Button Interaction

Buttons should have physical feedback.

Tap:

```txt
scale 1 → 0.96 → 1
```

Hover on desktop:

```txt
translateY(-1px)
```

Active:

```txt
translateY(1px)
```

Avoid excessive bouncing.

---

# 40. Haptic Feedback

Use the Vibration API where supported.

Create:

```txt
useHaptics()
```

Methods:

```ts
tap();
success();
warning();
timerEnd();
```

Implementation must fail silently when unsupported.

---

# 41. Accessibility

Minimum requirements:

- semantic HTML;
- keyboard-accessible controls;
- `aria-label` for icon-only buttons;
- visible focus states;
- sufficient contrast;
- minimum touch targets;
- reduced-motion support;
- no information represented exclusively by color.

---

# 42. Responsive Rules

Primary container:

```txt
max-width: 480px
```

On desktop:

center the game vertically/horizontally.

Example:

```txt
desktop background
      ↓

     ┌───────────────┐
     │               │
     │ mobile game   │
     │               │
     └───────────────┘
```

This gives the product an app-like appearance.

---

# 43. PWA Consideration

PWA is NOT required for the first implementation.

However architecture should allow future support for:

```txt
Install to home screen

offline play

app icon

splash screen
```

Since questions and game state are local, this project is naturally suitable for PWA later.

---

# 44. Error Handling

Examples:

## Not enough questions

```txt
Não temos perguntas suficientes
para 20 rodadas.
```

## No players

```txt
Adicione pelo menos 3 jogadores.
```

## Game state lost

Redirect safely to:

```txt
/setup
```

Do not let the application crash.

---

# 45. Testing Strategy

## Unit tests

Test:

```txt
shuffle

question selection

score calculation

ranking

timer calculations

game restart

used-question history
```

---

# 46. Component Tests

Test:

```txt
player creation

round selection

timer selection

score controls

question card

game progression
```

---

# 47. E2E Critical Flow

The critical E2E scenario:

```txt
Open game

Create 3 players

Select 5 rounds

Select 30 seconds

Start game

Start timer

Finish timer

Score player

Advance round

Complete 5 rounds

View ranking

Play again
```

---

# 48. Code Quality Rules

All AI agents must follow these rules.

## TypeScript

No:

```ts
any;
```

unless explicitly justified.

Prefer:

```ts
unknown;
```

with narrowing.

---

## Components

Avoid components larger than approximately:

```txt
200–250 lines
```

Extract behavior logically.

Do not fragment simple components unnecessarily.

---

## Hooks

Hooks must represent reusable behavior.

Do not create hooks simply to move code out of a component.

---

## Domain Logic

Game logic should not live directly inside React components.

Prefer:

```txt
lib/game.ts
```

or store actions.

---

# 49. Avoid Premature Abstraction

Do not create:

```txt
repository pattern

service layer

generic API client

backend adapters

DDD aggregates

complex dependency injection
```

for this MVP.

The architecture should remain simple.

---

# 50. Definition of Done

A feature is only completed when:

- behavior matches this specification;
- mobile layout works;
- loading/error/empty states are handled;
- interaction has visual feedback;
- TypeScript passes;
- lint passes;
- tests relevant to the feature pass;
- no obvious accessibility regression exists;
- no unnecessary abstraction was introduced.

---

# 51. AI Development Workflow

The project should be built using a multi-agent workflow.

The coordinating agent MUST NOT implement every task itself.

Use specialized agents.

Recommended structure:

```txt
Orchestrator
│
├── Product Agent
│
├── UX/UI Agent
│
├── Frontend Architecture Agent
│
├── Game Logic Agent
│
├── Animation Agent
│
├── Testing Agent
│
└── Review Agent
```

---

# 52. Agent: Orchestrator

## Responsibility

Coordinate implementation.

Must:

1. read this entire spec;
2. inspect current repository;
3. create implementation plan;
4. divide work into atomic tasks;
5. assign work to specialized agents;
6. validate agent outputs;
7. integrate changes;
8. run quality checks.

The orchestrator should avoid editing files concurrently with sub-agents modifying the same areas.

---

# 53. Agent: Product / Domain Agent

## Responsibilities

Validate game rules.

Focus on:

```txt
GameState

Player

Question

Round

Scoring

Ranking

Restart

Question selection
```

Deliver:

```txt
types

pure game functions

edge-case documentation

tests
```

This agent should avoid UI implementation.

---

# 54. Agent: Frontend Architecture Agent

## Responsibilities

Define:

```txt
folder architecture

state boundaries

routes

Zustand store

LocalStorage persistence

component boundaries

TypeScript models
```

Must actively prevent overengineering.

---

# 55. Agent: UX/UI Agent

This is a critical agent.

The agent should behave as a **senior product designer + senior frontend engineer specialized in mobile game interfaces**.

Responsibilities:

- build visual hierarchy;
- define spacing;
- design screen composition;
- create reusable UI components;
- improve mobile ergonomics;
- ensure visual personality;
- avoid generic SaaS design.

Before implementation, this agent should inspect all screens together and ensure visual consistency.

---

# 56. Frontend Design Skill

When implementing UI, follow this internal skill specification.

## Role

You are an expert frontend designer specializing in:

```txt
mobile-first interfaces

consumer apps

party games

game UI

micro-interactions

motion design

responsive interfaces
```

## Requirements

For every screen:

1. identify primary action;
2. establish visual hierarchy;
3. optimize thumb reach;
4. remove unnecessary UI;
5. use typography intentionally;
6. use spacing consistently;
7. create at least one memorable visual characteristic;
8. test at 375px;
9. verify accessibility;
10. verify animations do not harm usability.

Never settle for default browser or default component-library appearance.

---

# 57. Agent: Motion / Animation Specialist

Responsibilities:

```txt
page transitions

question card movement

timer animations

score animations

winner celebration

button feedback
```

The agent must prefer subtle, intentional motion.

Animations must communicate:

```txt
progress

state change

success

urgency

celebration
```

Animations must NOT exist purely as decoration if they negatively impact speed.

---

# 58. Agent: Testing Specialist

Responsibilities:

- identify critical paths;
- add unit tests;
- add component tests;
- add E2E coverage;
- test mobile viewport;
- test LocalStorage recovery;
- test refresh mid-game;
- test final ranking;
- test repeated games.

---

# 59. Agent: Code Review Specialist

This agent must review implementation after each major phase.

Review categories:

```txt
Architecture

React

Next.js

TypeScript

State management

Performance

Accessibility

Mobile UX

Animations

Testing

Code duplication
```

Output issues grouped as:

```txt
Critical

Important

Suggestion
```

Critical issues must be fixed before moving to next milestone.

---

# 60. Parallel Agent Strategy

Agents may operate in parallel only when files do not overlap.

Safe example:

```txt
Agent A
types/game.ts
lib/game.ts

Agent B
components/ui/*

Agent C
data/questions.ts
```

Unsafe example:

```txt
Agent A
game-store.ts

Agent B
game-store.ts
```

Never allow simultaneous edits to the same file.

---

# 61. Implementation Phase 0 — Repository Audit

Before coding:

```txt
inspect package.json

inspect app structure

inspect Tailwind setup

inspect tsconfig

inspect lint configuration

inspect existing styles
```

Report:

```txt
Current state

Missing dependencies

Architecture decisions

Potential conflicts
```

---

# 62. Phase 1 — Foundation

Create:

```txt
types

game models

question model

shuffle algorithm

game helpers

storage abstraction
```

Acceptance:

```txt
No UI required

Pure functions tested

TypeScript clean
```

---

# 63. Phase 2 — Game Store

Implement Zustand store.

Actions:

```txt
createGame

addPlayer

removePlayer

updatePlayer

setRounds

setTimer

startGame

startTimer

submitRoundScore

nextRound

finishGame

restartGame

resetGame
```

Add persistence.

Acceptance:

Refresh browser during game.

State should recover.

---

# 64. Phase 3 — Design System

Create:

```txt
Button

GameCard

PageContainer

IconButton

ProgressBar

SegmentedSelector

PlayerChip

ScoreStepper
```

Define:

```txt
colors

spacing

radius

typography

shadows

motion tokens
```

Do NOT build screens before core visual primitives are established.

---

# 65. Phase 4 — Home

Implement:

```txt
logo/title

hero

decorative game elements

CTA

how-to-play entry
```

Add entrance animation.

Acceptance:

Home should immediately look like a game.

---

# 66. Phase 5 — Setup

Implement:

```txt
player registration

round configuration

timer configuration

validation

step transitions
```

Acceptance:

A user must configure a game within approximately 30 seconds.

---

# 67. Phase 6 — Ready Screen

Implement:

```txt
player summary

round summary

timer summary

start CTA
```

Use anticipation animations.

---

# 68. Phase 7 — Gameplay

Implement:

```txt
round progress

question card

timer

start timer

timer completion

change question
```

Acceptance:

No repeated question.

Timer remains accurate.

Question remains clearly readable.

---

# 69. Phase 8 — Scoring

Implement:

```txt
player score rows

score stepper

round validation

score update

round transition
```

Acceptance:

Scores persist after refresh.

---

# 70. Phase 9 — Results

Implement:

```txt
ranking calculation

podium

winner

loser

confetti

restart

new game
```

Acceptance:

Ranking handles ties correctly.

Tie behavior must be explicitly defined.

Recommended MVP:

```txt
same score = same position
```

---

# 71. Phase 10 — Polish

UI Agent + Motion Agent perform a dedicated polish pass.

Review:

```txt
touch targets

spacing

typography

transition quality

empty states

game feel

timer urgency

winner celebration

desktop framing
```

No new major features in this phase.

---

# 72. Phase 11 — QA

Run:

```bash
yarn lint
```

```bash
yarn build
```

```bash
yarn test
```

Run E2E tests if configured.

Test viewports:

```txt
375x812

390x844

430x932

768x1024

1440x900
```

---

# 73. Phase 12 — Production

Deploy:

```txt
GitHub
   ↓
Vercel
```

No backend environment variables should be necessary.

Production requirements:

```txt
HTTPS

responsive

no console errors

no hydration errors

no missing assets
```

---

# 74. Suggested Dependencies

Keep dependencies limited.

Recommended:

```txt
zustand
motion
lucide-react
clsx
tailwind-merge
```

Optional:

```txt
canvas-confetti
```

Avoid introducing a large UI framework.

Tailwind should remain the main styling solution.

---

# 75. Performance

Target Lighthouse mobile:

```txt
Performance >= 90

Accessibility >= 95

Best Practices >= 95
```

Avoid:

```txt
large background videos

heavy animation libraries

unoptimized images

large client dependencies
```

---

# 76. Important UX Details

Disable accidental navigation during active game where reasonable.

If user attempts to reset:

```txt
Tem certeza?

A partida atual será perdida.
```

Only destructive actions should require confirmation.

---

# 77. Game Session Recovery

If browser refreshes during an active game:

```txt
restore game

restore players

restore round

restore scores

restore selected questions
```

Timer recovery:

If timer was active, compute remaining time based on persisted `endsAt`.

If expired:

```txt
mark timer as finished
```

---

# 78. Future Features

Do NOT implement these in MVP.

Keep them documented only.

Possible future versions:

```txt
question categories

18+ mode

family mode

custom questions

community packs

PWA/offline

sound effects

multiple game modes

QR multiplayer

online rooms

user accounts

statistics

share result image
```

---

# 79. MVP Explicit Non-Goals

Do not implement:

```txt
authentication

PocketBase

Supabase

PostgreSQL

API routes

WebSockets

multiplayer networking

admin dashboard

payment

analytics platform

CMS
```

---

# 80. AI Rules for Repository Changes

Before modifying code:

```txt
Read SPEC.md

Inspect related files

Identify impacted domain

Plan smallest coherent change
```

After modifying code:

```txt
Run relevant tests

Run TypeScript

Run lint

Inspect changed files

Review against acceptance criteria
```

Never claim feature completion without validation.

---

# 81. AI Commit Strategy

Suggested commits:

```txt
feat: add game domain models

feat: add game state persistence

feat: build game setup flow

feat: implement round timer

feat: implement round scoring

feat: add game results

feat: add game animations

test: cover game flow

chore: production polish
```

Avoid:

```txt
huge single AI commit
```

---

# 82. Agent Handoff Protocol

Every agent must return:

```txt
TASK

FILES CHANGED

DECISIONS

IMPLEMENTATION

TESTS

KNOWN LIMITATIONS

NEXT RECOMMENDED STEP
```

This allows another agent to continue without rereading the entire implementation.

---

# 83. Review Loop

For every important milestone:

```txt
Implementation Agent
       ↓
Review Agent
       ↓
Issues
       ↓
Implementation Agent
       ↓
Fix
       ↓
Testing Agent
       ↓
Approved
```

Do not skip review for:

```txt
state management

timer

scoring

question selection

results
```

---

# 84. Initial Agent Execution Plan

The orchestrator should begin with:

```txt
Agent 1 — Architecture

Create domain model and architecture proposal.
Do not implement UI.


Agent 2 — UI/UX

Create visual system and screen UX proposal.
Do not modify domain logic.


Agent 3 — Game Logic

Implement pure game functions and tests.


Agent 4 — Questions

Create initial structured question database.
```

After these agents complete:

```txt
Orchestrator integrates findings.
```

Then:

```txt
Agent 5 — Setup UI

Agent 6 — Gameplay UI

Agent 7 — Motion

Agent 8 — QA
```

---

# 85. Initial Question Target

Start development with at least:

```txt
100 questions
```

Recommended production MVP:

```txt
250–500 questions
```

Distribute categories approximately evenly.

Each question should be manually reviewable from `questions.ts`.

---

# 86. Product Success Criteria

The MVP succeeds if a group can:

```txt
open the website;

configure the game;

play without instructions from the developer;

complete an entire match;

understand the score;

see a clear winner;

immediately want to play another match.
```

The primary KPI for product quality is not infrastructure.

It is:

```txt
"Was the game fun?"
```

---

# 87. Final Product Standard

The final application should feel like a product intentionally designed as a game.

It must NOT feel like:

```txt
"a Next.js tutorial with some buttons"
```

The desired reaction when opening the application is:

```txt
"Isso parece um jogo de verdade."
```

Every implementation decision — typography, colors, animation, cards, timer, scoring and results — should reinforce that goal.
