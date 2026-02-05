/**
 * TuViChartProfessional - Component lá số tử vi chuyên nghiệp
 * Thiết kế theo mẫu truyền thống với 12 cung và ô thông tin trung tâm
 * Updated: Mystical Dark Theme
 */

import React, { useState, useRef } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Download, Share2, ZoomIn, ZoomOut, Eye, EyeOff, Triangle, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { PalaceCell } from './PalaceCell';
import PalaceDetailModal from './PalaceDetailModal';

interface Star {
    name: string;
    nameChinese?: string;
    nature?: 'good' | 'bad' | 'neutral' | 'cat' | 'hung';
    type?: 'main' | 'secondary';
    color?: string;
    brightness?: string;
}

interface Palace {
    name: string;
    nameChinese?: string;
    mainStars?: Star[];
    secondaryStars?: Star[];
    stars?: Star[]; // Từ tuvi-exact.ts
    trangSinh?: string;
    nguHanh?: string;
    diaChi?: string;
    earthlyBranch?: string; // Từ tuvi-exact.ts
    position?: number;
    element?: string;
    number?: number; // Từ tuvi-exact.ts
    id?: number; // Từ tuvi-exact.ts
}

// Cấu trúc từ tuvi-exact.ts
interface CenterInfoData {
    name?: string;
    birthYear?: number;
    birthMonth?: number;
    birthDay?: number;
    birthHour?: string;
    gender?: string;
    lunarCalendar?: boolean;
    destiny?: string;
    bodyPalace?: string;
}

interface ChartData {
    palaces: Palace[];
    element?: string;
    heavenlyStem?: string;
    earthlyBranch?: string;
    chuMenh?: string;
    chuThan?: string;
    lunarDate?: { day: number; month: number; year?: number };
    napAm?: string;
    cucLoai?: string;
    mangMenh?: string;
    centerInfo?: CenterInfoData; // Từ tuvi-exact.ts
}

// Mapping tên cung từ UPPERCASE sang Title Case
const PALACE_NAME_MAPPING: Record<string, string> = {
    'TÀI BẠCH': 'Tài Bạch',
    'TỬ TỨC': 'Tử Tức',
    'PHU THÊ': 'Phu Thê',
    'MỆNH': 'Mệnh',
    'PHÁ QUÂN': 'Mệnh', // PHÁ QUÂN trong tuvi-exact.ts có thể là Mệnh hoặc cung khác
    'PHU MẪU': 'Phụ Mẫu',
    'PHÚC ĐỨC': 'Phúc Đức',
    'ĐIỀN TRẠCH': 'Điền Trạch',
    'QUAN LỘC': 'Quan Lộc',
    'NÔ BỘC': 'Nô Bộc',
    'THIÊN DI': 'Thiên Di',
    'TẤT ÁCH': 'Tật Ách',
    'HUYNH ĐỆ': 'Huynh Đệ',
};

// Mapping tên cung theo địa chi (từ tuvi-exact.ts)
const BRANCH_TO_PALACE: Record<string, string> = {
    'Tỵ': 'Mệnh',
    'Ngọ': 'Phụ Mẫu',
    'Mùi': 'Phúc Đức',
    'Thân': 'Điền Trạch',
    'Dậu': 'Quan Lộc',
    'Tuất': 'Nô Bộc',
    'Hợi': 'Thiên Di',
    'Tý': 'Tật Ách',
    'Sửu': 'Tài Bạch',
    'Dần': 'Tử Tức',
    'Mão': 'Phu Thê',
    'Thìn': 'Huynh Đệ',
};

// Hàm normalize tên cung
function normalizePalaceName(name: string): string {
    // Nếu là uppercase, convert sang Title Case
    if (PALACE_NAME_MAPPING[name]) {
        return PALACE_NAME_MAPPING[name];
    }
    return name;
}

interface InputData {
    fullName: string;
    birthDay: number;
    birthMonth: number;
    birthYear: number;
    birthHour: string;
    gender: 'male' | 'female';
    calendarType?: 'lunar' | 'solar';
}

interface TuViChartProfessionalProps {
    chart: ChartData;
    input: InputData;
}

// Địa chi 12 cung theo vị trí truyền thống (theo chiều kim đồng hồ từ Tỵ)
const EARTHLY_BRANCHES_POSITIONS = [
    'Tỵ', 'Ngọ', 'Mùi', 'Thân',    // Row 0
    'Thìn', '', '', 'Dậu',          // Row 1 (center cells empty)
    'Mão', '', '', 'Tuất',          // Row 2 (center cells empty)
    'Dần', 'Sửu', 'Tý', 'Hợi'       // Row 3
];

