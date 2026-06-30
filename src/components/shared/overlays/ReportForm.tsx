import { useState } from "react";
import { Button, Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

const REASONS = [
  { key: "fake", label: "Fake or misleading listing" },
  { key: "closed", label: "Business is closed" },
  { key: "wrong_info", label: "Wrong information" },
  { key: "spam", label: "Spam" },
  { key: "inappropriate", label: "Inappropriate content" },
  { key: "other", label: "Something else" },
];

export function ReportForm({ onDone }: { onDone: () => void }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-sel-bg text-forest">
          <Icon name="check" size={30} />
        </span>
        <h3 className="display-2">Thanks for flagging this.</h3>
        <p className="max-w-sm text-muted">Our team will review it. Reports like yours keep the marketplace trustworthy.</p>
        <Button className="mt-2" onClick={onDone}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (reason) setSent(true);
      }}
    >
      <div className="grid gap-2">
        {REASONS.map((r) => (
          <button
            type="button"
            key={r.key}
            onClick={() => setReason(r.key)}
            className={cn(
              "flex items-center gap-2 rounded-[11px] border px-4 py-2.5 text-left text-[14px] transition hover:border-forest",
              reason === r.key ? "border-forest bg-sel-bg" : "border-line",
            )}
          >
            <span className={cn("grid h-4 w-4 place-items-center rounded-full border", reason === r.key ? "border-forest" : "border-line")}>
              {reason === r.key && <span className="h-2 w-2 rounded-full bg-forest" />}
            </span>
            {r.label}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Add any detail (optional)"
        className="w-full rounded-[11px] border border-line bg-bone px-3 py-2 text-[14px] outline-none focus:border-forest"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!reason}>
          Submit report
        </Button>
      </div>
    </form>
  );
}
