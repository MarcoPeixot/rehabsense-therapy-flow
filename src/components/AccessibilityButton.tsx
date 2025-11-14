import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { Contrast } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function AccessibilityButton() {
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={highContrast ? 'default' : 'ghost'}
          size="sm"
          onClick={toggleHighContrast}
          className="w-full justify-start gap-2 transition-all focus:ring-2 focus:ring-sidebar-ring"
          aria-label={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
          aria-pressed={highContrast}
        >
          <Contrast className="h-4 w-4" aria-hidden="true" />
          Alto Contraste
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{highContrast ? 'Desativar' : 'Ativar'} modo de alto contraste para melhor visibilidade</p>
      </TooltipContent>
    </Tooltip>
  );
}
