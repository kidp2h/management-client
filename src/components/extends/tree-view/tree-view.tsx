'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import React, { forwardRef, useCallback, useRef } from 'react';
import useResizeObserver from 'use-resize-observer';

import { cn } from '@/lib/utils';

import type { TreeViewElement } from './tree-view-api';
import { CollapseButton, File, Folder, Tree } from './tree-view-api';

// TODO: Add the ability to add custom icons

type TreeViewComponentProps = {} & React.HTMLAttributes<HTMLDivElement>;

type TreeViewProps = {
  initialSelectedId?: string;
  elements: TreeViewElement[];
  indicator?: boolean;
  btnCollapse?: boolean;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  fileIcon?: React.ReactNode;
} & (
  | {
      initialExpendedItems?: string[];
      expandAll?: false;
    }
  | {
      initialExpendedItems?: undefined;
      expandAll: true;
    }
) &
  TreeViewComponentProps;

/**
 * Tree View Docs: {@link: https://shadcn-extension.vercel.app/docs/tree-view}
 */

export const TreeView = ({
  elements,
  className,
  initialSelectedId,
  initialExpendedItems,
  expandAll,
  btnCollapse = false,
  indicator = false,
  closeIcon = <FolderIcon className="size-4" />,
  fileIcon = <FileIcon className="size-4" />,
  openIcon = <FolderOpenIcon className="size-4" />,
}: TreeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: elements.length,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(() => 40, []),
    overscan: 5,
  });

  const { height = getTotalSize(), width } = useResizeObserver({
    ref: containerRef,
  });
  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full rounded-md overflow-hidden py-1 relative',
        className,
      )}
    >
      <Tree
        initialSelectedId={initialSelectedId}
        initialExpendedItems={initialExpendedItems}
        elements={elements}
        style={{ height, width }}
        openIcon={openIcon}
        closeIcon={closeIcon}
        className="size-full overflow-y-auto"
      >
        {getVirtualItems().map(element => (
          <TreeItem
            aria-label="Root"
            key={element.key}
            elements={[elements[element.index]]}
            indicator={indicator}
            fileIcon={fileIcon}
          />
        ))}
        {btnCollapse && (
          <CollapseButton elements={elements} expandAll={expandAll}>
            <span>Expand All</span>
          </CollapseButton>
        )}
      </Tree>
    </div>
  );
};

TreeView.displayName = 'TreeView';

export const TreeItem = forwardRef<
  HTMLUListElement,
  {
    elements?: TreeViewElement[];
    indicator?: boolean;
    fileIcon?: React.ReactNode;
  } & React.HTMLAttributes<HTMLUListElement>
>(
  (
    {
      className,
      elements,
      indicator,
      fileIcon = <FileIcon className="size-4" />,
      ...props
    },
    ref,
  ) => {
    return (
      <ul ref={ref} className="w-full space-y-1 " {...props}>
        {elements &&
          elements.map(element => (
            <li key={element.id} className="w-full">
              {element.children && element.children?.length > 0 ? (
                <Folder
                  element={element.name}
                  value={element.id}
                  isSelectable={element.isSelectable}
                >
                  <TreeItem
                    key={element.id}
                    aria-label={`folder ${element.name}`}
                    elements={element.children}
                    indicator={indicator}
                    fileIcon={fileIcon}
                  />
                </Folder>
              ) : (
                <File
                  value={element.id}
                  aria-label={`File ${element.name}`}
                  key={element.id}
                  isSelectable={element.isSelectable}
                  fileIcon={fileIcon}
                >
                  <span>{element?.name}</span>
                </File>
              )}
            </li>
          ))}
      </ul>
    );
  },
);

TreeItem.displayName = 'TreeItem';
