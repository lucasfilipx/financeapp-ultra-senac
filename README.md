# ⚡ FinanceApp Ultra

> **Projeto Integrador - Centro Universitário Senac**
>
> Aplicativo Web de gestão financeira pessoal com design premium e arquitetura focada em Performance e Experiência do Usuário.

---

## 📖 Sobre o Projeto

O **FinanceApp Ultra** foi desenvolvido como uma Prova de Conceito (MVP) para solucionar o problema da desorganização financeira pessoal.

O sistema abandona as tradicionais planilhas e foca em um fluxo rápido de inserção de dados, garantindo que o usuário consiga registrar e monitorar suas receitas e despesas com o menor atrito possível.

### ✨ Principais Funcionalidades

- **Dashboard Analítico:** Resumo financeiro com cálculo automático de saldo, receitas e despesas.
- **Gráficos Dinâmicos:** Mapeamento visual das categorias de gastos através de gráficos de rosca interativos.
- **Termômetro de Gastos:** Indicador de saúde financeira que calcula a porcentagem da receita que já foi comprometida.
- **CRUD Completo e Ágil:** Inserção, listagem, edição e exclusão de transações em uma interface fluida.
- **Optimistic UI:** Implementação avançada de interface otimista no front-end. Ao editar ou excluir um registro, a tela é atualizada em milissegundos, antes mesmo da confirmação do servidor, eliminando telas de carregamento e atrasos de rede.

---

## 🛠️ Tecnologias Utilizadas

**Front-end**

- **HTML5 & CSS3:** Estrutura semântica com estilização avançada baseada em _Glassmorphism_.
- **JavaScript (Vanilla JS):** Lógica de negócios assíncrona (`async/await`, Fetch API) e manipulação do DOM.
- **Bootstrap 5:** Framework CSS para grid responsivo.
- **Chart.js:** Biblioteca para renderização do gráfico analítico.
- **SweetAlert2:** Para modais e alertas elegantes e não-bloqueantes.

**Back-end (Server-side)**

- **Node.js:** Ambiente de execução JavaScript no servidor.
- **Express.js:** Micro-framework para roteamento da API RESTful.
- **Persistência em Memória (PoC):** Estruturação de dados via Arrays de Objetos para garantir alta portabilidade em ambientes de nuvem (Cloud IDEs como StackBlitz), dispensando a instalação de drivers locais de banco de dados para a demonstração do MVP.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

Certifique-se de ter o **[Node.js](https://nodejs.org/)** instalado na sua máquina (versão LTS recomendada).

### Passo a Passo

1. **Clone ou baixe** este repositório para o seu computador.
2. Abra o terminal na pasta raiz do projeto.
3. Instale as dependências necessárias executando:
   ```bash
   npm install express cors
   ```

## ☁️ Execução Rápida via Nuvem (StackBlitz)

Caso prefira testar a aplicação instantaneamente sem baixar nenhum arquivo ou instalar o Node.js em sua máquina, siga estes passos:

1. Acesse o [StackBlitz] (https://stackblitz.com/).
2. Selecione a opção **"Node.js Blank Project"**.
3. No painel de arquivos à esquerda, crie a seguinte estrutura:
   - `server.js` (na raiz)
   - Pasta `public/` e dentro dela: `index.html`, `style.css` e `app.js`.
4. Copie e cole os códigos deste repositório em seus respectivos arquivos.
5. No terminal do StackBlitz (parte inferior), instale as dependências pelo terminal:

   `npm install express cors`

6. Em seguida, execute o servidor/aplicativo:
   `node server.js`

7. O StackBlitz abrirá automaticamente uma janela de visualização à direita com o **FinanceApp Ultra** rodando em tempo real.

## Link Para Visualização Prática do Projeto em Acão:

**https://youtu.be/OhesP12SZ-g**
