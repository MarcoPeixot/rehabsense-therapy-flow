# 📚 Documentação de Interface - RehabSense

## 📋 Visão Geral

Este documento descreve todos os elementos visuais e interativos utilizados na interface do RehabSense, garantindo consistência, acessibilidade e usabilidade em todo o sistema.

---

## 🎨 Design System

### Cores (HSL)

#### Tema Claro (Light Mode)
| Variável | Valor HSL | Uso |
|----------|-----------|-----|
| `--background` | `0 0% 100%` | Fundo principal da aplicação |
| `--foreground` | `180 10% 15%` | Texto principal |
| `--primary` | `175 60% 45%` | Cor primária (teal/turquesa) - Botões principais, links |
| `--secondary` | `200 70% 50%` | Cor secundária (azul) - Elementos de destaque |
| `--success` | `145 65% 45%` | Verde para ações de sucesso |
| `--warning` | `40 95% 55%` | Laranja para avisos |
| `--destructive` | `0 75% 55%` | Vermelho para ações destrutivas |
| `--muted` | `180 10% 96%` | Fundos sutis (cards, áreas secundárias) |
| `--border` | `180 10% 90%` | Bordas de elementos |
| `--ring` | `175 60% 45%` | Anel de foco para acessibilidade |

#### Tema Escuro (Dark Mode)
| Variável | Valor HSL | Uso |
|----------|-----------|-----|
| `--background` | `180 15% 8%` | Fundo principal escuro |
| `--foreground` | `0 0% 95%` | Texto claro |
| `--primary` | `175 60% 50%` | Cor primária ajustada |
| `--muted` | `180 10% 15%` | Fundos sutis em modo escuro |
| `--border` | `180 10% 20%` | Bordas em modo escuro |

#### Alto Contraste (High Contrast)
Ativado automaticamente via `@media (prefers-contrast: high)`
- **Light:** Background branco puro, foreground preto puro
- **Dark:** Background preto puro, foreground branco puro

### Tipografia

#### Fontes
- **Principal:** System font stack (native do sistema operacional)
- **Fallback:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

#### Tamanhos
| Classe | Tamanho | Uso |
|--------|---------|-----|
| `text-xs` | 0.75rem | Labels pequenos, metadados |
| `text-sm` | 0.875rem | Texto secundário, descrições |
| `text-base` | 1rem | Texto padrão |
| `text-lg` | 1.125rem | Títulos de cards |
| `text-xl` | 1.25rem | Subtítulos |
| `text-2xl` | 1.5rem | Títulos de seção |
| `text-3xl` | 1.875rem | Títulos de página |
| `text-4xl` | 2.25rem | Números grandes, métricas |
| `text-6xl` | 3.75rem | Timer de exercícios |

### Espaçamento

#### Grid e Layout
- **Container máximo:** 1400px (2xl breakpoint)
- **Padding padrão:** 2rem (container)
- **Gap padrão:** 1.5rem (6) entre cards e elementos

#### Breakpoints
| Nome | Largura | Uso |
|------|---------|-----|
| `sm` | 640px | Mobile grande |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop pequeno |
| `xl` | 1280px | Desktop |
| `2xl` | 1400px | Desktop grande |

### Border Radius
- **lg:** `var(--radius)` = 0.75rem - Padrão para cards e containers
- **md:** `calc(var(--radius) - 2px)` - Elementos internos
- **sm:** `calc(var(--radius) - 4px)` - Elementos pequenos
- **full:** Círculos perfeitos (avatars, badges)

---

## 🧩 Componentes Base (shadcn/ui)

### Button
**Arquivo:** `src/components/ui/button.tsx`

**Variantes:**
- `default` - Botão primário (fundo primary, texto branco)
- `destructive` - Ações destrutivas (vermelho)
- `outline` - Botão com borda, sem fundo
- `secondary` - Botão secundário (fundo secondary)
- `ghost` - Sem fundo, hover sutil
- `link` - Estilo de link

**Tamanhos:**
- `sm` - Pequeno (padding reduzido)
- `default` - Padrão
- `lg` - Grande
- `icon` - Quadrado para ícones

**Acessibilidade:**
- ✅ `focus-visible:ring-2` - Anel de foco visível
- ✅ `disabled:pointer-events-none` - Desabilita interação
- ✅ `disabled:opacity-50` - Feedback visual de desabilitado

**Exemplo de Uso:**
```tsx
<Button variant="default" size="lg" aria-label="Criar novo paciente">
  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
  Novo Paciente
</Button>
```

---

### Card
**Arquivos:** `src/components/ui/card.tsx`

