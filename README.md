Bazaar API - Tibia Scout Backend
Este é o motor central do projeto Tibia Scout, desenvolvido para realizar o scraping, processamento e distribuição de dados do Tibia Bazaar. O projeto utiliza uma arquitetura de alta performance focada em escalabilidade e consistência de dados.

Arquitetura do Projeto
O backend foi construído utilizando o conceito de NPM Workspaces (Monorepo), permitindo a gestão de múltiplos pacotes em um único repositório:

api: Servidor REST construído com Fastify 4 para entrega de dados.

crawler: Motor de web scraping para coleta de dados do site oficial.

worker: Processamento de tarefas em segundo plano.

Stack Tecnológica
Runtime: Node.js + TypeScript

Framework Web: Fastify v4

ORM: Prisma

Banco de Dados: SQLite

Infraestrutura: Railway (Cloud)

Desafios Técnicos Superados
Gestão de Dependências e CORS
Um dos maiores desafios foi a compatibilidade de versões entre o core do Fastify e seus plugins. Para garantir a segurança e a comunicação com o frontend (Tibia Scout), foi implementado o downgrade estratégico do @fastify/cors para a versão 8.x, compatibilizando-o com o ecossistema Fastify 4 utilizado no projeto.

Deploy e Network Binding
Para o funcionamento correto no ambiente de nuvem (Railway), a aplicação foi reconfigurada para realizar o bind no host 0.0.0.0. Isso permitiu que o Proxy do Railway realizasse o roteamento de tráfego externo para a porta interna 3333, resolvendo erros críticos de SIGTERM e falhas de Health Check.

Como Rodar o Projeto
Pré-requisitos
Node.js v22 ou superior

NPM

Instalação
Bash
# Instala as dependências de todos os workspaces
npm install
Banco de Dados
Bash
# Gera o Prisma Client e aplica as migrações
npx prisma generate
npx prisma migrate dev
Execução
Bash
# Iniciar a API
npm run dev --workspace=api

# Iniciar o Crawler
npm run dev --workspace=crawler
📡 Endpoints Principais
GET /health: Verificação de integridade do sistema.

GET /characters: Lista todos os personagens processados.

GET /bazaar: Retorna os dados ativos do leilão oficial.

🛡️ Configuração de Ambiente (.env)
O projeto requer as seguintes variáveis para operar no ambiente de produção:

Plaintext
PORT=3333
HOST=0.0.0.0
DATABASE_URL="file:./prisma/dev.db"
👨‍💻 Desenvolvedor
Luiz Gustavo (luizgustavolab)
Focado em Clean Code, Arquitetura de Sistemas e Automação.