# Plataforma de Cursos
Este projeto é uma API para uma plataforma de cursos online, desenvolvida em Node.js, Express e Sequelize (ORM para MySQL).

##

## Sumário
Requisitos
- Instalação
- Configuração do Ambiente
- Migração do Banco de Dados (Sequelize)
- Execução
- Estrutura de Pastas
- Principais Rotas

##

## Requisitos
- Node.js (v16+)
- MySQL

##

## Instalação
- Clone o repositório e instale as dependências:

```Bash
git clone <url-do-repo>
cd plataforma-cursos
npm install
```
##

## Configuração do Ambiente
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=plataforma_cursos
DB_PORT=3306
JWT_SECRET=sua_chave_jwt
```

Migração do Banco de Dados (Sequelize)
O projeto utiliza Sequelize para gerenciar o banco de dados.

##

#### Migração automática (via sync)
Ao rodar o projeto, as tabelas são criadas automaticamente conforme os modelos definidos:


```
npm run dev
# ou
npm start
```

##

#### Migração manual (usando Sequelize CLI)
Para maior controle, utilize o Sequelize CLI:

Instale o CLI globalmente (se necessário):

```
npm install --global sequelize-cli
```

Inicialize as configurações do Sequelize CLI:

```
npx sequelize-cli init
```
Crie as migrations para cada modelo:

```
npx sequelize-cli migration:generate --name create-usuarios
npx sequelize-cli migration:generate --name create-cursos
npx sequelize-cli migration:generate --name create-inscricoes
```
Edite os arquivos de migration em ` migrations/ ` conforme os modelos.

Execute as migrations:

```
npx sequelize-cli db:migrate
```

Nota: Para produção, recomenda-se o uso de migrations.

Execução
Para rodar o servidor em modo desenvolvimento:

```
npm run dev
```

Para rodar em modo produção:

```
npm start
```

O servidor estará disponível em `http://localhost:3000`.

## Principais Rotas
`POST /usuarios` — Cadastro de usuário
`POST /login` — Login (retorna JWT)
`GET /cursos` — Lista de cursos (autenticado)
`POST /cursos/:idCurso` — Inscrever-se em curso (autenticado)
`PATCH /cursos/:idCurso` — Cancelar inscrição (autenticado)
`GET /cursos/inscritos/:idUsuario` — Listar cursos inscritos (autenticado)
`GET /:idUsuario` — Listar cursos inscritos do usuário (autenticado)

