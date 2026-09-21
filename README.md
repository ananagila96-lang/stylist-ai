# Stylist AI — Demo funcional

Consultoria de imagem assistida por IA + descoberta de produtos e profissionais.

## Fluxo principal
Fotos guiadas → análise explicável de linhas → identidade de estilo → guia pessoal → looks → Radar de compras → profissionais.

## MVP
- onboarding visual
- fotos de frente/perfil/costas
- estrutura para análise de linhas
- identidade de estilo
- guia personalizado
- Stylist IA
- Radar de compras
- cores e beleza
- profissionais

## Rodar
npm install
npm run dev

## Demo atual
- navegação funcional em todas as áreas;
- fluxo consentido de fotos frente/perfil/costas com prévia local;
- questionário de identidade e resultado demonstrativo;
- guia pessoal, looks, paleta, Radar de Compras e profissionais;
- persistência local da jornada;
- CI e deploy automático no GitHub Pages.

## Beta com Área da Cliente
- cadastro, login, logout, sessão persistente e recuperação de senha via Supabase Auth;
- perfis, jornadas e feedback isolados por usuária com Row Level Security;
- consentimentos essenciais e de marketing separados;
- painel da cliente e formulário de feedback das testadoras;
- preparação para fotos privadas no Supabase Storage.

Para ativar o backend, execute `supabase/schema.sql` no projeto Supabase e configure as variáveis de `.env.example` no ambiente de publicação.

## Limites atuais
A análise exibida continua demonstrativa e baseada nas respostas; as fotos ainda não são interpretadas por IA. Pagamentos, produtos reais e profissionais verificados não estão ativos e são identificados como demonstração.

Stylist AI é nome provisório.
