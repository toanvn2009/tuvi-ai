import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import ShareButtons from "@/components/ShareButtons";
import { Heart, Loader2, Sparkles, User, Users, ArrowLeft } from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => 2025 - i);

interface PersonFormData {
  fullName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

function ScoreCircle({ score, label, color, delay = 0 }: { score: number; label: string; color: string; delay?: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative w-32 h-32 group">
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"
          style={{ backgroundColor: color }}
        />
        <svg className="w-32 h-32 transform -rotate-90 relative z-10 transition-transform duration-700 group-hover:scale-110">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke={color}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ 
               filter: `drop-shadow(0 0 12px ${color}66)`,
               strokeDashoffset: strokeDashoffset
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-white tracking-tighter drop-shadow-md">{score}</span>
            <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] relative -top-1">%</span>
          </div>
        </div>
      </div>
      <p className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

function PersonCard({ person, color, delay = 0 }: { person: any; color: string; delay?: number }) {
  return (
    <div 
      className={`p-8 rounded-[2rem] glass-card border-white/10 animate-fade-in-up relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}
      style={{ 
        animationDelay: `${delay}ms`,
        background: `linear-gradient(135deg, ${color}10, #0f172a)`
      }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Users className="w-24 h-24 text-white" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
          style={{ backgroundColor: `${color}33`, border: `1px solid ${color}44` }}
        >
          <User className="w-7 h-7" style={{ color: color }} />
        </div>
        <div>
          <h3 className="font-black text-xl text-white tracking-tight">{person.name}</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">{person.zodiacVN}</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Năm sinh</span>
          <span className="font-black text-white text-lg">{person.birthYear}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bản mệnh</span>
          <span className="font-black text-white" style={{ color: color }}>{person.element}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Số chủ đạo</span>
          <div className="px-3 py-1 rounded-lg bg-white/10 text-white font-black text-lg shadow-sm">
            {person.lifePathNumber}
          </div>
        </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 w-full h-1 opacity-20"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function PersonForm({ 
  person, 
  setPerson, 
  title, 
  icon 
}: { 
  person: PersonFormData; 
  setPerson: (p: PersonFormData) => void; 
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-8 glass-card bg-[#0f172a]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>

      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
          {icon}
        </div>
        <h3 className="font-black text-2xl text-white tracking-tight">{title}</h3>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
            Họ và tên <span className="text-rose-500">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Nhập họ tên đầy đủ"
            value={person.fullName}
            onChange={(e) => setPerson({ ...person, fullName: e.target.value })}
            className="h-14 bg-white/5 border-white/10 text-white focus:border-rose-500/50 rounded-2xl text-lg px-6 transition-all"
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
            Ngày sinh <span className="text-rose-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Select
                value={String(person.birthDay)}
                onValueChange={(v) => setPerson({ ...person, birthDay: parseInt(v) })}
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
            <div>
              <Select
                value={String(person.birthMonth)}
                onValueChange={(v) => setPerson({ ...person, birthMonth: parseInt(v) })}
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
            <div>
              <Select
                value={String(person.birthYear)}
                onValueChange={(v) => setPerson({ ...person, birthYear: parseInt(v) })}
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
      </div>
    </div>
  );
}

export default function Compatibility() {
  const [person1, setPerson1] = useState<PersonFormData>({ 
    fullName: "", 
    birthDay: 1, 
    birthMonth: 1, 
    birthYear: 1990 
  });
  const [person2, setPerson2] = useState<PersonFormData>({ 
    fullName: "", 
    birthDay: 1, 
    birthMonth: 1, 
    birthYear: 1990 
  });
  const [result, setResult] = useState<any>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const formatBirthDate = (p: PersonFormData) => {
    return `${p.birthYear}-${String(p.birthMonth).padStart(2, "0")}-${String(p.birthDay).padStart(2, "0")}`;
  };

  const calculateMutation = trpc.compatibility.calculate.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
      setShowResult(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    },
  });

  const analyzeMutation = trpc.compatibility.analyze.useMutation({
    onSuccess: (data: any) => {
      setResult(data.result);
      setAnalysis(typeof data.analysis === 'string' ? data.analysis : '');
      setShowResult(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi phân tích AI");
    },
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!person1.fullName.trim() || !person2.fullName.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin cả hai người");
      return;
    }
    setAnalysis("");
    calculateMutation.mutate({ 
      person1: { fullName: person1.fullName, birthDate: formatBirthDate(person1) }, 
      person2: { fullName: person2.fullName, birthDate: formatBirthDate(person2) } 
    });
  };

  const handleAnalyze = () => {
    if (!person1.fullName.trim() || !person2.fullName.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin cả hai người");
      return;
    }
    analyzeMutation.mutate({ 
      person1: { fullName: person1.fullName, birthDate: formatBirthDate(person1) }, 
      person2: { fullName: person2.fullName, birthDate: formatBirthDate(person2) } 
    });
  };

  const isLoading = calculateMutation.isPending || analyzeMutation.isPending;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(244,114,182,0.1),transparent_70%)]" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold mb-8 animate-fade-in-down backdrop-blur-md">
              <Heart className="w-4 h-4" />
              TƯƠNG HỢP TÌNH DUYÊN
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter text-glow">
              Giao Thoa <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Định Mệnh</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100">
              Khám phá mức độ hòa hợp giữa hai tâm hồn dựa trên Tử Vi, Ngũ Hành và Thần Số Học. Nhận lời khuyên chuyên sâu từ trí tuệ nhân tạo.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            {!showResult ? (
              <form onSubmit={handleCalculate} className="space-y-12 animate-fade-in-up">
                <div className="grid md:grid-cols-2 gap-10 relative">
                  {/* Person 1 */}
                  <PersonForm 
                    person={person1} 
                    setPerson={setPerson1} 
                    title="Người thứ nhất"
                    icon={<User className="w-8 h-8 text-rose-400" />}
                  />

                  {/* Heart Icon in center */}
                  <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-20 h-20 rounded-full bg-[#0f172a] border-4 border-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(244,114,182,0.3)] animate-pulse group">
                      <Heart className="w-10 h-10 text-rose-500 transition-transform duration-500 group-hover:scale-125" />
                    </div>
                  </div>

                  {/* Person 2 */}
                  <PersonForm 
                    person={person2} 
                    setPerson={setPerson2} 
                    title="Người thứ hai"
                    icon={<User className="w-8 h-8 text-indigo-400" />}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center max-w-2xl mx-auto">
                  <Button 
                    type="submit" 
                    className="flex-1 h-16 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-lg rounded-2xl transition-all duration-300 active:scale-95 shadow-xl"
                    disabled={isLoading}
                  >
                    {calculateMutation.isPending ? (
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    ) : (
                      <Sparkles className="w-6 h-6 mr-3 text-rose-400" />
                    )}
                    Tính Toán Cơ Bản
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleAnalyze} 
                    className="flex-1 h-16 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl transition-all duration-300 active:scale-95 shadow-[0_0_25px_rgba(244,114,182,0.3)]"
                    disabled={isLoading}
                  >
                    {analyzeMutation.isPending ? (
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    ) : (
                      <Sparkles className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                    )}
                    Phân Tích AI Chuyên Sâu
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-12">
                {/* Back Link */}
                <div className="flex justify-between items-center animate-fade-in-down">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResult(false);
                      setResult(null);
                      setAnalysis("");
                    }}
                    className="bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white rounded-2xl h-11 px-6 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tra cứu cặp đôi khác
                  </Button>
                  <ShareButtons 
                    type="compatibility"
                    title={`Độ tương hợp: ${result.score}%`}
                    description={`Xem độ tương hợp giữa ${person1.fullName} và ${person2.fullName}`}
                  />
                </div>

                {/* Main Score Card */}
                <div className="glass-card bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden animate-fade-in-up">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-10">
                      Giao Thoa Bản Mệnh
                    </div>
                    
                    <div className="relative mb-12">
                      <div className="absolute inset-0 bg-white/20 blur-[80px] rounded-full opacity-30 animate-pulse" />
                      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center relative backdrop-blur-3xl overflow-hidden group shadow-2xl">
                         <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-rose-500/30 to-transparent transition-all duration-700" style={{ height: `${result.score}%` }} />
                         <div className="flex flex-col items-center relative z-20">
                            <span className="text-7xl md:text-8xl font-black text-white tracking-tighter drop-shadow-xl group-hover:scale-110 transition-transform duration-700">{result.score}</span>
                            <span className="text-lg font-black text-white/40 tracking-[0.2em] -mt-2">%</span>
                         </div>
                      </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">
                      Mức Độ Tương Hợp: <span className="bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">{result.conclusion}</span>
                    </h2>
                    <p className="max-w-xl text-gray-400 text-lg leading-relaxed">
                       Sự kết hợp giữa {person1.fullName} và {person2.fullName} tạo nên một tần số năng lượng {result.conclusion.toLowerCase()}, kiến tạo nên một mối quan hệ đầy triển vọng.
                    </p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up animate-delay-200">
                  <ScoreCircle score={result.breakdown.element} label="Ngũ Hành" color="#f43f5e" delay={0} />
                  <ScoreCircle score={result.breakdown.zodiac} label="Địa Chi" color="#fbbf24" delay={100} />
                  <ScoreCircle score={result.breakdown.heavenlyStem} label="Thiên Can" color="#10b981" delay={200} />
                  <ScoreCircle score={result.breakdown.numerology} label="Thần Số" color="#6366f1" delay={300} />
                </div>

                {/* User Info Cards */}
                <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up animate-delay-300">
                  <PersonCard person={result.person1} color="#f43f5e" delay={0} />
                  <PersonCard person={result.person2} color="#6366f1" delay={100} />
                </div>

                {/* AI Analysis */}
                {analysis && (
                  <div className="glass-card bg-[#0f172a]/80 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-hidden group animate-fade-in-up animate-delay-400">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                      <Sparkles className="w-32 h-32 text-rose-500" />
                    </div>
                    
                    <div className="flex items-center gap-6 mb-12 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 flex items-center justify-center border border-rose-500/30 shadow-[0_0_25px_rgba(244,114,182,0.2)]">
                        <Sparkles className="w-8 h-8 text-rose-400" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white tracking-tight">Chiêm Tinh & Thần Số Học AI</h3>
                        <p className="text-gray-400 font-medium">Bí mật nhân duyên từ các chuyên gia AI</p>
                      </div>
                    </div>
                    
                    <div className="prose prose-invert prose-rose max-w-none text-gray-300 relative z-10 leading-relaxed text-lg">
                      <Streamdown>{analysis}</Streamdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