// Vị trí cung trong grid 4x4 (theo ảnh mẫu)
const PALACE_GRID_POSITIONS: Record<string, { row: number; col: number; branch: string; branchElement: string }> = {
    'Huynh Đệ': { row: 0, col: 0, branch: 'Tỵ', branchElement: 'Hỏa' },
    'Mệnh': { row: 0, col: 1, branch: 'Ngọ', branchElement: 'Hỏa' },
    'Phụ Mẫu': { row: 0, col: 2, branch: 'Mùi', branchElement: 'Thổ' },
    'Phúc Đức': { row: 0, col: 3, branch: 'Thân', branchElement: 'Kim' },
    'Phu Thê': { row: 1, col: 0, branch: 'Thìn', branchElement: 'Thổ' },
    'Điền Trạch': { row: 1, col: 3, branch: 'Dậu', branchElement: 'Kim' },
    'Tử Tức': { row: 2, col: 0, branch: 'Mão', branchElement: 'Mộc' },
    'Quan Lộc': { row: 2, col: 3, branch: 'Tuất', branchElement: 'Thổ' },
    'Tài Bạch': { row: 3, col: 0, branch: 'Dần', branchElement: 'Mộc' },
    'Tật Ách': { row: 3, col: 1, branch: 'Sửu', branchElement: 'Thổ' },
    'Thiên Di': { row: 3, col: 2, branch: 'Tý', branchElement: 'Thủy' },
    'Nô Bộc': { row: 3, col: 3, branch: 'Hợi', branchElement: 'Thủy' },
};

// Tên giờ sinh theo địa chi
const BIRTH_HOUR_NAMES: Record<string, string> = {
    'ty': 'Tý', 'suu': 'Sửu', 'dan': 'Dần', 'mao': 'Mão',
    'thin': 'Thìn', 'ti': 'Tỵ', 'ngo': 'Ngọ', 'mui': 'Mùi',
    'than': 'Thân', 'dau': 'Dậu', 'tuat': 'Tuất', 'hoi': 'Hợi'
};

// Ngũ hành cho giờ sinh 
const HOUR_ELEMENTS: Record<string, string> = {
    'ty': 'Thủy', 'suu': 'Thổ', 'dan': 'Mộc', 'mao': 'Mộc',
    'thin': 'Thổ', 'ti': 'Hỏa', 'ngo': 'Hỏa', 'mui': 'Thổ',
    'than': 'Kim', 'dau': 'Kim', 'tuat': 'Thổ', 'hoi': 'Thủy'
};

// Tam Hợp Cung - 3 cung tạo thành tam giác hợp nhau (Tam Phương)
const TAM_HOP_GROUPS: string[][] = [
    ['Dần', 'Ngọ', 'Tuất'],   // Hỏa cục
    ['Thân', 'Tý', 'Thìn'],   // Thủy cục
    ['Tỵ', 'Dậu', 'Sửu'],     // Kim cục
    ['Hợi', 'Mão', 'Mùi'],    // Mộc cục
];

// Cung Đối Xứng (Xung Chiếu) - Tứ Chính
const CUNG_DOI_XUNG: Record<string, string> = {
    'Tý': 'Ngọ', 'Ngọ': 'Tý',
    'Sửu': 'Mùi', 'Mùi': 'Sửu',
    'Dần': 'Thân', 'Thân': 'Dần',
    'Mão': 'Dậu', 'Dậu': 'Mão',
    'Thìn': 'Tuất', 'Tuất': 'Thìn',
    'Tỵ': 'Hợi', 'Hợi': 'Tỵ',
};

// Vị trí pixel của mỗi địa chi trên grid 4x4 (dùng để vẽ đường nối)
const BRANCH_POSITIONS: Record<string, { x: number; y: number }> = {
    'Tỵ': { x: 25, y: 25 },      // Row 0, Col 0 (Corner)
    'Ngọ': { x: 37.5, y: 25 },   // Row 0, Col 1 (Edge)
    'Mùi': { x: 62.5, y: 25 },   // Row 0, Col 2 (Edge)
    'Thân': { x: 75, y: 25 },    // Row 0, Col 3 (Corner)
    'Thìn': { x: 25, y: 37.5 },  // Row 1, Col 0 (Edge)
    'Dậu': { x: 75, y: 37.5 },   // Row 1, Col 3 (Edge)
    'Mão': { x: 25, y: 62.5 },   // Row 2, Col 0 (Edge)
    'Tuất': { x: 75, y: 62.5 },  // Row 2, Col 3 (Edge)
    'Dần': { x: 25, y: 75 },     // Row 3, Col 0 (Corner)
    'Sửu': { x: 37.5, y: 75 },   // Row 3, Col 1 (Edge)
    'Tý': { x: 62.5, y: 75 },    // Row 3, Col 2 (Edge)
    'Hợi': { x: 75, y: 75 },     // Row 3, Col 3 (Corner)
};

