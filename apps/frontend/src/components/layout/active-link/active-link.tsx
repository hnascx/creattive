"use client"

import { cn } from "@/lib/utils"
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"

type ActiveLinkProps = {
  children: React.ReactNode
} & LinkProps

export const ActiveLink = ({ children, href, ...rest }: ActiveLinkProps) => {
  const linkPath = (typeof href === "string" ? href : href.pathname) ?? ""

  const pathname = usePathname()

  const isActive = pathname === linkPath || pathname?.startsWith(`${linkPath}/`)

  return (
    <Link
      {...rest}
      href={href}
      className={cn(
        "text-xs md:text-sm hover:text-gray-700 transition-colors dark:hover:text-blue-200",
        isActive ? "dark:text-blue-200" : "dark:text-gray-100"
      )}
    >
      {children}
    </Link>
  )
}
