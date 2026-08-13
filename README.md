# Segue o Fluxo

Jogo de festa local, mobile-first, para descobrir quem pensa mais parecido com
o grupo.

Uma pessoa controla a partida em um único celular. Os demais jogadores usam
papel e caneta para responder às perguntas, revelam as respostas juntos e o
grupo decide quem pontuou. Não há login, backend ou necessidade de vários
dispositivos.

## O jogo

O fluxo de uma partida é simples:

```text
Configurar jogadores
        ↓
Escolher rodadas e tempo
        ↓
Responder à pergunta no papel
        ↓
Revelar as respostas
        ↓
Registrar os pontos
        ↓
Descobrir o ranking final
```

O aplicativo inclui um onboarding interativo em **Como jogar?**, pensado para
explicar as regras a grupos que nunca jogaram.

## Funcionalidades

- Cadastro de 3 a 10 jogadores.
- Partidas de 5, 10, 15 ou 20 rodadas.
- Timer configurável de 30, 45 ou 60 segundos.
- Timer preciso e recuperável após refresh, baseado em um horário final
  absoluto (`endsAt`).
- 126 perguntas locais distribuídas em nove categorias.
- Seleção de perguntas com Fisher–Yates e prevenção de repetições.
- Pontuação flexível de 0 a 3 pontos por jogador e rodada.
- Ranking final com suporte a empates (`1, 1, 3`).
- Persistência automática da partida no LocalStorage.
- Recuperação de jogadores, rodada, placar, perguntas e timer.
- Opção de jogar novamente mantendo jogadores e configurações.
- Opção de iniciar uma nova partida ou reiniciar tudo durante o jogo.
- Animações, feedback háptico opcional e suporte a movimento reduzido.
- Layout mobile-first com moldura de aplicativo em telas maiores.
- Fluxo acessível por teclado, controles com alvos de toque adequados e foco
  visível.

## Rotas

| Rota | Responsabilidade |
| --- | --- |
| `/` | Apresentação do jogo e onboarding “Como jogar?” |
| `/setup` | Cadastro de jogadores, rodadas e timer |
| `/ready` | Revisão da configuração antes da partida |
| `/game` | Pergunta atual, progresso e cronômetro |
| `/game/score` | Pontuação dos jogadores na rodada |
| `/results` | Revelação do vencedor e ranking final |

As rotas protegidas aguardam a hidratação do estado local antes de decidir se
devem renderizar ou redirecionar. Isso evita perda de sessão e falsos
redirecionamentos durante a inicialização.

## Tecnologias

