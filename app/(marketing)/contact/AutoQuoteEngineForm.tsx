"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/i18n-shared";

type MaterialOption = {
  id: string;
  name: string;
};

type Props = {
  locale: Locale;
  materials: MaterialOption[];
};

type EstimateResponse = {
  estimatedPriceUsd: number;
  leadTimeDays: number;
  quoteSummary: string;
  aiExplanation: string;
  breakdown: {
    material: { name: string; costUsd: number };
    castingCostUsd: number;
    machiningCostUsd: number;
    laborCostUsd: number;
    overheadCostUsd: number;
    marginCostUsd: number;
    estimatedTotalUsd: number;
  };
};

export function AutoQuoteEngineForm({ locale, materials }: Props) {
  const [specsText, setSpecsText] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResponse | null>(null);

  const isTh = locale === "th";
  const isZh = locale === "zh";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/ai/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        specsText,
        materialId: materialId || undefined,
        materialName: materialName || undefined,
        lang: locale,
      }),
    });

    const json = (await response.json().catch(() => null)) as
      | { estimate?: EstimateResponse; error?: string }
      | null;

    if (!response.ok || !json?.estimate) {
      setResult(null);
      setError(json?.error ?? (isTh ? "ไม่สามารถประเมินราคาได้" : isZh ? "估算失败" : "Failed to estimate"));
      setLoading(false);
      return;
    }

    setResult(json.estimate);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <select
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
        >
          <option value="">
            {isTh ? "เลือกวัสดุ (ไม่บังคับ)" : isZh ? "选择材料（可选）" : "Select material (optional)"}
          </option>
          {materials.map((material) => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>
        <Input
          value={materialName}
          onChange={(e) => setMaterialName(e.target.value)}
          placeholder={isTh ? "หรือระบุชื่อวัสดุ (เช่น Steel)" : isZh ? "或输入材料名称（如 Steel）" : "Or type material name (e.g. Steel)"}
        />
        <Textarea
          value={specsText}
          onChange={(e) => setSpecsText(e.target.value)}
          required
          placeholder={
            isTh
              ? "ระบุสเปก: วัสดุ, น้ำหนัก, ขนาด, tolerance, กระบวนการ machining, ปริมาณ, กำหนดส่ง"
              : isZh
                ? "输入规格：材料、重量、尺寸、公差、机加工要求、数量、交期"
                : "Describe specs: material, weight, dimensions, tolerance, machining, quantity, target delivery"
          }
        />
        <Button type="submit" disabled={loading}>
          {loading
            ? isTh
              ? "กำลังคำนวณ..."
              : isZh
                ? "计算中..."
                : "Calculating..."
            : isTh
              ? "คำนวณราคาอัตโนมัติ"
              : isZh
                ? "自动报价"
                : "Run Auto-Quotation"}
        </Button>
      </form>

      {error ? <div className="text-sm text-red-300">{error}</div> : null}

      {result ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
          <div className="text-lg font-semibold">${result.estimatedPriceUsd.toFixed(2)}</div>
          <div className="text-muted-2">
            {isTh ? "ระยะเวลา" : isZh ? "交期" : "Lead time"}: {result.leadTimeDays} {isTh ? "วัน" : isZh ? "天" : "days"}
          </div>
          <div className="mt-3 text-xs text-muted-2">{result.quoteSummary}</div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>Material: ${result.breakdown.material.costUsd.toFixed(2)}</div>
            <div>Casting: ${result.breakdown.castingCostUsd.toFixed(2)}</div>
            <div>Machining: ${result.breakdown.machiningCostUsd.toFixed(2)}</div>
            <div>Labor: ${result.breakdown.laborCostUsd.toFixed(2)}</div>
            <div>Overhead: ${result.breakdown.overheadCostUsd.toFixed(2)}</div>
            <div>Margin: ${result.breakdown.marginCostUsd.toFixed(2)}</div>
          </div>
          <div className="mt-3 text-xs text-muted">{result.aiExplanation}</div>
        </div>
      ) : null}
    </div>
  );
}

