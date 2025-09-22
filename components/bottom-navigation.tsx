"use client"

import { Home, FolderOpen, Sparkles, Settings, Calendar } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useMemo } from "react"

interface BottomNavigationProps {
  currentTab: "home" | "events" | "collections" | "agent" | "settings"
}

export function BottomNavigation({ currentTab }: BottomNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { id: "home", icon: Home, label: "Home", path: "/home" },
    { id: "events", icon: Calendar, label: "Events", path: "/events" },
    { id: "agent", icon: Sparkles, label: "Echoo", path: "/agent", special: true },
    { id: "collections", icon: FolderOpen, label: "Collections", path: "/collections" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ]

  const activeIndex = useMemo(() => {
    const index = tabs.findIndex((tab) => pathname === tab.path)
    return index >= 0 ? index : 0
  }, [pathname])

  const handleItemClick = (index: number) => {
    router.push(tabs[index].path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <nav className="interactive-dock" role="navigation">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex
          const isEchoo = tab.special
          const IconComponent = tab.icon

          return (
            <button
              key={tab.id}
              className={`dock-item ${isActive ? "active" : ""} ${isEchoo ? "echoo-special" : ""}`}
              onClick={() => handleItemClick(index)}
            >
              <div className="dock-icon">
                <IconComponent className="icon" />
              </div>
            </button>
          )
        })}
      </nav>

      <style jsx>{`
        .interactive-dock {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: rgba(44, 62, 80, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 107, 71, 0.2);
          padding: 12px 16px; /* Reduced padding since no text */
          margin: 0 16px 16px;
          border-radius: 20px; /* Slightly smaller border radius */
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .dock-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px; /* Reduced padding for compact design */
          border: none;
          background: transparent;
          border-radius: 12px; /* Smaller border radius */
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          min-width: 44px; /* Reduced min-width */
          height: 44px; /* Fixed height for consistency */
        }

        .dock-item:hover {
          transform: translateY(-2px);
          background: rgba(255, 107, 71, 0.1);
        }

        .dock-item.active {
          background: linear-gradient(135deg, rgba(255, 107, 71, 0.2), rgba(0, 139, 139, 0.2));
          transform: translateY(-4px);
        }

        .dock-item.active::after {
          content: '';
          position: absolute;
          bottom: -6px; /* Adjusted position */
          left: 50%;
          transform: translateX(-50%);
          width: 20px; /* Smaller indicator */
          height: 2px;
          background: linear-gradient(90deg, #FF6B47, #008B8B);
          border-radius: 1px;
        }

        .echoo-special {
          transform: scale(1.3); /* Increased scale to make echoo more prominent */
          margin: 0 8px;
        }

        .echoo-special:hover {
          transform: scale(1.35) translateY(-2px);
        }

        .echoo-special.active {
          transform: scale(1.35) translateY(-4px);
        }

        .dock-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px; /* Reduced icon container size */
          height: 20px;
        }

        .echoo-special .dock-icon {
          width: 24px; /* Slightly larger for echoo */
          height: 24px;
        }

        .icon {
          width: 16px; /* Reduced icon size */
          height: 16px;
          color: #FDFCF0;
          transition: all 0.3s ease;
        }

        .echoo-special .icon {
          width: 20px; /* Larger echoo icon */
          height: 20px;
        }

        .dock-item.active .icon {
          color: #FF6B47;
          filter: drop-shadow(0 0 8px rgba(255, 107, 71, 0.5));
        }

        /* Removed all dock-text styles since text is hidden */

        @media (max-width: 480px) {
          .interactive-dock {
            margin: 0 8px 8px;
            padding: 10px 8px; /* Reduced mobile padding */
          }
          
          .dock-item {
            min-width: 40px; /* Smaller mobile size */
            height: 40px;
            padding: 8px;
          }
          
          .echoo-special {
            margin: 0 4px;
          }
        }
      `}</style>
    </div>
  )
}
