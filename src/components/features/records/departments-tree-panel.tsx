import React from 'react';

import { TreeView } from '@/components/extends/tree-view';
import { ResizablePanel } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DepartmentsTreePanel() {
  const elements = [
    {
      id: '1',
      name: 'UBND HCM',
      children: [
        {
          id: '2',
          name: 'Van phong UBND',
        },
        {
          id: '3',
          name: 'Van phong doan dbqh va hdnd',
        },
        {
          id: '4',
          name: 'So Noi Vu',
          children: [
            {
              id: '5',
              name: 'So noi vu 1',
            },
          ],
        },
      ],
    },
  ];
  return (
    <ResizablePanel
      className="w-[30%]"
      defaultSize={30}
      minSize={19}
      maxSize={50}
    >
      <div className="size-full rounded-l-lg bg-primary-foreground  p-2 shadow-lg">
        <Tabs defaultValue="tree" className="h-full p-0">
          <TabsList className="grid h-[4.5%] grid-cols-1 flex-wrap gap-1">
            <TabsTrigger value="tree">Sơ đồ cây đơn vị</TabsTrigger>
            {/* <TabsTrigger value="tree-1">So do cay don vi1</TabsTrigger> */}
          </TabsList>
          <TabsContent value="tree" className="h-full animate-none">
            <TreeView
              className="h-[94.5%] overflow-hidden rounded-md bg-secondary p-2"
              elements={elements}
              expandAll
            />
          </TabsContent>
          <TabsContent value="tree-1" className="h-full animate-none">
            <TreeView
              className="h-[94.5%] overflow-hidden rounded-md bg-secondary p-2"
              elements={elements}
              expandAll
            />
          </TabsContent>
        </Tabs>
      </div>
    </ResizablePanel>
  );
}
