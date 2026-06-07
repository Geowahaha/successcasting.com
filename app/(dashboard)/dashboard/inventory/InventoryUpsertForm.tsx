"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  inventoryActionInitialState,
  type InventoryActionState,
  upsertInventoryAction,
} from "./actions";
import { useToast } from "@/components/ui/toast";

type ProductOption = {
  id: string;
  name: string;
  sku: string | null;
};

type InventoryUpsertFormProps = {
  products: ProductOption[];
  labels: {
    selectProduct: string;
    location: string;
    onHand: string;
    reserved: string;
    saveRow: string;
  };
  lang: string;
};

export function InventoryUpsertForm({ products, labels, lang }: InventoryUpsertFormProps) {
  const [state, formAction, isPending] = useActionState<InventoryActionState, FormData>(
    upsertInventoryAction,
    inventoryActionInitialState,
  );
  const { pushToast } = useToast();
  const prevMessageRef = useRef<string>("");

  useEffect(() => {
    if (!state.message || state.message === prevMessageRef.current) return;
    prevMessageRef.current = state.message;
    pushToast(state.message, state.ok ? "success" : "error");
  }, [pushToast, state.message, state.ok]);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 md:grid-cols-5">
      <input type="hidden" name="lang" value={lang} />
      <select
        name="productId"
        required
        disabled={isPending}
        className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm md:col-span-2"
      >
        <option value="">{labels.selectProduct}</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} {product.sku ? `(${product.sku})` : ""}
          </option>
        ))}
      </select>
      <input
        name="location"
        required
        disabled={isPending}
        placeholder={labels.location}
        className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
      />
      <input
        name="quantityOnHand"
        required
        disabled={isPending}
        type="number"
        min={0}
        placeholder={labels.onHand}
        className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
      />
      <input
        name="reservedQuantity"
        required
        disabled={isPending}
        type="number"
        min={0}
        placeholder={labels.reserved}
        className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 transition-colors md:col-span-5 md:justify-self-start disabled:cursor-not-allowed disabled:opacity-60"
      >
        {labels.saveRow}
      </button>
    </form>
  );
}

