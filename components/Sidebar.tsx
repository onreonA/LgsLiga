"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  { name: "Ana Panel", href: "/dashboard", icon: "ri-home-line" },
  { name: "Çalışma Takibi", href: "/study-tracker", icon: "ri-edit-line" },
  { name: "Büyük Resim", href: "/big-picture", icon: "ri-calendar-line" },
  { name: "Raporlar", href: "/reports", icon: "ri-bar-chart-line" },
  { name: "Görevler", href: "/quests", icon: "ri-flag-line" },
  { name: "Dijital Kütüphane", href: "/library", icon: "ri-book-open-line" },
  {
    name: "Motivasyon Videoları",
    href: "/motivation-videos",
    icon: "ri-video-line",
  },
  { name: "Boss Savaşları", href: "/boss", icon: "ri-sword-line" },
  { name: "Sınavlar", href: "/exams", icon: "ri-file-text-line" },
  { name: "Mağaza", href: "/shop", icon: "ri-shopping-bag-line" },
  { name: "Ayarlar", href: "/settings", icon: "ri-settings-line" },
];

const menuItems = [
  { icon: "ri-home-line", label: "Ana Sayfa", href: "/" },
  { icon: "ri-book-open-line", label: "Görevler", href: "/quests" },
  { icon: "ri-file-text-line", label: "Sınavlar", href: "/exams" },
  { icon: "ri-line-chart-line", label: "Raporlar", href: "/reports" },
  { icon: "ri-edit-line", label: "Çalışma Takibi", href: "/study-tracker" },
  { icon: "ri-shopping-bag-line", label: "Mağaza", href: "/shop" },
  { icon: "ri-settings-line", label: "Ayarlar", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-40">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <i className="ri-trophy-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div>
              <h1 className="text-xl font-['Pacifico'] text-gray-900">
                LGS Liga
              </h1>
              <p className="text-xs text-gray-500">Şampiyonlar Takımı</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-105"
                  }
                `}
              >
                <i
                  className={`${item.icon} text-lg mr-3 w-5 h-5 flex items-center justify-center`}
                ></i>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl p-4 text-white mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Seviye 15</span>
              <i className="ri-fire-line text-lg w-5 h-5 flex items-center justify-center"></i>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-xs opacity-90">250/400 XP</p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-logout-box-line text-lg mr-3 w-5 h-5 flex items-center justify-center"></i>
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
