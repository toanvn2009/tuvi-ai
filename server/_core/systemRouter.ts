import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { invokeLLM } from "./llm";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  // AI Chat endpoint for ChatWidget
  chat: publicProcedure
    .input(
      z.object({
        message: z.string().min(1, "message is required"),
        context: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `Bạn là Trợ Lý Phong Thủy AI - một chuyên gia về tử vi, phong thủy, ngày tốt, và vận mệnh theo văn hóa Việt Nam.

Nguyên tắc trả lời:
1. Luôn trả lời bằng tiếng Việt, thân thiện và dễ hiểu.
2. Khi tư vấn về ngày tốt/xấu, dựa vào Lịch Vạn Niên và Giờ Hoàng Đạo.
3. Khi nói về vận mệnh, tham khảo Tử Vi và Ngũ Hành.
4. Sử dụng emoji để làm câu trả lời sinh động hơn.
5. Nếu không đủ thông tin (như năm sinh), hãy hỏi lại người dùng.
6. Giữ câu trả lời ngắn gọn, súc tích (tối đa 150 từ).

${input.context ? `Ngữ cảnh:\n${input.context}` : ''}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input.message },
        ],
      });

      const rawResponse = response.choices[0]?.message?.content || "Xin lỗi, tôi không thể trả lời lúc này.";
      const cleanResponse = typeof rawResponse === "string" ? rawResponse : JSON.stringify(rawResponse);

      return {
        response: cleanResponse,
      };
    }),
});
