# Changelog

Tất cả thay đổi quan trọng của dự án sẽ được ghi lại ở đây.

## [2026-02-05]

### Added
- **Fortune Ticker**: Hiển thị vận khí real-time theo giờ trong header
- **Chat Widget**: AI Phong Thủy tư vấn trực tiếp với context awareness
- **Văn Khấn (Rituals)**: Trang với 6 bài văn khấn chuẩn, hỗ trợ cá nhân hóa và copy/print
- **Team Compatibility**: Ma trận tương hợp 3-6 người với điểm hài hòa nhóm
- Route `/team` và mục "Xem Nhóm" trong navigation

### Changed
- Tăng chất lượng export ảnh từ 2x lên 3x trong TuVi.tsx
- Cập nhật cache keys cho các LLM endpoints để refresh data tiếng Việt

### Fixed
- Sửa lỗi Admin Dashboard bị trắng trang do session validation quá khắt khe
- Sửa lỗi căn lề (Header misalignment) trong các tab kết quả của trang Tết 2026
- Sửa lỗi "Tư Vấn Toàn Diện" không hiển thị nội dung AI luận giải
- Sửa blank page do thiếu import `Users` icon trong Layout.tsx
- Sửa TypeScript errors trong ChatWidget.tsx (TRPCClientError callbacks)

---

## [2026-02-04]

### Added
- Tính năng Tết 2026: Xông đất, màu may mắn, lì xì theo tuổi
- UI polish với Mystical Dark theme
- Live Clock trong header

### Changed
- Cải thiện UI các trang Zodiac, Auspicious với glassmorphism effects
