import { cn } from '@/lib/utils'
import { forwardRef, type HTMLProps } from 'react'

export const Spinner = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ className, ...rest }, ref) => {
    const spinnerClass = cn(
      'animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4',
      className,
    )

    return <div ref={ref} className={spinnerClass} {...rest} />
  },
)

Spinner.displayName = 'Spinner'