// Component vẽ layer phủ toàn bộ lá số để nối các cung (Tam Hợp/Đối Xứng full scale)
function MainChartOverlay({
    selectedBranch,
    showTamHop,
    showDoiXung,
    menhBranch
}: {
    selectedBranch: string | null;
    showTamHop: boolean;
    showDoiXung: boolean;
    menhBranch?: string;
}) {
    const elements: React.ReactElement[] = [];
    const getPosition = (branch: string) => BRANCH_POSITIONS[branch] || { x: 50, y: 50 };

    const activeBranch = selectedBranch || menhBranch;

    if (!activeBranch) return null;

    // Tam Hợp (Màu vàng kim, nét đứt, mảnh)
    if (showTamHop) {
        const tamHopGroup = TAM_HOP_GROUPS.find(group => group.includes(activeBranch));
        if (tamHopGroup) {
            const positions = tamHopGroup.map(branch => getPosition(branch));
            const points = positions.map(p => `${p.x},${p.y}`).join(' ');
            elements.push(
                <polygon
                    key="tam-hop-overlay"
                    points={points}
                    fill="rgba(251, 191, 36, 0.05)"
                    stroke="rgba(251, 191, 36, 0.5)"
                    strokeWidth="0.15"
                    strokeDasharray="0.5 0.5"
                    className="transition-all duration-300 animate-pulse-slow"
                />
            );
        }
    }

    // Đối Xứng (Màu đỏ/hồng, nét đứt, mảnh)
    if (showDoiXung) {
        const doiXungBranch = CUNG_DOI_XUNG[activeBranch];
        if (doiXungBranch) {
            const p1 = getPosition(activeBranch);
            const p2 = getPosition(doiXungBranch);
            elements.push(
                <line
                    key="doi-xung-overlay"
                    x1={p1.x} y1={p1.y}
                    x2={p2.x} y2={p2.y}
                    stroke="rgba(244, 63, 94, 0.5)"
                    strokeWidth="0.15"
                    strokeDasharray="0.5 0.5"
                    className="transition-all duration-300"
                />
            );
        }
    }

    return (
        <svg
            className="absolute inset-0 pointer-events-none w-full h-full z-10"
            viewBox="0 0 100 100"
        >
            {elements}
        </svg>
    );
}

