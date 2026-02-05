import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { Sparkles, Gift, Loader2, Home, Palette, Banknote } from "lucide-react";
import { Streamdown } from "streamdown";

function XongDatTab() {
  const [birthYear, setBirthYear] = useState("");
  const [result, setResult] = useState<any>(null);

  const xongDatMutation = trpc.tet.xongDat.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthYear) return;
    xongDatMutation.mutate({ ownerBirthYear: parseInt(birthYear) });
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <div className="glass-card bg-[#0f172a]/80 border-white/10 max-w-md mx-auto animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <Home className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Xông Đất Đầu Năm</h3>
            <p className="text-gray-400 text-sm">Tìm tuổi đẹp nhất để xông đất, mang tài lộc về nhà</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ownerYear" className="text-sm font-semibold text-gray-300 ml-1">Năm sinh gia chủ</Label>
              <Input
                id="ownerYear"
                type="number"
                placeholder="VD: 1990"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="h-12 bg-white/5 border-white/10 text-white focus:border-red-500/50 rounded-xl"
                min="1900"
                max="2100"
                required
              />
            </div>
            <Button type="submit" className="h-14 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-red-900/20 w-full rounded-xl transition-all duration-300 font-bold tracking-wide" disabled={xongDatMutation.isPending}>
              {xongDatMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang Gieo Quẻ...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Xem Tuổi Xông Đất
                </>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-start">
            <Button variant="outline" onClick={() => setResult(null)} className="h-10 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl transition-all">
              ← Kiểm tra tuổi khác
            </Button>
          </div>

          <div className="glass-card bg-[#0f172a]/60 border-red-500/20 relative overflow-hidden p-8 md:p-10">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            <div className="result-header border-b border-white/5 pb-6 mb-8 relative z-10 flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-500/10">
                <Home className="w-8 h-8 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-white tracking-tight uppercase">Kết Quả Xông Đất</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                    Gia chủ: {result.ownerZodiac}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
                    Mệnh {result.ownerElement}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-bold border border-white/10">
                    Năm Bính Ngọ 2026
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-transform hover:scale-[1.02] duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-emerald-300 text-lg">Tuổi Đại Cát</h4>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {result.suitableZodiacs.map((zodiac: string) => (
                    <span key={zodiac} className="px-4 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 text-sm font-bold border border-emerald-500/20 shadow-sm">
                      {zodiac}
                    </span>
                  ))}
                </div>
                <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Năm sinh hợp nhất</p>
                  <p className="text-emerald-200 font-bold text-lg leading-tight">
                    {result.suitableAges && result.suitableAges.length > 0 
                      ? result.suitableAges.join(", ") 
                      : "Đang tính toán..."}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-transform hover:scale-[1.02] duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-red-300 text-lg">Tuổi Đại Kỵ</h4>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {result.avoidZodiacs.map((zodiac: string) => (
                    <span key={zodiac} className="px-4 py-1.5 rounded-xl bg-red-500/10 text-red-300 text-sm font-bold border border-red-500/20 shadow-sm">
                      {zodiac}
                    </span>
                  ))}
                </div>
                <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Các năm tuyệt đối tránh</p>
                  <p className="text-red-300 font-bold text-lg leading-tight">
                    {result.avoidAges && result.avoidAges.length > 0 
                      ? result.avoidAges.join(", ") 
                      : "Đang tính toán..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card bg-[#0f172a]/80 border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles className="w-24 h-24 text-red-500" />
            </div>
            <div className="result-header border-b border-white/5 pb-6 mb-8 relative z-10 flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/10">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight uppercase">Cẩm Nang Chi Tiết</h3>
                <p className="text-gray-400 font-medium mt-1">Luận giải chuyên sâu từ Chuyên gia Phong Thủy AI</p>
              </div>
            </div>
            <div className="prose prose-invert prose-red max-w-none relative z-10">
              <Streamdown>{result.aiAdvice}</Streamdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LuckyColorsTab() {
  const [birthYear, setBirthYear] = useState("");
  
  const luckyColors = trpc.tet.luckyColors.useQuery(
    { birthYear: parseInt(birthYear) },
    { enabled: birthYear.length === 4 && parseInt(birthYear) >= 1900 }
  );

  return (
    <div className="space-y-6">
      <div className="glass-card bg-[#0f172a]/80 border-white/10 max-w-md mx-auto animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Palette className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Màu Sắc May Mắn</h3>
          <p className="text-gray-400 text-sm">Tìm sắc màu vượng khí cho khởi đầu rực rỡ</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="colorYear" className="text-sm font-semibold text-gray-300 ml-1">Năm sinh của bạn</Label>
          <Input
            id="colorYear"
            type="number"
            placeholder="VD: 1990"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="h-12 bg-white/5 border-white/10 text-white focus:border-amber-500/50 rounded-xl"
            min="1900"
            max="2100"
          />
        </div>
      </div>

      {luckyColors.data && (
        <div className="glass-card bg-[#0f172a]/60 border-amber-500/20 max-w-2xl mx-auto animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
              <Palette className="w-24 h-24 text-amber-500" />
          </div>
          <div className="result-header border-b border-white/5 pb-6 mb-8 flex flex-col md:flex-row md:items-center gap-5">
            <div className="result-icon bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
              <Palette className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Màu Sắc Cho {luckyColors.data.zodiac}</h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20 mt-1">
                Mệnh {luckyColors.data.element}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-emerald-400 uppercase tracking-widest text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Màu May Mắn
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {luckyColors.data.luckyColors.map((color: string) => (
                  <div key={color} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 transition-transform active:scale-95 cursor-pointer hover:bg-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/40 border border-emerald-500/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    </div>
                    <span className="font-semibold text-gray-200">{color}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-red-400 uppercase tracking-widest text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Màu Nên Tránh
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {luckyColors.data.avoidColors.map((color: string) => (
                  <div key={color} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 transition-transform active:scale-95 cursor-pointer hover:bg-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400/20 to-pink-500/40 border border-red-500/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    </div>
                    <span className="font-semibold text-gray-200">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LuckyMoneyTab() {
  const [birthYear, setBirthYear] = useState("");
  
  const luckyMoney = trpc.tet.luckyMoney.useQuery(
    { recipientBirthYear: parseInt(birthYear) },
    { enabled: birthYear.length === 4 && parseInt(birthYear) >= 1900 }
  );

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card bg-[#0f172a]/80 border-white/10 max-w-md mx-auto animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.15)]">
            <Banknote className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Gợi Ý Lì Xì</h3>
          <p className="text-gray-400 text-sm">Tra cứu số tiền lì xì đại cát cho người thân</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipientYear" className="text-sm font-semibold text-gray-300 ml-1">Năm sinh người nhận</Label>
          <Input
            id="recipientYear"
            type="number"
            placeholder="VD: 2010"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="h-12 bg-white/5 border-white/10 text-white focus:border-yellow-500/50 rounded-xl"
            min="1900"
            max="2100"
          />
        </div>
      </div>

      {luckyMoney.data && (
        <div className="glass-card bg-[#0f172a]/60 border-yellow-500/20 max-w-2xl mx-auto animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
              <Banknote className="w-24 h-24 text-yellow-500" />
          </div>
          <div className="result-header border-b border-white/5 pb-6 mb-8 flex flex-col md:flex-row md:items-center gap-5">
            <div className="result-icon bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
              <Banknote className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Lì Xì Cho {luckyMoney.data.zodiac}</h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20 mt-1">
                Mệnh {luckyMoney.data.element} • Số may mắn: {luckyMoney.data.luckyNumbers.join(", ")}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 font-bold text-yellow-400 uppercase tracking-widest text-xs">
                Mệnh Giá Gợi Ý (VND)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {luckyMoney.data.suggestedAmounts.slice(0, 8).map((amount: number) => (
                <div
                  key={amount}
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/10 text-center hover:border-yellow-500/30 transition-all duration-300 active:scale-95 cursor-default overflow-hidden"
                >
                  <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative font-bold text-yellow-300 text-lg">
                    {formatMoney(amount).replace("₫", "").trim()}
                    <span className="text-[10px] ml-1">₫</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed italic">
                    Các con số trên được tính toán tinh vi dựa trên tổ hợp của Mệnh ngũ hành và các con số tương sinh với tuổi người nhận trong năm 2026.
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FullAdviceTab() {
  const [birthYear, setBirthYear] = useState("");
  const [result, setResult] = useState<any>(null);

  const fullAdviceMutation = trpc.tet.fullAdvice.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthYear) return;
    fullAdviceMutation.mutate({ birthYear: parseInt(birthYear) });
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <div className="glass-card bg-[#0f172a]/80 border-white/10 max-w-md mx-auto animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Gift className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Tư Vấn Toàn Diện</h3>
            <p className="text-gray-400 text-sm">Cẩm nang phong thủy trọn bộ cho năm mới</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullYear" className="text-sm font-semibold text-gray-300 ml-1">Năm sinh của bạn</Label>
              <Input
                id="fullYear"
                type="number"
                placeholder="VD: 1990"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="h-12 bg-white/5 border-white/10 text-white focus:border-purple-500/50 rounded-xl"
                min="1900"
                max="2100"
                required
              />
            </div>
            <Button type="submit" className="h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-900/20 w-full rounded-xl transition-all duration-300 font-bold tracking-wide" disabled={fullAdviceMutation.isPending}>
              {fullAdviceMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang Khai Quang...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Nhận Tư Vấn Tết 2026
                </>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-start">
            <Button variant="outline" onClick={() => setResult(null)} className="h-10 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl">
              ← Tra cứu việc khác
            </Button>
          </div>

          <div className="glass-card bg-[#0f172a]/60 border-purple-500/20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="text-5xl mb-6 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">🧧</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Cẩm Nang Tết 2026: {result.zodiac}
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm border border-purple-500/20 backdrop-blur-sm">
              Mệnh {result.element}
            </div>
          </div>

          <div className="glass-card bg-[#0f172a]/80 border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles className="w-24 h-24 text-purple-500" />
            </div>
            <div className="result-header border-b border-white/5 pb-6 mb-8 flex flex-col md:flex-row md:items-center gap-5">
              <div className="result-icon bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Chiến Lược Vận May</h3>
                <p className="text-gray-400">Luận giải tổng hợp từ Chuyên gia Phong Thủy AI</p>
              </div>
            </div>
            <div className="prose prose-invert prose-purple max-w-none relative z-10">
              <Streamdown>{result.aiAdvice}</Streamdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Tet() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1e1b4b] to-background py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(239,68,68,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 text-red-400 text-xs font-bold mb-8 border border-red-500/20 backdrop-blur-md animate-bounce-subtle">
              <Gift className="w-4 h-4" />
              TẾT NGUYÊN ĐÁN BÍNH NGỌ 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tighter text-glow">
              Công Cụ Tết <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">2026</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
              Chuẩn bị cho một năm mới đại cát đại lợi với trợ lý phong thủy AI. Xông đất, khai màu, lì xì và cẩm nang vận hạn.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 min-h-screen relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.03),transparent)] pointer-events-none" />
        <div className="container">
          <div className="max-w-5xl mx-auto relative z-10">
            <Tabs defaultValue="xongdat" className="w-full">
              <TabsList className="w-full h-auto p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl mb-12 flex flex-wrap lg:flex-nowrap">
                <TabsTrigger value="xongdat" className="flex-1 py-4 px-4 gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-all rounded-xl font-bold whitespace-nowrap">
                  <Home className="w-4 h-4" />
                  Xông Đất
                </TabsTrigger>
                <TabsTrigger value="colors" className="flex-1 py-4 px-4 gap-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-all rounded-xl font-bold whitespace-nowrap">
                  <Palette className="w-4 h-4" />
                  Màu May Mắn
                </TabsTrigger>
                <TabsTrigger value="money" className="flex-1 py-4 px-4 gap-2 data-[state=active]:bg-yellow-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-all rounded-xl font-bold whitespace-nowrap">
                  <Banknote className="w-4 h-4" />
                  Gợi Ý Lì Xì
                </TabsTrigger>
                <TabsTrigger value="full" className="flex-1 py-4 px-4 gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-all rounded-xl font-bold whitespace-nowrap">
                  <Gift className="w-4 h-4" />
                  Tư Vấn Toàn Diện
                </TabsTrigger>
              </TabsList>

              <div className="min-h-[400px]">
                <TabsContent value="xongdat" className="mt-0 focus-visible:outline-none">
                  <XongDatTab />
                </TabsContent>
                <TabsContent value="colors" className="mt-0 focus-visible:outline-none">
                  <LuckyColorsTab />
                </TabsContent>
                <TabsContent value="money" className="mt-0 focus-visible:outline-none">
                  <LuckyMoneyTab />
                </TabsContent>
                <TabsContent value="full" className="mt-0 focus-visible:outline-none">
                  <FullAdviceTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