**Estrutura:**
- `Card` - Container principal
- `CardHeader` - Cabeçalho
- `CardTitle` - Título do card
- `CardDescription` - Descrição/subtítulo
- `CardContent` - Conteúdo principal
- `CardFooter` - Rodapé

**Estilo:**
- Background: `bg-card`
- Texto: `text-card-foreground`
- Borda: `border border-border`
- Sombra: `shadow-sm`
- Radius: `rounded-lg`

**Exemplo de Uso:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Progresso da Sessão</CardTitle>
    <CardDescription>Exercício 2 de 5</CardDescription>
  </CardHeader>
  <CardContent>
    <Progress value={40} />
  </CardContent>
</Card>
```

---

### Input
**Arquivo:** `src/components/ui/input.tsx`

**Características:**
- Background: `bg-background`
- Borda: `border-input`
- Altura: `h-10`
- Padding: `px-3 py-2`
- Focus: `focus-visible:ring-2 focus-visible:ring-ring`

**Tipos Suportados:**
- `text` - Texto padrão
- `email` - Email com validação
- `password` - Senha (texto oculto)
- `number` - Números
- `datetime-local` - Data e hora

**Acessibilidade:**
- ✅ Sempre usar com `<Label>` associado
- ✅ Atributos `aria-invalid` para erros
- ✅ `placeholder` descritivo

**Exemplo de Uso:**
```tsx
<div className="space-y-2">
  <Label htmlFor="nome">Nome do Paciente</Label>
  <Input
    id="nome"
    type="text"
    placeholder="Digite o nome completo"
    aria-describedby="nome-error"
    aria-invalid={!!errors.nome}
  />
  {errors.nome && (
    <p id="nome-error" className="text-sm text-destructive" role="alert">
      {errors.nome}
    </p>
  )}
</div>
```

---

### Dialog
**Arquivo:** `src/components/ui/dialog.tsx`

**Estrutura:**
- `Dialog` - Container (gerencia estado open/closed)
- `DialogTrigger` - Botão que abre o dialog
- `DialogContent` - Conteúdo do modal
- `DialogHeader` - Cabeçalho
- `DialogTitle` - Título (obrigatório para a11y)
- `DialogDescription` - Descrição (obrigatório para a11y)
- `DialogFooter` - Rodapé com ações

**Acessibilidade:**
- ✅ `role="dialog"` automático
- ✅ `aria-labelledby` vinculado ao título
- ✅ `aria-describedby` vinculado à descrição
- ✅ Trap de foco (não sai do modal)
- ✅ Fecha com `Esc`
- ✅ Overlay escuro com backdrop-blur

**Exemplo de Uso:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Adicionar Exercício</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Criar Novo Exercício</DialogTitle>
      <DialogDescription>
        Preencha os campos abaixo para criar um exercício personalizado
      </DialogDescription>
    </DialogHeader>
    {/* Form aqui */}
  </DialogContent>
</Dialog>
```

---

### Select
**Arquivo:** `src/components/ui/select.tsx`

**Estrutura:**
- `Select` - Container
- `SelectTrigger` - Botão que abre o dropdown
- `SelectValue` - Valor selecionado
- `SelectContent` - Lista de opções
- `SelectItem` - Cada opção

**Características:**
- Navegação por teclado (Arrow Up/Down)
- Busca por digitação
- Scroll automático para item selecionado

**Exemplo de Uso:**
```tsx
<Select value={tipoGripe} onValueChange={setTipoGripe}>
  <SelectTrigger aria-label="Selecionar tipo de gripe">
    <SelectValue placeholder="Selecione o tipo" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pinça">Pinça</SelectItem>
    <SelectItem value="gancho">Gancho</SelectItem>
    <SelectItem value="esférica">Esférica</SelectItem>
    <SelectItem value="cilíndrica">Cilíndrica</SelectItem>
    <SelectItem value="lateral">Lateral</SelectItem>
  </SelectContent>
</Select>
```

---

### Progress
**Arquivo:** `src/components/ui/progress.tsx`

**Props:**
- `value` - Número de 0 a 100 (percentual)
- `className` - Classes adicionais

**Características:**
- Altura padrão: `h-4`
- Background: `bg-secondary/20`
- Indicador: `bg-primary`
- Animação suave de transição

**Acessibilidade:**
- ✅ `role="progressbar"`
- ✅ `aria-valuenow={value}`
- ✅ `aria-valuemin={0}`
- ✅ `aria-valuemax={100}`

**Exemplo de Uso:**
```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progresso</span>
    <span>{progress}%</span>
  </div>
  <Progress value={progress} aria-label="Progresso da sessão" />
</div>
```