// Component vẽ đường Tam Phương Tứ Chính nhỏ gọn ở trung tâm
function TamPhuongTuChinhMiniMap({
    selectedBranch,
    showTamHop,
    showDoiXung,
    menhBranch
}: {
    selectedBranch: string | null;
    showTamHop: boolean;
    showDoiXung: boolean;
    menhBranch?: string;
}) {
    // Vẽ la bàn mini ở trung tâm - các địa chi xếp theo vòng tròn
    // Vị trí 12 địa chi theo vòng tròn (góc từ trên theo chiều kim đồng hồ)
    const MINI_POSITIONS: Record<string, { angle: number }> = {
        'Tý': { angle: 180 },    // Dưới
        'Sửu': { angle: 210 },
        'Dần': { angle: 240 },
        'Mão': { angle: 270 },   // Trái
        'Thìn': { angle: 300 },
        'Tỵ': { angle: 330 },
        'Ngọ': { angle: 0 },     // Trên
        'Mùi': { angle: 30 },
        'Thân': { angle: 60 },
        'Dậu': { angle: 90 },    // Phải
        'Tuất': { angle: 120 },
        'Hợi': { angle: 150 },
    };

    const centerX = 50;
    const centerY = 50;
    const radius = 35; // Bán kính vòng tròn nhỏ

    // Hàm tính tọa độ từ góc
    const getPosition = (branch: string) => {
        const { angle } = MINI_POSITIONS[branch];
        const rad = (angle - 90) * Math.PI / 180;
        return {
            x: centerX + radius * Math.cos(rad),
            y: centerY + radius * Math.sin(rad)
        };
    };

    const elements: React.ReactElement[] = [];

    // Vẽ vòng tròn nền Dark Mode
    elements.push(
        <circle
            key="bg-circle"
            cx={centerX}
            cy={centerY}
            r={radius + 5}
            fill="rgba(0, 0, 0, 0.2)"
            stroke="rgba(251, 191, 36, 0.2)"
            strokeWidth="0.5"
        />
    );

    // Vẽ vòng tròn trong
    elements.push(
        <circle
            key="inner-circle"
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(251, 191, 36, 0.1)"
            strokeWidth="0.25"
            strokeDasharray="2,2"
        />
    );

    // Vẽ các chấm đại diện 12 địa chi
    Object.entries(MINI_POSITIONS).forEach(([branch]) => {
        const pos = getPosition(branch);
        const isSelected = branch === selectedBranch;
        elements.push(
            <circle
                key={`branch-${branch}`}
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 3 : 1.5}
                fill={isSelected ? '#fbbf24' : '#4b5563'} // Amber vs Gray
            />
        );
    });

    // Vẽ đường Tam Hợp (tam giác xanh/vàng nhỏ)
    if (showTamHop && selectedBranch) {
        const tamHopGroup = TAM_HOP_GROUPS.find(group => group.includes(selectedBranch));
        if (tamHopGroup) {
            const positions = tamHopGroup.map(branch => getPosition(branch));
            const points = positions.map(p => `${p.x},${p.y}`).join(' ');
            elements.push(
                <polygon
                    key="tam-hop-mini"
                    points={points}
                    fill="rgba(34, 197, 94, 0.1)"
                    stroke="rgba(34, 197, 94, 0.6)"
                    strokeWidth="1"
                />
            );
            // Chấm nhỏ ở các góc
            positions.forEach((pos, i) => {
                elements.push(
                    <circle
                        key={`tam-hop-dot-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        r="2.5"
                        fill="rgba(34, 197, 94, 0.8)"
                    />
                );
            });
        }
    }

    // Vẽ đường Đối Xứng (đường đỏ nhỏ)
    if (showDoiXung && selectedBranch) {
        const doiXungBranch = CUNG_DOI_XUNG[selectedBranch];
        if (doiXungBranch) {
            const pos1 = getPosition(selectedBranch);
            const pos2 = getPosition(doiXungBranch);
            elements.push(
                <line
                    key="doi-xung-mini"
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke="rgba(244, 63, 94, 0.6)"
                    strokeWidth="1"
                />
            );
            // Chấm ở 2 đầu
            [pos1, pos2].forEach((pos, i) => {
                elements.push(
                    <circle
                        key={`doi-xung-dot-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        r="2.5"
                        fill="rgba(244, 63, 94, 0.8)"
                    />
                );
            });
        }
    }

    // Vẽ đường Tam Hợp cho cung Mệnh (Màu cam/vàng - Luôn hiện)
    if (menhBranch) {
        const tamHopGroup = TAM_HOP_GROUPS.find(group => group.includes(menhBranch));
        if (tamHopGroup) {
            const positions = tamHopGroup.map(branch => getPosition(branch));
            const points = positions.map(p => `${p.x},${p.y}`).join(' ');
            elements.push(
                <polygon
                    key="tam-hop-menh-mini"
                    points={points}
                    fill="rgba(251, 191, 36, 0.05)"
                    stroke="rgba(251, 191, 36, 0.4)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                />
            );
            positions.forEach((pos, i) => {
                elements.push(
                    <circle
                        key={`tam-hop-menh-dot-mini-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        r="1.5"
                        fill="rgba(251, 191, 36, 0.6)"
                    />
                );
            });
        }
    }

    // Chấm giữa
    elements.push(
        <circle
            key="center-dot"
            cx={centerX}
            cy={centerY}
            r="2"
            fill="#fbbf24"
            className="animate-pulse"
        />
    );

    return (
        <svg
            className="absolute pointer-events-none"
            style={{
                width: '100px',
                height: '100px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
                opacity: 0.9
            }}
            viewBox="0 0 100 100"
        >
            {elements}
        </svg>
    );
}



const NAP_AM_DESCRIPTIONS: Record<string, string> = {
    'Hải Trung Kim': 'Vàng trong biển',
    'Lư Trung Hỏa': 'Lửa trong lò',
    'Đại Lâm Mộc': 'Gỗ trong rừng già',
    'Lộ Bàng Thổ': 'Đất ven đường',
    'Kiếm Phong Kim': 'Vàng mũi kiếm',
    'Sơn Đầu Hỏa': 'Lửa trên núi',
    'Giản Hạ Thủy': 'Nước dưới khe',
    'Thành Đầu Thổ': 'Đất trên thành',
    'Bạch Lạp Kim': 'Vàng chân đèn',
    'Dương Liễu Mộc': 'Gỗ cây dương liễu',
    'Tuyền Trung Thủy': 'Nước trong suối',
    'Ốc Thượng Thổ': 'Đất trên nóc nhà',
    'Tích Lịch Hỏa': 'Lửa sấm sét',
    'Tùng Bách Mộc': 'Gỗ cây tùng bách',
    'Trường Lưu Thủy': 'Nước chảy dài',
    'Sa Trung Kim': 'Vàng trong cát',
    'Sơn Hạ Hỏa': 'Lửa dưới núi',
    'Bình Địa Mộc': 'Gỗ đồng bằng',
    'Bích Thượng Thổ': 'Đất trên vách',
    'Kim Bạch Kim': 'Vàng pha bạch kim',
    'Phúc Đăng Hỏa': 'Lửa ngọn đèn',
    'Thiên Hà Thủy': 'Nước trên trời',
    'Đại Trạch Thổ': 'Đất nền nhà',
    'Thoa Xuyến Kim': 'Vàng trang sức',
    'Tang Đố Mộc': 'Gỗ cây dâu',
    'Đại Khê Thủy': 'Nước khe lớn',
    'Sa Trung Thổ': 'Đất pha cát',
    'Thiên Thượng Hỏa': 'Lửa trên trời',
    'Thạch Lựu Mộc': 'Gỗ cây thạch lựu',
    'Đại Hải Thủy': 'Nước biển lớn'
};

// Component thông tin trung tâm
function CenterInfo({ chart, input }: { chart: ChartData; input: InputData }) {
    const birthHourName = BIRTH_HOUR_NAMES[input.birthHour.toLowerCase()] || input.birthHour;
    const yearCanChi = `${chart.heavenlyStem || ''} ${chart.earthlyBranch || ''} (${input.birthYear})`.trim();
    const napAm = chart.napAm || '';
    const element = chart.element || '';
    const banMenhDisplay = napAm ? `${element} (${napAm})` : element;

    // Tính tương quan Mệnh - Cục
    const MENH_CUC_RELATION: Record<string, Record<string, string>> = {
        'Kim': { 'Thủy': 'Sinh Xuất', 'Mộc': 'Khắc Xuất', 'Thổ': 'Sinh Nhập', 'Hỏa': 'Khắc Nhập', 'Kim': 'Bình Hòa' },
        'Mộc': { 'Hỏa': 'Sinh Xuất', 'Thổ': 'Khắc Xuất', 'Thủy': 'Sinh Nhập', 'Kim': 'Khắc Nhập', 'Mộc': 'Bình Hòa' },
        'Thủy': { 'Mộc': 'Sinh Xuất', 'Hỏa': 'Khắc Xuất', 'Kim': 'Sinh Nhập', 'Thổ': 'Khắc Nhập', 'Thủy': 'Bình Hòa' },
        'Hỏa': { 'Thổ': 'Sinh Xuất', 'Kim': 'Khắc Xuất', 'Mộc': 'Sinh Nhập', 'Thủy': 'Khắc Nhập', 'Hỏa': 'Bình Hòa' },
        'Thổ': { 'Kim': 'Sinh Xuất', 'Thủy': 'Khắc Xuất', 'Hỏa': 'Sinh Nhập', 'Mộc': 'Khắc Nhập', 'Thổ': 'Bình Hòa' }
    };

    const menhEl = chart.element;
    const cucEl = chart.cucLoai ? chart.cucLoai.split(' ')[0] : '';

    let relationText = '';
    let relationColor = 'text-gray-400';

    if (menhEl && cucEl && MENH_CUC_RELATION[menhEl] && MENH_CUC_RELATION[menhEl][cucEl]) {
        const rel = MENH_CUC_RELATION[menhEl][cucEl];
        if (rel === 'Sinh Nhập') { relationText = 'Cục sinh Mệnh'; relationColor = 'text-green-400'; }
        else if (rel === 'Sinh Xuất') { relationText = 'Mệnh sinh Cục'; relationColor = 'text-blue-400'; }
        else if (rel === 'Khắc Xuất') { relationText = 'Mệnh khắc Cục'; relationColor = 'text-yellow-400'; }
        else if (rel === 'Khắc Nhập') { relationText = 'Cục khắc Mệnh'; relationColor = 'text-red-400'; }
        else if (rel === 'Bình Hòa') { relationText = 'Mệnh Cục hòa'; relationColor = 'text-gray-400'; }
    }


    return (
        <div className="col-span-2 row-span-2 flex flex-col relative overflow-hidden glass-card border-none ring-1 ring-white/10">
            {/* Layer 0: Background and Decoration */}
            <div className="absolute inset-0 bg-black/40 z-0" />
            
            {/* Holographic Circle Pattern */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-48 h-48 rounded-full border border-amber-500/20 animate-spin-slow opacity-30" />
                <div className="absolute w-36 h-36 rounded-full border border-purple-500/20 animate-spin-reverse-slow opacity-30" />
            </div>

            {/* Header Title */}
            <div className="text-center py-2 border-b border-white/10 relative z-20 bg-white/5">
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 uppercase tracking-widest font-serif">Tử Vi Đẩu Số</h2>
                <p className="text-[10px] text-gray-500 font-mono">THIÊN CƠ BẤT KHẢ LỘ</p>
            </div>

            {/* 2-Column Layout */}
            <div className="flex-1 grid grid-cols-2 gap-4 p-4 relative z-20">
                {/* Left Column: Personal Info */}
                <div className="text-xs sm:text-sm space-y-2 text-left pl-2 flex flex-col justify-start pt-2">
                    <div className="font-bold text-amber-500/80 border-b border-amber-500/20 mb-2 pb-1 uppercase text-sm font-serif">Đương Số</div>
                    <div className="truncate"><span className="text-gray-500">Họ tên:</span> <span className="font-bold block sm:inline sm:ml-2 text-gray-200">{input.fullName}</span></div>
                    <div className="truncate"><span className="text-gray-500">Năm sinh:</span> <span className="font-semibold block sm:inline sm:ml-2 text-gray-300">{yearCanChi}</span></div>
                    <div className="truncate"><span className="text-gray-500">Dương lịch:</span> <span className="font-semibold block sm:inline sm:ml-2 text-gray-300">{input.calendarType === 'lunar' ? '---' : `${input.birthDay}/${input.birthMonth}/${input.birthYear}`}</span></div>
                    <div className="truncate"><span className="text-gray-500">Âm lịch:</span> <span className="font-semibold block sm:inline sm:ml-2 text-gray-300">{chart.lunarDate ? `${chart.lunarDate.day}/${chart.lunarDate.month}` : ''}</span></div>
                    <div className="truncate"><span className="text-gray-500">Giờ sinh:</span> <span className="font-semibold block sm:inline sm:ml-2 text-gray-300">{birthHourName}</span></div>
                    <div className="truncate"><span className="text-gray-500">Giới tính:</span> <span className="font-semibold block sm:inline sm:ml-2 text-gray-300">{input.gender === 'male' ? 'Nam' : 'Nữ'}</span></div>
                </div>

                {/* Right Column: Destiny Info */}
                <div className="text-xs sm:text-sm space-y-2 text-right pr-2 flex flex-col justify-start pt-2">
                    <div className="font-bold text-amber-500/80 border-b border-amber-500/20 mb-2 pb-1 uppercase text-sm font-serif">Mệnh Tạo</div>

                    <div className="">
                        <span className="text-gray-500">Bản Mệnh:</span>
                        <span className="font-bold text-rose-400 block text-xs sm:text-sm mt-0.5 leading-tight">{banMenhDisplay}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <div>
                            <span className="text-gray-500">Cục:</span>
                            <span className="font-bold text-blue-400 ml-1">{chart.cucLoai || (chart as any).cuc || 'Nhị Cục'}</span>
                        </div>
                        {relationText && (
                            <span className={`text-[10px] italic ${relationColor}`}>{relationText}</span>
                        )}
                    </div>
                    <div>
                        <span className="text-gray-500">Chủ Mệnh:</span>
                        <span className="font-bold text-amber-200 block sm:inline sm:ml-2">{chart.chuMenh || 'Liêm Trinh'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Chủ Thân:</span>
                        <span className="font-bold text-amber-200 block sm:inline sm:ml-2">{chart.chuThan || 'Thiên Lương'}</span>
                    </div>
                </div>
            </div>

            {/* Major Star Group */}
            {(chart as any).majorStarGroup && (
                <div className="px-4 pb-2 text-center relative z-20 mx-2 mb-1 mt-2">
                    <div className="w-3/4 mx-auto border-t border-dashed border-white/20 mb-1.5 h-px"></div>
                    <span className="text-purple-400 font-bold uppercase text-xs sm:text-sm block tracking-widest text-shadow">
                        {(chart as any).majorStarGroup.name}
                    </span>
                </div>
            )}

            {/* Footer with Elements */}
            <div className="relative z-20 bg-white/5 py-1.5 border-t border-white/10">
                {(() => {
                    const currentElement = chart.element || '';
                    const elementClass = (el: string) =>
                        currentElement.includes(el)
                            ? 'ring-1 ring-amber-400 text-amber-400 font-bold shadow-[0_0_10px_rgba(251,191,36,0.5)] scale-105 bg-amber-500/20'
                            : 'opacity-40 text-gray-500';
                    return (
                        <div className="flex justify-center gap-2 sm:gap-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Kim')}`}>KIM</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Mộc')}`}>MỘC</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Thủy')}`}>THỦY</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Hỏa')}`}>HỎA</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Thổ')}`}>THỔ</span>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

export default function TuViChartProfessional({ chart, input }: TuViChartProfessionalProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [scale, setScale] = useState(1);

    const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
    const [chartSelectedBranch, setChartSelectedBranch] = useState<string | null>(null);
    const [showTamHop, setShowTamHop] = useState(true);
    const [showDoiXung, setShowDoiXung] = useState(true);

    const handlePalaceClick = (palace: Palace) => {
        if (palace.earthlyBranch) {
            setChartSelectedBranch(palace.earthlyBranch);
        }
        setSelectedPalace(palace);
        setModalOpen(true);
    };

    // Map palace name -> palace data
    const palaceMap = new Map<string, Palace>();
    (chart.palaces || []).forEach((p: Palace) => {
        palaceMap.set(p.name, p);
        const normalizedName = normalizePalaceName(p.name);
        if (normalizedName !== p.name) {
            palaceMap.set(normalizedName, p);
        }
        if (p.earthlyBranch) {
            const branchPalace = BRANCH_TO_PALACE[p.earthlyBranch];
            if (branchPalace) {
                palaceMap.set(branchPalace, p);
            }
        }
    });

    const getPalace = (name: string): Palace | null => {
        return palaceMap.get(name) || null;
    };

    const getPalaceByBranch = (branch: string): Palace | null => {
        const branches = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
        const branchIndex = branches.indexOf(branch);

        if (branchIndex === -1) return null;

        const found = (chart.palaces || []).find(p => {
            if (typeof p.position === 'number') {
                return p.position === branchIndex;
            }
            if (p.earthlyBranch === branch) return true;
            return false;
        });

        return found || null;
    };

    const getMenhBranch = () => {
        const menh = (chart.palaces || []).find(p => normalizePalaceName(p.name) === 'Mệnh');
        if (!menh) return null;

        if (typeof menh.position === 'number') {
            const branches = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
            return branches[menh.position];
        }
        return menh.earthlyBranch || null;
    };

    // Initialize hoveredBranch with Mệnh
    React.useEffect(() => {
        const menhBranch = getMenhBranch();
        if (menhBranch) {
            setHoveredBranch(menhBranch);
        }
    }, [chart]);

    const isBranchHighlighted = (branch: string): boolean => {
        if (!hoveredBranch) return false;
        if (hoveredBranch === branch) return true;
        if (showTamHop) {
            const tamHopGroup = TAM_HOP_GROUPS.find(group => group.includes(hoveredBranch));
            if (tamHopGroup && tamHopGroup.includes(branch)) return true;
        }
        if (showDoiXung) {
           if (CUNG_DOI_XUNG[hoveredBranch] === branch) return true;
        }
        return false;
    };

    const currentPalaceLayout = EARTHLY_BRANCHES_POSITIONS.map((pos, idx) => {
        if (!pos) return null; // Center cells
        return {
            branch: pos,
            palace: getPalaceByBranch(pos)
        };
    });

    // Handle Image Export
    const handleExportImage = async () => {
        if (chartRef.current) {
            try {
                const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#0f172a' }); // Dark background for export
                const link = document.createElement('a');
                link.download = `la-so-tu-vi-${input.fullName.replace(/\s+/g, '-').toLowerCase()}.png`;
                link.href = dataUrl;
                link.click();
                toast.success('Đã tải ảnh lá số về máy');
            } catch (err) {
                console.error('Export error:', err);
                toast.error('Có lỗi khi xuất ảnh');
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between w-full gap-4 p-4 rounded-xl glass border border-white/10">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowTamHop(!showTamHop)}
                        className={`text-xs ${showTamHop ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}
                    >
                        <Triangle className="w-3 h-3 mr-1" />
                        Tam Hợp
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowDoiXung(!showDoiXung)}
                        className={`text-xs ${showDoiXung ? 'bg-red-500/20 text-red-400' : 'text-gray-400'}`}
                    >
                        <Triangle className="w-3 h-3 mr-1 rotate-180" />
                        Xung Chiếu
                    </Button>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="border-white/20 text-gray-300 hover:bg-white/10">
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-xs font-mono text-gray-400 w-12 text-center">{Math.round(scale * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={() => setScale(s => Math.min(2, s + 0.1))} className="border-white/20 text-gray-300 hover:bg-white/10">
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <Button variant="default" size="sm" onClick={handleExportImage} className="bg-purple-600 hover:bg-purple-500 text-white">
                        <Download className="w-4 h-4 mr-1" />
                        Lưu Ảnh
                    </Button>
                </div>
            </div>

            {/* Main Chart Container */}
            <div className="w-full overflow-auto flex justify-center p-4 rounded-xl glass-card bg-[#0f172a]/80 shadow-2xl backdrop-blur-xl border border-white/5">
                <div 
                    ref={chartRef}
                    className="relative bg-transparent transition-transform duration-200 origin-top"
                    style={{ 
                        width: '1200px', 
                        height: '900px', // Fixed aspect ratio for Tu Vi chart
                        transform: `scale(${scale})`
                    }}
                >
                    {/* SVG Overlay Layer */}
                    <MainChartOverlay 
                         selectedBranch={chartSelectedBranch || hoveredBranch}
                         showTamHop={showTamHop}
                         showDoiXung={showDoiXung}
                         menhBranch={getMenhBranch() || undefined}
                    />
                    
                    {/* Mini Map Layer */}
                    <TamPhuongTuChinhMiniMap
                         selectedBranch={chartSelectedBranch || hoveredBranch}
                         showTamHop={showTamHop}
                         showDoiXung={showDoiXung}
                         menhBranch={getMenhBranch() || undefined}
                    />

                    {/* CSS Grid for Palaces */}
                    <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full p-2">
                        {EARTHLY_BRANCHES_POSITIONS.map((branch, index) => {
                             const row = Math.floor(index / 4);
                             const col = index % 4;
                             const isCenter = (row === 1 || row === 2) && (col === 1 || col === 2);

                             if (isCenter) {
                                 // Only render CenterInfo once at (1,1) spanning 2x2
                                 if (row === 1 && col === 1) {
                                     return <CenterInfo key="center" chart={chart} input={input} />;
                                 }
                                 return null; // Skip other center cells
                             }

                             const palace = getPalaceByBranch(branch);
                             // Need to find 'index' for Dai Van calculation fallback
                             // The original logic passed `number` or calculated index
                             // Here we just pass the loop index or palace.id
                             
                             return (
                                 <div key={branch} className="w-full h-full relative">
                                     <PalaceCell 
                                         palace={palace} 
                                         branch={branch}
                                         palaceName={palace ? palace.name : normalizePalaceName(BRANCH_TO_PALACE[branch] || '')}
                                         branchElement={HOUR_ELEMENTS[branch.toLowerCase().replace(/đ/g, 'd').replace(/ê/g, 'e').replace(/ô/g, 'o').replace(/ư/g, 'u').replace(/ơ/g, 'u').normalize('NFD').replace(/[\u0300-\u036f]/g, '')] || ''}
                                         index={index}
                                         onPalaceClick={handlePalaceClick}
                                         onHover={setHoveredBranch}
                                         isHighlighted={isBranchHighlighted(branch)}
                                     />
                                 </div>
                             );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal for Palace Details */}
            {selectedPalace && (
                <PalaceDetailModal 
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    palace={selectedPalace}
                    input={{
                        fullName: input.fullName,
                        birthDate: `${input.birthYear}-${String(input.birthMonth).padStart(2, '0')}-${String(input.birthDay).padStart(2, '0')}`,
                        birthHour: input.birthHour,
                        gender: input.gender,
                        calendarType: input.calendarType || 'solar'
                    }}
                />
            )}
        </div>
    );
}