- [Next.js 16](https://nextjs.org/) com App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) para estado e persistência
- [Motion](https://motion.dev/) para animações
- [Lucide](https://lucide.dev/) para ícones
- [Vitest](https://vitest.dev/) e Testing Library
- [Playwright](https://playwright.dev/) para testes E2E

## Requisitos

- Node.js 20.9 ou superior
- npm

O projeto não exige variáveis de ambiente nem serviços externos.

## Executando localmente

```bash
git clone <url-do-repositorio>
cd segue-o-fluxo
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para executar os testes E2E pela primeira vez, instale o Chromium usado pelo
Playwright:

```bash
npx playwright install chromium
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build otimizado de produção |
| `npm run start` | Executa o build de produção |
| `npm run lint` | Analisa o código com ESLint |
| `npm run typecheck` | Valida os tipos sem gerar arquivos |
| `npm test` | Executa o Vitest em modo interativo |
| `npm run test:run` | Executa testes unitários e de componentes uma vez |
| `npm run test:e2e` | Executa os testes E2E no Chromium |

Antes de entregar uma mudança, execute:

```bash
npm run typecheck
npm run lint
npm run test:run
npm run test:e2e
npm run build
```

## Estrutura do projeto

```text
app/
├── page.tsx                 # Home
├── setup/page.tsx           # Configuração
├── ready/page.tsx           # Revisão da partida
├── game/page.tsx            # Rodada e timer
├── game/score/page.tsx      # Pontuação
└── results/page.tsx         # Resultado final

src/
├── components/
│   ├── game/                # Pergunta, timer, progresso e pontuação
│   ├── home/                # Home e onboarding
│   ├── layout/              # Estrutura compartilhada das telas
│   ├── motion/              # Revelações e celebrações
│   ├── results/             # Vencedor e ranking
│   ├── setup/               # Wizard de configuração
│   └── ui/                  # Primitivos visuais reutilizáveis
├── data/questions.ts        # Catálogo local de perguntas
├── hooks/                   # Timer e feedback háptico
├── lib/                     # Regras puras, shuffle e storage
├── store/game-store.ts      # Estado persistente e ações do jogo
└── types/                   # Modelos TypeScript

e2e/                         # Fluxos críticos e testes responsivos
```

## Estado e persistência

O MVP é totalmente frontend. O estado é persistido sob três chaves:

```text
segue-o-fluxo:game
segue-o-fluxo:used-questions
segue-o-fluxo:preferences
```

O acesso ao LocalStorage fica centralizado em `src/lib/storage.ts`; componentes
não leem nem escrevem diretamente no armazenamento.

### Reinícios disponíveis

- **Jogar novamente:** mantém jogadores, quantidade de rodadas e timer; zera
  placares e seleciona novas perguntas.
- **Nova partida:** volta ao cadastro inicial.
- **Reiniciar do zero:** durante uma partida, apaga configuração, jogadores,
  progresso e histórico após confirmação explícita.

## Regras de domínio

- Nomes são obrigatórios, limitados a 20 caracteres e únicos sem diferenciar
  maiúsculas de minúsculas.
- Cada jogador recebe entre 0 e 3 pontos por rodada.
- Perguntas não se repetem dentro da mesma partida.
- O histórico recente tem limite de 100 perguntas e é reiniciado
  automaticamente quando não há perguntas inéditas suficientes.
- Empates compartilham a mesma colocação; a posição seguinte é pulada.
- Uma rodada zerada não concede vitória de rodada.

As regras puras vivem fora dos componentes React, principalmente em
`src/lib/game.ts` e `src/lib/shuffle.ts`.

## Testes e qualidade

A suíte cobre:

- shuffle e imutabilidade;
- seleção e histórico de perguntas;
- ranking e empates;
- cálculos e recuperação do timer;
- reinício de partida;
- store e persistência;
- wizard, seletores, pontuação e progresso;
- onboarding completo;
- partida E2E de cinco rodadas;
- refresh durante o timer;
- reinício completo durante a partida;
- ausência de overflow e erros de console nas viewports `375x812`, `390x844`,
  `430x932`, `768x1024` e `1440x900`.

## Princípios de implementação

- Mobile-first e amigável para uso com uma mão.
- Ações principais próximas ao rodapé.
- Lógica de domínio fora dos componentes.
- Client Components somente quando há interação ou APIs do navegador.
- Sem backend, autenticação, API routes ou abstrações desnecessárias.
- Animações devem comunicar estado, urgência ou celebração.
- `prefers-reduced-motion` deve ser respeitado.
- A interface deve parecer um jogo de festa, não um dashboard.

## Documentação do desenvolvimento

- [Especificação do produto](./doc.md)
- [Plano e checklist de implementação](./IMPLEMENTATION_PLAN.md)

## Próximos passos possíveis

- Expandir o catálogo para 250–500 perguntas.
- Packs e seleção de categorias.
- Perguntas personalizadas.
- Sons opcionais e preferências locais.
- Novas regras e modos de pontuação.
- PWA e suporte offline completo.
- Histórico de partidas e estatísticas locais.
- Compartilhamento do resultado como imagem.

Esses itens são evoluções futuras e não fazem parte do MVP atual.