---

### Badge
**Arquivo:** `src/components/ui/badge.tsx`

**Variantes:**
- `default` - Fundo primary
- `secondary` - Fundo secondary
- `destructive` - Fundo vermelho
- `outline` - Apenas borda

**Uso:**
- Status de sessões
- Labels de categoria
- Contadores

**Exemplo de Uso:**
```tsx
<Badge variant="default">Conectado</Badge>
<Badge variant="secondary">Em Progresso</Badge>
<Badge variant="destructive">Cancelado</Badge>
```

---

### Toast/Sonner
**Arquivo:** `src/components/ui/sonner.tsx`

**Tipos:**
- `toast.success()` - Notificação de sucesso (verde)
- `toast.error()` - Notificação de erro (vermelho)
- `toast.info()` - Notificação informativa (azul)
- `toast.warning()` - Aviso (laranja)

**Características:**
- Posição: `bottom-right`
- Auto-dismiss: 4 segundos
- Empilhável
- Animações de entrada/saída

**Acessibilidade:**
- ✅ `role="status"` para toasts informativos
- ✅ `role="alert"` para toasts de erro
- ✅ `aria-live="polite"` ou `"assertive"`

**Exemplo de Uso:**
```tsx
import { toast } from 'sonner';

toast.success('Paciente cadastrado com sucesso!');
toast.error('Erro ao salvar dados');
toast.info('Dispositivo Bluetooth desconectado');
```

---

## 🖼️ Layouts Principais

### DashboardLayout
**Arquivo:** `src/components/DashboardLayout.tsx`

**Estrutura:**
- **Sidebar fixa** (esquerda, 256px largura)
  - Logo + nome da aplicação
  - Menu de navegação com ícones
  - Informações do usuário
  - Botão de sair
- **Conteúdo principal** (margin-left: 256px)
  - Padding: 2rem (8)
  - Background: `bg-muted/30`

**Navegação:**
- Dashboard
- Pacientes
- Exercícios
- Sessões

**Acessibilidade:**
- ✅ `role="navigation"` na sidebar
- ✅ `aria-label="Menu principal de navegação"`
- ✅ `aria-current="page"` no item ativo
- ✅ `aria-label` descritivo em cada link
- ✅ Ícones com `aria-hidden="true"`
- ✅ Focus ring visível em todos os links

**Cores da Sidebar:**
- Background: `--sidebar-background` (teal escuro)
- Texto: `--sidebar-foreground` (branco)
- Hover/Active: `--sidebar-accent`
- Border: `--sidebar-border`

---

### Páginas

#### 1. Login / SignUp
**Arquivos:** `src/pages/Login.tsx`, `src/pages/SignUp.tsx`

**Layout:**
- Centro da tela
- Card com formulário
- Logo acima do card
- Links entre login/signup

**Elementos:**
- Input de email
- Input de senha
- Botão de submit
- Link "Esqueci minha senha" (futuro)

---

#### 2. Dashboard
**Arquivo:** `src/pages/Index.tsx`

**Layout:**
- Grid de cards com estatísticas
- Sessões recentes
- Gráficos de progresso (futuro)

**Elementos:**
- Cards de métricas (total pacientes, sessões, etc.)
- Tabela de sessões recentes
- Botões de ação rápida

---

#### 3. Pacientes
**Arquivo:** `src/pages/Patients.tsx`

**Layout:**
- Cabeçalho com título + botão "Novo Paciente"
- Grid de cards de pacientes
- Dialog de criação/edição

**Card de Paciente:**
- Avatar (primeira letra do nome)
- Nome em destaque
- Idade e condição
- Botões de editar/deletar

**Dialog de Criação:**
- Input: Nome
- Input: Idade (número)
- Input: Condição médica
- Select: Terapeuta (auto-preenchido)

---

#### 4. Exercícios
**Arquivo:** `src/pages/Exercises.tsx`

**Layout:**
- Tabs: "Criar Manual" | "Gerar com IA"
- Grid de exercícios existentes
- Dialog de criação

**Tab "Criar Manual":**
- Input: Nome do exercício
- Select: Tipo de gripe (pinça, gancho, etc.)
- Input: Duração (segundos)
- Input: Percentual de força
- Input: Repetições
- Input: Intervalo (opcional)
- Select: Lado (direita/esquerda/ambos)
- Textarea: Observações

**Tab "Gerar com IA":**
- Textarea: Prompt descritivo
- Select: Paciente
- Botão: Gerar

