/**
 * Fortune Services
 * Zodiac forecasts, Auspicious dates, Lunar New Year tools
 */

import type {
  ZodiacAnimal,
  ZodiacForecast,
  AuspiciousPurpose,
  AuspiciousDateInput,
  AuspiciousDate,
  XongDatInput,
  XongDatResult,
  LuckyColorInput,
  LuckyColorResult,
  LuckyMoneyInput,
  LuckyMoneyResult,
} from "@shared/types";

// Zodiac animals in order
const ZODIAC_ORDER: ZodiacAnimal[] = [
  "rat", "ox", "tiger", "rabbit", "dragon", "snake",
  "horse", "goat", "monkey", "rooster", "dog", "pig"
];

// Vietnamese zodiac names
export const ZODIAC_VIETNAMESE: Record<ZodiacAnimal, string> = {
  rat: "Tý (Chuột)",
  ox: "Sửu (Trâu)",
  tiger: "Dần (Hổ)",
  rabbit: "Mão (Mèo)",
  dragon: "Thìn (Rồng)",
  snake: "Tỵ (Rắn)",
  horse: "Ngọ (Ngựa)",
  goat: "Mùi (Dê)",
  monkey: "Thân (Khỉ)",
  rooster: "Dậu (Gà)",
  dog: "Tuất (Chó)",
  pig: "Hợi (Lợn)",
};

// Five Elements mapping by year ending
const YEAR_ELEMENTS: Record<number, string> = {
  0: "Kim", 1: "Kim",
  2: "Thủy", 3: "Thủy",
  4: "Mộc", 5: "Mộc",
  6: "Hỏa", 7: "Hỏa",
  8: "Thổ", 9: "Thổ",
};

// Element colors
const ELEMENT_COLORS: Record<string, { lucky: string[]; avoid: string[] }> = {
  "Kim": { lucky: ["Trắng", "Vàng", "Bạc", "Xám nhạt"], avoid: ["Đỏ", "Hồng", "Cam"] },
  "Mộc": { lucky: ["Xanh lá", "Xanh lục", "Xanh ngọc"], avoid: ["Trắng", "Bạc", "Xám"] },
  "Thủy": { lucky: ["Đen", "Xanh dương", "Xanh navy", "Tím"], avoid: ["Vàng", "Nâu", "Be"] },
  "Hỏa": { lucky: ["Đỏ", "Hồng", "Cam", "Tím"], avoid: ["Đen", "Xanh dương"] },
  "Thổ": { lucky: ["Vàng", "Nâu", "Be", "Cam đất"], avoid: ["Xanh lá", "Xanh lục"] },
};

// Element compatibility (sinh - khắc)
const ELEMENT_SINH: Record<string, string> = {
  "Kim": "Thủy", "Thủy": "Mộc", "Mộc": "Hỏa", "Hỏa": "Thổ", "Thổ": "Kim"
};

const ELEMENT_KHAC: Record<string, string> = {
  "Kim": "Mộc", "Mộc": "Thổ", "Thổ": "Thủy", "Thủy": "Hỏa", "Hỏa": "Kim"
};

// Zodiac compatibility
const ZODIAC_TAM_HOP: Record<ZodiacAnimal, ZodiacAnimal[]> = {
  rat: ["dragon", "monkey"],
  ox: ["snake", "rooster"],
  tiger: ["horse", "dog"],
  rabbit: ["goat", "pig"],
  dragon: ["rat", "monkey"],
  snake: ["ox", "rooster"],
  horse: ["tiger", "dog"],
  goat: ["rabbit", "pig"],
  monkey: ["rat", "dragon"],
  rooster: ["ox", "snake"],
  dog: ["tiger", "horse"],
  pig: ["rabbit", "goat"],
};

const ZODIAC_XUNG: Record<ZodiacAnimal, ZodiacAnimal> = {
  rat: "horse", ox: "goat", tiger: "monkey", rabbit: "rooster",
  dragon: "dog", snake: "pig", horse: "rat", goat: "ox",
  monkey: "tiger", rooster: "rabbit", dog: "dragon", pig: "snake",
};

/**
 * Get zodiac animal from birth year
 */
export function getZodiacFromYear(year: number): ZodiacAnimal {
  const index = (year - 4) % 12;
  return ZODIAC_ORDER[index];
}

/**
 * Get element from birth year
 */
export function getElementFromYear(year: number): string {
  const lastDigit = year % 10;
  return YEAR_ELEMENTS[lastDigit];
}

/**
 * Get zodiac forecast prompt for AI
 */
