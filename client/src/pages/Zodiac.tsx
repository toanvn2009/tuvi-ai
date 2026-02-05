import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { Sparkles, Loader2 } from "lucide-react";
import { Streamdown } from "streamdown";

const ZODIAC_ANIMALS = [
  { id: "rat", name: "Tý (Chuột)", emoji: "🐀", years: [1948, 1960, 1972, 1984, 1996, 2008, 2020] },
  { id: "ox", name: "Sửu (Trâu)", emoji: "🐂", years: [1949, 1961, 1973, 1985, 1997, 2009, 2021] },
  { id: "tiger", name: "Dần (Hổ)", emoji: "🐅", years: [1950, 1962, 1974, 1986, 1998, 2010, 2022] },
  { id: "rabbit", name: "Mão (Mèo)", emoji: "🐇", years: [1951, 1963, 1975, 1987, 1999, 2011, 2023] },
  { id: "dragon", name: "Thìn (Rồng)", emoji: "🐉", years: [1952, 1964, 1976, 1988, 2000, 2012, 2024] },
  { id: "snake", name: "Tỵ (Rắn)", emoji: "🐍", years: [1953, 1965, 1977, 1989, 2001, 2013, 2025] },
  { id: "horse", name: "Ngọ (Ngựa)", emoji: "🐴", years: [1954, 1966, 1978, 1990, 2002, 2014, 2026] },
  { id: "goat", name: "Mùi (Dê)", emoji: "🐐", years: [1955, 1967, 1979, 1991, 2003, 2015, 2027] },
  { id: "monkey", name: "Thân (Khỉ)", emoji: "🐒", years: [1956, 1968, 1980, 1992, 2004, 2016, 2028] },
  { id: "rooster", name: "Dậu (Gà)", emoji: "🐓", years: [1957, 1969, 1981, 1993, 2005, 2017, 2029] },
  { id: "dog", name: "Tuất (Chó)", emoji: "🐕", years: [1958, 1970, 1982, 1994, 2006, 2018, 2030] },
  { id: "pig", name: "Hợi (Lợn)", emoji: "🐷", years: [1959, 1971, 1983, 1995, 2007, 2019, 2031] },
];

type ZodiacAnimal = typeof ZODIAC_ANIMALS[number]["id"];

function ZodiacCard({ 
  animal, 
  isSelected, 
  onClick 
}: { 
  animal: typeof ZODIAC_ANIMALS[number]; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button 
      className={`relative group p-4 rounded-2xl transition-all duration-500 overflow-hidden ${
        isSelected 
        ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      } border backdrop-blur-sm flex flex-col items-center justify-center gap-2 aspect-square active:scale-95`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-50" />
      )}
      <div className={`text-4xl transition-transform duration-500 group-hover:scale-110 ${isSelected ? 'animate-bounce-subtle' : ''}`}>
        {animal.emoji}
      </div>
      <div className={`font-bold text-sm transition-colors duration-300 ${isSelected ? 'text-amber-400' : 'text-gray-400 group-hover:text-white'}`}>
        {animal.name}
      </div>
      <div className={`text-[10px] transition-colors duration-300 ${isSelected ? 'text-amber-500/70' : 'text-gray-500'}`}>
        {animal.years.slice(-1)}
      </div>
    </button>
  );
}

