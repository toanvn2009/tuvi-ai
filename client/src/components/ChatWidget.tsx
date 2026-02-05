/**
 * ChatWidget - AI Assistant floating chat widget
 * Provides personalized fortune advice based on user context
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  User,
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Get stored user context from localStorage
function getUserContext(): string {
  try {
    const stored = localStorage.getItem('tuvi_user_context');
    if (stored) {
      const data = JSON.parse(stored);
      return `Thông tin người dùng: Tên: ${data.name || 'Chưa biết'}, Năm sinh: ${data.birthYear || 'Chưa biết'}, Giới tính: ${data.gender || 'Chưa biết'}.`;
    }
  } catch (e) {
    // Ignore
  }
  return 'Người dùng chưa cung cấp thông tin cá nhân.';
}

// Save user context
export function saveUserContext(data: { name?: string; birthYear?: number; gender?: string }) {
  try {
    const existing = localStorage.getItem('tuvi_user_context');
    const current = existing ? JSON.parse(existing) : {};
    localStorage.setItem('tuvi_user_context', JSON.stringify({ ...current, ...data }));
  } catch (e) {
    // Ignore
  }
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: '🔮 Xin chào! Tôi là Trợ Lý Phong Thủy AI. Hãy hỏi tôi bất cứ điều gì về tử vi, phong thủy, ngày tốt, hoặc vận mệnh của bạn.\n\n💡 **Gợi ý câu hỏi:**\n- "Hôm nay có phù hợp để ký hợp đồng không?"\n- "Tôi sinh năm 1990, vận trình năm nay thế nào?"\n- "Màu sắc may mắn cho tuổi Thìn?"',
  timestamp: new Date(),
};

const QUICK_QUESTIONS = [
  "Hôm nay có phù hợp để ký hợp đồng?",
  "Ngày mai có nên xuất hành?",
  "Tư vấn số điện thoại đẹp",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const chatMutation = trpc.system.chat.useMutation({
    onSuccess: (data: { response: string }) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    },
    onError: (error: unknown) => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    },
  });

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Build context from previous messages
    const history = messages
      .filter((m) => m.id !== 'welcome')
      .slice(-6) // Last 6 messages for context
      .map((m) => `${m.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${m.content}`)
      .join('\n');

    const context = getUserContext();
    const now = new Date();
    const timeContext = `Thời điểm hiện tại: ${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}.`;

    chatMutation.mutate({
      message: input.trim(),
      context: `${context}\n${timeContext}\n\nLịch sử hội thoại:\n${history}`,
    });
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          >
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0f172a] animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed z-50 ${
              isMinimized
                ? 'bottom-6 right-6 w-72'
                : 'bottom-6 right-6 w-[400px] max-w-[calc(100vw-48px)]'
            }`}
          >
            <div className={`bg-[#0f172a]/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden ${
              isMinimized ? '' : 'h-[600px] max-h-[calc(100vh-100px)]'
            } flex flex-col`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/10 p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Trợ Lý Phong Thủy</h3>
                    <p className="text-[10px] text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      Đang hoạt động
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          message.role === 'user'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-purple-600/30 text-white rounded-tr-sm'
                            : 'bg-white/5 text-gray-200 rounded-tl-sm'
                        }`}>
                        <div className="prose prose-sm prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 whitespace-pre-wrap">
                          {message.content}
                        </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Đang phân tích...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Questions */}
                  {messages.length <= 2 && (
                    <div className="px-4 pb-2 flex flex-wrap gap-2">
                      {QUICK_QUESTIONS.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(q)}
                          className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t border-white/10 shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Hỏi về vận mệnh, ngày tốt..."
                        disabled={isLoading}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                      />
                      <Button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