export function getZodiacForecastPrompt(animal: ZodiacAnimal, year: number = 2026): string {
  const vietnameseName = ZODIAC_VIETNAMESE[animal];
  const compatible = ZODIAC_TAM_HOP[animal].map(a => ZODIAC_VIETNAMESE[a]).join(", ");
  const clash = ZODIAC_VIETNAMESE[ZODIAC_XUNG[animal]];
  
  return `Bạn là một **Thầy Tử Vi & Phong Thủy lão làng** với hơn 40 năm kinh nghiệm nghiên cứu Kinh Dịch, Ngũ Hành và Tướng Số. Bạn có kiến thức uyên thâm, giọng văn điềm đạm, sâu sắc và luôn trích dẫn các câu phú cổ hoặc triết lý nhân sinh để làm rõ vấn đề.

DỰ BÁO VẬN MỆNH CHI TIẾT NĂM ${year} CHO TUỔI ${vietnameseName.toUpperCase()}

THÔNG TIN GIA CHỦ:
- Con giáp: ${vietnameseName}
- Năm dự báo: ${year} (Năm Bính Ngọ)
- Mối quan hệ: Tam hợp (${compatible}), Xung khắc (${clash})

Hãy luận giải thật chi tiết theo cấu trúc sau (dùng Markdown):

### 🔮 TỔNG QUAN NĂM ${year}
- **Vận thế chung:** Đánh giá tổng quát (Điểm số trên thang 10).
- **Sao chiếu mệnh:** Sao gì? Tốt hay xấu? Cách cúng sao giải hạn (nếu cần).
- **Lời bình:** Một câu thơ hoặc câu phú cổ phù hợp với vận hạn năm nay.

### 📅 DỰ BÁO THEO TỪNG THÁNG (Luận giải kỹ 12 tháng)
*Hãy viết chi tiết từng tháng, không viết chung chung.*
- **Tháng 1 - 3:** ...
- **Tháng 4 - 6:** ...
- **Tháng 7 - 9:** ...
- **Tháng 10 - 12:** ...

### 💖 CÁC PHƯƠNG DIỆN CHÍNH
- **Công danh & Sự nghiệp:** Cơ hội thăng tiến, thách thức cần đề phòng.
- **Tài lộc & Tiền bạc:** Nguồn thu chính, phụ, vận may rủi.
- **Tình duyên & Gia đạo:** Đối với người độc thân và người đã có gia đình.
- **Sức khỏe:** Các bệnh cần lưu ý, tháng dễ đau ốm.

### 💡 LỜI KHUYÊN & HÓA GIẢI
- **Vật phẩm phong thủy:** Nên mang theo gì?
- **Màu sắc may mắn:** ${year} nên dùng màu gì?
- **Hướng xuất hành:** Hướng nào đón tài lộc?
- **Quý nhân:** Tuổi nào sẽ giúp đỡ?

Giọng văn cần trang trọng, cổ điển nhưng dễ hiểu. Tránh dùng từ ngữ quá hiện đại. Hãy đóng vai một người thầy tận tâm đang khuyên răn học trò.`;
}

/**
 * Get auspicious dates for a purpose
 */
export function getAuspiciousDatesPrompt(input: AuspiciousDateInput): string {
  const purposeNames: Record<AuspiciousPurpose, string> = {
    wedding: "Cưới hỏi",
    business_opening: "Khai trương",
    groundbreaking: "Động thổ",
    travel: "Xuất hành",
    moving_house: "Nhập trạch",
    other: "Việc quan trọng",
  };

  const ownerInfo = input.ownerBirthYear 
    ? `\n- Tuổi gia chủ: ${input.ownerBirthYear} (${ZODIAC_VIETNAMESE[getZodiacFromYear(input.ownerBirthYear)]})`
    : "";

  return `Bạn là một **Chuyên gia Lịch Vạn Niên và Phong Thủy Bát Trạch**. Hãy xem ngày tốt xấu dựa trên tuổi gia chủ và mục đích công việc.

MỤC ĐÍCH: Tìm ngày tốt cho việc **${purposeNames[input.purpose].toUpperCase()}**
THỜI GIAN: Từ ${input.startDate} đến ${input.endDate}
${ownerInfo}

Hãy phân tích và đưa ra danh sách các ngày **Đại Cát** và **Tiểu Cát**. Bỏ qua các ngày Xấu.

CẤU TRÚC TRẢ LỜI (Markdown):

### 🗓️ DANH SÁCH NGÀY TỐT NHẤT
Liệt kê chi tiết từng ngày theo định dạng:
#### 1. Ngày [DD/MM/YYYY] (Âm lịch: [Ngày]/[Tháng])
- **Đánh giá:** ⭐⭐⭐⭐⭐ (hoặc số sao tùy độ tốt)
- **Sao tốt:** (Ví dụ: Thiên Đức, Nguyệt Đức...)
- **Giờ Hoàng Đạo:** (Liệt kê các khung giờ tốt nhất để tiến hành)
- **Kỵ tuổi:** (Những tuổi nào KHÔNG nên dùng ngày này dù là ngày tốt)
- **Lời khuyên:** Nên tiến hành vào lúc nào? Cần tránh gì?

### 📜 GIẢI THÍCH CHUYÊN MÔN
- Tại sao chọn những ngày này? (Dựa trên Trực, Nhị Thập Bát Tú, hoặc Ngọc Hạp Thông Thư).
- Các yếu tố phong thủy bổ trợ cho việc ${purposeNames[input.purpose]}.

### ⚠️ LƯU Ý KHI THỰC HIỆN
- Nghi lễ cần chuẩn bị đơn giản.
- Các thủ tục tâm linh cần thiết để công việc hanh thông.

Giọng văn dứt khoát, rõ ràng, chuyên nghiệp. Không nói nước đôi.`;
}

