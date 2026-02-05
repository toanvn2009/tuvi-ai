import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  Sparkles,
  Star,
  Hash,
  Moon,
  Calendar,
  Gift,
  History,
  Settings,
  User,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Heart
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import FortuneTicker from "./FortuneTicker";
import ChatWidget from "./ChatWidget";

const navItems = [
  { href: "/tuvi", label: "Tử Vi", icon: Star },
  { href: "/numerology", label: "Thần Số Học", icon: Hash },
  // { href: "/compatibility", label: "Tương Hợp", icon: Heart },
  { href: "/zodiac", label: "12 Con Giáp", icon: Moon },
  { href: "/auspicious", label: "Ngày Đẹp", icon: Calendar },
  { href: "/tet", label: "Tết 2026", icon: Gift },
  { href: "/rituals", label: "Văn Khấn", icon: Sparkles },
  { href: "/team", label: "Xem Nhóm", icon: Users },
];

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const d = days[date.getDay()];
    const dateStr = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return { d, dateStr, timeStr };
  };

  const { d, dateStr, timeStr } = formatDate(time);

  return (
    <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner shadow-white/5">
      <div className="flex flex-col items-end leading-none">
        <span className="text-[10px] uppercase tracking-widest font-black text-purple-400/80">{d}</span>
        <span className="text-[10px] font-bold text-gray-500">{dateStr}</span>
      </div>
      <div className="w-[1px] h-6 bg-white/10" />
      <span className="text-sm font-mono font-bold text-amber-400 text-glow whitespace-nowrap tabular-nums">
        {timeStr}
      </span>
    </div>
  );
}

function Header() {
  const { user, loading, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#0f172a]/95 backdrop-blur-md shadow-lg shadow-purple-500/10"
        : "bg-[#0f172a]/80 backdrop-blur-sm"
        } border-b border-white/10`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 group-hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white group-hover:animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent leading-none">
                  Tử Vi AI
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] font-black text-gray-500 mt-1">Sát Cánh Cùng Vận Mệnh</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-4 flex-1 justify-center">
              <LiveClock />
              <FortuneTicker />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? "bg-purple-500/20 text-purple-300 shadow-sm"
                        : "text-gray-400 hover:bg-white/10 hover:text-gray-200 hover:scale-105"
                        }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                      {item.label}
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Right side - Auth & Actions */}
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link href="/history">
                    <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-gray-400 hover:text-purple-300 hover:bg-white/10 hover:scale-105 transition-all duration-200">
                      <History className="w-4 h-4" />
                      <span className="hidden md:inline">Lịch sử</span>
                    </Button>
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 hover:scale-105 transition-all duration-200">
                        <Settings className="w-4 h-4" />
                        <span className="hidden md:inline">Admin</span>
                      </Button>
                    </Link>
                  )}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300 max-w-[100px] truncate">
                      {user.name || "Người dùng"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => logout()}
                    className="text-gray-500 hover:text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : null}

              {/* Mobile menu button - Hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <div className="hamburger w-6 h-5 relative flex flex-col justify-between">
                  <span className={`block w-full h-0.5 bg-gray-300 rounded-full transition-all duration-300 ease-out ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                  <span className={`block w-full h-0.5 bg-gray-300 rounded-full transition-all duration-300 ease-out ${mobileMenuOpen ? "opacity-0 scale-0" : ""}`} />
                  <span className={`block w-full h-0.5 bg-gray-300 rounded-full transition-all duration-300 ease-out ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#0f172a] z-50 lg:hidden shadow-2xl transition-transform duration-300 ease-out border-l border-white/10 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-100">Menu</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="py-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Home Link */}
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <div className={`flex items-center gap-3 px-6 py-4 border-b border-white/5 transition-all duration-200 hover:bg-white/10 hover:pl-8 ${location === "/" ? "bg-purple-500/20 text-purple-300" : "text-gray-300"
              }`}>
              <Home className="w-5 h-5" />
              <span className="font-medium">Trang chủ</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
            </div>
          </Link>

          {/* Main Nav Items */}
          {navItems.map((item, index) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-6 py-4 border-b border-white/5 transition-all duration-200 hover:bg-white/10 hover:pl-8 ${isActive ? "bg-purple-500/20 text-purple-300" : "text-gray-300"
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110 text-purple-400" : ""}`} />
                  <span className="font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                </div>
              </Link>
            );
          })}


          {/* User Section */}
          {user && (
            <>
              <div className="h-2 bg-white/5" />

              {/* User Info */}
              <div className="px-6 py-4 bg-purple-500/10 border-b border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-100">{user.name || "Người dùng"}</p>
                    <p className="text-xs text-gray-500">{user.email || "Đã đăng nhập"}</p>
                  </div>
                </div>
              </div>

              <Link href="/history" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 text-gray-300 transition-all duration-200 hover:bg-white/10 hover:pl-8">
                  <History className="w-5 h-5" />
                  <span className="font-medium">Lịch sử tra cứu</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                </div>
              </Link>

              {user.role === "admin" && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 text-purple-400 transition-all duration-200 hover:bg-white/10 hover:pl-8">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Quản trị hệ thống</span>
                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                  </div>
                </Link>
              )}

              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-6 py-4 text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:pl-8"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </>
          )}

          {/* Admin Button for non-logged users */}
          {!user && !loading && (
            <div className="p-6">
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
                Quản trị viên
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Tử Vi AI
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Kết hợp thuật toán tử vi đẩu số truyền thống với công nghệ AI hiện đại, mang đến những phân tích chuyên sâu về vận mệnh.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Tính năng</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tuvi" className="text-sm text-gray-500 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Xem Lá Số Tử Vi
                </Link>
              </li>
              <li>
                <Link href="/numerology" className="text-sm text-gray-500 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Thần Số Học
                </Link>
              </li>
              <li>
                <Link href="/zodiac" className="text-sm text-gray-500 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Tử Vi 12 Con Giáp
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Công cụ</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/auspicious" className="text-sm text-gray-500 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Ngày Đẹp Giờ Tốt
                </Link>
              </li>
              <li>
                <Link href="/tet" className="text-sm text-gray-500 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Công Cụ Tết 2026
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-gray-500 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Lịch Sử Tra Cứu
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Về chúng tôi</h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Tử Vi AI được phát triển với mục tiêu mang đến trải nghiệm xem tử vi và thần số học chính xác, dễ hiểu nhất cho người Việt.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                AI đang hoạt động
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Tử Vi AI. Kết hợp truyền thống và công nghệ.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">Powered by AI</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400 hover:scale-125 transition-transform duration-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <Header />
      <main className="flex-1 page-transition">
        {children}
      </main>
      {showFooter && <Footer />}
      <ChatWidget />
    </div>
  );
}
