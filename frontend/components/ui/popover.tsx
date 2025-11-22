"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({
  children,
  asChild,
  ...props
}: {
  children: React.ReactNode
  asChild?: boolean
} & React.HTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("PopoverTrigger must be used within Popover")

  const handleClick = () => {
    context.setOpen(!context.open)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      ...props,
    })
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  ...props
}: {
  className?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("PopoverContent must be used within Popover")

  const contentRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })

  React.useEffect(() => {
    if (!context.open || !contentRef.current) return

    const trigger = contentRef.current.parentElement?.querySelector('[role="button"]')
    if (trigger) {
      const rect = trigger.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      
      let top = rect.bottom + sideOffset
      let left = rect.left

      if (align === "center") {
        left = rect.left + rect.width / 2 - contentRect.width / 2
      } else if (align === "end") {
        left = rect.right - contentRect.width
      }

      // Ensure popover stays within viewport
      if (left + contentRect.width > window.innerWidth) {
        left = window.innerWidth - contentRect.width - 8
      }
      if (left < 8) left = 8

      if (top + contentRect.height > window.innerHeight) {
        top = rect.top - contentRect.height - sideOffset
      }

      setPosition({ top, left })
    }
  }, [context.open, align, sideOffset])

  React.useEffect(() => {
    if (!context.open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        context.setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [context])

  if (!context.open) return null

  return (
    <div
      ref={contentRef}
      className={cn(
        "fixed z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      style={{ 
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      data-state={context.open ? "open" : "closed"}
      {...props}
    >
      {children}
    </div>
  )
}

function PopoverAnchor({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block">{children}</div>
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
