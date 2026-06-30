import { useState } from "react";
import { Button, Input, Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

export type ConnectIntent = "project" | "product" | "shop" | "service";

export interface ConnectOptions {
  intent?: ConnectIntent;
  sellerName?: string;
  itemName?: string;
}

const COPY: Record<ConnectIntent, { q: string; options: string[]; respond: string }> = {
  project: {
    q: "What kind of project is this?",
    options: ["Full home interior", "Single room", "Modular kitchen", "Renovation"],
    respond: "4 hours",
  },
  product: {
    q: "What do you need?",
    options: ["Price & availability", "Bulk / trade quote", "Request a sample", "Custom size"],
    respond: "6 hours",
  },
  shop: {
    q: "How would you like to connect?",
    options: ["Plan a showroom visit", "Check stock", "Ask about a product"],
    respond: "a few hours",
  },
  service: {
    q: "What do you need help with?",
    options: ["Consultation", "Get a quote", "Site visit", "General enquiry"],
    respond: "4 hours",
  },
};

/** Intent-aware enquiry flow. Never asks budget — focuses on need + contact. */
export function ConnectForm({ intent = "project", sellerName = "this seller", itemName, onDone }: ConnectOptions & { onDone: () => void }) {
  const copy = COPY[intent];
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const total = 3;

  if (step === 2) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-sel-bg text-forest">
          <Icon name="check" size={30} />
        </span>
        <h3 className="display-2">Routed exclusively to {sellerName}.</h3>
        <p className="max-w-sm text-muted">
          They typically respond within {copy.respond}. We'll notify you the moment they reply.
        </p>
        <Button className="mt-2" onClick={onDone}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: total - 1 }).map((_, i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-forest" : "bg-line")} />
        ))}
      </div>

      {itemName && <p className="text-[13px] text-muted">Enquiry about <span className="font-medium text-ink">{itemName}</span></p>}

      {step === 0 && (
        <div className="space-y-3">
          <p className="font-serif text-[19px] italic text-forest">{copy.q}</p>
          <div className="grid gap-2">
            {copy.options.map((o) => (
              <button
                key={o}
                onClick={() => {
                  setNeed(o);
                  setStep(1);
                }}
                className={cn(
                  "rounded-[11px] border px-4 py-3 text-left text-[14px] transition hover:border-forest",
                  need === o ? "border-forest bg-sel-bg" : "border-line",
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim() && phone.trim().length >= 10) setStep(2);
          }}
        >
          <p className="font-serif text-[19px] italic text-forest">How can they reach you?</p>
          <Input label="Your name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            label="Mobile number"
            leftAddon="+91"
            inputMode="numeric"
            placeholder="10-digit mobile"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            required
          />
          <div className="flex justify-between pt-1">
            <Button type="button" variant="ghost" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button type="submit">Send enquiry</Button>
          </div>
        </form>
      )}
    </div>
  );
}