/**
 * Calculate Xông Đất recommendations
 */
export function calculateXongDat(input: XongDatInput): XongDatResult {
  const ownerZodiac = getZodiacFromYear(input.ownerBirthYear);
  const ownerElement = getElementFromYear(input.ownerBirthYear);
  
  // Tam hợp zodiacs are suitable
  const suitableZodiacs = [ownerZodiac, ...ZODIAC_TAM_HOP[ownerZodiac]];
  
  // Xung zodiac should be avoided
  const avoidZodiacs = [ZODIAC_XUNG[ownerZodiac]];
  
  // Calculate suitable ages (current year 2026)
  const currentYear = 2026;
  const suitableAges: number[] = [];
  const avoidAges: number[] = [];
  
  suitableZodiacs.forEach(zodiac => {
    for (let year = currentYear - 60; year <= currentYear; year += 12) {
      if (getZodiacFromYear(year) === zodiac) {
        const age = currentYear - year;
        if (age >= 18 && age <= 70) {
          suitableAges.push(year);
        }
      }
    }
  });
  
  avoidZodiacs.forEach(zodiac => {
    for (let year = currentYear - 60; year <= currentYear; year += 12) {
      if (getZodiacFromYear(year) === zodiac) {
        const age = currentYear - year;
        if (age >= 18 && age <= 70) {
          avoidAges.push(year);
        }
      }
    }
  });
  
  return {
    suitableAges: suitableAges.sort((a, b) => a - b),
    suitableZodiacs,
    avoidAges: avoidAges.sort((a, b) => a - b),
    avoidZodiacs,
  };
}

/**
 * Get lucky colors based on birth year element
 */
export function calculateLuckyColors(input: LuckyColorInput): LuckyColorResult {
  const element = getElementFromYear(input.birthYear);
  const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS["Thổ"];
  
  return {
    element,
    luckyColors: colors.lucky,
    avoidColors: colors.avoid,
  };
}

/**
 * Get lucky money suggestions
 */
export function calculateLuckyMoney(input: LuckyMoneyInput): LuckyMoneyResult {
  const element = getElementFromYear(input.recipientBirthYear);
  
  // Lucky numbers based on element
  const elementLuckyNumbers: Record<string, number[]> = {
    "Kim": [4, 9, 49, 94],
    "Mộc": [3, 8, 38, 83],
    "Thủy": [1, 6, 16, 61],
    "Hỏa": [2, 7, 27, 72],
    "Thổ": [5, 10, 50, 100],
  };
  
  const luckyNumbers = elementLuckyNumbers[element] || [8, 9];
  
  // Suggested amounts (in thousands VND)
  const baseAmounts = [20, 50, 100, 200, 500, 1000, 2000];
  const suggestedAmounts = baseAmounts.map(base => {
    // Find a lucky ending
    const luckyEnding = luckyNumbers[0];
    if (base < 100) {
      return base * 1000 + luckyEnding * 1000;
    }
    return base * 1000;
  });
  
  // Add some specific lucky amounts
  suggestedAmounts.push(88000, 99000, 168000, 888000);
  
  return {
    element,
    suggestedAmounts: suggestedAmounts.sort((a, b) => a - b),
    luckyNumbers,
  };
}

/**
 * Get Xông Đất prompt for AI
 */
