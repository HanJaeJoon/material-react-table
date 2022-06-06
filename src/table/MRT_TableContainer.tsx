import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { TableContainer } from '@mui/material';
import { MRT_Table } from './MRT_Table';
import type { MRT_TableInstance } from '..';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface Props {
  tableInstance: MRT_TableInstance;
}

export const MRT_TableContainer: FC<Props> = ({ tableInstance }) => {
  const {
    getState,
    options: { enableStickyHeader, tableId, muiTableContainerProps },
  } = tableInstance;

  const { isFullScreen } = getState();

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);

  const tableContainerProps =
    muiTableContainerProps instanceof Function
      ? muiTableContainerProps({ tableInstance })
      : muiTableContainerProps;

  useIsomorphicLayoutEffect(() => {
    const topToolbarHeight =
      typeof document !== 'undefined'
        ? document?.getElementById(`mrt-${tableId}-toolbar-top`)
            ?.offsetHeight ?? 0
        : 0;

    const bottomToolbarHeight =
      typeof document !== 'undefined'
        ? document?.getElementById(`mrt-${tableId}-toolbar-bottom`)
            ?.offsetHeight ?? 0
        : 0;

    setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight);
  });

  return (
    <TableContainer
      {...tableContainerProps}
      sx={{
        maxWidth: '100%',
        maxHeight: enableStickyHeader
          ? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 2000px)`
          : undefined,
        overflow: 'auto',
        ...tableContainerProps?.sx,
      }}
      style={{
        maxHeight: isFullScreen
          ? `calc(100vh - ${totalToolbarHeight}px)`
          : undefined,
      }}
    >
      <MRT_Table tableInstance={tableInstance} />
    </TableContainer>
  );
};
