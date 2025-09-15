'use client';

import React from 'react';
import type * as TippyJs from 'tippy.js';
import { useMediaQuery } from 'usehooks-ts';

import { createTippy } from './core';

import { TippyGroupContext } from './tippy-group';

type TippyProps = {
  readonly children?: React.ReactNode;
  readonly className?: string;
} & Partial<TippyJs.CreateSingletonProps>;

export function Tippy(props: TippyProps) {
  const { children, className, ...tippyProps } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const groupContext = React.useContext(TippyGroupContext);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  React.useEffect(() => {
    if (ref.current) {
      const newTippy = createTippy(ref.current, {
        ...groupContext.tippyProps,
        ...tippyProps,
        arrow: false,
      });
      if (groupContext?.addTippy) {
        return groupContext.addTippy(newTippy);
      }

      return () => {
        newTippy.hide();
        newTippy.destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupContext, props]);

  return (
    <div ref={isDesktop ? ref : undefined} className={className}>
      {children}
    </div>
  );
}

export const MemoizedTippy = React.memo(Tippy);
MemoizedTippy.displayName = 'Tippy';
