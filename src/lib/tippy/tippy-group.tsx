import React from 'react';
import type * as Tippy from 'tippy.js';

import { useGroupTippy } from './use-group-tippy';

type TippyGroupProps = {
  readonly children?: React.ReactNode;
} & Partial<Tippy.CreateSingletonProps>;

export const defaultContextValue = {
  tippyProps: {},
};

export const TippyGroupContext = React.createContext<{
  tippyProps: Partial<Tippy.CreateSingletonProps>;
  addTippy?: (tippyInstance: Tippy.Instance) => () => void;
}>(defaultContextValue);

export function TippyGroup(props: TippyGroupProps) {
  const { children, ...tippyProps } = props;

  const { addTippy } = useGroupTippy();

  const contextValue = React.useMemo(
    () => ({
      tippyProps,
      addTippy,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addTippy, props]
  );

  return (
    <TippyGroupContext.Provider value={contextValue}>
      {children}
    </TippyGroupContext.Provider>
  );
}

export const MemoizedTippyGroup = React.memo(TippyGroup);
MemoizedTippyGroup.displayName = 'TippyGroup';
