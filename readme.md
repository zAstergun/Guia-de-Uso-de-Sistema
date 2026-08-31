# 📖 Guia de Uso do Sistema

> **Aplicação web estática de consulta a procedimentos de sistema e rotinas operacionais.**
> Esta revisão prepara o Guia existente para a validação operacional do Projeto de Extensão VI (PEX VI); ela não representa a execução da atividade com colaboradores nem contém resultados acadêmicos.

---

## ✨ Funcionalidades

- 📄 **Acessibilidade:** Conteúdo disponível para leitura mesmo sem JavaScript.
- 📱 **Responsividade:** Navegação lateral no computador e painel acessível no celular.
- 🔍 **Busca Inteligente:** Busca por procedimentos, rotinas, documentos e FAQ.
  - Sem distinção de caixa ou acentos.
  - Suporte a termos parciais e tolerância a erros simples.
  - Resultados ordenados por relevância com contagem em região viva e acesso direto ao conteúdo.
- 🌓 **Tema Claro/Escuro:** Preferência persistida e sincronizada com a preferência do sistema no primeiro acesso.
- ⌨️ **Navegação por Teclado:** FAQ totalmente operável por teclado.
- 📬 **Contato e Feedback:** Contatos e formulário de feedback opcionais (sem placeholders públicos).
- 🔒 **Privacidade:** Sem analytics, cookies de rastreamento ou armazenamento local de respostas.

> **Aviso:** O conteúdo operacional herdado está marcado como pendente de homologação institucional nesta revisão.

---

## 🚀 Executar Localmente

Como não há etapa de compilação, basta executar um servidor HTTP estático na raiz do repositório. Por exemplo, utilizando Python:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000` em seu navegador. (Abrir o `index.html` diretamente também permite a leitura, mas um servidor local representa melhor a hospedagem real).

---

## ⚙️ Configuração Pública

Edite somente o arquivo [`js/config.js`](js/config.js). Ele é a fonte da versão, data de revisão, resumo de mudanças e integrações opcionais.

- `feedbackUrl`: URL HTTPS do formulário externo aprovado.
- `contacts`: Lista de contatos públicos autorizados.

> **Importante:** Valores vazios ocultam os respectivos controles. Não coloque senhas, documentos internos ou dados pessoais não autorizados nesse arquivo.

**Exemplo de contato autorizado:**
```javascript
contacts: [
  {
    title: "Suporte de TI",
    phone: "valor autorizado",
    email: "valor autorizado",
    hours: "horário autorizado"
  }
]
```

---

## 📝 Como Atualizar o Conteúdo

1. **Confirme** a alteração com a gerente ou farmacêutica responsável.
2. **Edite** o procedimento correspondente em `index.html`, preservando a hierarquia de títulos.
3. **Atualize** `updatedAt`, `version` e `changes` em `js/config.js`.
4. **Registre** a mudança em `CHANGELOG.md`.
5. **Execute** os testes e repita as verificações de teclado, celular e ambos os temas.

---

## 🧪 Testes

Execute os testes automatizados para garantir a integridade da aplicação:

```bash
node --check js/config.js
node --check js/search.js
node --check js/script.js
node tests/search.test.js
node tests/html.test.js
```

> **Nota:** Os roteiros para a aplicação real estão em [`docs/pex-vi`](docs/pex-vi). Campos de resultado, tempo e observação devem permanecer vazios até a atividade com os colaboradores.

---

## 🌐 Publicação

O site pode ser publicado em **GitHub Pages**, **Vercel** ou outro host de arquivos estáticos. Basta publicar a raiz do repositório sem a necessidade de comando de build. 
*O endereço oficial não foi confirmado neste repositório e deve ser informado na entrega acadêmica somente após a publicação.*

---

## ⚠️ Limitações Conhecidas

- O **Tailwind CSS** ainda é carregado por CDN; removê-lo exigiria uma reescrita de estilos fora do escopo incremental atual.
- Contatos, responsável institucional, formulário e URL oficial aguardam configuração autorizada.
- Procedimentos e documentos listados aguardam homologação/publicação pela organização.
- Capturas finais precisam ser produzidas em um navegador disponível após a revisão visual.

---

## 🛡️ Privacidade

O Guia **não registra** consultas nem respostas. O formulário de feedback, se configurado, é externo e deve evitar nome, CPF, e-mail ou qualquer dado pessoal que não seja estritamente indispensável.
