import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { Sparkles, Hash, Loader2, Info, Download, ArrowLeft } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { Streamdown } from "streamdown";
import { exportNumerologyToPDF } from "@/lib/pdfExport";
import { toast } from "sonner";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => 2025 - i);

interface NumerologyFormData {
  fullName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

function NumberCard({ 
  number, 
  title, 
  subtitle, 
  description,
  isHighlight = false,
  delay = 0
}: { 
  number: number; 
  title: string; 
  subtitle?: string;
  description?: string;
  isHighlight?: boolean;
  delay?: number;
}) {
  return (
    <div 
      className={`p-6 rounded-2xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up group overflow-hidden relative ${
        isHighlight 
          ? 'glass-card bg-indigo-500/10 border-indigo-500/30' 
          : 'glass-card bg-white/5 border-white/10'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl rounded-full transition-opacity duration-500 opacity-20 group-hover:opacity-40 ${
        isHighlight ? 'bg-indigo-500' : 'bg-purple-500'
      }`} />
      
      <div className="flex items-start gap-5 relative z-10">
        <div className={`number-badge flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-xl text-3xl font-black transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
          [11, 22, 33].includes(number) 
            ? 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-[0_0_20px_rgba(251,191,36,0.4)] animate-pulse-glow' 
            : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl'
        }`}>
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{title}</h3>
          {subtitle && (
            <p className="text-sm text-indigo-400 font-semibold tracking-wide uppercase mt-0.5">{subtitle}</p>
          )}
          {description && (
            <p className="text-sm text-gray-400 mt-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function BirthChart({ chart }: { chart: number[][] }) {
  const positions = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];

  return (
    <div className="p-8 glass-card bg-white/5 border-white/10 rounded-3xl animate-fade-in-up relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Hash className="w-32 h-32 text-indigo-500" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
          <Info className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Biểu Đồ Ngày Sinh</h3>
          <p className="text-sm text-gray-400">Tần suất và ý nghĩa các con số</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="w-full max-w-[280px]">
          <div className="grid grid-cols-3 gap-3">
            {positions.map((row, rowIdx) =>
              row.map((num, colIdx) => {
                const count = chart[rowIdx][colIdx];
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 ${
                      count > 0 
                      ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)] scale-105" 
                      : "bg-white/5 border-white/5 opacity-40 hover:opacity-60"
                    }`}
                  >
                    {count > 0 ? (
                      <div className="text-center">
                        <div className="text-2xl font-black text-white drop-shadow-sm">{num}</div>
                        {count > 1 && (
                          <div className="text-[10px] font-bold text-indigo-400 mt-0.5">x{count}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-600">{num}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <div className="flex-1 space-y-3 w-full">
          {[
            { label: "Trục Trí Tuệ", nums: "3-6-9", idx: 0 },
            { label: "Trục Tinh Thần", nums: "2-5-8", idx: 1 },
            { label: "Trục Thể Chất", nums: "1-4-7", idx: 2 }
          ].map((axis) => {
            const hasAxis = chart[axis.idx].filter(n => n > 0).length > 0;
            return (
              <div key={axis.idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                hasAxis ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/5 border-white/5'
              }`}>
                <div className="flex flex-col">
                  <span className={`font-bold ${hasAxis ? 'text-indigo-300' : 'text-gray-500'}`}>{axis.label}</span>
                  <span className="text-xs text-gray-500 font-mono">({axis.nums})</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                  hasAxis ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-gray-600 border border-white/5'
                }`}>
                  {hasAxis ? "Mạnh" : "Thiếu"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Numerology() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<NumerologyFormData>({
    fullName: "",
    birthDay: 1,
    birthMonth: 1,
    birthYear: 1990,
  });
  const [result, setResult] = useState<any>(null);

  const analyzeMutation = trpc.numerology.analyze.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    
    // Tạo birthDate từ các trường tách biệt
    const birthDate = `${formData.birthYear}-${String(formData.birthMonth).padStart(2, "0")}-${String(formData.birthDay).padStart(2, "0")}`;
    
    analyzeMutation.mutate({
      fullName: formData.fullName,
      birthDate,
    });
  };

  const handleExportPDF = () => {
    if (!result) return;
    
    try {
      const birthDateString = `${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}`;
      exportNumerologyToPDF({
        fullName: formData.fullName,
        birthDate: birthDateString,
        lifePathNumber: result.result.lifePathNumber,
        soulNumber: result.result.soulNumber,
        personalityNumber: result.result.personalityNumber,
        destinyNumber: result.result.destinyNumber,
        birthDayNumber: result.result.birthDayNumber,
        birthChart: result.result.birthChart,
        aiAnalysis: result.analysis,
      });
      
      toast.success("Đã tải xuống PDF thành công!");
    } catch (error) {
      toast.error("Có lỗi khi tạo PDF. Vui lòng thử lại.");
    }
  };

  const getMeaningTitle = (num: number) => {
    const meanings: Record<number, string> = {
      1: "Người Tiên Phong",
      2: "Người Hòa Giải",
      3: "Người Sáng Tạo",
      4: "Người Xây Dựng",
      5: "Người Tự Do",
      6: "Người Chăm Sóc",
      7: "Người Tìm Kiếm",
      8: "Người Thành Đạt",
      9: "Người Nhân Đạo",
      11: "Người Trực Giác",
      22: "Người Kiến Tạo",
      33: "Người Thầy",
    };
    return meanings[num] || "";
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8 animate-fade-in-down backdrop-blur-md">
              <Hash className="w-4 h-4" />
              THẦN SỐ HỌC PYTHAGORAS
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter text-glow">
              Khát Vọng <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Vận Mệnh</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100">
              Giải mã ý nghĩa những con số qua họ tên và ngày sinh của bạn. Tìm hiểu sứ mệnh và tiềm năng vô tận đang ẩn giấu.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 relative">
        <div className="container mx-auto px-4">
          {!result ? (
            <div className="max-w-xl mx-auto animate-fade-in-up">
              <div className="glass-card bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-sm font-bold text-gray-300 ml-1 uppercase tracking-widest">
                      Họ và tên đầy đủ
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="VD: Nguyễn Văn Anh"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 rounded-2xl text-lg px-6"
                    />
                    <p className="text-[10px] text-gray-500 ml-1 italic">
                      * Nhập đúng họ tên khai sinh để có kết quả chính xác nhất
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-300 ml-1 uppercase tracking-widest">
                      Ngày sinh (Dương lịch)
                    </Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Select
                          value={String(formData.birthDay)}
                          onValueChange={(v) => setFormData({ ...formData, birthDay: parseInt(v) })}
                        >
                          <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl">
                            <SelectValue placeholder="Ngày" />
                          </SelectTrigger>
                          <SelectContent className="glass bg-[#0f172a] border-white/10">
                            {DAYS.map((d) => (
                              <SelectItem key={d} value={String(d)} className="text-white hover:bg-white/10">{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Select
                          value={String(formData.birthMonth)}
                          onValueChange={(v) => setFormData({ ...formData, birthMonth: parseInt(v) })}
                        >
                          <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl">
                            <SelectValue placeholder="Tháng" />
                          </SelectTrigger>
                          <SelectContent className="glass bg-[#0f172a] border-white/10">
                            {MONTHS.map((m) => (
                              <SelectItem key={m} value={String(m)} className="text-white hover:bg-white/10">{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Select
                          value={String(formData.birthYear)}
                          onValueChange={(v) => setFormData({ ...formData, birthYear: parseInt(v) })}
                        >
                          <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl">
                            <SelectValue placeholder="Năm" />
                          </SelectTrigger>
                          <SelectContent className="glass bg-[#0f172a] border-white/10">
                            {YEARS.map((y) => (
                              <SelectItem key={y} value={String(y)} className="text-white hover:bg-white/10">{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg shadow-[0_0_25px_rgba(79,70,229,0.3)] rounded-2xl transition-all duration-300 active:scale-95 group" 
                    disabled={analyzeMutation.isPending}
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                        Đang Khai Quang...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                        Khám Phá Định Mệnh
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-12 max-w-5xl mx-auto">
              {/* Back button */}
              <div className="flex flex-wrap justify-between items-center gap-6 animate-fade-in-down">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white rounded-2xl h-11 px-6 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tra cứu người khác
                </Button>
                <div className="flex gap-4">
                  <ShareButtons
                    type="numerology"
                    title={`Thần số học của ${formData.fullName}`}
                    description={`Số chủ đạo: ${result.result.lifePathNumber}`}
                  />
                  <Button
                    variant="outline"
                    onClick={handleExportPDF}
                    className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 rounded-2xl h-11 px-6 transition-all"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải PDF
                  </Button>
                </div>
              </div>

              {/* Summary Card */}
              <div className="glass-card bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.05]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative z-10">
                  <div className="space-y-3">
                    <p className="text-indigo-200 font-bold uppercase tracking-[0.2em] text-xs">Kết quả phân tích</p>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">{formData.fullName}</h2>
                    <p className="text-lg text-indigo-100/80 font-medium">
                      Ngày sinh: {formData.birthDay}/{formData.birthMonth}/{formData.birthYear}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-inner group">
                    <div className="text-right">
                      <p className="text-indigo-100 text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Số chủ đạo</p>
                      <p className="text-white text-lg font-black">{getMeaningTitle(result.result.lifePathNumber)}</p>
                    </div>
                    <div className="w-20 h-20 bg-white text-indigo-700 rounded-2xl flex items-center justify-center text-5xl font-black shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {result.result.lifePathNumber}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="numbers" className="animate-fade-in-up animate-delay-200">
                <TabsList className="grid w-full grid-cols-3 mb-12 bg-white/5 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl h-auto">
                  <TabsTrigger value="numbers" className="py-4 font-bold rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white uppercase tracking-widest text-xs">CÁC CON SỐ</TabsTrigger>
                  <TabsTrigger value="chart" className="py-4 font-bold rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white uppercase tracking-widest text-xs">BIỂU ĐỒ</TabsTrigger>
                  <TabsTrigger value="analysis" className="py-4 font-bold rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white uppercase tracking-widest text-xs">PHÂN TÍCH AI</TabsTrigger>
                </TabsList>

                <TabsContent value="numbers" className="space-y-6 focus-visible:outline-none">
                  <NumberCard
                    number={result.result.lifePathNumber}
                    title="Số Chủ Đạo (Life Path)"
                    subtitle={getMeaningTitle(result.result.lifePathNumber)}
                    description="Con số quan trọng nhất, thể hiện con đường cuộc đời, sứ mệnh và những bài học cốt lõi bạn cần trải qua trong kiếp sống này."
                    isHighlight={true}
                    delay={0}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NumberCard
                      number={result.result.soulNumber}
                      title="Số Linh Hồn (Soul)"
                      subtitle={getMeaningTitle(result.result.soulNumber)}
                      description="Thể hiện khao khát sâu thẳm, động lực nội tâm và những gì thực sự khiến bạn cảm thấy hạnh phúc."
                      delay={100}
                    />
                    <NumberCard
                      number={result.result.personalityNumber}
                      title="Số Nhân Cách (Personality)"
                      subtitle={getMeaningTitle(result.result.personalityNumber)}
                      description="Cách bạn thể hiện ra bên ngoài và cách người khác cảm nhận về bạn trong những lần tiếp xúc đầu tiên."
                      delay={200}
                    />
                    <NumberCard
                      number={result.result.destinyNumber}
                      title="Số Định Mệnh (Destiny)"
                      subtitle={getMeaningTitle(result.result.destinyNumber)}
                      description="Thể hiện năng lực bẩm sinh, tiềm năng thiên bẩm và mục tiêu lớn nhất mà bạn cần đạt được."
                      delay={300}
                    />
                    <NumberCard
                      number={result.result.birthDayNumber}
                      title="Số Ngày Sinh (Birthday)"
                      subtitle={getMeaningTitle(result.result.birthDayNumber)}
                      description="Tài năng đặc biệt và những công cụ hỗ trợ bạn trên hành trình chinh phục các con số lớn hơn."
                      delay={400}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="chart" className="focus-visible:outline-none">
                  <BirthChart chart={result.result.birthChart} />
                </TabsContent>

                <TabsContent value="analysis" className="focus-visible:outline-none">
                  <div className="glass-card bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                      <Sparkles className="w-32 h-32 text-purple-500" />
                    </div>
                    
                    <div className="flex items-center gap-6 mb-10 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Cẩm Nang Vận Mệnh AI</h3>
                        <p className="text-gray-400">Luận giải chuyên sâu dựa trên các chỉ số cá nhân</p>
                      </div>
                    </div>
                    
                    <div className="prose prose-invert prose-indigo max-w-none text-gray-300 relative z-10 leading-relaxed">
                      <Streamdown>{result.analysis}</Streamdown>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
