/**
 * TeamCompatibility - Xem tương hợp nhóm nhiều người
 * Cho phép thêm 3-6 người và hiển thị ma trận tương hợp
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Trash2,
  Loader2,
  Sparkles,
  Heart
} from "lucide-react";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => 2025 - i);

interface TeamMember {
  id: string;
  fullName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

interface CompatibilityResult {
  person1: string;
  person2: string;
  score: number;
  relationship: string;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Score color based on value
function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"; // Green
  if (score >= 60) return "#eab308"; // Yellow
  if (score >= 40) return "#f97316"; // Orange
  return "#ef4444"; // Red
}

function getScoreEmoji(score: number): string {
  if (score >= 85) return "💕";
  if (score >= 70) return "💛";
  if (score >= 50) return "🤝";
  return "⚡";
}

// Input component for a team member
function MemberInput({
  member,
  index,
  onChange,
  onRemove,
  canRemove
}: {
  member: TeamMember;
  index: number;
  onChange: (id: string, field: keyof TeamMember, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) {
  const colors = ["rose", "indigo", "amber", "emerald", "purple", "cyan"];
  const color = colors[index % colors.length];

  return (
    <div className={`p-5 rounded-2xl bg-white/5 border border-${color}-500/20 backdrop-blur-sm relative group transition-all hover:border-${color}-500/40`}>
      {canRemove && (
        <button
          onClick={() => onRemove(member.id)}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center text-${color}-400 font-bold`}>
          {index + 1}
        </div>
        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
          Thành viên {index + 1}
        </span>
      </div>
      
      <div className="space-y-4">
        <Input
          placeholder="Nhập họ tên..."
          value={member.fullName}
          onChange={(e) => onChange(member.id, "fullName", e.target.value)}
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
        />
        
        <div className="grid grid-cols-3 gap-2">
          <Select
            value={String(member.birthDay)}
            onValueChange={(v) => onChange(member.id, "birthDay", parseInt(v))}
          >
            <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-sm">
              <SelectValue placeholder="Ngày" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f172a] border-white/10">
              {DAYS.map((d) => (
                <SelectItem key={d} value={String(d)} className="text-white hover:bg-white/10">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={String(member.birthMonth)}
            onValueChange={(v) => onChange(member.id, "birthMonth", parseInt(v))}
          >
            <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-sm">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f172a] border-white/10">
              {MONTHS.map((m) => (
                <SelectItem key={m} value={String(m)} className="text-white hover:bg-white/10">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={String(member.birthYear)}
            onValueChange={(v) => onChange(member.id, "birthYear", parseInt(v))}
          >
            <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-sm">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f172a] border-white/10">
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)} className="text-white hover:bg-white/10">{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// Matrix cell
function MatrixCell({ score, name1, name2 }: { score: number; name1: string; name2: string }) {
  const color = getScoreColor(score);
  const emoji = getScoreEmoji(score);
  
  return (
    <div 
      className="aspect-square flex flex-col items-center justify-center rounded-xl border border-white/10 hover:scale-105 transition-transform cursor-pointer group relative"
      style={{ backgroundColor: `${color}20` }}
      title={`${name1} + ${name2}: ${score}%`}
    >
      <span className="text-2xl mb-1">{emoji}</span>
      <span className="font-black text-white text-lg">{score}%</span>
      
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#1e293b] rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
        {name1} ↔ {name2}
      </div>
    </div>
  );
}

export default function TeamCompatibility() {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: generateId(), fullName: "", birthDay: 1, birthMonth: 1, birthYear: 1990 },
    { id: generateId(), fullName: "", birthDay: 1, birthMonth: 1, birthYear: 1990 },
    { id: generateId(), fullName: "", birthDay: 1, birthMonth: 1, birthYear: 1990 },
  ]);
  const [results, setResults] = useState<CompatibilityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calculateMutation = trpc.compatibility.calculate.useMutation();

  const addMember = () => {
    if (members.length >= 6) {
      toast.error("Tối đa 6 thành viên");
      return;
    }
    setMembers([...members, { id: generateId(), fullName: "", birthDay: 1, birthMonth: 1, birthYear: 1990 }]);
  };

  const removeMember = (id: string) => {
    if (members.length <= 3) {
      toast.error("Tối thiểu 3 thành viên");
      return;
    }
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string | number) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const formatBirthDate = (m: TeamMember) => 
    `${m.birthYear}-${String(m.birthMonth).padStart(2, "0")}-${String(m.birthDay).padStart(2, "0")}`;

  const handleCalculate = async () => {
    // Validate
    const emptyNames = members.filter(m => !m.fullName.trim());
    if (emptyNames.length > 0) {
      toast.error("Vui lòng nhập tên cho tất cả thành viên");
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      const allResults: CompatibilityResult[] = [];
      
      // Calculate all pairs
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          const result = await calculateMutation.mutateAsync({
            person1: { fullName: members[i].fullName, birthDate: formatBirthDate(members[i]) },
            person2: { fullName: members[j].fullName, birthDate: formatBirthDate(members[j]) }
          });
          
          allResults.push({
            person1: members[i].fullName,
            person2: members[j].fullName,
            score: result.overallScore,
            relationship: result.overallDescription || "Bình thường"
          });
        }
      }
      
      setResults(allResults);
      setShowResults(true);
      toast.success(`Đã phân tích ${allResults.length} cặp thành công!`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi phân tích");
    } finally {
      setIsLoading(false);
    }
  };

  // Get score between two members
  const getScore = (name1: string, name2: string): number => {
    const result = results.find(
      r => (r.person1 === name1 && r.person2 === name2) || (r.person1 === name2 && r.person2 === name1)
    );
    return result?.score || 0;
  };

  // Calculate team harmony score
  const teamScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(139,92,246,0.15),transparent_70%)]" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold mb-6">
              <Users className="w-4 h-4" />
              TƯƠNG HỢP NHÓM
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Ma Trận <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Tương Hợp</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Phân tích độ hòa hợp giữa tất cả thành viên trong nhóm, gia đình hoặc đội ngũ
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            {!showResults ? (
              <div className="space-y-8">
                {/* Member inputs */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member, index) => (
                    <MemberInput
                      key={member.id}
                      member={member}
                      index={index}
                      onChange={updateMember}
                      onRemove={removeMember}
                      canRemove={members.length > 3}
                    />
                  ))}
                </div>

                {/* Add member button */}
                {members.length < 6 && (
                  <Button
                    variant="outline"
                    onClick={addMember}
                    className="w-full h-14 border-dashed border-2 border-white/20 text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 rounded-2xl"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Thêm thành viên ({members.length}/6)
                  </Button>
                )}

                {/* Calculate button */}
                <Button
                  onClick={handleCalculate}
                  disabled={isLoading}
                  className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-500/25"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      Đang phân tích {members.length * (members.length - 1) / 2} cặp...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      Phân Tích Nhóm
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Back button */}
                <Button
                  variant="outline"
                  onClick={() => setShowResults(false)}
                  className="bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl"
                >
                  ← Chỉnh sửa nhóm
                </Button>

                {/* Team Score */}
                <div className="text-center p-10 rounded-3xl glass-card border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                  <div className="relative z-10">
                    <span className="text-6xl">{teamScore >= 70 ? "🎉" : teamScore >= 50 ? "👍" : "💪"}</span>
                    <h2 className="text-2xl font-bold text-white mt-4 mb-2">Điểm Hài Hòa Nhóm</h2>
                    <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {teamScore}%
                    </div>
                    <p className="text-gray-400 mt-4">
                      {teamScore >= 80 ? "Nhóm cực kỳ hài hòa! Năng lượng tuyệt vời!" :
                       teamScore >= 60 ? "Nhóm khá hài hòa, có thể phát triển tốt." :
                       teamScore >= 40 ? "Cần thời gian để hiểu nhau hơn." :
                       "Nhóm có nhiều khác biệt, cần sự thấu hiểu."}
                    </p>
                  </div>
                </div>

                {/* Compatibility Matrix */}
                <div className="glass-card rounded-3xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Ma Trận Chi Tiết
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <div className="min-w-[400px]">
                      {/* Header row */}
                      <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(${members.length}, 1fr)` }}>
                        <div className="h-16" /> {/* Empty corner */}
                        {members.map((m, i) => (
                          <div key={m.id} className="h-16 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-400 text-center truncate px-1">
                              {m.fullName.split(' ').pop() || `#${i + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Data rows */}
                      {members.map((rowMember, rowIndex) => (
                        <div 
                          key={rowMember.id}
                          className="grid gap-2"
                          style={{ gridTemplateColumns: `auto repeat(${members.length}, 1fr)` }}
                        >
                          <div className="h-16 flex items-center pr-2">
                            <span className="text-xs font-bold text-gray-400 truncate">
                              {rowMember.fullName.split(' ').pop() || `#${rowIndex + 1}`}
                            </span>
                          </div>
                          {members.map((colMember, colIndex) => (
                            <div key={colMember.id} className="h-16">
                              {rowIndex === colIndex ? (
                                <div className="aspect-square flex items-center justify-center rounded-xl bg-white/5 border border-white/5">
                                  <span className="text-2xl">👤</span>
                                </div>
                              ) : (
                                <MatrixCell
                                  score={getScore(rowMember.fullName, colMember.fullName)}
                                  name1={rowMember.fullName}
                                  name2={colMember.fullName}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed list */}
                <div className="glass-card rounded-3xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Chi Tiết Từng Cặp</h3>
                  <div className="space-y-3">
                    {results
                      .sort((a, b) => b.score - a.score)
                      .map((r, i) => (
                        <div 
                          key={i}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getScoreEmoji(r.score)}</span>
                            <span className="font-medium text-white">{r.person1}</span>
                            <span className="text-gray-500">↔</span>
                            <span className="font-medium text-white">{r.person2}</span>
                          </div>
                          <div 
                            className="px-4 py-1.5 rounded-full font-bold text-sm"
                            style={{ 
                              backgroundColor: `${getScoreColor(r.score)}20`,
                              color: getScoreColor(r.score)
                            }}
                          >
                            {r.score}%
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
