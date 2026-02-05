import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { Sparkles, Calendar, Loader2, Heart, Store, Shovel, Plane, Home } from "lucide-react";
import { Streamdown } from "streamdown";

const PURPOSES = [
  { id: "wedding", name: "Cưới hỏi", icon: Heart, description: "Chọn ngày tốt cho lễ cưới, ăn hỏi", emoji: "💒" },
  { id: "business_opening", name: "Khai trương", icon: Store, description: "Mở cửa hàng, công ty, văn phòng", emoji: "🏪" },
  { id: "groundbreaking", name: "Động thổ", icon: Shovel, description: "Khởi công xây dựng, sửa chữa nhà", emoji: "🏗️" },
  { id: "travel", name: "Xuất hành", icon: Plane, description: "Du lịch, công tác, di chuyển xa", emoji: "✈️" },
  { id: "moving_house", name: "Nhập trạch", icon: Home, description: "Dọn về nhà mới, chuyển nhà", emoji: "🏠" },
];

// Move date logic outside to use in initialization
const today = new Date();
const threeMonthsLater = new Date(today);
threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
const DEFAULT_START_DATE = today.toISOString().split("T")[0];
const DEFAULT_END_DATE = threeMonthsLater.toISOString().split("T")[0];

type Purpose = typeof PURPOSES[number]["id"];

interface FormData {
  purpose: Purpose;
  startDate: string;
  endDate: string;
  ownerBirthYear: string;
}

function PurposeCard({ 
  purpose, 
  isSelected, 
  onClick 
}: { 
  purpose: typeof PURPOSES[number]; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = purpose.icon;
  
  return (
    <button 
      className={`p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group ${
        isSelected 
          ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
          : "border-white/10 bg-white/5 hover:border-emerald-500/30 hover:bg-white/10"
      }`}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${
        isSelected 
          ? "bg-emerald-500 text-white" 
          : "bg-emerald-500/20 text-emerald-400"
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className={`font-semibold transition-colors duration-300 ${isSelected ? "text-emerald-300" : "text-gray-200"}`}>{purpose.name}</div>
      <div className="text-[10px] text-gray-400 mt-1 leading-tight">
        {purpose.description}
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
        </div>
      )}
    </button>
  );
}

export default function Auspicious() {
  const [formData, setFormData] = useState<FormData>({
    purpose: "",
    startDate: DEFAULT_START_DATE,
    endDate: DEFAULT_END_DATE,
    ownerBirthYear: "",
  });
  const [result, setResult] = useState<any>(null);

  const getDatesMutation = trpc.auspicious.getDates.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.purpose || !formData.startDate || !formData.endDate) {
      return;
    }
    getDatesMutation.mutate({
      purpose: formData.purpose as any,
      startDate: formData.startDate,
      endDate: formData.endDate,
      ownerBirthYear: formData.ownerBirthYear ? parseInt(formData.ownerBirthYear) : undefined,
    });
  };

  // Set default date range (next 3 months)
  const today = new Date();
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  const defaultStartDate = today.toISOString().split("T")[0];
  const defaultEndDate = threeMonthsLater.toISOString().split("T")[0];

  const selectedPurpose = PURPOSES.find(p => p.id === formData.purpose);

  return (
    <Layout>
      <section className="bg-gradient-to-b from-[#1e1b4b] to-background py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-8 border border-emerald-500/20 backdrop-blur-md animate-twinkle">
              <Calendar className="w-4 h-4" />
              Tư Vấn Phong Thủy Bát Trạch Chuyên Sâu
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tighter text-glow font-serif">
              Ngày Đẹp Giờ Tốt
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
              Khai mở vận may bằng cách chọn ngày đại cát và giờ hoàng đạo, giúp vạn sự hanh thông, khởi đầu thuận lợi.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 min-h-[60vh]">
        <div className="container">
          {!result ? (
            <div className="space-y-12 max-w-5xl mx-auto">
              {/* Purpose Selection */}
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  1. Chọn Việc Cần Làm
                </h2>
                <p className="text-center text-gray-500 mb-8">
                  Hệ thống sẽ dựa trên mục đích này để tìm ngày mang năng lượng phù hợp nhất
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {PURPOSES.map((purpose) => (
                    <PurposeCard
                      key={purpose.id}
                      purpose={purpose}
                      isSelected={formData.purpose === purpose.id}
                      onClick={() => setFormData({ ...formData, purpose: purpose.id })}
                    />
                  ))}
                </div>
              </div>

              {/* Date Range Form */}
              {formData.purpose && (
                <div className="glass-card bg-[#0f172a]/80 border-white/10 max-w-xl mx-auto animate-fade-in-up">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <Calendar className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">2. Thông Tin Thời Gian</h3>
                      <p className="text-sm text-gray-400">Thiết lập khoảng thời gian và thông tin gia chủ</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-sm font-semibold text-gray-300 ml-1">Từ ngày</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="h-12 bg-white/5 border-white/10 text-white focus:border-emerald-500/50 rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-sm font-semibold text-gray-300 ml-1">Đến ngày</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="h-12 bg-white/5 border-white/10 text-white focus:border-emerald-500/50 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerBirthYear" className="text-sm font-semibold text-gray-300 ml-1">Năm sinh gia chủ (tùy chọn)</Label>
                      <Input
                        id="ownerBirthYear"
                        type="number"
                        placeholder="VD: 1990"
                        value={formData.ownerBirthYear}
                        onChange={(e) => setFormData({ ...formData, ownerBirthYear: e.target.value })}
                        className="h-12 bg-white/5 border-white/10 text-white focus:border-emerald-500/50 rounded-xl"
                        min="1900"
                        max="2100"
                      />
                      <p className="text-[10px] text-gray-500 ml-1 italic">
                        * Nhập năm sinh để xem ngày hợp tuổi gia chủ (tăng độ chính xác)
                      </p>
                    </div>

                    <Button type="submit" className="h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 shadow-lg shadow-emerald-900/20 w-full rounded-xl transition-all duration-300 font-bold tracking-wide" disabled={getDatesMutation.isPending}>
                      {getDatesMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Đang Khai Quang Ngày Tốt...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Xem Ngày Đẹp Giờ Tốt
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-10 max-w-4xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl"
                >
                  ← Tra cứu việc khác
                </Button>
              </div>

              {/* Result Header */}
              <div className="glass-card bg-[#0f172a]/60 border-emerald-500/20 text-center relative overflow-hidden p-10 md:p-12">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                <div className="text-7xl mb-8 filter drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-float inline-block">{selectedPurpose?.emoji}</div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
                  Ngày Đại Cát: {selectedPurpose?.name}
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-4">
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/20 backdrop-blur-md">
                    <Calendar className="w-4 h-4" />
                    Từ {new Date(result.dateRange.start).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="w-4 h-0.5 bg-gray-600 rounded-full" />
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/20 backdrop-blur-md">
                    <Calendar className="w-4 h-4" />
                    Đến {new Date(result.dateRange.end).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Result Content */}
              <div className="glass-card bg-[#0f172a]/80 border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="w-24 h-24 text-emerald-500" />
                </div>
                <div className="result-header border-b border-white/5 pb-6 mb-8 relative z-10 flex items-center gap-5">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">Luận Giải Chuyên Môn</h3>
                    <p className="text-gray-400 font-medium">Dựa trên tinh hoa Lịch Vạn Niên & Bát Trạch</p>
                  </div>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none relative z-10">
                  <Streamdown>{result.result}</Streamdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
