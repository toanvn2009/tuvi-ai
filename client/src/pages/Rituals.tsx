/**
 * Rituals Page - Trang Văn Khấn & Cúng Lễ
 * Cẩm nang văn khấn chuẩn cho các dịp lễ quan trọng
 */

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
  Edit3,
  Download,
  Printer,
  X
} from "lucide-react";
import { toast } from "sonner";
import ritualsData from "@shared/data/rituals.json";

interface Ritual {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  content: string;
}

const CATEGORIES = [
  { id: "all", label: "Tất Cả", icon: "📜" },
  { id: "tet", label: "Tết Nguyên Đán", icon: "🧧" },
  { id: "business", label: "Kinh Doanh", icon: "💼" },
  { id: "construction", label: "Xây Dựng", icon: "🏗️" },
  { id: "home", label: "Gia Đạo", icon: "🏠" },
];

export default function Rituals() {
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    date: "",
    custom1: "",
    custom2: "",
  });

  const rituals: Ritual[] = ritualsData.rituals;

  const filteredRituals = activeCategory === "all" 
    ? rituals 
    : rituals.filter(r => r.category === activeCategory);

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast.success("Đã sao chép văn khấn!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Không thể sao chép");
    }
  };

  const applyFormData = (content: string) => {
    let result = content;
    if (formData.name) {
      result = result.replace(/Tín chủ con là: ___/g, `Tín chủ con là: ${formData.name}`);
    }
    if (formData.address) {
      result = result.replace(/Ngụ tại: ___/g, `Ngụ tại: ${formData.address}`);
      result = result.replace(/Địa chỉ.*?: ___/g, (match) => match.replace('___', formData.address));
    }
    return result;
  };

  const handleSelectRitual = (ritual: Ritual) => {
    setSelectedRitual(ritual);
    setEditedContent(applyFormData(ritual.content));
    setIsEditing(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedRitual?.title}</title>
            <style>
              body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.8; }
              h1 { text-align: center; color: #8B0000; margin-bottom: 30px; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: 16px; }
            </style>
          </head>
          <body>
            <h1>${selectedRitual?.icon} ${selectedRitual?.title}</h1>
            <pre>${isEditing ? editedContent : applyFormData(selectedRitual?.content || '')}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  useEffect(() => {
    if (selectedRitual) {
      setEditedContent(applyFormData(selectedRitual.content));
    }
  }, [formData, selectedRitual]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1e1b4b] to-background py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(220,38,38,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 text-red-400 text-xs font-bold mb-6 border border-red-500/20 backdrop-blur-md animate-twinkle">
              <BookOpen className="w-4 h-4" />
              CẨM NANG VĂN KHẤN CHUẨN
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tighter text-glow font-serif">
              Văn Khấn <span className="bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent">& Cúng Lễ</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
              Tổng hợp các bài văn khấn chuẩn cho mọi dịp lễ. Tùy chỉnh thông tin cá nhân và in trực tiếp.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        {!selectedRitual ? (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Personal Info Form */}
            <div className="glass-card bg-[#0f172a]/60 border-purple-500/20 max-w-2xl mx-auto mb-10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Edit3 className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Điền Thông Tin Cá Nhân (Tùy chọn)</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Thông tin này sẽ tự động điền vào các bài văn khấn.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 text-xs mb-1.5 block">Họ và Tên</Label>
                  <Input
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-xs mb-1.5 block">Địa Chỉ</Label>
                  <Input
                    placeholder="Số 123, Phố A, Quận B"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Rituals Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRituals.map((ritual) => (
                <button
                  key={ritual.id}
                  onClick={() => handleSelectRitual(ritual)}
                  className="glass-card bg-[#0f172a]/60 border-white/10 hover:border-purple-500/30 p-6 text-left transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-amber-500/20 border border-red-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {ritual.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1 group-hover:text-purple-300 transition-colors">
                        {ritual.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {ritual.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Ritual Detail View */
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setSelectedRitual(null)}
              className="mb-6 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>

            <div className="glass-card bg-[#0f172a]/60 border-red-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              
              {/* Header */}
              <div className="p-8 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-amber-500/20 border border-red-500/30 flex items-center justify-center text-3xl">
                    {selectedRitual.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                      {selectedRitual.title}
                    </h2>
                    <p className="text-gray-400">{selectedRitual.description}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-white/5 flex flex-wrap gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-white/20 text-gray-300 hover:bg-white/10"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? "Xem Gốc" : "Chỉnh Sửa"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(isEditing ? editedContent : applyFormData(selectedRitual.content), selectedRitual.id)}
                  className="border-white/20 text-gray-300 hover:bg-white/10"
                >
                  {copiedId === selectedRitual.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Đã Sao Chép
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Sao Chép
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  In Văn Khấn
                </Button>
              </div>

              {/* Content */}
              <div className="p-8 relative z-10">
                {isEditing ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[500px] bg-white/5 border-white/10 text-gray-200 font-serif text-lg leading-relaxed whitespace-pre-wrap"
                  />
                ) : (
                  <div className="prose prose-invert prose-lg max-w-none">
                    <pre className="whitespace-pre-wrap font-serif text-gray-200 leading-loose text-lg bg-transparent p-0 m-0">
                      {applyFormData(selectedRitual.content)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="p-6 bg-amber-500/5 border-t border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-1">Lưu ý khi cúng</h4>
                    <p className="text-gray-400 text-sm">
                      Trang phục gọn gàng, thành tâm. Đọc văn khấn rõ ràng, chậm rãi. Sau khi khấn xong, chắp tay vái 3 vái.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
