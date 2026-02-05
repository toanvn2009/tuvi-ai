
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { Sparkles, Loader2 } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface Star {
  name: string;
  nature?: string;
}

interface Palace {
  name: string;
  mainStars?: Star[];
  secondaryStars?: Star[];
  trangSinh?: string;
  nguHanh?: string;
}

interface TuviInput {
  fullName: string;
  birthDate: string;
  birthHour: string;
  gender: "male" | "female";
  calendarType: "lunar" | "solar";
}

interface PalaceDetailModalProps {
  palace: Palace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  input?: TuviInput;
}

const PALACE_EXPLANATIONS: Record<string, { chinese: string; meaning: string; influence: string }> = {
  'Mệnh': {
    chinese: '命',
    meaning: 'Cung Mệnh đại diện cho tính cách, vận mệnh và con đường sống của người. Đây là cung quan trọng nhất trong lá số tử vi.',
    influence: 'Ảnh hưởng đến tổng thể vận mệnh, tính cách, khả năng lãnh đạo, sự tự tin và định hướng cuộc sống'
  },
  'Phụ Mẫu': {
    chinese: '父母',
    meaning: 'Cung Phụ Mẫu liên quan đến mối quan hệ với cha mẹ, những người bảo trợ và người hướng dẫn.',
    influence: 'Ảnh hưởng đến mối quan hệ gia đình, sự hỗ trợ từ người lớn tuổi, di sản gia đình'
  },
  'Phúc Đức': {
    chinese: '福德',
    meaning: 'Cung Phúc Đức thể hiện phúc báo, tài lộc, sự may mắn và hạnh phúc tinh thần trong cuộc sống.',
    influence: 'Ảnh hưởng đến tài chính, phúc lộc, sự hài lòng, tâm trạng và hạnh phúc nội tâm'
  },
  'Điền Trạch': {
    chinese: '田宅',
    meaning: 'Cung Điền Trạch liên quan đến bất động sản, nhà cửa, đất đai và tài sản cố định.',
    influence: 'Ảnh hưởng đến bất động sản, tài sản, nơi ở, di sản gia đình, môi trường sống'
  },
  'Quan Lộc': {
    chinese: '官祿',
    meaning: 'Cung Quan Lộc đại diện cho sự nghiệp, công việc, địa vị xã hội và thành công trong công việc.',
    influence: 'Ảnh hưởng đến sự nghiệp, công việc, địa vị, danh vọng, sự phát triển chuyên môn'
  },
  'Nô Bộc': {
    chinese: '奴僕',
    meaning: 'Cung Nô Bộc liên quan đến mối quan hệ với nhân viên, cấp dưới, bạn bè và đồng nghiệp.',
    influence: 'Ảnh hưởng đến mối quan hệ công việc, tình bạn, mối quan hệ cấp dưới, hợp tác'
  },
  'Thiên Di': {
    chinese: '遷移',
    meaning: 'Cung Thiên Di đại diện cho những thay đổi, di chuyển, du lịch và những cuộc hành trình.',
    influence: 'Ảnh hưởng đến du lịch, di cư, những thay đổi trong cuộc sống, phát triển bên ngoài'
  },
  'Tật Ách': {
    chinese: '疾厄',
    meaning: 'Cung Tật Ách liên quan đến sức khỏe, bệnh tật, những trở ngại và khó khăn cần vượt qua.',
    influence: 'Ảnh hưởng đến sức khỏe, bệnh tật, những khó khăn, khả năng vượt qua thử thách'
  },
  'Tài Bạch': {
    chinese: '財帛',
    meaning: 'Cung Tài Bạch đại diện cho tài chính, tiền bạc, thu nhập và tài sản động.',
    influence: 'Ảnh hưởng đến tài chính, tiền bạc, thu nhập, tài sản động, khả năng kiếm tiền'
  },
  'Tử Tức': {
    chinese: '子息',
    meaning: 'Cung Tử Tức liên quan đến con cái, những người kế thừa và mối quan hệ với con em.',
    influence: 'Ảnh hưởng đến con cái, tình yêu, mối quan hệ với con em, sự truyền thừa'
  },
  'Phu Thê': {
    chinese: '夫妻',
    meaning: 'Cung Phu Thê đại diện cho hôn nhân, tình yêu, mối quan hệ lãng mạn và đôi lứa.',
    influence: 'Ảnh hưởng đến hôn nhân, tình yêu, mối quan hệ đôi lứa, sự hòa hợp trong gia đình'
  },
  'Huynh Đệ': {
    chinese: '兄弟',
    meaning: 'Cung Huynh Đệ liên quan đến anh em ruột, người anh chị em và mối quan hệ anh em.',
    influence: 'Ảnh hưởng đến mối quan hệ anh em, sự hỗ trợ từ gia đình, tình cảm gia đình'
  },
};

