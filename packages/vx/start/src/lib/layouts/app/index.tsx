import type { ComponentPropsWithoutRef, ReactNode } from 'react'

const cx = (...classNames: Array<false | null | string | undefined>) => {
  return classNames.filter(Boolean).join(' ')
}

export type AppShellProps = {
  children: ReactNode
  contentClassName?: string
  footer?: ReactNode
  footerClassName?: string
  header?: ReactNode
  headerClassName?: string
  mainClassName?: string
  sidebar?: ReactNode
  sidebarClassName?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>

export const AppShell = ({
  children,
  className,
  contentClassName,
  footer,
  footerClassName,
  header,
  headerClassName,
  mainClassName,
  sidebar,
  sidebarClassName,
  ...props
}: AppShellProps) => {
  return (
    <div
      data-slot="app-shell"
      className={cx('bg-background text-foreground min-h-svh', className)}
      {...props}>
      <div data-slot="app-shell-frame" className="flex min-h-svh">
        {sidebar ? (
          <aside
            data-slot="app-sidebar"
            className={cx(
              'bg-background hidden w-64 shrink-0 border-r md:block',
              sidebarClassName
            )}>
            {sidebar}
          </aside>
        ) : null}
        <div
          data-slot="app-main"
          className={cx('flex min-w-0 flex-1 flex-col', mainClassName)}>
          {header ? (
            <header
              data-slot="app-header"
              className={cx(
                'bg-background shrink-0 border-b',
                headerClassName
              )}>
              {header}
            </header>
          ) : null}
          <main
            data-slot="app-content"
            className={cx('min-w-0 flex-1', contentClassName)}>
            {children}
          </main>
          {footer ? (
            <footer
              data-slot="app-footer"
              className={cx(
                'bg-background shrink-0 border-t',
                footerClassName
              )}>
              {footer}
            </footer>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export const AppLayout = AppShell
