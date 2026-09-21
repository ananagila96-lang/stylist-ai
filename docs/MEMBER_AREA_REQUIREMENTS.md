# Área da Cliente — requisitos oficiais

## Objetivo
Transformar o Stylist AI em uma experiência persistente: a cliente cria conta, acessa resultados e histórico e controla seus dados.

## Fluxo
Criar conta / entrar → Área da Cliente → Minhas análises → Meu perfil de estilo → Meus guias → Stylist IA → Favoritos / Radar → Preferências e privacidade.

## Cadastro
### Necessário para a conta
- Nome
- E-mail
- Credencial de acesso
- Cidade e UF

### Coletar apenas quando necessário ou opcional
- WhatsApp
- Instagram
- Endereço completo
- Demais dados de personalização

A interface deve marcar claramente **Obrigatório** e **Opcional**. Endereço não deve bloquear a criação da conta quando não for necessário para entregar a funcionalidade.

## Preferências e consentimentos
Não usar um único checkbox para tudo.
- Aceite dos Termos de Uso e ciência da Política/Aviso de Privacidade.
- Tratamento de fotos/dados necessários à análise: explicar finalidade e fluxo antes do envio.
- Marketing por e-mail: opt-in separado, desmarcado por padrão.
- Marketing por WhatsApp: opt-in separado, desmarcado por padrão.
- Preferências alteráveis posteriormente.
- Registrar versão do texto, data/hora e estado do consentimento quando aplicável.

## Área da Cliente
- Minha conta
- Meu perfil de estilo
- Minhas análises e resultados
- Meus guias
- Meu Stylist IA
- Favoritos
- Recomendações / Radar de Compras
- Preferências de comunicação
- Privacidade e dados
- Alterar dados
- Solicitar exclusão da conta/dados conforme aplicável
- Sair

## Privacidade por design
- Não prometer que fotos ficam somente no dispositivo quando backend/IA externa for integrada.
- Informar finalidade, retenção e compartilhamentos reais.
- Minimizar dados coletados.
- Separar dados necessários ao serviço de marketing.
- Não reutilizar fotos para treinamento ou finalidade incompatível sem base legal/transparência apropriada.
- Projetar mecanismo de acesso, correção e eliminação conforme aplicável.
- Resultado automatizado deve ser apresentado como hipótese/recomendação, com explicação adequada e canal de contestação/revisão quando aplicável.

## Comércio
Antes de checkout real, apresentar de forma clara fornecedor, produto/serviço, preço, condições, contato/atendimento e regras aplicáveis a cancelamento/arrependimento.

## Segurança
A demo atual usa localStorage e NÃO constitui autenticação real. Produção exige backend, autenticação segura, controle de sessão/autorização, proteção de credenciais e armazenamento adequado. Nunca armazenar senha em texto puro ou localStorage.

## Analytics comercial
Registrar origem da aquisição quando disponível (UTM/campanha/parceiro/indicação) sem transformar esse dado em campo obrigatório do cadastro.

## Critério de aceite do MVP
A cliente consegue criar conta/entrar, abrir painel, consultar resultado salvo, editar preferências, sair e voltar sem perder seu histórico. O produto diferencia visualmente campos obrigatórios/opcionais e consentimentos de serviço/marketing.
