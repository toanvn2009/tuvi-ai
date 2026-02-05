import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { getLoginUrl } from "@/const";
import { History as HistoryIcon, Star, Hash, Loader2, Calendar, User, Eye, Clock, Download, Trash2, Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";
import { exportTuViToPDF, exportNumerologyToPDF } from "@/lib/pdfExport";
import { toast } from "sonner";
import ShareButtons from "@/components/ShareButtons";
import { formatDateVN, formatDateTimeVN } from "@/lib/dateUtils";

function TuviHistory() {
  const utils = trpc.useUtils();
  const { data: readings, isLoading } = trpc.tuvi.history.useQuery();
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteMutation = trpc.tuvi.delete.useMutation({
    onSuccess: () => {
      toast.success("Đã xóa kết quả tra cứu");
      utils.tuvi.history.invalidate();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Không thể xóa kết quả");
    },
  });

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  const handleExportPDF = (reading: any) => {
    try {
      const chartData = typeof reading.chartData === 'string' 
        ? JSON.parse(reading.chartData) 
        : reading.chartData;
      
      exportTuViToPDF({
        fullName: reading.fullName,
        birthDate: reading.birthDate,
        birthHour: reading.birthHour,
        gender: reading.gender,
        calendarType: reading.calendarType,
        palaces: chartData.palaces || [],
        element: chartData.element,
        heavenlyStem: chartData.heavenlyStem,
        earthlyBranch: chartData.earthlyBranch,
        aiAnalysis: reading.aiAnalysis,
      });
      toast.success("Đã tải xuống file PDF");
    } catch (error) {
      toast.error("Không thể tạo file PDF");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <div className="glass-card bg-white/5 border-white/10 text-center py-20 animate-fade-in-up rounded-3xl">
        <Star className="w-16 h-16 mx-auto text-gray-700 mb-6 opacity-20" />
        <h3 className="font-black text-2xl text-white mb-3">Chưa có lịch sử</h3>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto">
          Hành trình khám phá bản thân bắt đầu từ một bước chân. Hãy gieo quẻ đầu tiên ngay!
        </p>
        <Link href="/tuvi">
          <Button className="h-14 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl">
             Khai Mở Lá Số Tử Vi
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {readings.map((reading: any, index: number) => (
          <div 
            key={reading.id} 
            className="p-6 glass-card bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500 animate-fade-in-up cursor-pointer group rounded-2xl relative overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setSelectedReading(reading)}
          >
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <Star className="w-7 h-7 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-white text-lg group-hover:text-purple-300 transition-colors truncate">{reading.fullName}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {formatDateVN(reading.birthDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    {reading.gender === "male" ? "Nam" : "Nữ"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  Lưu lúc: {formatDateTimeVN(reading.createdAt)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  onClick={(e) => handleDelete(reading.id, e)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="w-8 h-8 flex items-center justify-center text-purple-400 group-hover:translate-x-1 transition-transform">
                    <Eye className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card bg-[#0f172a] border-white/10 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-xl font-bold">Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Dữ liệu tra cứu này sẽ biến mất vĩnh viễn khỏi dòng thời gian của bạn. Bạn chắc chứ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Xóa Ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedReading} onOpenChange={() => setSelectedReading(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-card bg-[#0f172a] border-white/10 rounded-[2.5rem] p-0 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          
          <div className="p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center shadow-lg">
                  <Star className="w-10 h-10 text-purple-400" />
               </div>
               <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Lá Số Tử Vi</h2>
                  <p className="text-lg text-purple-400 font-bold uppercase tracking-widest">{selectedReading?.fullName}</p>
               </div>
            </div>
            
            {selectedReading && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Ngày sinh", value: formatDateVN(selectedReading.birthDate) },
                    { label: "Giờ sinh", value: selectedReading.birthHour },
                    { label: "Giới tính", value: selectedReading.gender === "male" ? "Nam" : "Nữ" },
                    { label: "Loại lịch", value: selectedReading.calendarType === "lunar" ? "Âm lịch" : "Dương lịch" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:border-white/10 transition-all">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                {selectedReading.aiAnalysis && (
                  <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20 relative overflow-hidden group">
                    <h4 className="font-black text-indigo-400 mb-6 flex items-center gap-3 uppercase tracking-[0.2em] text-sm">
                      <Sparkles className="w-5 h-5" />
                      Phân Tích Chiêm Tinh AI
                    </h4>
                    <div className="prose prose-invert prose-indigo max-w-none text-gray-300 relative z-10 text-sm leading-relaxed">
                      <Streamdown>{selectedReading.aiAnalysis}</Streamdown>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
                  <ShareButtons
                    title="Lá Số Tử Vi"
                    description={`Lá số tử vi của ${selectedReading.fullName}`}
                    type="tuvi"
                    data={{
                      name: selectedReading.fullName,
                      birthDate: formatDateVN(selectedReading.birthDate),
                    }}
                  />
                  <Button
                    onClick={() => handleExportPDF(selectedReading)}
                    className="flex-1 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    Tải PDF Chuyên Sâu
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function NumerologyHistory() {
  const utils = trpc.useUtils();
  const { data: readings, isLoading } = trpc.numerology.history.useQuery();
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteMutation = trpc.numerology.delete.useMutation({
    onSuccess: () => {
      toast.success("Đã xóa kết quả tra cứu");
      utils.numerology.history.invalidate();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Không thể xóa kết quả");
    },
  });

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  const handleExportPDF = (reading: any) => {
    try {
      const birthChart = typeof reading.birthChart === 'string' 
        ? JSON.parse(reading.birthChart) 
        : reading.birthChart;
      
      exportNumerologyToPDF({
        fullName: reading.fullName,
        birthDate: reading.birthDate,
        lifePathNumber: reading.lifePathNumber,
        soulNumber: reading.soulNumber,
        personalityNumber: reading.personalityNumber,
        destinyNumber: reading.destinyNumber,
        birthDayNumber: reading.birthDayNumber,
        birthChart: birthChart || [],
        aiAnalysis: reading.aiAnalysis,
      });
      toast.success("Đã tải xuống file PDF");
    } catch (error) {
      toast.error("Không thể tạo file PDF");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <div className="glass-card bg-white/5 border-white/10 text-center py-20 animate-fade-in-up rounded-3xl">
        <Hash className="w-16 h-16 mx-auto text-gray-700 mb-6 opacity-20" />
        <h3 className="font-black text-2xl text-white mb-3">Chưa có lịch sử</h3>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto">
          Các con số mang trong mình sức mạnh định mệnh. Hãy khám phá con số của bạn ngay!
        </p>
        <Link href="/numerology">
          <Button className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl">
             Giải Mã Thần Số Học
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {readings.map((reading: any, index: number) => (
          <div 
            key={reading.id} 
            className="p-6 glass-card bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-500 animate-fade-in-up cursor-pointer group rounded-2xl relative overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setSelectedReading(reading)}
          >
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <Hash className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-white text-lg group-hover:text-indigo-300 transition-colors truncate">{reading.fullName}</h3>
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 mt-1 uppercase tracking-widest font-black">
                   Số chủ đạo: {reading.lifePathNumber}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-gray-400 border border-white/5">Hồn: {reading.soulNumber}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-gray-400 border border-white/5">Mệnh: {reading.destinyNumber}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  onClick={(e) => handleDelete(reading.id, e)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="w-8 h-8 flex items-center justify-center text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <Eye className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card bg-[#0f172a] border-white/10 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-xl font-bold">Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Dữ liệu tra cứu này sẽ biến mất vĩnh viễn khỏi dòng thời gian của bạn. Bạn chắc chứ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Xóa Ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedReading} onOpenChange={() => setSelectedReading(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-card bg-[#0f172a] border-white/10 rounded-[2.5rem] p-0 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          
          <div className="p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg">
                  <Hash className="w-10 h-10 text-indigo-400" />
               </div>
               <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Thần Số Học</h2>
                  <p className="text-lg text-indigo-400 font-bold uppercase tracking-widest">{selectedReading?.fullName}</p>
               </div>
            </div>
            
            {selectedReading && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: "Số Chủ Đạo", value: selectedReading.lifePathNumber, color: "text-indigo-400" },
                    { label: "Linh Hồn", value: selectedReading.soulNumber, color: "text-rose-400" },
                    { label: "Nhân Cách", value: selectedReading.personalityNumber, color: "text-amber-400" },
                    { label: "Định Mệnh", value: selectedReading.destinyNumber, color: "text-emerald-400" },
                    { label: "Ngày Sinh", value: selectedReading.birthDayNumber, color: "text-blue-400" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:border-white/10 transition-all">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{item.label}</p>
                      <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {selectedReading.aiAnalysis && (
                  <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20 relative overflow-hidden group">
                    <h4 className="font-black text-indigo-400 mb-6 flex items-center gap-3 uppercase tracking-[0.2em] text-sm">
                      <Sparkles className="w-5 h-5" />
                      Cẩm Nang Vận Mệnh AI
                    </h4>
                    <div className="prose prose-invert prose-indigo max-w-none text-gray-300 relative z-10 text-sm leading-relaxed">
                      <Streamdown>{selectedReading.aiAnalysis}</Streamdown>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
                  <ShareButtons
                    title="Thần Số Học"
                    description={`Kết quả thần số học của ${selectedReading.fullName}`}
                    type="numerology"
                    data={{
                      name: selectedReading.fullName,
                      birthDate: formatDateVN(selectedReading.birthDate),
                      mainNumber: selectedReading.lifePathNumber,
                    }}
                  />
                  <Button
                    onClick={() => handleExportPDF(selectedReading)}
                    className="flex-1 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    Tải PDF Chuyên Sâu
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function History() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(168,85,247,0.1),transparent_70%)]" />
          <div className="container relative z-10">
            <div className="max-w-md mx-auto text-center animate-fade-in-up">
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center shadow-2xl rotate-3">
                <HistoryIcon className="w-12 h-12 text-purple-400" />
              </div>
              <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
                Đăng Nhập Để Xem Lịch Sử
              </h1>
              <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                Bạn cần đăng nhập để xem lịch sử tra cứu Tử Vi và Thần Số Học của mình. Mọi thông tin sẽ được lưu giữ bảo mật.
              </p>
              <a href={getLoginUrl()}>
                <Button className="h-16 px-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all active:scale-95">
                  Đăng Nhập Ngay
                </Button>
              </a>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.1),transparent_70%)]" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm font-bold mb-8 animate-fade-in-down backdrop-blur-md uppercase tracking-widest">
              <HistoryIcon className="w-4 h-4" />
              Dòng thời gian
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter text-glow">
              Lịch Sử <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">Tra Cứu</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100 font-medium">
              Nơi lưu trữ những khoảnh khắc khai sáng. Xem lại các lá số tử vi và kết quả thần số học bạn đã khám phá.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="tuvi" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-12 bg-white/5 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl h-auto animate-fade-in-up">
                <TabsTrigger value="tuvi" className="py-4 font-black rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white uppercase tracking-widest text-xs gap-3">
                  <Star className="w-4 h-4" />
                  LÁ SỐ TỬ VI
                </TabsTrigger>
                <TabsTrigger value="numerology" className="py-4 font-black rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white uppercase tracking-widest text-xs gap-3">
                  <Hash className="w-4 h-4" />
                  THẦN SỐ HỌC
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tuvi" className="mt-0 animate-fade-in outline-none focus:outline-none focus:ring-0">
                <TuviHistory />
              </TabsContent>
              
              <TabsContent value="numerology" className="mt-0 animate-fade-in outline-none focus:outline-none focus:ring-0">
                <NumerologyHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
