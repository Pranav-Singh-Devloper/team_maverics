import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const SidebarContext = React.createContext({
  isOpen: false,
  toggle: () => {},
})

const useSidebar = () => {
  return React.useContext(SidebarContext)
}

export function SidebarProvider({ children, isOpen, onToggle }) {
  return (
    <SidebarContext.Provider value={{ isOpen, toggle: onToggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = React.forwardRef(({ className, ...props }, ref) => {
  const { isOpen } = useSidebar()
  return (
    <aside
      ref={ref}
      className={cn(
        "fixed left-0 top-0 z-50 h-screen border-r bg-background transition-[width] duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-64" : "w-16",
        className
      )}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

export const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-full flex-col py-4", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-3 pb-4", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn("flex flex-1 flex-col gap-1 px-3", className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const sidebarMenuItemVariants = cva(
  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        active: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const SidebarMenuItem = React.forwardRef(
  ({ className, variant, children, ...props }, ref) => {
    const { isOpen } = useSidebar()
    return (
      <button
        ref={ref}
        className={cn(
          sidebarMenuItemVariants({ variant }),
          !isOpen && "justify-center px-2",
          "overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto px-3 pt-4", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"
