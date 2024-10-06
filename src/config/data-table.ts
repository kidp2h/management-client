import { MixIcon } from '@radix-ui/react-icons';

export type DataTableConfig = typeof dataTableConfig;

export const dataTableConfig = {
  comparisonOperators: [
    { label: 'Chứa', value: 'ilike' as const },
    { label: 'Không chứa', value: 'notIlike' as const },
    { label: 'Phải Là', value: 'eq' as const },
    { label: 'Không phải là', value: 'notEq' as const },
    { label: 'Bắt đầu bằng', value: 'startsWith' as const },
    { label: 'Kết thúc bằng', value: 'endsWith' as const },
    { label: 'Trống', value: 'isNull' as const },
    { label: 'Không phải rỗng', value: 'isNotNull' as const },
  ],
  selectableOperators: [
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'notEq' as const },
    { label: 'Is empty', value: 'isNull' as const },
    { label: 'Is not empty', value: 'isNotNull' as const },
  ],
  logicalOperators: [
    {
      label: 'And',
      value: 'and' as const,
      description: 'All conditions must be met',
    },
    {
      label: 'Or',
      value: 'or' as const,
      description: 'At least one condition must be met',
    },
  ],
  featureFlags: [
    {
      label: 'Tìm kiếm nâng cao',
      value: 'advancedFilter' as const,
      icon: MixIcon,
      tooltipTitle: 'Bật/tắt chức năng tìm kiếm nâng cao',
      tooltipDescription:
        'Tìm kiếm nâng cao giúp bạn tìm kiếm dữ liệu một cách linh hoạt hơn ',
    },
  ],
};
