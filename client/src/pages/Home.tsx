import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { 
  Sparkles, 
  Star, 
  Calendar, 
  Gift, 
  Hash,
  ChevronRight,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Heart,
  Moon,
  Sun
} from "lucide-react";

const features = [
  {
    id: "tuvi",
    title: "Tử Vi Đẩu Số",
    description: "Luận giải 12 cung số, vận hạn chi tiết với độ chính xác cao nhờ thuật toán An Sao chân truyền.",
    icon: Star,
    href: "/tuvi",
    color: "text-amber-400",
    bgClass: "from-amber-500/20 to-purple-900/40"
  },
  {
    id: "numerology",
    title: "Thần Số Học",
    description: "Khám phá bản đồ đường đời, sứ mệnh và tiềm năng ẩn giấu qua những con số.",
    icon: Hash,
    href: "/numerology",
    color: "text-blue-400",
    bgClass: "from-blue-500/20 to-indigo-900/40"
  },
  {
    id: "compatibility",
    title: "Bói Tình Duyên",
    description: "Phân tích độ hợp nhau dựa trên Ngũ Hành, Thiên Can Địa Chi và Thần Số.",
    icon: Heart,
    href: "/compatibility",
    color: "text-pink-400",
    bgClass: "from-pink-500/20 to-rose-900/40"
  },
  {
    id: "zodiac",
    title: "12 Con Giáp 2026",
    description: "Dự báo vận niên Bính Ngọ 2026 chi tiết cho từng tuổi.",
    icon: Sparkles,
    href: "/zodiac",
    color: "text-purple-400",
    bgClass: "from-purple-500/20 to-violet-900/40"
  },
  {
    id: "auspicious",
    title: "Xem Ngày Tốt",
    description: "Chọn ngày lành tháng tốt để khởi sự, kết hôn, động thổ...",
    icon: Calendar,
    href: "/auspicious",
    color: "text-emerald-400",
    bgClass: "from-emerald-500/20 to-teal-900/40"
  },
  {
    id: "tet",
    title: "Gieo Quẻ Tết",
    description: "Xông đất, hướng xuất hành và những tục lệ cầu may đầu năm.",
    icon: Gift,
    href: "/tet",
    color: "text-red-400",
    bgClass: "from-red-500/20 to-orange-900/40"
  }
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-3xl animate-spin-slow" />
        </div>

        <div className="container mx-auto relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-purple-200 text-sm font-medium mb-8 animate-fade-in-down shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Sparkles className="w-4 h-4 text-amber-400 animate-twinkle" />
              <span>Kết tinh Cổ Học & Trí Tuệ Nhân Tạo</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up font-serif tracking-tight">
              Khai Mở <br />
              <span className="bg-gradient-to-r from-amber-200 via-purple-300 to-amber-200 bg-clip-text text-transparent bg-300% animate-gradient">
                Thiên Cơ Vận Mệnh
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
              Hệ thống luận giải <strong>Tử Vi & Thần Số Học</strong> chuyên sâu, 
              kết hợp tinh hoa thuật toán cổ truyền và sức mạnh phân tích của AI hiện đại.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-200">
              <Link href="/tuvi">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-lg px-8 py-6 h-auto rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all duration-300 group ring-1 ring-white/20">
                  <Star className="w-5 h-5 mr-2 group-hover:rotate-45 transition-transform text-amber-300" />
                  Lập Lá Số Tử Vi
                </Button>
              </Link>
              <Link href="/numerology">
                <Button variant="outline" className="glass border-white/10 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto rounded-xl backdrop-blur-md group hover:border-purple-500/50 transition-all duration-300">
                  <Hash className="w-5 h-5 mr-2 text-blue-400 group-hover:scale-110 transition-transform" />
                  Tra Cứu Thần Số
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-white">
              Công Cụ Huyền Học
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto opacity-50" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Link key={feature.id} href={feature.href}>
                <div 
                  className="glass-card h-full p-6 rounded-2xl group cursor-pointer border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Hover Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner ring-1 ring-white/10">
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors font-serif">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300">
                      Xem ngay
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Highlights */}
      <section className="py-20 relative overflow-hidden border-y border-white/5 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="inline-flex p-4 rounded-full glass mb-6 ring-1 ring-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                <Zap className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Tiên Tiến</h3>
              <p className="text-gray-400">Phân tích sâu sắc, không rập khuôn máy móc như phần mềm cũ.</p>
            </div>
            <div className="p-6">
              <div className="inline-flex p-4 rounded-full glass mb-6 ring-1 ring-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bảo Mật Tuyệt Đối</h3>
              <p className="text-gray-400">Dữ liệu cá nhân của bạn được mã hóa và không chia sẻ với bên thứ ba.</p>
            </div>
            <div className="p-6">
              <div className="inline-flex p-4 rounded-full glass mb-6 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <Clock className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Kết Quả Tức Thì</h3>
              <p className="text-gray-400">Lập lá số và nhận luận giải chi tiết chỉ trong vài giây.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </Layout>
  );
}