const STAR_MEANINGS: Record<string, string> = {
  'Tử': 'Sao Tử - Sao chính của cung Tử Tức, tượng trưng cho sự phát triển, tài năng',
  'Phá': 'Sao Phá - Sao hung, tượng trưng cho sự phá vỡ, thay đổi',
  'Thăng': 'Sao Thăng - Sao cát, tượng trưng cho sự lên tiến, phát triển',
  'Liêm': 'Sao Liêm - Sao cát, tượng trưng cho sự liêm chính, tốt bụng',
  'Trinh': 'Sao Trinh - Sao cát, tượng trưng cho sự trinh khiết, thánh thiện',
  'Vũ': 'Sao Vũ - Sao hung, tượng trưng cho sự hung tợn, mạnh mẽ',
  'Tương': 'Sao Tương - Sao cát, tượng trưng cho sự hỗ trợ, giúp đỡ',
  'Hóa': 'Sao Hóa - Sao cát, tượng trưng cho sự hóa giải, chuyển hóa',
};

export default function PalaceDetailModal({ palace, open, onOpenChange, input }: PalaceDetailModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const analyzePalaceMutation = trpc.tuvi.analyzePalace.useMutation({
    onSuccess: (data: any) => {
      const content = typeof data === 'string' ? data : JSON.stringify(data);
      setAiAnalysis(content);
    },
    onError: (error: any) => {
      console.error("Lỗi AI:", error.message);
      setAiAnalysis("Không thể phân tích lúc này. Vui lòng thử lại sau.");
    },
  });

  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      setAiAnalysis(null); // Reset AI analysis when opening new palace
    }
  }, [open]);

  const handleAnalyzePalace = () => {
    if (!input || !palace) return;
    analyzePalaceMutation.mutate({
      ...input,
      palaceName: palace.name,
    });
  };

  if (!palace) return null;

  const explanation = PALACE_EXPLANATIONS[palace.name] || {
    chinese: '?',
    meaning: 'Thông tin chi tiết không khả dụng',
    influence: 'Ảnh hưởng chưa được xác định'
  };

  const mainStars = palace.mainStars || [];
  const secondaryStars = palace.secondaryStars || [];

  return (
    <>
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .palace-modal-content { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .palace-section { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .palace-section:nth-child(2) { animation-delay: 0.1s; }
        .palace-section:nth-child(3) { animation-delay: 0.2s; }
        .palace-section:nth-child(4) { animation-delay: 0.3s; }
        .palace-section:nth-child(5) { animation-delay: 0.4s; }
      `}</style>
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto palace-modal-content glass-card border border-white/10 bg-[#0f172a]/95 text-gray-100 shadow-2xl backdrop-blur-xl">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-2xl flex items-baseline gap-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 font-serif font-bold uppercase tracking-wide text-shadow-sm">
                {palace.name}
              </span>
              <span className="text-amber-500/60 text-xl font-serif">({explanation.chinese})</span>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 pt-2 pb-6">
              {/* Ý nghĩa cung */}
              <div className="palace-section">
                <h3 className="font-bold text-amber-400 mb-2 uppercase text-xs tracking-wider">Ý Nghĩa Cung</h3>
                <p className="text-gray-300 leading-relaxed font-light">{explanation.meaning}</p>
              </div>

              {/* Ảnh hưởng */}
              <div className="palace-section">
                <h3 className="font-bold text-amber-400 mb-2 uppercase text-xs tracking-wider">Ảnh Hưởng</h3>
                <p className="text-gray-300 leading-relaxed font-light">{explanation.influence}</p>
              </div>

              {/* Sao chính */}
              {mainStars.length > 0 && (
                <div className="palace-section">
                  <h3 className="font-bold text-purple-400 mb-3 uppercase text-xs tracking-wider">Chính Tinh (Sao Chính)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mainStars.map((star, i) => (
                      <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:border-purple-500/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className={`font-bold text-base ${
                              star.nature === 'cat' || star.nature === 'good' ? 'text-amber-300' :
                              star.nature === 'hung' || star.nature === 'bad' ? 'text-indigo-400' : 'text-gray-300'
                            }`}>
                              {star.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {STAR_MEANINGS[star.name] || `Sao ${star.name}`}
                            </div>
                          </div>
                          <Badge variant="outline" className={`border-none ${
                            star.nature === 'cat' || star.nature === 'good' ? 'bg-amber-500/20 text-amber-300' :
                            star.nature === 'hung' || star.nature === 'bad' ? 'bg-indigo-500/20 text-indigo-300' :
                            'bg-gray-700/50 text-gray-400'
                          }`}>
                            {star.nature === 'cat' || star.nature === 'good' ? 'Cát' : star.nature === 'hung' || star.nature === 'bad' ? 'Hung' : 'Trung'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sao phụ */}
              {secondaryStars.length > 0 && (
                <div className="palace-section">
                  <h3 className="font-bold text-gray-400 mb-3 uppercase text-xs tracking-wider">Phụ Tinh (Sao Phụ)</h3>
                  <div className="flex flex-wrap gap-2">
                    {secondaryStars.map((star, i) => (
                      <div
                        key={i}
                        className={`text-xs px-2.5 py-1 rounded border ${
                            star.nature === 'cat' || star.nature === 'good' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                            star.nature === 'hung' || star.nature === 'bad' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' :
                            'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        {star.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tràng Sinh & Ngũ Hành Row */}
              <div className="grid grid-cols-2 gap-4 palace-section">
                {palace.trangSinh && (
                    <div>
                        <h3 className="font-bold text-gray-500 mb-2 uppercase text-[10px] tracking-wider">Tràng Sinh</h3>
                        <div className="text-gray-200 bg-white/5 px-3 py-2 rounded border border-white/10 text-sm font-medium">
                            {palace.trangSinh}
                        </div>
                    </div>
                )}
                {palace.nguHanh && (
                    <div>
                        <h3 className="font-bold text-gray-500 mb-2 uppercase text-[10px] tracking-wider">Ngũ Hành</h3>
                        <div className="text-gray-200 bg-white/5 px-3 py-2 rounded border border-white/10 text-sm font-medium">
                            {palace.nguHanh}
                        </div>
                    </div>
                )}
              </div>

              {/* AI Analysis Section */}
              {input && (
                <div className="palace-section border-t border-white/10 pt-6 mt-6">
                  <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                    Luận Giải Chi Tiết (AI Master)
                  </h3>

                  {!aiAnalysis ? (
                    <div className="text-center py-6 bg-white/5 rounded-xl border border-white/5 dashed border-dashed">
                      <p className="text-gray-400 mb-4 text-sm">
                        Nhận phân tích chuyên sâu về cung {palace.name} từ hệ thống AI cao cấp
                      </p>
                      <Button
                        onClick={handleAnalyzePalace}
                        disabled={analyzePalaceMutation.isPending}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-purple-900/20"
                      >
                        {analyzePalaceMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang suy luận...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Phân Tích Ngay
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="glass-card bg-purple-900/10 p-5 rounded-xl border border-purple-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-20 h-20 text-purple-500" />
                        </div>
                      <div className="prose prose-sm prose-invert max-w-none relative z-10">
                        <Streamdown>{aiAnalysis}</Streamdown>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
