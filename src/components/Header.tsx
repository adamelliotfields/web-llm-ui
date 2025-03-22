import clsx from 'clsx'
import { Github } from 'lucide-react'
import { type HTMLAttributes, memo } from 'react'

import { HREF, TITLE } from '../consts'
import { Button } from './Button'

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const Header = memo(function Header({ className, ...rest }: HeaderProps) {
  return (
    <div
      className={clsx('bg-neutral-50 border-b sticky top-0 z-20', className)}
      {...rest}
    >
      <div className="h-full max-w-screen-lg mx-auto">
        <div className="h-full flex items-center justify-between p-4 md:border-x">
          <a
            href={HREF}
            className={clsx(
              'px-1 py-0.5 font-mono font-extrabold text-lg text-neutral-600 tracking-wide',
              'focus:ring-2 focus:ring-cyan-500 focus-visible:outline-none'
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            {TITLE}
          </a>
          <Button
            className="text-xl"
            href="https://github.com/adamelliotfields/web-llm-ui"
            icon={Github}
            label="GitHub"
          />
        </div>
      </div>
    </div>
  )
})
