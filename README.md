# Verly Admin React

Sistema administrativo para gestão de leads, clientes, produtos, caixa e custos, desenvolvido em React com Vite.

## :rocket: Demonstração

Acesse a versão em produção: [https://painel.verlyvidracaria.com/](https://painel.verlyvidracaria.com/)

## :star: Funcionalidades
- Autenticação de usuários
- Gestão de leads
- Cadastro e edição de clientes
- Cadastro e edição de produtos
- Controle de caixa (entradas e saídas)
- Gerenciamento de custos

## :file_folder: Estrutura do Projeto
```
├── public/           # Arquivos públicos (favicon, 404.html, CNAME)
├── src/
│   ├── pages/        # Páginas principais (Login, Home, Products, Customers, etc)
│   ├── components/   # Componentes reutilizáveis
│   ├── services/     # Serviços de API e lógica de negócio
│   ├── helpers/      # Funções utilitárias
│   ├── assets/       # Imagens e SVGs
│   └── App.jsx       # Definição das rotas
├── styles/           # Estilos globais
├── config.js         # Configuração da API
├── vite.config.js    # Configuração do Vite
├── package.json      # Dependências e scripts
└── README.md         # Documentação
```

## :computer: Como rodar localmente

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   cd SEU_REPOSITORIO
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   # ou
   yarn install
   ```
3. **Rode o projeto:**
   ```sh
   npm run dev
   # ou
   yarn dev
   ```
   O app estará disponível em `http://localhost:5173` (ou porta definida pelo Vite).

## :hammer: Build de produção

```sh
npm run build
# ou
yarn build
```
Os arquivos finais estarão na pasta `dist/`.

## :rocket: Deploy no GitHub Pages

1. Certifique-se que o arquivo `vite.config.js` tem o base correto (ex: `/seu-repositorio/` se não usar domínio customizado).
2. Execute:
   ```sh
   npm run deploy
   # ou
   yarn deploy
   ```
3. O site será publicado automaticamente no branch `gh-pages`.

> **Domínio customizado:** Este projeto já está configurado para [painel.verlyvidracaria.com](https://painel.verlyvidracaria.com/).

## :package: Principais dependências
- React
- Vite
- React Router DOM
- React Hook Form & Yup
- Bootstrap
- RxJS
- gh-pages (deploy)

## :triangular_flag_on_post: Scripts úteis
- `npm run dev` — roda o projeto em modo desenvolvimento
- `npm run build` — gera o build de produção
- `npm run preview` — pré-visualiza o build localmente
- `npm run lint` — executa o linter
- `npm run deploy` — build + deploy no GitHub Pages

## :memo: Observações
- A API utilizada está configurada em `config.js`.
- O favicon pode ser alterado em `public/favicon.svg`.
- Página 404 customizada em `public/404.html`.

## :handshake: Contribuição
Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

## :email: Contato
Dúvidas ou sugestões? Entre em contato pelo [GitHub](https://github.com/SEU_USUARIO) ou abra uma issue.