**Card de Exercício:**
- Nome do exercício
- Badge: Tipo de gripe
- Métricas: Duração, força, repetições
- Observações
- Código DSL
- Botões: Editar/Deletar

---

#### 5. Sessões
**Arquivo:** `src/pages/Sessions.tsx`

**Layout:**
- Cabeçalho com botão "Nova Sessão"
- Lista de cards de sessões
- Dialog de criação

**Card de Sessão:**
- Ícone de calendário
- ID da sessão
- Data/hora agendada
- Badge de status (agendada/em progresso/concluída)
- Nome do paciente
- Número de exercícios
- Botões:
  - "Executar Sessão" (se agendada)
  - "Continuar" (se em progresso)
  - "Ver Relatório" (se concluída)

**Dialog de Criação:**
- Select: Paciente
- Input: Data e hora (datetime-local)
- Checklist: Exercícios (múltipla escolha)

---

#### 6. Execução de Sessão
**Arquivo:** `src/pages/SessionExecution.tsx`

**Layout:** Grid 3 colunas (lg)

**Coluna Esquerda (1/3):**
1. **Card Bluetooth:**
   - Status de conexão
   - Botão "Escanear Dispositivos"
   - Info: Bateria, sinal, última leitura

2. **Card Progresso:**
   - Exercício X de Y
   - Barra de progresso

3. **Card Lista de Exercícios:**
   - Todos os exercícios da sessão
   - Ícones de status:
     - ✅ Concluído (verde)
     - ❌ Pulado (cinza)
     - 🔵 Atual (azul pulsante)

**Coluna Direita (2/3):**
1. **Card Exercício Atual:**
   - Nome do exercício
   - Grid de informações:
     - Tipo de gripe
     - Força alvo
     - Duração
     - Repetição atual/total
   - Observações (se houver)
   - Timer grande (text-6xl)
   - Barra de progresso do timer
   - Botões:
     - "Iniciar Repetição" / "Pausar"
     - "Pular"
     - "Concluir Exercício"

2. **Card Dados dos Sensores** (se Bluetooth conectado):
   - Grid 5 colunas:
     - Polegar
     - Indicador
     - Médio
     - Anular
     - Mindinho
   - Cada um com:
     - Valor percentual (text-2xl)
     - Barra de progresso colorida
   - Resumo:
     - Força média
     - Força máxima
     - Força mínima

---

#### 7. Relatório de Sessão
**Arquivo:** `src/pages/SessionReport.tsx`

**Layout:**
- Cabeçalho com botão "Baixar PDF"
- Sequência de cards:

1. **Informações do Paciente:**
   - Nome
   - Idade
   - Condição

2. **Resumo da Sessão:**
   - Data/hora início
   - Data/hora término
   - Duração total
   - Exercícios concluídos/total

3. **Desempenho Geral:**
   - 3 métricas grandes (text-4xl):
     - Força média (%)
     - Consistência (%)
     - Taxa de conclusão (%)

4. **Detalhes dos Exercícios:**
   - Lista de todos exercícios
   - Para cada:
     - Nome + tipo
     - Badge: Concluído/Pulado
     - Métricas (se concluído):
       - Força média/máxima/mínima
       - Consistência
       - Taxa de conclusão

5. **Recomendações** (se disponível):
   - Lista bullet de recomendações geradas

---

## ♿ Acessibilidade (WCAG 2.1)

### Navegação por Teclado
✅ **Implementado:**
- Todos os elementos interativos são focáveis via `Tab`
- Focus ring visível: `focus-visible:ring-2 ring-ring`
- Ordem lógica de foco (top-to-bottom, left-to-right)
- Dialogs trapam foco dentro deles
- `Esc` fecha modais e dropdowns

### Leitores de Tela
✅ **Implementado:**
- Roles semânticos: `navigation`, `main`, `contentinfo`
- `aria-label` em elementos complexos
- `aria-current="page"` em navegação
- `aria-hidden="true"` em ícones decorativos
- `aria-describedby` em campos com erro
- `aria-invalid` em inputs com erro
- Classe `.sr-only` para texto apenas para screen readers

### Contraste de Cores
✅ **Implementado:**
- Contraste mínimo 4.5:1 para texto normal
- Contraste mínimo 3:1 para texto grande
- Modo alto contraste via `@media (prefers-contrast: high)`
- Cores com significado também diferenciadas por ícones

### Movimento Reduzido
✅ **Implementado:**
```css
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
```

### Formulários Acessíveis
✅ **Implementado:**
- Labels sempre associados a inputs via `htmlFor`
- Placeholders descritivos (não substituem labels)
- Mensagens de erro com `role="alert"`
- Validação inline com feedback visual e textual

