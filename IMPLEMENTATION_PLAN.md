# Segue o Fluxo - Plano persistente de implementacao

Este arquivo e a fonte de verdade do andamento. Cada agente deve respeitar o
ownership indicado e o orquestrador deve atualizar os checks depois de validar
as entregas.

## Estado de retomada

- Status atual: MVP concluido e validado
- Ultima atualizacao: 2026-08-13
- Especificacao: `doc.md` lido integralmente (87 secoes)
- Stack: Next.js 16.3.0, React 19.2.8, TypeScript 5, Tailwind CSS 4
- Proximo marco: evolucoes futuras de conteudo, PWA ou distribuicao

## Ownership ativo

| Frente | Responsavel | Arquivos permitidos | Estado |
| --- | --- | --- | --- |
| Arquitetura | `architecture` | somente proposta neste passe | concluido |
| UX/UI | `ui_ux` | somente proposta neste passe | concluido |
| Dominio | `game_logic` | `src/types/*`, `src/lib/*`, testes de dominio | concluido |
| Catalogo | `questions` | `src/data/questions.ts` | concluido |
| Store | `store` | `src/store/*`, `src/lib/storage.ts` | concluido |
| Design system | `design_system` | `app/globals.css`, `src/components/ui/*`, `src/components/layout/*` | concluido |
| Orquestracao | `root` | plano, integracao e validacao | em andamento |

## Fase 0 - Auditoria e planejamento

- [x] Ler `doc.md` integralmente
- [x] Inspecionar scaffold, dependencias, Tailwind, TypeScript e ESLint
- [x] Ler guias locais do Next 16 sobre App Router, Server/Client, CSS e fontes
- [x] Criar plano persistente com ownership
- [x] Receber proposta de arquitetura
- [x] Receber proposta de UX/UI
- [x] Validar fundacao de dominio
- [x] Registrar decisoes finais e dependencias aprovadas

## Fase 1 - Fundacao

- [x] Modelar Player, Question, GameState, RoundResult e timer
- [x] Implementar Fisher-Yates
- [x] Implementar selecao sem repeticao e historico de perguntas
- [x] Implementar pontuacao, ranking com empates e restart
- [x] Implementar abstracao de storage
- [x] Criar pelo menos 100 perguntas revisaveis (126 entregues)
- [x] Adicionar e validar testes unitarios da fundacao

## Fase 2 - Store e recuperacao

- [x] Instalar dependencias minimas aprovadas
- [x] Implementar store Zustand e actions da especificacao
- [x] Persistir partida, preferencias e historico por abstracao
- [x] Recuperar partida apos refresh
- [x] Recuperar timer por `endsAt`
- [x] Tratar estado perdido com redirecionamento seguro nas telas
- [x] Revisar store, timer, scoring e selecao antes de avancar

## Fase 3 - Sistema visual

- [x] Definir tokens de cor, tipografia, espacamento, raios e sombras
- [x] Implementar PageContainer, Button, IconButton e GameCard
- [x] Implementar ProgressBar, SegmentedSelector, PlayerChip e ScoreStepper
- [x] Garantir alvos de toque >= 44px e CTA de 52-60px
- [x] Implementar focus visivel e reduced motion
- [x] Validar composicao responsiva por regras de layout e E2E mobile

## Fase 4 - Telas e fluxo

- [x] Home `/` com identidade de party game e instrucoes
- [x] Setup `/setup` com jogadores, rodadas e timer
- [x] Ready `/ready` com resumo e antecipacao
- [x] Gameplay `/game` com progresso, pergunta e timer preciso
- [x] Scoring `/game/score` com pontos de 0 a 3
- [x] Results `/results` com ranking, empates, vencedor e perdedor
- [x] Play Again preservando configuracao e renovando perguntas
- [x] New Game limpando a sessao e retornando ao setup

## Fase 5 - Motion e polish

- [x] Feedback fisico de botoes
- [x] Transicao de cartas de pergunta
- [x] Urgencia dos ultimos 10 segundos e haptics opcionais
- [x] Transicao curta de rodada com opcao de pular
- [x] Revelacao do ranking e celebracao do vencedor
- [x] Garantir degradacao silenciosa e `prefers-reduced-motion`
- [x] Revisar ergonomia, legibilidade, estados vazios e desktop framing

## Fase 6 - Qualidade

- [x] Testes unitarios: shuffle, selecao, ranking, timer, restart e historico
- [x] Testes de componentes: setup, seletores, score e progressao
- [x] E2E: partida completa de 5 rodadas
- [x] E2E: refresh durante partida e timer
- [x] Executar `npm run lint`
- [x] Executar `npx tsc --noEmit`
- [x] Executar testes (37 unitarios e de componentes)
- [x] Executar `npm run build`
- [x] Validar 375x812, 390x844, 430x932, 768x1024 e 1440x900
- [x] Confirmar ausencia de erros de console e hidratacao

## Fase 7 - Revisao e entrega

- [x] Review de arquitetura, React, Next, TypeScript e estado
- [x] Review de acessibilidade, mobile UX e motion
- [x] Corrigir problemas Critical e principais Important
- [x] Conferir Definition of Done e criterios de sucesso do `doc.md`
- [x] Registrar limitacoes e proximos passos
- [x] Entregar resumo final de arquivos e validacoes

## Limitacoes e proximos passos

- O catalogo inicial possui 126 perguntas, acima do minimo de 100, mas pode ser
  ampliado futuramente para a faixa de 250 a 500 sugerida para producao.
- PWA, offline completo, sons, modos e multiplayer permanecem fora do MVP,
  conforme os non-goals da especificacao.
- A validacao automatizada cobre o fluxo completo em mobile e a home nas cinco
  viewports-alvo; novas features devem ampliar os cenarios E2E correspondentes.

## Decisoes confirmadas

- App Router com rotas explicitas da especificacao.
- Paginas/layouts permanecem Server Components quando possivel; interatividade,
  Zustand, LocalStorage, timer e haptics ficam em Client Components pequenos.
- Sem backend, autenticacao, API routes, PWA ou features futuras no MVP.
- Tailwind continua como solucao principal; CSS global apenas para tokens e base.
- Logica de jogo permanece fora dos componentes React.

## Registro de andamento

### 2026-08-13

- A primeira leitura encontrou `doc.md` com 0 bytes; o trabalho foi pausado.
- O arquivo foi posteriormente salvo com 32.552 bytes e lido por completo.
- Tres agentes foram iniciados em frentes sem sobreposicao: arquitetura, UX/UI
  e dominio.
- Fundacao, store, persistencia, design system e 126 perguntas foram integrados.
- A suite inicial possui 28 testes passando; lint e TypeScript passaram.
- As seis rotas do MVP foram implementadas e o fluxo completo esta jogavel.
- Review especializado corrigiu timer expirado, overflow em 375px, navegacao de
  restart, reduced motion, landmarks, contraste e semantica do ranking.
- Validacao final: 37 testes unitarios/componentes, 7 E2E, lint, TypeScript e
  build passaram. As cinco viewports-alvo ficaram sem overflow horizontal,
  erros de console, `pageerror` ou hidratacao.
- QA de fechamento adicionou testes de componente para o wizard de setup,
  seletores, limites de pontuacao e progresso acessivel; 37 testes passaram.
- A home foi validada via Playwright nas cinco resolucoes requeridas, sem
  overflow horizontal, `pageerror`, erro de console ou erro de hidratacao;
  a suite E2E completa passou com 7 cenarios.
