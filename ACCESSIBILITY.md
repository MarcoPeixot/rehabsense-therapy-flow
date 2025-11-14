# Documentação de Acessibilidade - RehabSense

Este documento descreve os recursos de acessibilidade implementados na plataforma RehabSense, seguindo as diretrizes WCAG 2.1 (Web Content Accessibility Guidelines).

## Conformidade WCAG 2.1

A plataforma RehabSense foi desenvolvida para atender ao nível AA das diretrizes WCAG 2.1, garantindo:

### 1. Perceptível
- **Contraste de Cores**: Todas as combinações de cores atendem ao índice de contraste mínimo de 4.5:1
- **Textos Alternativos**: Todas as imagens e ícones possuem atributos `aria-label` ou `alt` descritivos
- **Conteúdo Adaptável**: Layout responsivo que se adapta a diferentes tamanhos de tela e níveis de zoom

### 2. Operável
- **Navegação por Teclado**: Todos os elementos interativos são acessíveis via teclado
  - `Tab`: Navega para o próximo elemento
  - `Shift + Tab`: Navega para o elemento anterior
  - `Enter` ou `Space`: Ativa botões e links
  - `Esc`: Fecha diálogos e menus
- **Indicadores de Foco**: Bordas visíveis em elementos focados usando `focus:ring-2`
- **Skip Links**: Links para pular direto ao conteúdo principal (planejado)

### 3. Compreensível
- **Rótulos e Instruções**: Todos os campos de formulário possuem `<Label>` associados
- **Mensagens de Erro**: Erros são anunciados através de `aria-live` regions
- **Feedback Visual**: Estados de loading possuem indicadores `aria-busy`
- **Linguagem Clara**: Textos descritivos e consistentes em toda a interface

### 4. Robusto
- **HTML Semântico**: Uso correto de tags semânticas (`<main>`, `<nav>`, `<aside>`, `<section>`)
- **ARIA Roles**: Implementação de roles adequados para leitores de tela
  - `role="navigation"`: Menu de navegação
  - `role="main"`: Conteúdo principal
  - `role="status"`: Indicadores de status
  - `role="alert"`: Mensagens importantes

## Recursos Implementados

### Formulários Acessíveis
```tsx
// Exemplo de campo de formulário acessível
<Label htmlFor="email">Email</Label>
<Input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-description"
  autoComplete="email"
/>
<span id="email-description" className="sr-only">
  Digite seu endereço de email
</span>
```

### Navegação Acessível
- Indicadores visuais de página ativa (`aria-current="page"`)
- Foco visível em todos os links e botões
- Transições suaves para melhor experiência

### Loading States
- Componente `LoadingSpinner` com `aria-busy` e `aria-live`
- Textos alternativos descrevendo o estado de carregamento
- Feedback visual e textual

### Screen Reader Support
- Classes `.sr-only` para textos visíveis apenas para leitores de tela
- Atributos `aria-label` em ícones e elementos decorativos
- Anúncios apropriados de mudanças de estado

## Design System Acessível

### Cores e Contraste
As cores do sistema foram escolhidas para garantir contraste adequado:

```css
/* Light Mode */
--foreground: 180 10% 15%;  /* Texto escuro em fundo claro */
--background: 0 0% 100%;

/* Dark Mode */
--foreground: 0 0% 95%;     /* Texto claro em fundo escuro */
--background: 180 15% 8%;
```

### Tipografia
- Tamanhos mínimos de fonte: 14px (0.875rem)
- Altura de linha adequada para legibilidade
- Espaçamento consistente entre elementos

### Estados Interativos
Todos os elementos interativos possuem estados visuais claros:
- **Default**: Estado normal
- **Hover**: Mudança de cor ao passar o mouse
- **Focus**: Anel de foco visível
- **Active**: Estado pressionado
- **Disabled**: Opacidade reduzida e cursor não permitido

## Testes de Acessibilidade

### Ferramentas Recomendadas
1. **axe DevTools**: Extensão do Chrome/Firefox para testes automáticos
2. **WAVE**: Ferramenta online de avaliação de acessibilidade
3. **Lighthouse**: Auditoria integrada no Chrome DevTools
4. **NVDA/JAWS**: Leitores de tela para testes manuais

### Checklist de Testes
- [ ] Navegação completa por teclado
- [ ] Leitura com leitor de tela
- [ ] Teste de contraste de cores
- [ ] Zoom até 200% sem perda de funcionalidade
- [ ] Teste em diferentes resoluções
- [ ] Validação HTML e ARIA

## Melhorias Futuras

1. **Skip Links**: Adicionar links para pular navegação
2. **Modo Alto Contraste**: Tema com contraste ainda maior
3. **Tamanhos de Fonte Ajustáveis**: Permitir usuários ajustarem o tamanho do texto
4. **Atalhos de Teclado**: Documentar e implementar atalhos personalizados
5. **Legendas e Transcrições**: Para conteúdo de vídeo/áudio (quando aplicável)

## Contato

Para reportar problemas de acessibilidade ou sugerir melhorias, entre em contato com a equipe de desenvolvimento.

---

**Última atualização**: 2024
**Versão**: 1.0
