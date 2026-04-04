import React, { useState } from "react";
import {
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaDesktop,
  FaBatteryFull,
  FaCamera,
  FaWifi,
  FaLaptop,
  FaBolt,
  FaVideo,
  FaUsb,
  FaSimCard,
  FaFingerprint,
  FaVolumeUp,
  FaKeyboard,
  FaPaintBrush,
  FaRuler,
  FaSlidersH,
  FaCog,
  FaList,
  FaThLarge,
} from "react-icons/fa";

/* ─── Spec key → icon map ────────────────────────────────────────── */
const SPEC_ICONS = {
  "Processor (Chipset)": <FaMicrochip />,
  "Processor (CPU)": <FaMicrochip />,
  "Graphics (GPU)": <FaThLarge />,
  Display: <FaDesktop />,
  "Memory (RAM)": <FaMemory />,
  Storage: <FaHdd />,
  "Operating System (OS)": <FaLaptop />,
  Battery: <FaBatteryFull />,
  Charging: <FaBolt />,
  "Rear Camera": <FaCamera />,
  "Front Camera": <FaVideo />,
  "Camera & Audio": <FaCamera />,
  Connectivity: <FaWifi />,
  "Ports & Connectivity": <FaUsb />,
  "SIM & Network": <FaSimCard />,
  "Sensors & Security": <FaFingerprint />,
  Audio: <FaVolumeUp />,
  "Keyboard & Input": <FaKeyboard />,
  "Build & Design": <FaPaintBrush />,
  "Dimensions & Weight": <FaRuler />,
  "Other Features": <FaSlidersH />,
};

const getSpecIcon = (key) =>
  SPEC_ICONS[key] ?? <FaCog className="h-3.5 w-3.5" />;

/* ─── Specifications Table ───────────────────────────────────────── */
const SpecsTable = ({ specifications }) => {
  const [expanded, setExpanded] = useState(false);

  const filled = (specifications || []).filter(
    (s) => s.value && s.value.trim() !== "",
  );
  if (filled.length === 0) return null;

  const PREVIEW_COUNT = 6;
  const visible = expanded ? filled : filled.slice(0, PREVIEW_COUNT);
  const hasMore = filled.length > PREVIEW_COUNT;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-3">
        <FaList className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-productSansBold text-sm tracking-wide text-white">
          Specifications
        </span>
        <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
          {filled.length} specs
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-50">
        {visible.map((spec, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
              i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
            }`}
          >
            {/* Icon */}
            <span className="mt-0.5 flex-shrink-0 text-blue-500">
              {React.cloneElement(getSpecIcon(spec.key), {
                className: "h-3.5 w-3.5",
              })}
            </span>
            {/* Key */}
            <span className="font-productSansBold w-[38%] flex-shrink-0 text-xs text-slate-500">
              {spec.key}
            </span>
            {/* Value */}
            <span className="font-productSansReg min-w-0 flex-1 text-xs leading-relaxed text-slate-800">
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Expand / Collapse */}
      {hasMore && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50 py-2.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
        >
          {expanded ? (
            <>
              <span>Show Less</span>
              <span className="text-[10px]">▲</span>
            </>
          ) : (
            <>
              <span>Show All {filled.length} Specs</span>
              <span className="text-[10px]">▼</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default SpecsTable;
