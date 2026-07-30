import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "../../lib/utils"

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block text-left">{children}</div>
}

const DropdownMenuTrigger = ({ children, asChild, onClick }: { children: React.ReactNode, asChild?: boolean, onClick?: () => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return React.cloneElement(children as React.ReactElement, {
    onClick: (e: any) => {
      setIsOpen(!isOpen);
      if (onClick) onClick();
    }
  });
}

// Custom simple dropdown because Radix/BaseUI might not be fully configured for Menu
export function Dropdown({ 
  trigger, 
  children,
  align = "start"
}: { 
  trigger: React.ReactNode, 
  children: React.ReactNode,
  align?: "start" | "end"
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "absolute z-[110] mt-2 w-56 rounded-md bg-white shadow-xl ring-1 ring-black/5 focus:outline-none overflow-hidden",
              align === "end" ? "right-0" : "left-0"
            )}
          >
            <div className="py-1" onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({ 
  children, 
  onClick, 
  className 
}: { 
  children: React.ReactNode, 
  onClick?: () => void,
  className?: string
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gold/10 hover:text-navy cursor-pointer transition-colors gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}
