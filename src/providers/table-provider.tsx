import React, { useMemo } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { dataTableConfig } from '@/config/data-table';
import type { FeatureFlagValue } from '@/types';

interface TableContextProps {
  featureFlags: FeatureFlagValue[];
  setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlagValue[]>>;
}

const TableContext = React.createContext<TableContextProps>({
  featureFlags: [],
  setFeatureFlags: () => {},
});

export function useTable() {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
}

export interface TableProviderProps {
  children: React.ReactNode;
  isHidden: boolean;
}
export function TableProvider({ children, isHidden }: TableProviderProps) {
  const [featureFlags, setFeatureFlags] = React.useState<FeatureFlagValue[]>(
    [],
  );

  return (
    <TableContext.Provider
      value={useMemo(() => {
        return {
          featureFlags,
          setFeatureFlags,
        };
      }, [featureFlags, setFeatureFlags])}
    >
      <div className="w-full overflow-x-auto">
        {!isHidden && (
          <ToggleGroup
            type="multiple"
            variant="outline"
            size="sm"
            value={featureFlags}
            onValueChange={(value: FeatureFlagValue[]) =>
              setFeatureFlags(value)
            }
            className="w-fit"
          >
            {dataTableConfig.featureFlags.map(flag => (
              <Tooltip key={flag.value} delayDuration={250}>
                <ToggleGroupItem
                  value={flag.value}
                  className="whitespace-nowrap px-3 text-sm"
                  asChild
                >
                  <TooltipTrigger>
                    <flag.icon
                      className="mr-2 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {flag.label}
                  </TooltipTrigger>
                </ToggleGroupItem>
                <TooltipContent
                  align="start"
                  side="bottom"
                  sideOffset={6}
                  className="flex max-w-60 flex-col space-y-1.5 border py-2 font-semibold text-foreground"
                >
                  <div>{flag.tooltipTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    {flag.tooltipDescription}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        )}
      </div>
      {children}
    </TableContext.Provider>
  );
}
