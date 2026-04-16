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

| Ferramenta | Versão utilizada |
|------------|-----------------|
| Node.js    | 18.x ou superior |
| Yarn       | 4.12.0          |
| Cypress    | 15.13.1         |

Verifique as versões instaladas:

```bash
node -v
yarn -v
```

> Caso não tenha o Yarn instalado: `npm install -g yarn`

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/gpatativa/Automation.git
cd Automation
```

### 2. Instale as dependências

```bash
yarn install
```

> As dependências estão listadas em `package.json`. O Cypress será instalado automaticamente como dependência de desenvolvimento.

---

## Configuração

As configurações centrais do projeto estão em `cypress.config.js`. Nenhum arquivo `.env` é necessário.

| Propriedade             | Valor                                        |
|-------------------------|----------------------------------------------|
| `baseUrl`               | `https://blog.agibank.com.br/institucional/` |
| `viewportWidth`         | 1280                                         |
| `viewportHeight`        | 720                                          |
| `defaultCommandTimeout` | 10 000 ms                                    |
| `pageLoadTimeout`       | 30 000 ms                                    |

---

## Execução dos Testes

### Modo interativo — Cypress Test Runner (recomendado para desenvolvimento)

Abre a interface gráfica do Cypress para acompanhar os testes passo a passo com inspeção visual do navegador:

```bash
yarn cypress open
```

**Passo a passo:**
1. Execute o comando acima no terminal
2. Selecione **E2E Testing**
3. Escolha o navegador de sua preferência (Chrome, Firefox, Edge)
4. Clique em **Start E2E Testing**
5. Na lista de specs, clique em **home.cy.js** para executar os testes

---

### Modo headless — linha de comando (recomendado para CI/CD)

Executa todos os testes sem abrir interface gráfica e exibe o resultado no terminal:

```bash
yarn cypress run
```

---

### Executar apenas a suíte do Blog Agibank

```bash
yarn cypress run --spec "cypress/e2e/home.cy.js"
```

---

### Escolher navegador específico no modo headless

```bash
# Chrome
yarn cypress run --browser chrome

# Firefox
yarn cypress run --browser firefox

# Edge
yarn cypress run --browser edge
```

---

## Cenários Automatizados

### CT01 – Abrir campo de busca

**Objetivo:** Garantir que o campo de busca e os elementos associados são exibidos corretamente ao clicar no ícone de lupa.

| # | Passo | Resultado Esperado |
|---|-------|--------------------|
| 1 | Acessar `https://blog.agibank.com.br/institucional/` | Página carregada com sucesso |
| 2 | Clicar no ícone de lupa no header | Campo de busca expandido |
| 3 | Verificar campo de busca | Placeholder `"Digite sua busca"` visível |
| 4 | Verificar botão de pesquisa | `#search_submit` visível |
| 5 | Verificar link de simulação | `"Simular empréstimo"` visível |

---

### CT02 – Realizar pesquisa com sucesso

**Objetivo:** Garantir que a pesquisa retorna resultados relevantes e que o usuário é redirecionado corretamente ao clicar no primeiro resultado.

| # | Passo | Resultado Esperado |
|---|-------|--------------------|
| 1 | Acessar `https://blog.agibank.com.br/institucional/` | Página carregada com sucesso |
| 2 | Clicar no ícone de lupa | Campo de busca expandido |
| 3 | Verificar campo de busca | Placeholder visível |
| 4 | Digitar `"Pix"` no campo | Texto inserido |
| 5 | Verificar lista de resultados | Lista exibida e não vazia |
| 6 | Verificar conteúdo dos resultados | Pelo menos um resultado contém "Pix" |
| 7 | Clicar no primeiro resultado | Redirecionamento iniciado |
| 8 | Verificar URL | `https://blog.agibank.com.br/pix-automatico/` |
| 9 | Verificar título do artigo | `"Pix automático: o que é e como utilizar"` visível |

---

### CT03 – Pesquisa com termo inválido (sem resultados)

**Objetivo:** Garantir que o sistema exibe as mensagens de ausência de resultados corretamente, tanto no live search quanto na página de resultados.

| # | Passo | Resultado Esperado |
|---|-------|--------------------|
| 1 | Acessar `https://blog.agibank.com.br/institucional/` | Página carregada com sucesso |
| 2 | Clicar no ícone de lupa | Campo de busca expandido |
| 3 | Verificar campo de busca | Placeholder visível |
| 4 | Digitar `"Pesquisa Invalida"` | Texto inserido |
| 5 | Verificar label do live search | `"No results found"` exibido |
| 6 | Clicar no botão de busca | Redirecionamento para página de resultados |
| 7 | Verificar URL | Query string contém o termo buscado |
| 8 | Verificar título da página | `"Resultados encontrados para: Pesquisa Invalida"` |
| 9 | Verificar mensagem de ausência | `"Lamentamos, mas nada foi encontrado..."` visível |

---

## Estrutura do Projeto

```
Automation/
├── cypress/
│   ├── e2e/
│   │   └── home.cy.js          # Suíte de testes: CT01, CT02 e CT03      
│   └── support/
│       ├── commands.js         # Comandos customizados reutilizáveis
│       └── e2e.js              # Configuração global dos testes e2e
├── cypress.config.js           # Configuração central do Cypress
├── package.json                # Dependências e metadados do projeto
└── README.md
```

---

## Boas Práticas Aplicadas

| Prática | Descrição |
|---------|-----------|
| **Seletores centralizados** | Objeto `selectors` no topo do arquivo de teste — um único ponto de manutenção para todos os seletores CSS |
| **Comando customizado** | `cy.abrirCampoDeBusca()` encapsula a ação repetida de abertura do campo de busca, eliminando duplicação |
| **`beforeEach` para setup** | Cada teste começa de um estado limpo, visitando a URL base automaticamente |
| **`context` para agrupamento** | Cenários agrupados com `context()` dentro do `describe()` principal, organizando a suíte por funcionalidade |
| **Assertivas explícitas** | Cada passo possui sua respectiva asserção, tornando falhas imediatas e fáceis de diagnosticar |
| **`baseUrl` no config** | URL base definida em um único lugar (`cypress.config.js`), facilitando troca de ambiente |
| **Comentários descritivos** | Passos e validações comentados no teste para rastreabilidade com os casos de uso |