---

## 🎯 Consistência Visual

### Hierarquia de Títulos
- **h1:** Título da página (text-3xl, font-bold)
- **h2:** Título de card (text-lg ou text-xl, font-semibold)
- **h3:** Subtítulos (text-base, font-medium)

### Espaçamento Consistente
- Entre cards: `gap-6` (1.5rem)
- Padding de cards: `p-4` ou `p-6`
- Margin de seções: `space-y-6`

### Ícones
- **Biblioteca:** lucide-react
- **Tamanhos padrão:**
  - Pequeno: `h-4 w-4`
  - Médio: `h-5 w-5`
  - Grande: `h-6 w-6`
  - Logo: `h-8 w-8`
- **Sempre com `aria-hidden="true"`** quando decorativos

### Estados Visuais
- **Hover:** Mudança sutil de background/cor
- **Active:** Background mais escuro
- **Disabled:** `opacity-50` + `cursor-not-allowed`
- **Loading:** Spinner animado

---

## 📱 Responsividade

### Breakpoints em Uso
- **Mobile First:** Design base para mobile
- **md (768px):** Tablet - grid de 2 colunas
- **lg (1024px):** Desktop - grid de 3 colunas, sidebar fixa

### Adaptações
- Sidebar fixa em desktop, colapsável em mobile (futuro)
- Grid de cards: 1 coluna (mobile) → 2 colunas (tablet) → 3 colunas (desktop)
- Texto responsivo via classes `text-sm md:text-base`
- Padding/margin reduzidos em mobile

---

## 🚀 Performance e Usabilidade

### Carregamento
✅ **Implementado:**
- Skeleton loaders (spinner circular)
- Lazy loading de imagens (futuro)
- Code splitting por rota (Vite)

### Feedback ao Usuário
✅ **Implementado:**
- Toasts para ações (sucesso/erro)
- Loading states em botões (disabled durante request)
- Progress bars em processos longos
- Mensagens de erro inline em formulários

### Otimizações
✅ **Implementado:**
- Debounce em buscas (futuro)
- Memoização de componentes pesados (futuro)
- Virtualização de listas longas (futuro)
- Service Workers para cache (futuro)

---

## 📋 Checklist de Implementação

### RNF05 - Usabilidade
- ✅ Interface fluida com transições suaves
- ✅ Feedback visual imediato (toasts, loading states)
- ✅ Respostas rápidas às ações do usuário
- ✅ Navegação intuitiva
- ✅ Mensagens de erro claras

### RNF06 - Acessibilidade WCAG 2.1
- ✅ Navegação por teclado completa
- ✅ Focus visível em todos os elementos
- ✅ Roles semânticos (ARIA)
- ✅ Alto contraste automático
- ✅ Movimento reduzido (prefers-reduced-motion)
- ✅ Leitores de tela (aria-label, sr-only)
- ✅ Contraste de cores adequado
- ⚠️ Skip to content link (implementado no CSS, falta no HTML)

### RNF07 - Consistência Visual
- ✅ Design system centralizado (index.css)
- ✅ Cores padronizadas via CSS variables
- ✅ Componentes reutilizáveis (shadcn/ui)
- ✅ Hierarquia visual clara
- ✅ Espaçamento consistente
- ✅ Tipografia uniforme

### RNF08 - Documentação de Interface
- ✅ Este documento completo
- ✅ Descrição de todos os componentes
- ✅ Exemplos de uso
- ✅ Guidelines de acessibilidade
- ✅ Padrões de design

---

## 🔄 Melhorias Futuras

### Curto Prazo
- [ ] Adicionar `<a href="#main-content" class="skip-to-content">Pular para conteúdo</a>` antes da sidebar
- [ ] Implementar modo escuro persistente (toggle manual)
- [ ] Adicionar breadcrumbs em páginas aninhadas
- [ ] Melhorar feedback de loading (skeleton screens)

### Médio Prazo
- [ ] Gráficos de progresso (Chart.js/Recharts)
- [ ] Exportação de relatórios em PDF
- [ ] Busca e filtros avançados
- [ ] Virtualização de listas longas
- [ ] Sidebar colapsável em mobile

### Longo Prazo
- [ ] Temas personalizados
- [ ] Preferências de usuário (tamanho de fonte, contraste)
- [ ] Internacionalização (i18n)
- [ ] PWA (instalável)
- [ ] Offline-first com sincronização

---

**Versão:** 1.0.0
**Última atualização:** 14/11/2025
**Autor:** Equipe RehabSense
