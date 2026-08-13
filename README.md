# Segue o Fluxo

A local, mobile-first party game about finding out who thinks most like the
group.

One person manages the match on a single phone. Everyone else uses pen and
paper to answer questions, reveals their answers together, and lets the group
decide who scored. There is no login, backend, or multi-device requirement.

## The game

A match follows a simple loop:

```text
Set up players
      ↓
Choose rounds and timer
      ↓
Answer the question on paper
      ↓
Reveal all answers
      ↓
Record the scores
      ↓
Discover the final ranking
```

The app includes an interactive **How to play** onboarding flow designed to
teach the rules to first-time groups.

## Features

- 3 to 10 players.
- Matches with 5, 10, 15, or 20 rounds.
- Configurable 30, 45, or 60-second timer.
- Drift-resistant timer recovery after refresh, based on an absolute `endsAt`
  timestamp.
- 126 local questions spread across nine categories.
- Fisher–Yates question selection with repetition prevention.
- Flexible scoring from 0 to 3 points per player and round.
- Final ranking with tie support (`1, 1, 3`).
- Automatic game persistence in LocalStorage.
- Recovery of players, current round, scores, questions, and timer.
- Play again while keeping players and settings.
- Start a new match or reset everything during an active game.
- Motion, optional haptic feedback, and reduced-motion support.
- Mobile-first layout with an app-like frame on larger screens.
- Keyboard-accessible flow, visible focus states, and touch-friendly controls.

## Routes

| Route | Responsibility |
| --- | --- |
| `/` | Game introduction and “How to play” onboarding |
| `/setup` | Player, round, and timer configuration |
| `/ready` | Match configuration review |
| `/game` | Current question, progress, and timer |
| `/game/score` | Round scoring |
| `/results` | Winner reveal and final ranking |

Protected routes wait for local state hydration before rendering or
redirecting. This prevents lost sessions and incorrect redirects during app
startup.

## Tech stack

- [Next.js 16](https://nextjs.org/) with App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) for state and persistence
- [Motion](https://motion.dev/) for animations
- [Lucide](https://lucide.dev/) for icons
- [Vitest](https://vitest.dev/) and Testing Library
- [Playwright](https://playwright.dev/) for end-to-end tests

## Requirements

- Node.js 20.9 or newer
- npm

The project does not require environment variables or external services.

## Running locally

```bash
git clone <repository-url>
cd segue-o-fluxo
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before running the E2E suite for the first time, install Playwright's Chromium
browser:

```bash
npx playwright install chromium
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Runs the production build |
| `npm run lint` | Checks the codebase with ESLint |
| `npm run typecheck` | Validates types without emitting files |
| `npm test` | Runs Vitest in watch mode |
| `npm run test:run` | Runs unit and component tests once |
| `npm run test:e2e` | Runs the E2E suite in Chromium |

Before shipping a change, run:

```bash
npm run typecheck
npm run lint
npm run test:run
npm run test:e2e
npm run build
```

## Project structure

```text
app/
├── page.tsx                 # Home
├── setup/page.tsx           # Game setup
├── ready/page.tsx           # Match review
├── game/page.tsx            # Current round and timer
├── game/score/page.tsx      # Round scoring
└── results/page.tsx         # Final results

src/
├── components/
│   ├── game/                # Question, timer, progress, and scoring
│   ├── home/                # Home screen and onboarding
│   ├── layout/              # Shared screen structure
│   ├── motion/              # Reveals and celebrations
│   ├── results/             # Winner and leaderboard
│   ├── setup/               # Setup wizard
│   └── ui/                  # Reusable visual primitives
├── data/questions.ts        # Local question catalog
├── hooks/                   # Timer and haptic feedback
├── lib/                     # Pure game rules, shuffle, and storage
├── store/game-store.ts      # Persistent state and game actions
└── types/                   # TypeScript domain models

e2e/                         # Critical flows and responsive checks
```

## State and persistence

The MVP is entirely frontend-based. State is stored under three keys:

```text
segue-o-fluxo:game
segue-o-fluxo:used-questions
segue-o-fluxo:preferences
```

LocalStorage access is centralized in `src/lib/storage.ts`. Components never
read from or write to storage directly.

### Reset options

- **Play again:** keeps players, round count, and timer settings while resetting
  scores and selecting new questions.
- **New match:** returns to the initial player setup.
- **Reset from scratch:** during an active game, removes settings, players,
  progress, and question history after explicit confirmation.

## Domain rules

- Player names are required, limited to 20 characters, and unique regardless
  of letter case.
- Each player can receive between 0 and 3 points per round.
- Questions never repeat within the same match.
- Recent question history is limited to 100 entries and automatically resets
  when there are not enough unseen questions.
- Tied players share the same position and the following position is skipped.
- A round where everyone scores zero does not award a round win.

Pure game rules live outside React components, primarily in `src/lib/game.ts`
and `src/lib/shuffle.ts`.

## Testing and quality

The automated suite covers:

- shuffle behavior and immutability;
- question selection and history;
- ranking and ties;
- timer calculations and recovery;
- match restart behavior;
- store actions and persistence;
- setup wizard, selectors, scoring, and progress;
- the complete onboarding flow;
- a five-round E2E match;
- refresh during an active timer;
- full reset during an active match;
- horizontal overflow and console errors at `375x812`, `390x844`, `430x932`,
  `768x1024`, and `1440x900`.

## Implementation principles

- Mobile-first and comfortable for one-handed use.
- Primary actions stay near the bottom of the screen.
- Domain logic stays outside React components.
- Client Components are used only for interaction or browser APIs.
- No backend, authentication, API routes, or unnecessary abstractions.
- Motion should communicate state, urgency, or celebration.
- `prefers-reduced-motion` must be respected.
- The interface should feel like a party game, not a dashboard.

## Development documentation

- [Product specification](./doc.md)
- [Implementation plan and checklist](./IMPLEMENTATION_PLAN.md)

## Possible next steps

- Expand the catalog to 250–500 questions.
- Add question packs and category selection.
- Support custom questions.
- Add optional sounds and local preferences.
- Introduce new scoring rules and game modes.
- Add PWA and full offline support.
- Store local match history and player statistics.
- Generate shareable result images.

These are potential future improvements and are not part of the current MVP.
