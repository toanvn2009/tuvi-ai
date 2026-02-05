import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Info } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Palace } from '@shared/types';
import { Streamdown } from 'streamdown';

interface TuviAnalysisPanelProps {
    palaces: Palace[];
    overviewAnalysis?: string;
    input: {
        fullName: string;
        birthDate: string;
        birthHour: string;
        gender: 'male' | 'female';
        calendarType: 'lunar' | 'solar';
    };
}

const PALACE_NAMES = [
    { id: 'overview', name: 'Tổng Quan', icon: '📊' },
    { id: 'Mệnh', name: 'Mệnh', icon: '✨' },
    { id: 'Phụ Mẫu', name: 'Phụ Mẫu', icon: '👨‍👩‍👧' },
    { id: 'Phúc Đức', name: 'Phúc Đức', icon: '🙏' },
    { id: 'Điền Trạch', name: 'Điền Trạch', icon: '🏠' },
    { id: 'Quan Lộc', name: 'Quan Lộc', icon: '💼' },
    { id: 'Nô Bộc', name: 'Nô Bộc', icon: '👥' },
    { id: 'Thiên Di', name: 'Thiên Di', icon: '✈️' },
    { id: 'Tật Ách', name: 'Tật Ách', icon: '🏥' },
    { id: 'Tài Bạch', name: 'Tài Bạch', icon: '💰' },
    { id: 'Tử Tức', name: 'Tử Tức', icon: '👶' },
    { id: 'Phu Thê', name: 'Phu Thê', icon: '💑' },
    { id: 'Huynh Đệ', name: 'Huynh Đệ', icon: '👫' },
];

const LOADING_MESSAGES_PHASE_1 = [
    "Thầy đang đi coi trộm Thiên Cơ, chờ xíu nhé... 🔮",
    "Đang mở cánh cổng thiên đình để xem lá số... 🚪✨",
    "Các vị thần đang kiểm tra hồ sơ của bạn... 👼📋",
    "Đang leo lên cung trăng hỏi Thái Âm... 🌙🪜",
    "Tử Vi sao đang tra cứu sổ sách vận mệnh... 📚🔍",
    "Đang gõ cửa điện Ngọc Hoàng xin phép xem... 👊",
];

const LOADING_MESSAGES_PHASE_2 = [
    "Tìm thấy rồi! Đang đọc kỹ nội dung... 👀📜",
    "Thiên Cơ đã mở kho bí mật, đang xem xét... 🗝️💎",
    "Các vì sao đang họp bàn về vận mệnh bạn... ⭐🗣️",
    "Phá Quân và Tham Lang đang tranh luận kịch liệt... ⚔️💬",
    "Đang phân tích 108 triệu vì sao... 🌌",
    "Thiên Lương đang cân nhắc từng chi tiết... ⚖️🤔",
];

const LOADING_MESSAGES_PHASE_3 = [
    "Đang dịch từ ngôn ngữ thiên thần ra tiếng Việt... 🗣️✍️",
    "AI Master đang viết thư pháp cho đẹp... 🖌️",
    "Đang định dạng lại cho dễ đọc... ✨",
    "Sắp xong rồi, đang kiểm tra lần cuối... ✅",
    "Đang thêm emoji cho sinh động... 🎨",
    "Thiên Thư đang đóng dấu xác nhận... 📬🔖",
];

const LOADING_MESSAGES_PHASE_4 = [
    "99% rồi, sắp ra kết quả đây! 🎯⏱️",
    "Chỉ còn vài giây nữa thôi... 🏁⏳",
    "Đang in ấn bản thảo cuối cùng... 📃",
    "Chuẩn bị đóng gói gửi xuống trần gian... 📦⬇️",
    "Sắp deliver rồi, mở to mắt đón nhận nhé! 👁️✨",
];

const getProgressiveLoadingMessage = (elapsedSeconds: number) => {
    let messages: string[];
    if (elapsedSeconds < 30) messages = LOADING_MESSAGES_PHASE_1;
    else if (elapsedSeconds < 60) messages = LOADING_MESSAGES_PHASE_2;
    else if (elapsedSeconds < 90) messages = LOADING_MESSAGES_PHASE_3;
    else messages = LOADING_MESSAGES_PHASE_4;
    return messages[Math.floor(Math.random() * messages.length)];
};

