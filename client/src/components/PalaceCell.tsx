
import React from 'react';

// Component hiển thị một cung
export function PalaceCell({
    palace,
    palaceName,
    branch,
    branchElement,
    index,
    onPalaceClick,
    onHover,
    isHighlighted = false
}: {
    palace: any;
    palaceName: string;
    branch: string;
    branchElement: string;
    index: number;
    onPalaceClick?: (palace: any) => void;
    onHover?: (branch: string | null) => void;
    isHighlighted?: boolean;
}) {
    if (!palace) {
        // Empty palace handling
        return (
            <div className="glass-card border-white/5 bg-white/5 p-1 h-full min-h-[160px] flex flex-col relative opacity-50">
                <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">{branch}</span>
                    <span className="text-gray-400 font-bold text-xs sm:text-sm uppercase text-center flex-1">{palaceName}</span>
                </div>
                <div className="absolute bottom-0.5 right-1 text-[7px] sm:text-[8px] text-gray-600">+{branchElement}</div>
            </div>
        );
    }

    // Separate Main Stars vs Secondary Stars
    const mainStarsData = (palace.mainStars || []).map((s: any) => ({ ...s, isMain: true }));
    const secondaryData = (palace.secondaryStars || []).map((s: any) => ({ ...s, isMain: false }));

    // Extract Trang Sinh for Footer
    const trangSinhNames = ["Tràng Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan", "Đế Vượng", "Suy", "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"];
    const trangSinhStar = secondaryData.find((s: any) => trangSinhNames.includes(s.name));

    // Filter out Trang Sinh from main list
    const listStars = secondaryData.filter((s: any) => !trangSinhNames.includes(s.name));

    // Split into Left (Good/Neutral + Tuan/Triet) and Right (Bad)
    const isBad = (s: any) => ['bad', 'hung'].includes(s.nature || '') && !['Tuần', 'Triệt'].includes(s.name);
    // List of Good/Neutral
    const isGood = (s: any) => !isBad(s);

    const leftStars = listStars.filter(isGood).sort((a: any, b: any) => {
        // Tuan/Triet first
        if (['Tuần', 'Triệt'].includes(a.name) && !['Tuần', 'Triệt'].includes(b.name)) return -1;
        if (!['Tuần', 'Triệt'].includes(a.name) && ['Tuần', 'Triệt'].includes(b.name)) return 1;
        return 0; // Keep original order otherwise
    });

    const rightStars = listStars.filter(isBad);

    // Heuristic for Tieu Van
    const branches = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
    const currentBranchIdx = branches.indexOf(branch);
    const tieuVanBranch = branches[(currentBranchIdx - 2 + 12) % 12];


    const renderStar = (star: any) => {
        const isTuanTriet = ['Tuần', 'Triệt'].includes(star.name);
        if (isTuanTriet) {
            return (
                <span className="inline-block bg-red-900/80 text-white text-[9px] px-1 rounded mr-1 mb-0.5 border border-red-500/30">
                    {star.name}
                </span>
            );
        }

        let textColor = 'text-gray-300'; // Default Neutral on Dark
        const el = star.element ? star.element.toLowerCase() : '';

        // Colors suited for Dark Background
        if (el === 'kim') textColor = 'text-amber-100';      // White/Gold
        else if (el === 'mộc') textColor = 'text-emerald-400'; // Green
        else if (el === 'thủy') textColor = 'text-blue-400';   // Blue
        else if (el === 'hỏa') textColor = 'text-rose-400';    // Red/Pink
        else if (el === 'thổ') textColor = 'text-yellow-500';  // Yellow/Earth

        // Special handling for Main Stars to make them pop
        if (star.isMain) {
             if (star.nature === 'good' || star.nature === 'cat') textColor = 'text-amber-300 drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]';
             else if (star.nature === 'bad' || star.nature === 'hung') textColor = 'text-indigo-400'; 
             else if (el === 'thổ') textColor = 'text-yellow-400';
             else if (el === 'hỏa') textColor = 'text-red-400';
             else if (el === 'kim') textColor = 'text-gray-100';
             else if (el === 'thủy') textColor = 'text-blue-400';
             else if (el === 'mộc') textColor = 'text-green-400';
        } else {
             // Secondary stars
             if (star.nature === 'bad' || star.nature === 'hung') textColor = 'text-slate-400'; 
             if (star.name === 'Lộc Tồn' || star.name === 'Hóa Lộc') textColor = 'text-green-400 font-semibold';
             if (star.name === 'Hóa Kỵ') textColor = 'text-purple-400'; 
        }

        const isMain = star.isMain;

        return (
            <div className={`${isMain ? 'text-sm font-bold uppercase mb-1' : 'text-[10px] sm:text-[11px] font-medium leading-tight'} ${textColor} transition-all duration-200`}>
                {star.name}
                {star.brightness && <span className="text-[9px] ml-0.5 opacity-70">({star.brightness})</span>}
            </div>
        );
    };

    return (
        <div
            className={`tuvi-palace glass-card border-white/10 p-1 flex flex-col cursor-pointer transition-all duration-300 relative h-full min-h-[160px] z-20 hover:border-purple-500/50 hover:bg-white/5
                ${isHighlighted ? 'bg-purple-900/30 ring-1 ring-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : ''}
            `}
            onClick={() => onPalaceClick?.(palace)}
            onMouseEnter={() => onHover?.(branch)}
            onMouseLeave={() => onHover?.(null)}
        >
            {/* Header: Branch (Left) - Palace (Center) - DaiVan (Right) */}
            <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1 px-1">
                <span className="text-[10px] text-gray-400 font-semibold uppercase w-6 text-left">{branch}</span>
                <span className="text-amber-200 font-bold text-xs sm:text-sm uppercase text-center flex-1 truncate px-1 text-shadow-sm" title={palace.name}>{palace.name}</span>
                <span className="text-rose-400 text-[10px] font-bold w-6 text-right">
                    {(palace as any).daiVan !== undefined ? (palace as any).daiVan : index}
                </span>
            </div>

            {/* Main Stars: Centered */}
            <div className="flex flex-col items-center mb-1 min-h-[1.5em] relative z-10">
                {mainStarsData.map((star: any, i: number) => (
                    <div key={`main-${i}`}>{renderStar(star)}</div>
                ))}
            </div>

            {/* Secondary Stars: 2 Columns */}
            <div className="flex-1 grid grid-cols-2 gap-1 px-0.5 border-t border-dashed border-white/10 pt-1 relative z-10">
                {/* Left Column: Good/Neutral */}
                <div className="flex flex-col text-left pr-0.5">
                    {leftStars.map((star: any, i: number) => (
                        <div key={`left-${i}`}>{renderStar(star)}</div>
                    ))}
                </div>
                {/* Right Column: Bad */}
                <div className="flex flex-col text-right pl-0.5 border-l border-dashed border-white/10">
                    {rightStars.map((star: any, i: number) => (
                        <div key={`right-${i}`}>{renderStar(star)}</div>
                    ))}
                </div>
            </div>

            {/* Footer: TieuVan (Left) - TrangSinh (Center) - Element (Right) */}
            <div className="flex justify-between items-end mt-1 pt-1 border-t border-dashed border-white/10 text-[9px] sm:text-[10px] px-1">
                <span className="text-gray-500 font-medium w-6 text-left">{tieuVanBranch}</span>

                <span className="text-yellow-600 font-semibold uppercase text-[9px] text-center flex-1">
                    {trangSinhStar?.name || ''}
                </span>

                <span className="text-gray-500 font-medium w-6 text-right">
                    {index % 2 === 0 ? '+' : '-'}{branchElement}
                </span>
            </div>
        </div>
    );
}
