'use client'
import React, { useState } from 'react'
import {
  ImageIcon,
  FileText,
  Image as ImageConvert,
  Code,
  BookOpen,
  FileJson,
  Edit,
  Mail,
  Github
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
export interface SidebarNavProps {
  children: React.ReactNode
}

export function SidebarNav({ children }: SidebarNavProps) {
  // 初始化时直接从 localStorage 读取，避免闪烁
  const [isCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar-collapsed')
      return savedState ? JSON.parse(savedState) : true
    }
    return true
  })
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const navItems: Array<{
    href: string
    icon: React.ComponentType<{ className?: string }>
    label: string
    description: string
    external?: boolean
  }> = [
      {
        href: '/png-to-pdf',
        icon: ImageIcon,
        label: 'png转pdf',
        description: ''
      },
      {
        href: '/pdf-to-png',
        icon: FileText,
        label: 'pdf转png',
        description: ''
      },
      {
        href: '/jpg-to-png',
        icon: ImageConvert,
        label: 'jpg转png',
        description: ''
      },
      {
        href: '/jpg,png-yuanma',
        icon: Code,
        label: 'jpg,png源码',
        description: ''
      },
      {
        href: '/json-editor',
        icon: Edit,
        label: 'json编辑器',
        description: ''
      },
      {
        href: '/markdown-guide',
        icon: BookOpen,
        label: 'markdown指南',
        description: ''
      },
      {
        href: '/json-guide',
        icon: FileJson,
        label: 'json指南',
        description: ''
      },
      {
        href: '/feedback',
        icon: Mail,
        label: '意见',
        description: ''
      }
    ]

  // 组件级显示宽度：当用户折叠时，鼠标悬停临时展开
  const displayedCollapsed = isCollapsed && !isHovered ? true : false

  return (
    <div className="flex h-full">
      {/* 侧边导航 */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${displayedCollapsed ? 'w-16' : 'w-50'}
          fixed top-0 left-0 h-screen z-40
          transition-all duration-200 ease-in-out
          border-r border-slate-200 bg-gradient-to-b from-slate-50 to-gray-50 backdrop-blur-sm
        `}
      >
        <div className="p-4 h-full flex flex-col">
          <nav className="space-y-6 mt-8 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              const linkContent = (
                <div
                  className={`
                    w-full flex items-center rounded-md cursor-pointer transition-colors duration-150
                    justify-start
                    ${isActive
                      ? 'bg-slate-500 text-white shadow-md'
                      : 'hover:bg-slate-100 hover:text-slate-600'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex-shrink-0 w-8 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`text-left min-w-0 px-2 flex-1 transition-all duration-200 ease-in-out ${displayedCollapsed ? 'max-w-0 opacity-0 overflow-hidden' : 'max-w-[160px] opacity-100'}`}>
                    <div className="font-medium truncate">{item.label}</div>
                    <div className="text-xs opacity-70 truncate">{item.description}</div>
                  </div>
                </div>
              )

              return (
                <div key={item.href}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                      {linkContent}
                    </a>
                  ) : (
                    <Link href={item.href} className="block">
                      {linkContent}
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>

          {/* GitHub 链接 */}
          <div className="mt-auto mb-4">
            <a
              href="https://github.com/ZZi0330/File-conversion"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 transition-colors duration-150"
              title="GitHub"
            >
              <Github className="h-5 w-5 text-slate-600" />
            </a>
          </div>

        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}