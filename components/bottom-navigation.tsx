"use client";

import {
  Home,
  FolderOpen,
  Sparkles,
  Settings,
  Calendar,
  Loader2,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useTransition, useEffect } from "react";
import Image from "next/image";

interface BottomNavigationProps {
  currentTab: "home" | "events" | "collections" | "agent" | "settings";
}

export function BottomNavigation({ currentTab }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [loadingTab, setLoadingTab] = useState<number | null>(null);

  const tabs = [
    { id: "home", icon: Home, label: "Home", path: "/home" },
    { id: "events", icon: Calendar, label: "Events", path: "/events" },
    {
      id: "agent",
      icon: null,
      imageSrc: "/echoo-logo-white-sm.png",
      activeImageSrc: "/echoo-logo-sm.png",
      label: "Echoo",
      path: "/agent",
      special: true,
    },
    {
      id: "collections",
      icon: FolderOpen,
      label: "Collections",
      path: "/collections",
    },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  const activeIndex = useMemo(() => {
    const index = tabs.findIndex((tab) => pathname === tab.path);
    return index >= 0 ? index : 0;
  }, [pathname]);

  // Clear loading state when pathname changes (page has loaded)
  useEffect(() => {
    setLoadingTab(null);
  }, [pathname]);

  const handleItemClick = (index: number) => {
    // Don't set loading state if clicking on the already active tab
    if (index === activeIndex) {
      return;
    }

    // Immediately set loading state for page-level loader
    setLoadingTab(index);

    startTransition(() => {
      router.push(tabs[index].path);
    });
  };

  return (
    <>
      {/* Page-level loading overlay */}
      {loadingTab !== null && (
        <div className="page-loading-overlay">
          <div className="loading-content">
            <Loader2 className="loading-spinner-large" />
            <p className="loading-text">Loading...</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <nav className="interactive-dock" role="navigation">
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            const isEchoo = tab.special;
            const IconComponent = tab.icon;

            return (
              <button
                key={tab.id}
                className={`dock-item ${isActive ? "active" : ""} ${
                  isEchoo ? "echoo-special" : ""
                }`}
                onClick={() => handleItemClick(index)}
              >
                <div className="dock-icon">
                  {tab.imageSrc ? (
                    <Image
                      src={
                        isActive && tab.activeImageSrc
                          ? tab.activeImageSrc
                          : tab.imageSrc
                      }
                      alt={tab.label}
                      width={60}
                      height={60}
                      className={`icon echoo-logo ${isActive ? "active" : ""}`}
                    />
                  ) : IconComponent ? (
                    <IconComponent className="icon" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

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
          background: linear-gradient(
            135deg,
            rgba(255, 107, 71, 0.2),
            rgba(0, 139, 139, 0.2)
          );
          transform: translateY(-4px);
        }

        .dock-item.active::after {
          content: "";
          position: absolute;
          bottom: -6px; /* Adjusted position */
          left: 50%;
          transform: translateX(-50%);
          width: 20px; /* Smaller indicator */
          height: 2px;
          background: linear-gradient(90deg, #ff6b47, #008b8b);
          border-radius: 1px;
        }

        .echoo-special {
          transform: scale(1.3) translateY(-8px); /* Lift the logo above the dock */
          margin: 0 8px;
          z-index: 10;
          position: relative;
        }

        .echoo-special::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: radial-gradient(
            circle,
            rgba(255, 107, 71, 0.1) 0%,
            transparent 70%
          );
          border-radius: 50%;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .echoo-special:hover::before {
          opacity: 1;
        }

        .echoo-special.active::before {
          opacity: 1;
          background: radial-gradient(
            circle,
            rgba(255, 107, 71, 0.2) 0%,
            transparent 70%
          );
        }

        .echoo-special:hover {
          transform: scale(1.35) translateY(-10px);
        }

        .echoo-special.active {
          transform: scale(1.35) translateY(-12px);
        }

        .dock-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px; /* Reduced icon container size */
          height: 20px;
        }

        .echoo-special .dock-icon {
          width: 60px; /* Larger for echoo logo */
          height: 60px;
          position: relative;
        }

        .icon {
          width: 16px; /* Reduced icon size */
          height: 16px;
          color: #fdfcf0;
          transition: all 0.3s ease;
        }

        .echoo-special .icon {
          width: 60px; /* Larger echoo logo */
          height: 60px;
        }

        .dock-item.active .icon {
          color: #ff6b47;
          filter: drop-shadow(0 0 8px rgba(255, 107, 71, 0.5));
        }

        .echoo-logo {
          transition: all 0.3s ease;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .dock-item.active .echoo-logo {
          filter: drop-shadow(0 6px 12px rgba(255, 107, 71, 0.4));
        }

        /* Page-level loading overlay */
        .page-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-in-out;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          background: rgba(44, 62, 80, 0.95);
          padding: 32px;
          border-radius: 16px;
          border: 1px solid rgba(255, 107, 71, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .loading-spinner-large {
          width: 48px;
          height: 48px;
          color: #ff6b47;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: #fdfcf0;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
    </>
  );
}
