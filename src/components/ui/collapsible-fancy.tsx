import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface CollapsibleFancyProps {
  name: string;
  children?: React.ReactNode;
}
export default function CollapsibleFancy({
  name,
  children,
}: CollapsibleFancyProps) {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <Collapsible onOpenChange={setOpen} defaultOpen className="mb-5">
      <CollapsibleTrigger className="mb-3 flex w-full flex-row items-center justify-between rounded-md bg-muted p-2 text-card-foreground">
        {name}
        {isOpen ? (
          <ChevronDown className="size-5" />
        ) : (
          <ChevronUp className="size-5" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent px-5">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
