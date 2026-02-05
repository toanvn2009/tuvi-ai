/**
 * FortuneTicker - Component hiển thị dự báo vận may theo giờ
 * Tính toán Giờ Hoàng Đạo và đưa ra lời khuyên thời gian thực
 */

import { useState, useEffect } from 'react';
import { Sparkles, Star, AlertTriangle, TrendingUp, Heart, Briefcase, DollarSign, Plane, Calendar } from 'lucide-react';

// 12 Chi giờ và thời gian tương ứng
const HOUR_BRANCHES = [
  { branch: 'Tý', start: 23, end: 1, emoji: '🐀' },
  { branch: 'Sửu', start: 1, end: 3, emoji: '🐂' },
  { branch: 'Dần', start: 3, end: 5, emoji: '🐅' },
  { branch: 'Mão', start: 5, end: 7, emoji: '🐇' },
  { branch: 'Thìn', start: 7, end: 9, emoji: '🐉' },
  { branch: 'Tỵ', start: 9, end: 11, emoji: '🐍' },
  { branch: 'Ngọ', start: 11, end: 13, emoji: '🐎' },
  { branch: 'Mùi', start: 13, end: 15, emoji: '🐑' },
  { branch: 'Thân', start: 15, end: 17, emoji: '🐒' },
  { branch: 'Dậu', start: 17, end: 19, emoji: '🐓' },
  { branch: 'Tuất', start: 19, end: 21, emoji: '🐕' },
  { branch: 'Hợi', start: 21, end: 23, emoji: '🐖' },
];

// Giờ Hoàng Đạo theo ngày trong tuần (simplified)
// 0 = Chủ Nhật, 1 = Thứ Hai, ...
const HOANG_DAO_BY_DAY: Record<number, string[]> = {
  0: ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Mùi', 'Dậu'], // Chủ Nhật
  1: ['Dần', 'Mão', 'Tỵ', 'Thân', 'Dậu', 'Hợi'], // Thứ Hai
  2: ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'], // Thứ Ba
  3: ['Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu', 'Tý'], // Thứ Tư
  4: ['Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi', 'Sửu'], // Thứ Năm
  5: ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Tuất'], // Thứ Sáu
  6: ['Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi', 'Sửu'], // Thứ Bảy
};

// Lời khuyên theo từng giờ
const HOUR_ADVICE: Record<string, { good: string[]; bad: string[]; tip: string }> = {
  'Tý': {
    good: ['Cầu tài', 'Xuất hành hướng Bắc', 'Khởi sự mới'],
    bad: ['Động thổ', 'Ký hợp đồng'],
    tip: 'Giờ Tý khai phát - Thuận lợi cho việc khởi đầu, tư duy sáng tạo.'
  },
  'Sửu': {
    good: ['Cúng lễ', 'Làm việc cần tập trung', 'Học tập'],
    bad: ['Xuất hành xa', 'Giao dịch lớn'],
    tip: 'Giờ Sửu tĩnh lặng - Thích hợp cho suy ngẫm và làm việc một mình.'
  },
  'Dần': {
    good: ['Xuất hành', 'Khai trương', 'Gặp đối tác'],
    bad: ['Cầu hôn', 'Kiện tụng'],
    tip: 'Giờ Dần sinh khí - Năng lượng mạnh mẽ, thuận lợi cho những bước đi quan trọng.'
  },
  'Mão': {
    good: ['Giao lưu', 'Đàm phán', 'Họp nhóm'],
    bad: ['Ký kết văn bản', 'Chốt giao dịch'],
    tip: 'Giờ Mão mềm mại - Thích hợp cho các cuộc trò chuyện, kết nối xã hội.'
  },
  'Thìn': {
    good: ['Động thổ', 'Xây dựng', 'Giao dịch bất động sản'],
    bad: ['Xuất hành hướng Đông', 'Khai trương'],
    tip: 'Giờ Thìn long vượng - Vượng khí đất trời, thuận lợi cho xây dựng.'
  },
  'Tỵ': {
    good: ['Làm đẹp', 'Gặp gỡ', 'Sáng tạo nghệ thuật'],
    bad: ['Giao dịch tiền bạc', 'Vay mượn'],
    tip: 'Giờ Tỵ linh hoạt - Thích hợp cho các hoạt động sáng tạo và giao tiếp.'
  },
  'Ngọ': {
    good: ['Cầu tài', 'Khai trương', 'Ký hợp đồng'],
    bad: ['Cầu hôn', 'Đi xa'],
    tip: 'Giờ Ngọ hỏa vượng - Năng lượng cao điểm, thuận lợi cho việc làm ăn.'
  },
  'Mùi': {
    good: ['Yến tiệc', 'Đám cưới', 'Gặp mặt gia đình'],
    bad: ['Xuất hành xa', 'Khởi công'],
    tip: 'Giờ Mùi sum vầy - Thích hợp cho các hoạt động gia đình, sum họp.'
  },
  'Thân': {
    good: ['Xuất hành', 'Giao dịch', 'Ký kết hợp đồng'],
    bad: ['Cúng lễ', 'An táng'],
    tip: 'Giờ Thân linh hoạt - Thuận lợi cho di chuyển và các giao dịch nhanh.'
  },
  'Dậu': {
    good: ['Thu tiền', 'Đòi nợ', 'Kết thúc dự án'],
    bad: ['Bắt đầu việc mới', 'Khai trương'],
    tip: 'Giờ Dậu thu hoạch - Thích hợp cho việc thu kết, hoàn tất công việc.'
  },
  'Tuất': {
    good: ['Họp mặt', 'Bàn luận', 'Giải quyết tranh chấp'],
    bad: ['Cầu tài', 'Đầu tư'],
    tip: 'Giờ Tuất trung lập - Thích hợp cho các cuộc thảo luận nghiêm túc.'
  },
  'Hợi': {
    good: ['Nghỉ ngơi', 'Thiền định', 'Lên kế hoạch'],
    bad: ['Khởi sự mới', 'Xuất hành'],
    tip: 'Giờ Hợi tĩnh tâm - Thời điểm phản tư và chuẩn bị cho ngày mới.'
  },
};

