import { useState } from "react";
import { Button, Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

const MOODS = [
  { key: "love", emoji: "😍", label: "Loved it" },
  { key: "good", emoji: "🙂", label: "Pretty good" },
  { key: "meh", emoji: "😐", label: "It was okay" },
  { key: "bad", emoji: "😣", label: "Hit a problem" },
];

export function FeedbackForm({ onDone }: { onDone: () => void }) {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-sel-bg text-forest">
          <Icon name="check" size={30} />
        </span>
        <h3 className="display-2">Thank you.</h3>
        <p className="max-w-sm text-muted">Your note helps us make Interior Bazzar calmer and more useful.</p>
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
        if (mood) setSent(true);
      }}
    >
      <p className="font-serif text-[19px] italic text-forest">How was your experience?</p>
      <div className="grid grid-cols-4 gap-2">
        {MOODS.map((m) => (
          <button
            type="button"
            key={m.key}
            onClick={() => setMood(m.key)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-[11px] border px-2 py-3 text-[12px] transition hover:border-forest",
              mood === m.key ? "border-forest bg-sel-bg" : "border-line",
            )}
          >
            <span className="text-2xl">{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="In your words — what worked, what didn't?"
        className="w-full rounded-[11px] border border-line bg-bone px-3 py-2 text-[14px] outline-none focus:border-forest"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!mood}>
          <Icon name="send" size={16} /> Send feedback
        </Button>
      </div>
    </form>
  );
}
