# Documentação de Interface - RehabSense

## Visão Geral

Este documento descreve todos os elementos visuais e interativos utilizados na interface do RehabSense, incluindo componentes, padrões de design e diretrizes de uso.

## Sistema de Design

### Paleta de Cores

A plataforma utiliza um sistema de cores baseado em tokens semânticos HSL, garantindo consistência e acessibilidade:

#### Cores Principais
- **Primary** (`--primary`): Verde-azulado (#3FA9A0) - Cor principal da marca
- **Secondary** (`--secondary`): Azul (#4AB3E8) - Cor secundária
- **Success** (`--success`): Verde (#47B881) - Indicadores de sucesso
- **Warning** (`--warning`): Laranja (#F59E0B) - Avisos
- **Destructive** (`--destructive`): Vermelho (#E53E3E) - Ações destrutivas

#### Cores de Interface
- **Background**: Fundo principal das páginas
- **Foreground**: Texto principal
- **Muted**: Elementos secundários/desativados
- **Accent**: Destaques e hover states
- **Border**: Bordas e divisores

### Tipografia

```css
/* Hierarquia de títulos */
h1: 3xl (2.25rem) - Títulos principais de página
h2: 2xl (1.5rem) - Seções importantes
h3: xl (1.25rem) - Subsections
h4: lg (1.125rem) - Cards e componentes

/* Texto corpo */
base: 1rem - Texto padrão
sm: 0.875rem - Texto secundário
xs: 0.75rem - Legendas e metadados
```

### Espaçamento

Sistema baseado em múltiplos de 4px (0.25rem):
- **xs**: 0.5rem (8px)
- **sm**: 1rem (16px)
- **md**: 1.5rem (24px)
- **lg**: 2rem (32px)
- **xl**: 3rem (48px)

## Componentes de UI

### Botões (`Button`)

Componente base para todas as ações interativas.

**Variantes:**
- `default`: Botão principal (fundo primary)
- `secondary`: Ação secundária (fundo secondary)
- `outline`: Botão com borda, fundo transparente
- `ghost`: Sem borda, efeito hover sutil
- `destructive`: Ações destrutivas (deletar, remover)
- `link`: Estilo de link, sem background

**Tamanhos:**
- `sm`: Pequeno (h-9, px-3)
- `default`: Padrão (h-10, px-4)
- `lg`: Grande (h-11, px-8)
- `icon`: Quadrado para ícones (h-10, w-10)

**Exemplo de uso:**
```tsx
<Button variant="default" size="lg">
  Salvar Alterações
</Button>

<Button variant="outline" size="sm">
  Cancelar
</Button>

<Button variant="destructive">
  Excluir Paciente
</Button>
```

### Campos de Entrada (`Input`)

Campos de texto para entrada de dados.

**Propriedades:**
- `type`: text, email, password, number, tel, etc.
- `placeholder`: Texto de exemplo
- `disabled`: Estado desabilitado
- `required`: Campo obrigatório

**Estados:**
- Normal: Borda border, fundo background
- Focus: Anel de foco (ring-2 ring-primary)
- Error: Borda vermelha (quando em formulário com erro)
- Disabled: Opacidade 50%, cursor não permitido

### Labels (`Label`)

Rótulos para campos de formulário.

**Características:**
- Sempre associado a um campo via `htmlFor`
- Fonte medium, cor foreground
- Desabilitado quando campo pai está disabled

### Cards (`Card`)

Containers para agrupar conteúdo relacionado.

**Subcomponentes:**
- `Card`: Container principal
- `CardHeader`: Cabeçalho do card
- `CardTitle`: Título do card
- `CardDescription`: Descrição/subtítulo
- `CardContent`: Conteúdo principal
- `CardFooter`: Rodapé com ações

**Exemplo:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Informações do Paciente</CardTitle>
    <CardDescription>Dados cadastrais e histórico</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
  <CardFooter>
    <Button>Salvar</Button>
  </CardFooter>
</Card>
```

### Tabelas (`Table`)

Exibição de dados tabulares.

**Componentes:**
- `Table`: Container principal
- `TableHeader`: Cabeçalho
- `TableBody`: Corpo da tabela
- `TableRow`: Linha
- `TableHead`: Célula de cabeçalho
- `TableCell`: Célula de dados

### Badges (`Badge`)

Indicadores visuais de status, categorias ou contadores.

**Variantes:**
- `default`: Badge padrão
- `secondary`: Variante secundária
- `outline`: Com borda
- `destructive`: Para status negativos

### Toasts (Notificações)

Mensagens temporárias para feedback do usuário.

**Tipos:**
- Success: Ações concluídas com sucesso
- Error: Erros e falhas
- Warning: Avisos importantes
- Info: Informações gerais

**Uso:**
```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: "Sucesso!",
  description: "Paciente cadastrado com sucesso.",
});

toast({
  title: "Erro",
  description: "Não foi possível salvar os dados.",
  variant: "destructive",
});
```

### Loading Spinner (`LoadingSpinner`)

Indicador de carregamento acessível.

**Propriedades:**
- `size`: 'sm' | 'md' | 'lg'
- `label`: Texto descritivo (para leitores de tela)
- `className`: Classes adicionais

**Uso:**
```tsx
<LoadingSpinner size="lg" label="Carregando pacientes..." />
```

## Padrões de Layout

### DashboardLayout

Layout padrão para páginas internas da aplicação.

**Estrutura:**
- Sidebar fixa à esquerda (w-64)
- Área de conteúdo principal à direita
- Menu de navegação com indicador de página ativa
- Seção de usuário no rodapé da sidebar

### Páginas de Autenticação

Layout split-screen:
- Formulário à esquerda (w-full lg:w-1/2)
- Gradient decorativo à direita (hidden lg:block)

## Ícones

Utilizamos a biblioteca `lucide-react` para ícones.

**Ícones Principais:**
- `Activity`: Logo da aplicação
- `LayoutDashboard`: Dashboard
- `Users`: Pacientes
- `Dumbbell`: Exercícios
- `Calendar`: Sessões
- `LogOut`: Sair
- `Plus`: Adicionar
- `Edit`: Editar
- `Trash`: Excluir
- `Eye`: Visualizar

**Tamanhos padrão:**
- Ícones de navegação: h-5 w-5
- Ícones em botões: h-4 w-4
- Logo: h-8 w-8

## Estados Interativos

### Hover
```css
hover:bg-accent hover:text-accent-foreground
```

### Focus
```css
focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
```

### Active/Current Page
```css
bg-sidebar-accent text-sidebar-accent-foreground
aria-current="page"
```

### Disabled
```css
disabled:pointer-events-none disabled:opacity-50
```

### Loading
```css
aria-busy="true"
```

## Transições e Animações

Todas as transições seguem o padrão:
```css
transition-all duration-200
```

Animações especiais:
- **Spinner**: `animate-spin`
- **Fade in**: `animate-in fade-in`
- **Slide in**: `slide-in-from-top-2`

## Responsividade

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First
Todos os componentes são desenvolvidos com abordagem mobile-first, expandindo para telas maiores.

## Acessibilidade

Todos os componentes seguem as diretrizes WCAG 2.1:
- Contraste adequado (mínimo 4.5:1)
- Navegação por teclado
- Atributos ARIA apropriados
- Textos alternativos para leitores de tela

Ver documento `ACCESSIBILITY.md` para mais detalhes.

## Consistência Visual

### Hierarquia Visual
1. **Títulos de Página**: text-3xl font-bold
2. **Seções**: text-2xl font-semibold
3. **Cards**: text-xl font-semibold
4. **Labels**: text-sm font-medium

### Espaçamento Consistente
- Entre seções: space-y-8
- Entre elementos de formulário: space-y-6
- Entre campos: space-y-2
- Padding de containers: p-8 ou p-6

### Bordas e Cantos
- Raio padrão: `rounded-md` (0.375rem)
- Raio de cards: `rounded-lg` (0.5rem)
- Raio de botões: `rounded-md`

---

**Última atualização**: 2024
**Versão**: 1.0
