"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  quoteActionInitialState,
  type QuoteActionState,
  updateQuoteStatusAction,
} from "./actions";
import { useToast } from "@/components/ui/toast";

type QuoteStatusFormProps = {
  quoteId: string;
  currentStatus: string;
  statuses: readonly string[];
  statusLabels: Record<string, string>;
  updateStatusLabel: string;
  saveLabel: string;
  lang: string;
};

export function QuoteStatusForm(props: QuoteStatusFormProps) {
  const [state, formAction, isPending] = useActionState<QuoteActionState, FormData>(
    updateQuoteStatusAction,
    quoteActionInitialState,
  );
  const { pushToast } = useToast();
  const prevMessageRef = useRef<string>("");

  useEffect(() => {
    if (!state.message || state.message === prevMessageRef.current) return;
    prevMessageRef.current = state.message;
    pushToast(state.message, state.ok ? "success" : "error");
  }, [pushToast, state.message, state.ok]);

  return (
    <form action={formAction} className="mt-3 flex flex-wrap items-center gap-3">
      <input type="hidden" name="quoteId" value={props.quoteId} />
      <input type="hidden" name="lang" value={props.lang} />
      <label className="text-xs text-muted-2">{props.updateStatusLabel}</label>
      <select
        name="status"
        defaultValue={props.currentStatus}
        className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
        disabled={isPending}
      >
        {props.statuses.map((status) => (
          <option key={status} value={status}>
            {props.statusLabels[status] ?? status}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {props.saveLabel}
      </button>
    </form>
  );
}