// Tính giờ chi hiện tại
function getCurrentHourBranch(date: Date): typeof HOUR_BRANCHES[0] {
  const hour = date.getHours();
  
  // Giờ Tý bắt đầu từ 23h ngày hôm trước
  if (hour >= 23 || hour < 1) return HOUR_BRANCHES[0]; // Tý
  
  for (const branch of HOUR_BRANCHES) {
    if (hour >= branch.start && hour < branch.end) {
      return branch;
    }
  }
  
  return HOUR_BRANCHES[0];
}

// Kiểm tra có phải giờ hoàng đạo không
function isHoangDao(date: Date, branchName: string): boolean {
  const dayOfWeek = date.getDay();
  const hoangDaoHours = HOANG_DAO_BY_DAY[dayOfWeek] || [];
  return hoangDaoHours.includes(branchName);
}

export default function FortuneTicker() {
  const [time, setTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000); // Update every 30s
    return () => clearInterval(timer);
  }, []);

  const currentBranch = getCurrentHourBranch(time);
  const isGoodHour = isHoangDao(time, currentBranch.branch);
  const advice = HOUR_ADVICE[currentBranch.branch];

  return (
    <div className="relative">
      {/* Compact View */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
          isGoodHour 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
        }`}
      >
        <span className="text-base">{currentBranch.emoji}</span>
        <span className="text-xs font-bold uppercase tracking-wider">
          Giờ {currentBranch.branch}
        </span>
        {isGoodHour ? (
          <Star className="w-3 h-3 text-emerald-400 animate-pulse" />
        ) : (
          <AlertTriangle className="w-3 h-3 text-amber-400" />
        )}
        <span className="text-[10px] font-medium hidden md:inline">
          {isGoodHour ? 'Hoàng Đạo' : 'Bình Thường'}
        </span>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 md:w-96 z-50 animate-fade-in">
          <div className={`rounded-2xl p-5 shadow-2xl backdrop-blur-xl border ${
            isGoodHour 
              ? 'bg-[#0f172a]/95 border-emerald-500/30 shadow-emerald-500/10' 
              : 'bg-[#0f172a]/95 border-amber-500/30 shadow-amber-500/10'
          }`}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                isGoodHour ? 'bg-emerald-500/20' : 'bg-amber-500/20'
              }`}>
                {currentBranch.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">Giờ {currentBranch.branch}</h3>
                  {isGoodHour && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                      Hoàng Đạo
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{advice.tip}</p>
              </div>
            </div>

            {/* Good Activities */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Nên Làm</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {advice.good.map((item, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bad Activities */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Nên Tránh</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {advice.bad.map((item, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-300 text-xs font-medium border border-red-500/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Next Hour Preview */}
            <div className="pt-3 border-t border-white/10 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                Giờ tiếp theo: {HOUR_BRANCHES[(HOUR_BRANCHES.findIndex(b => b.branch === currentBranch.branch) + 1) % 12].branch} {HOUR_BRANCHES[(HOUR_BRANCHES.findIndex(b => b.branch === currentBranch.branch) + 1) % 12].emoji}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
