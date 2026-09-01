# 📖 Guia de Uso do Sistema

> **Aplicação web estática de consulta a procedimentos de sistema e rotinas operacionais.**
> Esta revisão foi utilizada na validação operacional do Projeto de Extensão VI (PEX VI). Os registros acadêmicos e os dados anonimizados da atividade são mantidos fora deste repositório público.

---

## 🎯 Sobre o Projeto

O Guia de Uso do Sistema é uma solução rápida, acessível e segura para consulta de rotinas e procedimentos. Foi desenvolvido com foco na usabilidade, garantindo que a informação esteja sempre disponível, independentemente do dispositivo ou das condições da rede (suporte básico sem JavaScript).

## ✨ Principais Funcionalidades

- 📄 **Acessibilidade Universal:** O conteúdo base permanece legível mesmo com o JavaScript desabilitado no navegador.
- 📱 **Design Responsivo:** Navegação lateral otimizada para desktops e um painel intuitivo e retrátil para dispositivos móveis.
- 🔍 **Busca Inteligente & Resiliente:**
  - Pesquisa unificada por procedimentos, rotinas, documentos e perguntas frequentes (FAQ).
  - Ignora diferenças de maiúsculas/minúsculas e acentuação.
  - Tolera erros simples de digitação e suporta termos parciais.
  - Exibe resultados ordenados por relevância, anunciados para leitores de tela via região viva (ARIA).
- 🌓 **Tema Adaptativo (Claro/Escuro):** Ajusta-se automaticamente à preferência do sistema no primeiro acesso e memoriza a escolha do usuário.
- ⌨️ **Operação por Teclado:** Suporte completo à navegação via teclado, especialmente nas sessões de FAQ.
- 🔒 **Foco em Privacidade:** Zero trackers, zero ferramentas de analytics externas e sem uso de cookies de rastreamento. As buscas são processadas localmente.

---

## 📝 Atualizando o Conteúdo

Para garantir a rastreabilidade e integridade, siga o fluxo abaixo ao alterar informações:

1. 🗣️ **Confirme** a alteração com a gestão ou área responsável.
2. 📄 **Edite** o conteúdo correspondente diretamente no `index.html`, mantendo a hierarquia semântica das tags de título (`<h1>`, `<h2>`, etc).
3. 🔄 **Atualize** os campos `updatedAt`, `version` e `changes` no arquivo `js/config.js`.
4. 📋 **Registre** a alteração na mensagem do commit e na documentação interna do projeto.
5. 🧪 **Valide** manualmente as alterações, verificando busca, teclado, navegação móvel, responsividade e contraste nos temas claro e escuro.