export const TuviAnalysisPanel: React.FC<TuviAnalysisPanelProps> = ({
    palaces,
    overviewAnalysis,
    input,
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [palaceAnalyses, setPalaceAnalyses] = useState<Record<string, string>>({});
    const [loadingPalace, setLoadingPalace] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    React.useEffect(() => {
        if (loadingPalace) {
            setElapsedSeconds(0);
            setLoadingMessage(getProgressiveLoadingMessage(0));
            const timeInterval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
            const messageInterval = setInterval(() => {
                setElapsedSeconds(prev => {
                    setLoadingMessage(getProgressiveLoadingMessage(prev + 1));
                    return prev + 1;
                });
            }, 20000);
            return () => {
                clearInterval(timeInterval);
                clearInterval(messageInterval);
            };
        }
    }, [loadingPalace]);

    const analyzePalaceMutation = trpc.tuvi.analyzePalace.useMutation({
        onSuccess: (data, variables) => {
            setPalaceAnalyses(prev => ({ ...prev, [variables.palaceName]: data.analysis }));
            setLoadingPalace(null);
        },
        onError: () => setLoadingPalace(null)
    });

    const handlePalaceAnalysis = (palaceName: string) => {
        if (palaceAnalyses[palaceName] || loadingPalace) return;
        setLoadingPalace(palaceName);
        analyzePalaceMutation.mutate({ ...input, palaceName });
    };

    return (
        <div className="w-full glass-card bg-[#0f172a]/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent font-serif">
                    Luận Giải Tử Vi - AI Master
                </h2>
            </div>
            
            <div className="p-4 md:p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Tab List */}
                    <TabsList className="w-full flex flex-nowrap overflow-x-auto gap-1 h-auto bg-white/5 p-1 mb-6 no-scrollbar rounded-xl border border-white/5">
                        {PALACE_NAMES.map((palace) => (
                            <TabsTrigger
                                key={palace.id}
                                value={palace.id}
                                className="flex-shrink-0 flex flex-col items-center gap-1 py-3 px-4 min-w-[70px] transition-all duration-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 hover:text-white rounded-lg group"
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform">{palace.icon}</span>
                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{palace.name}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
                        <div className="glass-card bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                            <div className="p-4 border-b border-white/5 bg-white/5">
                                <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                                    📊 Phân Tích Tổng Quan
                                </h3>
                            </div>
                            <div className="p-6">
                                {overviewAnalysis ? (
                                    <div className="prose prose-invert prose-purple max-w-none text-gray-200 leading-relaxed">
                                        <Streamdown>{overviewAnalysis}</Streamdown>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                                        <p className="text-gray-400 font-medium">Chưa có phân tích tổng quan.</p>
                                        <p className="text-sm mt-1">Vui lòng nhấn nút "Luận giải ngay" ở trang trước để bắt đầu.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Individual Palace Tabs */}
                    {PALACE_NAMES.slice(1).map((palaceInfo) => {
                        const palace = palaces.find(p => p.name === palaceInfo.id);
                        if (!palace) return null;

                        const analysis = palaceAnalyses[palaceInfo.id];
                        const isLoading = loadingPalace === palaceInfo.id;
                        const isCached = analyzePalaceMutation.data?.cached && analyzePalaceMutation.variables?.palaceName === palaceInfo.id;

                        return (
                            <TabsContent key={palaceInfo.id} value={palaceInfo.id} className="mt-0 focus-visible:outline-none">
                                <div className="glass-card bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                                            <span className="text-2xl">{palaceInfo.icon}</span>
                                            Cung {palaceInfo.name}
                                            {(palace as any).earthlyBranch && (
                                                <span className="text-xs text-gray-400 font-normal">({(palace as any).earthlyBranch})</span>
                                            )}
                                        </h3>
                                        {isCached && (
                                            <Badge variant="secondary" className="bg-emerald-900/40 text-emerald-400 border-emerald-500/30">
                                                ⚡ Cached
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="p-6 space-y-8">
                                        {/* Palace Info Grid */}
                                        <div className="grid md:grid-cols-2 gap-6 p-6 bg-[#020617]/50 rounded-xl border border-white/5">
                                            <div>
                                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                    Chủ Tinh
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {palace.mainStars.map((star, idx) => (
                                                        <Badge key={idx} className="bg-purple-600/80 hover:bg-purple-600 text-white px-3 py-1 text-sm border-none shadow-sm">
                                                            {star.name}
                                                        </Badge>
                                                    ))}
                                                    {palace.mainStars.length === 0 && (
                                                        <span className="text-sm text-gray-500 italic">Vô chính diệu</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                    Phụ Tinh
                                                </h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {palace.secondaryStars.slice(0, 12).map((star, idx) => (
                                                        <Badge key={idx} variant="outline" className="border-white/10 text-gray-400 bg-white/5 hover:bg-white/10 px-2 py-0.5 text-[11px]">
                                                            {star.name}
                                                        </Badge>
                                                    ))}
                                                    {palace.secondaryStars.length > 12 && (
                                                        <Badge variant="outline" className="border-white/10 text-gray-500 bg-white/5 px-2 py-0.5 text-[10px]">
                                                            +{palace.secondaryStars.length - 12}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Analysis Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-gray-100 flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                                    Luận Giải Chi Tiết (AI)
                                                </h4>
                                                {!analysis && !isLoading && (
                                                    <Button
                                                        onClick={() => handlePalaceAnalysis(palaceInfo.id)}
                                                        size="sm"
                                                        className="bg-purple-600 hover:bg-purple-700 text-white h-9 rounded-lg"
                                                    >
                                                        <Sparkles className="w-4 h-4 mr-1.5" />
                                                        Luận giải ngay
                                                    </Button>
                                                )}
                                            </div>

                                            {isLoading && (
                                                <div className="flex flex-col items-center justify-center py-16 bg-white/5 rounded-xl border border-dashed border-white/10">
                                                    <Loader2 className="w-10 h-10 animate-spin text-purple-400 mb-4" />
                                                    <p className="text-purple-300 font-medium animate-pulse">{loadingMessage}</p>
                                                </div>
                                            )}

                                            {analysis && (
                                                <div className="prose prose-invert prose-purple max-w-none bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/20 text-gray-200 leading-relaxed shadow-inner">
                                                    <Streamdown>{analysis}</Streamdown>
                                                </div>
                                            )}

                                            {!analysis && !isLoading && (
                                                <div className="text-center py-12 bg-white/5 rounded-xl border-2 border-dashed border-white/5 group hover:border-purple-500/20 transition-colors">
                                                    <Sparkles className="w-14 h-14 text-gray-700 mx-auto mb-4 group-hover:scale-110 group-hover:text-purple-700 transition-all" />
                                                    <p className="text-gray-300 font-bold text-lg mb-1">Cơ trời sắp hé lộ...</p>
                                                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                                                        Nhấn nút phía trên để AI Master phân tích chuyên sâu các yếu tố Tam Phương Tứ Chính tại cung {palaceInfo.name}.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </div>
    );
};
