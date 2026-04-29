## 🛡️⚙️ Bazaar API - Tibia Scout Backend 
Este é o motor central do ecossistema Tibia Scout. Ele é responsável pelo web scraping de alta performance, processamento de dados do Tibia Bazaar (CipSoft) e distribuição desses dados via API REST.

Este projeto atua como o Backend obrigatório para o funcionamento das funcionalidades de mercado do projeto:
🔗 Tibia Scout Frontend [https://github.com/luizgustavolab/tibia-scout.git](https://github.com/luizgustavolab/tibia-scout.git)

## 🏗️ Arquitetura do Projeto
>- O projeto utiliza o conceito de NPM Workspaces (Monorepo). Essa estrutura permite que a API e os serviços de coleta compartilhem tipos e lógica de banco de dados, mantendo a separação de responsabilidades:
    apps/api: Servidor Fastify que entrega os dados processados ao Frontend.
    apps/crawler: Motor de scraping que extrai dados brutos do site oficial do Tibia.
    apps/worker: Orquestrador de tarefas que gerencia a persistência e atualização do banco de dados.

## 🛠️ Stack Tecnológica
- Runtime: Node.js (v20+) + TypeScript
- Framework Web: Fastify v4
- ORM: Prisma (v5+)
- Banco de Dados: SQLite (Foco em portabilidade e baixo custo)
- Fila/Tasks: BullMQ + Redis (opcional para processamento assíncrono)
- Agendamento: Node-cron

## ⚠️ Notas Importantes de Infraestrutura (Atenção ao Deploy)
1. **Limitações do Railway (Plano Gratuito)**
- O projeto foi desenhado para rodar no Railway, mas é vital entender as regras da plataforma:
>- Plano Trial: O Railway oferece um crédito inicial/tempo limitado. Após o término desse período, o projeto é suspenso automaticamente.
>- Continuidade: Não é possível realizar um downgrade para manter o projeto gratuito após o Trial. É necessário o upgrade para o plano Hobby (pago) para garantir que o banco de dados e os cronjobs continuem operando.

2. **Network Binding**
- Para deploys em containers (Docker/Fly/Railway), o servidor está configurado para o host 0.0.0.0 na porta 3333. Isso é essencial para que o proxy reverso da hospedagem consiga rotear o tráfego para a aplicação.

## 🚀 Guia do Programador: Como Rodar Localmente
📋 Pré-requisitos
- Node.js v22 ou superior.
- NPM ou PNPM.

## 🔧 Instalação Passo a Passo
1. **Clone o repositório:**
    git clone [https://github.com/luizgustavolab/bazaar-api.git](https://github.com/luizgustavolab/bazaar-api.git) 
    cd bazaar-api

2. **Instale as dependências (Raiz do Monorepo):**
    npm install

3. **Configuração do Banco de Dados:**
- Gere o cliente do Prisma e sincronize o esquema com o seu arquivo SQLite local:
    npx prisma generate
    npx prisma db push

4. **Variáveis de Ambiente:**
>- Crie um arquivo .env na raiz do projeto. O Redis é obrigatório para a orquestração das tarefas do Crawler:
    PORT=3333
    HOST=0.0.0.0
    DATABASE_URL="file:./prisma/dev.db"
    REDIS_HOST="localhost"
    REDIS_PORT=6379
    REDIS_PASSWORD=""

🛡️ Por que o Redis é necessário?
- Diferente do banco de dados (SQLite), o Redis atua como o motor de mensagens do BullMQ. Ele é responsável por:
-   Assincronismo: Permite que a API continue respondendo enquanto o Crawler processa milhares de caracteres em background.
-   Resiliência: Se a aplicação for reiniciada, o estado do scraping não é perdido; ele permanece na fila do Redis para ser retomado.
-   Eficiência: Evita o consumo excessivo de memória RAM ao distribuir o processamento das tarefas de forma controlada.

5. **🏃 Execução**
- Para rodar em modo de desenvolvimento com Hot Reload em todos os serviços simultaneamente:
    npm run dev
- Ou inicie serviços específicos via workspace:
    Apenas a API:               npm run dev:api
    Apenas o Crawler/Worker:    npm run dev:crawler

## 📡 Endpoints Principais
- GET /health: Check de saúde da aplicação e conexão com banco.
- GET /characters: Retorna a lista de personagens processados do Bazaar.
- GET /bazaar: Retorna dados ativos e filtros do leilão.

## 🏗️ Decisões Técnicas e Desafios
- Downgrade de Dependências: O @fastify/cors foi fixado na versão 8.x para garantir estabilidade com o Fastify 4, evitando conflitos de tipagem e falhas de handshake com o frontend.
- Persistência: Optou-se pelo SQLite por ser um arquivo único, facilitando o backup e reduzindo a necessidade de um servidor de banco de dados externo (Postgres/MySQL) em estágios iniciais, o que otimiza o uso de memória.
- Sincronização: O Crawler está programado via node-cron no arquivo server.ts para realizar a atualização pesada de dados em horários de menor tráfego (00:00), protegendo a saúde da instância.

## 🔄 Padrão de Commits
- Utilizamos Conventional Commits para manter a governança:
    feat: Nova funcionalidade.
    fix: Correção de erro.
    docs: Alteração em documentação.
    chore: Atualização de pacotes ou build

## 👨‍💻 Autor e Licença
Desenvolvido por Luiz Gustavo 🔗 **[https://github.com/luizgustavolab](https://github.com/luizgustavolab)** .
Código aberto integrante do ecossistema Tibia Scout. Contribuições são bem-vindas respeitando os padrões de commits estabelecidos.