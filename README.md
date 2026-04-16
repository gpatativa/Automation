# Automação de Testes – Blog Agibank

Projeto de automação de testes end-to-end para a funcionalidade de **pesquisa de artigos** do Blog Agibank, utilizando [Cypress](https://www.cypress.io/).

---

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução dos Testes](#execução-dos-testes)
- [Cenários Automatizados](#cenários-automatizados)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Boas Práticas Aplicadas](#boas-práticas-aplicadas)

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|--------------|
| Node.js    | 18.x         |
| Yarn       | 4.x          |

> Verifique as versões instaladas com `node -v` e `yarn -v`.

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/gpatativa/Automation.git
cd Automation

# Instale as dependências
yarn install
```

---

## Configuração

As configurações centrais do projeto estão em `cypress.config.js`:

| Propriedade            | Valor                                          |
|------------------------|------------------------------------------------|
| `baseUrl`              | `https://blog.agibank.com.br/institucional/`   |
| `viewportWidth`        | 1280                                           |
| `viewportHeight`       | 720                                            |
| `defaultCommandTimeout`| 10 000 ms                                      |
| `pageLoadTimeout`      | 30 000 ms                                      |

Não é necessário nenhum arquivo `.env` para executar os testes.

---

## Execução dos Testes

### Modo interativo (Cypress Test Runner)

Abre a interface gráfica do Cypress para acompanhar os testes visualmente:

```bash
yarn cypress open
```

### Modo headless (linha de comando / CI)

Executa todos os testes sem abrir o navegador:

```bash
yarn cypress run
```

### Executar apenas os testes do Blog Agibank

```bash
yarn cypress run --spec "cypress/e2e/home.cy.js"
```

---

## Cenários Automatizados

### CT01 – Abrir campo de busca

**Objetivo:** Garantir que o campo de busca e os elementos associados são exibidos corretamente ao clicar no ícone de lupa.

**Passos:**
1. Acessar `https://blog.agibank.com.br/institucional/`
2. Clicar no ícone de lupa no header
3. Validar que o campo de busca com placeholder `"Digite sua busca"` está visível
4. Validar que o botão de submissão da pesquisa (`#search_submit`) está visível
5. Validar que o link `"Simular empréstimo"` está visível

---

### CT02 – Realizar pesquisa com sucesso

**Objetivo:** Garantir que a pesquisa retorna resultados relevantes e que o usuário é redirecionado corretamente ao clicar no primeiro resultado.

**Passos:**
1. Acessar `https://blog.agibank.com.br/institucional/`
2. Clicar no ícone de lupa no header
3. Validar exibição do campo de busca
4. Digitar `"Pix"` no campo de busca
5. Validar que a lista de resultados é exibida e não está vazia
6. Validar que pelo menos um resultado contém a palavra "Pix" (case-insensitive)
7. Clicar no primeiro resultado da lista
8. Validar que o usuário foi redirecionado para `https://blog.agibank.com.br/pix-automatico/`
9. Validar que o título `"Pix automático: o que é e como utilizar"` está visível na página

---

## Estrutura do Projeto

```
Automation/
├── cypress/
│   ├── e2e/
│   │   └── home.cy.js          # Cenários de teste do blog (CT01 e CT02)
│   ├── fixtures/
│   │   └── example.json        # Fixtures de dados (reservado para expansão)
│   └── support/
│       ├── commands.js         # Comandos customizados reutilizáveis
│       └── e2e.js              # Configuração global dos testes e2e
├── cypress.config.js           # Configuração central do Cypress
├── package.json
└── README.md
```

---

## Boas Práticas Aplicadas

| Prática | Descrição |
|--------|-----------|
| **Seletores centralizados** | Todos os seletores CSS ficam no objeto `selectors` no topo do arquivo de teste, facilitando manutenção |
| **Comando customizado** | `cy.abrirCampoDeBusca()` encapsula a ação de abertura do campo de busca, eliminando duplicação de código entre cenários |
| **`beforeEach` para setup** | Cada teste começa de um estado limpo, visitando a URL base automaticamente |
| **`context` para agrupamento** | Os cenários são agrupados com `context()` dentro do `describe()` principal, organizando a suíte por funcionalidade |
| **Assertivas explícitas** | Cada passo possui sua respectiva asserção, tornando falhas imediatas e fáceis de diagnosticar |
| **`baseUrl` no config** | A URL base é definida em um único lugar (`cypress.config.js`), evitando repetição e facilitando troca de ambiente |
| **Comentários descritivos** | Passos e validações comentados no próprio teste para rastreabilidade com os casos de uso |