export function getXongDatPrompt(input: XongDatInput, result: XongDatResult): string {
  const ownerZodiac = getZodiacFromYear(input.ownerBirthYear);
  const ownerElement = getElementFromYear(input.ownerBirthYear);
  
  return `Bạn là **Chuyên gia Phong Thủy Đời Sống**. Hãy tư vấn người xông đất đầu năm một cách khoa học và tâm linh cho dịp **Tết Nguyên Đán Bính Ngọ 2026**.

THÔNG TIN GIA CHỦ:
- Năm sinh: ${input.ownerBirthYear}
- Con giáp: ${ZODIAC_VIETNAMESE[ownerZodiac]}
- Mệnh: ${ownerElement}

BỐI CẢNH DỰ BÁO:
- Năm hiện tại: 2026 (Bính Ngọ)
- Đối tượng: Tìm người xông đất mang lại may mắn, tài lộc cho gia chủ trong năm 2026.

KẾT QUẢ TÍNH TOÁN CƠ BẢN:
- Tuổi hợp (Tam Hợp/Nhị Hợp): ${result.suitableAges.join(", ")}
- Con giáp hợp: ${result.suitableZodiacs.map(z => ZODIAC_VIETNAMESE[z]).join(", ")}
- Tuổi kỵ (Xung/Hình/Hại): ${result.avoidAges.join(", ")}

Hãy viết một bản tư vấn chi tiết cho năm 2026 (Tuyệt đối không nhầm sang các năm khác như 2024 hay 2025):

### 🏠 NGƯỜI XÔNG ĐẤT HOÀN HẢO NĂM 2026
Chọn ra 3 tuổi **TỐT NHẤT** trong danh sách trên để xông đất. Với mỗi tuổi, giải thích ngắn gọn tại sao (Ví dụ: Vừa tam hợp, vừa tương sinh ngũ hành với gia chủ và năm Bính Ngọ 2026).
*Ưu tiên người có tính cách vui vẻ, xởi lởi, đang làm ăn phát đạt.*

### ⏰ THỜI KHẮC VÀNG
- Giờ đẹp nhất mùng 1 Tết Bính Ngọ 2026 để người này bước vào nhà.
- Hướng xuất hành của gia chủ khi ra đón khách.

### 🧧 NGHI THỨC & LỜI CHÚC TẾT 2026
- Người xông đất nên mặc màu gì hợp năm 2026?
- Nên lì xì bao nhiêu (con số tượng trưng)?
- Gợi ý 3 câu chúc Tết hay và ý nghĩa cho năm Bính Ngọ, phù hợp với tuổi của gia chủ.

### ⚠️ LƯU Ý CHO GIA CHỦ
- Các kiêng kỵ tuyệt đối khi xông đất.

Văn phong vui tươi, mang đậm không khí Tết cổ truyền Việt Nam. Đặc biệt lưu ý nhấn mạnh đây là lời khuyên cho năm 2026.`;
}

/**
 * Get Lunar New Year tools prompt for AI
 */
export function getLunarNewYearPrompt(
  luckyColors: LuckyColorResult,
  luckyMoney: LuckyMoneyResult,
  birthYear: number
): string {
  const zodiac = getZodiacFromYear(birthYear);
  
  return `Bạn là một chuyên gia phong thủy hàng đầu. Hãy tư vấn chi tiết về các phương diện trong dịp **Tết Nguyên Đán Bính Ngọ 2026**.

THÔNG TIN GIA CHỦ:
- Năm sinh: ${birthYear}
- Con giáp: ${ZODIAC_VIETNAMESE[zodiac]}
- Mệnh: ${luckyColors.element}
- Màu may mắn năm 2026: ${luckyColors.luckyColors.join(", ")}
- Màu nên tránh năm 2026: ${luckyColors.avoidColors.join(", ")}
- Số may mắn tài lộc: ${luckyMoney.luckyNumbers.join(", ")}

BỐI CẢNH: Đây là tư vấn cho năm Bính Ngọ 2026. Tuyệt đối không nhầm lẫn với năm 2024 (Giáp Thìn) hay 2025 (Ất Tỵ).

Hãy tư vấn chi tiết các phần sau (dùng Markdown):

### 🎨 1. MÀU SẮC MAY MẮN TẾT BÍNH NGỌ 2026
- Giải thích tại sao các màu này hợp mệnh gia chủ trong năm 2026.
- Cách áp dụng vào trang phục mùng 1, 2, 3 Tết.
- Tư vấn màu sắc bao lì xì để kích hoạt tài lộc.

### 🧧 2. CHIẾN THUẬT LÌ XÌ MAY MẮN
- Ý nghĩa các con số may mắn ${luckyMoney.luckyNumbers.join(", ")} đối với gia chủ.
- Số tiền gợi ý nên lì xì để cả người cho và người nhận đều gặp may.
- Cách trao lì xì đúng phong thủy năm 2026.

### 🔮 3. LỜI KHUYÊN PHONG THỦY TẾT 2026
- **Hướng xuất hành:** Hướng nào tốt nhất để đón Hỷ Thần, Tài Thần năm Bính Ngọ?
- **Ngày giờ tốt:** Những thời điểm đại cát để khai nữ hành, mở hàng, khai bút.
- **Kiêng kỵ:** Những điều cần tránh đặc biệt cho tuổi ${ZODIAC_VIETNAMESE[zodiac]} trong Tết này.

Viết bằng tiếng Việt, văn phong truyền thống, ấm áp, chuyên nghiệp và tràn đầy năng lượng tích cực cho năm mới 2026.`;
}