export default function Zodiac() {
  const [selectedAnimal, setSelectedAnimal] = useState<ZodiacAnimal | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [result, setResult] = useState<any>(null);

  const zodiacFromYear = trpc.zodiac.fromYear.useQuery(
    { year: parseInt(birthYear) },
    { enabled: birthYear.length === 4 }
  );

  const forecastMutation = trpc.zodiac.forecast.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
  });

  const handleYearChange = (year: string) => {
    setBirthYear(year);
    if (year.length === 4) {
      const yearNum = parseInt(year);
      if (yearNum >= 1900 && yearNum <= 2100) {
        const index = (yearNum - 4) % 12;
        setSelectedAnimal(ZODIAC_ANIMALS[index].id as ZodiacAnimal);
      }
    }
  };

  const handleGetForecast = () => {
    if (selectedAnimal) {
      forecastMutation.mutate({ animal: selectedAnimal as any, year: 2026 });
    }
  };

  const selectedZodiac = ZODIAC_ANIMALS.find(z => z.id === selectedAnimal);

  return (
    <Layout>
      <section className="bg-gradient-to-b from-[#1e1b4b] to-background py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(245,158,11,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-8 border border-amber-500/20 backdrop-blur-md animate-twinkle">
              <Sparkles className="w-4 h-4" />
              TỬ VI CHI TIẾT NĂM BÍNH NGỌ 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tighter text-glow font-serif">
              Tử Vi <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">12 Con Giáp</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
              Dự báo vận mệnh, sự nghiệp, tài lộc và tình duyên cho từng con giáp dưới góc nhìn của chuyên gia Phong Thủy AI.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 min-h-screen relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03),transparent)] pointer-events-none" />
        <div className="container">
          {!result ? (
            <div className="space-y-12 animate-fade-in-up">
              {/* Year Input */}
              <div className="max-w-md mx-auto">
                <div className="glass-card bg-[#0f172a]/80 border-white/10">
                  <h3 className="font-bold text-white mb-4 text-center">Tìm con giáp qua năm sinh</h3>
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Nhập năm sinh (VD: 1990)"
                        value={birthYear}
                        onChange={(e) => handleYearChange(e.target.value)}
                        min="1900"
                        max="2100"
                        className="h-12 bg-white/5 border-white/10 text-white focus:border-amber-500/50 rounded-xl pl-4"
                      />
                    </div>
                    {zodiacFromYear.data && (
                      <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-fade-in">
                        <span className="text-4xl">
                          {ZODIAC_ANIMALS.find(z => z.id === zodiacFromYear.data.animal)?.emoji}
                        </span>
                        <div>
                          <div className="text-xs text-amber-500/70 font-bold uppercase tracking-wider">Tuổi của bạn là</div>
                          <div className="text-xl font-bold text-white">{zodiacFromYear.data.vietnameseName}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Zodiac Grid */}
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
                  <h2 className="text-2xl font-bold text-white text-center">
                    Chọn Con Giáp Của Bạn
                  </h2>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
                  {ZODIAC_ANIMALS.map((animal) => (
                    <ZodiacCard
                      key={animal.id}
                      animal={animal}
                      isSelected={selectedAnimal === animal.id}
                      onClick={() => setSelectedAnimal(animal.id as ZodiacAnimal)}
                    />
                  ))}
                </div>
              </div>

              {/* Get Forecast Button */}
              {selectedAnimal && (
                <div className="text-center animate-fade-in-up pb-20">
                  <div className="glass-card bg-[#0f172a]/90 border-amber-500/30 inline-block p-8 min-w-[320px] shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                    <div className="flex flex-col items-center gap-4 mb-8">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center text-6xl shadow-inner">
                        {selectedZodiac?.emoji}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {selectedZodiac?.name}
                        </div>
                        <div className="text-amber-500/70 text-sm font-medium">
                          Vận trình năm Bính Ngọ 2026
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleGetForecast}
                      className="h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 border-0 shadow-lg shadow-amber-900/20 w-full rounded-xl transition-all duration-300 font-bold tracking-wide"
                      disabled={forecastMutation.isPending}
                    >
                      {forecastMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Đang Gieo Quẻ...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Xem Dự Báo Chi Tiết
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
              <div className="flex items-center justify-start pb-4">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="h-10 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl transition-all"
                >
                  ← Trở lại danh sách
                </Button>
              </div>

              {/* Result Header */}
              <div className="glass-card bg-[#0f172a]/60 border-amber-500/20 relative overflow-hidden text-center p-12 md:p-16">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <div className="relative z-10">
                  <div className="text-8xl mb-8 animate-float inline-block filter drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    {ZODIAC_ANIMALS.find(z => z.id === result.animal)?.emoji}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
                    Vận Trình {result.vietnameseName} 2026
                  </h2>
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20 backdrop-blur-md">
                    <Sparkles className="w-4 h-4" />
                    Bản tin Tử vi Cát tường - Năm Bính Ngọ
                  </div>
                </div>
              </div>

              {/* Forecast Content */}
              <div className="glass-card bg-[#0f172a]/80 border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="w-32 h-32 text-amber-500" />
                </div>
                <div className="result-header border-b border-white/5 pb-6 mb-10 relative z-10 flex items-center gap-5">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                    <Sparkles className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">Cẩm Nang Vận Mệnh</h3>
                    <p className="text-gray-400 font-medium">Luận giải chuyên sâu từ Chuyên gia Phong Thủy AI</p>
                  </div>
                </div>
                <div className="prose prose-invert prose-amber max-w-none relative z-10 leading-relaxed">
                  <Streamdown>{result.forecast}</Streamdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
