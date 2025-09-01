import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageTitleProps {
  title: string
  description?: string
  icon?: ReactNode
  className?: string
  actions?: ReactNode
}

export function PageTitle({ 
  title, 
  description, 
  icon, 
  className, 
  actions 
}: PageTitleProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}
