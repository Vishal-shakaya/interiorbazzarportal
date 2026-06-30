import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Icon, type IconName } from "@/components/ui";
import { CardGrid, ListingCard, useOverlays } from "@/components/shared";
import { Panel, ToggleRow, EmptyState } from "@/components/dashboard/parts";
import { AsyncBoundary } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useAsync } from "@/hooks/useAsync";
import { DashboardService } from "@/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAuth, selectRole, patch } from "@/redux/slice/authSlice";
import { selectSavedIds } from "@/redux/slice/savedSlice";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useAlert } from "@/providers";
import { PAGES } from "@/lib/constants";
import { ALL_ITEMS } from "@/content/marketplace.content";

/* ── Connections ───────────────────────────────────────────────── */

const statusMeta: Record<string, { label: string; cls: string; icon: IconName }> = {
  Responded: { label: "Active", cls: "bg-green-light text-forest", icon: "chat" },
  Pending: { label: "Awaiting reply", cls: "bg-amber-light text-amber", icon: "clock" },
  Closed: { label: "Closed", cls: "bg-chip text-muted", icon: "check" },
};

export function ConnectionsView() {
  const { data, status, retry } = useAsync(() => DashboardService.buyer(), []);
  const connections = data?.connections ?? [];
  return (
    <Panel
      title="Your enquiries"
      action={
        <Link to={PAGES.PRODUCTS}>
          <Button size="sm"><Icon name="send" size={15} /> New enquiry</Button>
        </Link>
      }
    >
      <AsyncBoundary
        status={status}
        onRetry={retry}
        isEmpty={!connections.length}
        empty={
          <EmptyState
            icon="send"
            title="No conversation yet"
            text="Send a qualified enquiry to a seller to start a connection. Phone-verified, intent-scored, routed to one seller only."
          />
        }
      >
        <ul className="divide-y divide-line">
          {connections.map((c) => {
            const m = statusMeta[c.status];
            return (
              <li key={c.id} className="flex items-center gap-3.5 py-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest text-[14px] font-semibold text-bone">
                  {c.seller.replace(/^Ar\.\s*/, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-[14px] font-semibold text-ink">{c.seller}</p>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", m.cls)}>
                      <Icon name={m.icon} size={11} /> {m.label}
                    </span>
                  </div>
                  <p className="truncate text-[13px] text-muted">{c.item}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.06em] text-muted/70">{c.id} · {c.date}</p>
                </div>
                <button className="grid h-9 w-9 shrink-0 place-items-center rounded-card border border-line text-forest hover:bg-bone-tint" aria-label="Reply">
                  <Icon name="arrow-right" size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      </AsyncBoundary>
    </Panel>
  );
}

/* ── Saved items ───────────────────────────────────────────────── */

const SAVED_FILTERS: { key: string; label: string; icon: IconName; match?: string }[] = [
  { key: "all", label: "All", icon: "bookmark" },
  { key: "products", label: "Products", icon: "products", match: "product" },
  { key: "services", label: "Services", icon: "services", match: "service" },
  { key: "business", label: "Businesses", icon: "business", match: "business" },
  { key: "architects", label: "Architects", icon: "architects", match: "architect" },
];

export function SavedView() {
  const ids = useAppSelector(selectSavedIds);
  const items = ALL_ITEMS.filter((i) => ids.includes(i.id));
  const [filter, setFilter] = useState("all");

  if (!items.length)
    return (
      <EmptyState
        icon="bookmark"
        title="No saved items yet"
        text="Browse listings and tap the heart to save products, services, businesses and architects you like. They'll appear here for easy access."
        action={
          <Link to={PAGES.PRODUCTS} className="mt-1">
            <Button variant="secondary" size="sm"><Icon name="search" size={15} /> Start browsing</Button>
          </Link>
        }
      />
    );

  const active = SAVED_FILTERS.find((f) => f.key === filter);
  const shown = active?.match ? items.filter((i) => i.type === active.match) : items;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-muted">
          <strong className="text-ink">{items.length}</strong> items bookmarked across products, services, businesses and architects.
        </p>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-card border border-line px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-bone-tint">
            <Icon name="share" size={15} /> Share list
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-card border border-line px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-bone-tint">
            <Icon name="download" size={15} /> Export
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {SAVED_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition",
              filter === f.key ? "border-forest bg-sel-bg text-forest" : "border-line text-ink hover:bg-bone-tint",
            )}
          >
            <Icon name={f.icon} size={14} /> {f.label}
            {f.key === "all" && <span className="text-muted">{items.length}</span>}
          </button>
        ))}
      </div>
      {shown.length ? (
        <CardGrid items={shown} />
      ) : (
        <EmptyState icon="bookmark" title={`No saved ${active?.label.toLowerCase()} yet`} text="Browse and save items you're interested in — they'll show up here." />
      )}
    </div>
  );
}

/* ── Recently viewed ───────────────────────────────────────────── */

export function ActivityView() {
  const { items, remove, clear } = useRecentlyViewed();
  if (!items.length)
    return (
      <EmptyState
        icon="history"
        title="Nothing here yet"
        text="Listings, profiles and pages you visit on Interior bazzar show up here for the last 30 days. Use the history to pick up where you left off."
      />
    );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-muted"><strong className="text-ink">{items.length}</strong> items in the last 30 days</p>
        <button onClick={clear} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-err hover:underline">
          <Icon name="trash" size={15} /> Clear history
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.id} className="relative">
            <button onClick={() => remove(it.id)} aria-label="Remove" className="absolute left-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink shadow-card hover:text-err">
              <Icon name="close" size={14} />
            </button>
            <ListingCard item={it} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Reports & feedback ────────────────────────────────────────── */

function ReportsPanel({ icon, title, count, sub, emptyIcon, emptyText, onAdd, addLabel }: {
  icon: IconName; title: string; count: number; sub: string; emptyIcon: IconName; emptyText: string; onAdd: () => void; addLabel: string;
}) {
  return (
    <Panel
      title={`${title} · ${count}`}
      action={<Button variant="ghost" size="sm" onClick={onAdd}><Icon name={icon} size={15} /> {addLabel}</Button>}
    >
      <p className="-mt-2 mb-3 text-[13px] text-muted">{sub}</p>
      <div className="grid place-items-center gap-2 rounded-card border border-dashed border-line py-10 text-center">
        <Icon name={emptyIcon} size={26} className="text-muted" />
        <p className="max-w-sm text-[13px] text-muted">{emptyText}</p>
      </div>
    </Panel>
  );
}

export function ReportsView() {
  const { openReport, openFeedback } = useOverlays();
  return (
    <div className="space-y-4">
      <ReportsPanel
        icon="flag"
        title="Your reports"
        count={0}
        sub="Listings you've flagged for review — every submission is reviewed by the Interior bazzar team."
        emptyIcon="flag"
        emptyText="No reports yet. If a listing looks wrong, use the flag button on its page."
        onAdd={openReport}
        addLabel="Report a listing"
      />
      <ReportsPanel
        icon="feedback"
        title="Your feedback"
        count={0}
        sub="Notes you've sent us through the Feedback button. Little things."
        emptyIcon="feedback"
        emptyText="No feedback yet. The Feedback button lives at the bottom-right of every page."
        onAdd={openFeedback}
        addLabel="Share feedback"
      />
    </div>
  );
}

/* ── My profile ────────────────────────────────────────────────── */

const PROFILE_INTERESTS = ["Italian Marble", "Modular Kitchens", "Smart Home", "Modern Architecture", "Sustainable Design", "Heritage Restoration"];

export function ProfileView() {
  const auth = useAppSelector(selectAuth);
  const ids = useAppSelector(selectSavedIds);
  const initials = (auth.name || "IB").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const stats = [
    { value: String(ids.length), label: "Saved" },
    { value: "6", label: "Connections" },
    { value: "2024", label: "Member since" },
  ];

  return (
    <div className="space-y-4">
      <Panel className="text-center">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-forest text-[34px] font-semibold text-bone">{initials}</span>
        <h2 className="mt-4 font-editorial text-[28px] text-ink">{auth.name || "Your name"}</h2>
        <p className="mt-1 text-[14px] text-muted">{auth.email}{auth.city ? ` · ${auth.city}` : ""}</p>
        {auth.verified && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-green-mint bg-green-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-forest">
            <Icon name="verified" size={13} /> IB Verified member
          </span>
        )}
        <div className="mt-7 grid grid-cols-3 gap-4 border-t border-line pt-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-editorial text-[26px] text-forest">{s.value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <Panel title="About me">
            <p className="text-[13.5px] leading-relaxed text-ink">
              I'm a founder building Feelsafe Technology and Interior bazzar. Currently planning the interiors of my new home in New Delhi and sourcing premium materials and architects for the project.
            </p>
          </Panel>
          <Panel title="My interests">
            <div className="flex flex-wrap gap-2">
              {PROFILE_INTERESTS.map((t) => (
                <span key={t} className="rounded-full border border-green-mint bg-green-light px-3 py-1.5 text-[12px] font-medium text-forest">{t}</span>
              ))}
            </div>
          </Panel>
        </div>
        <Panel title="Contact details">
          <dl className="space-y-4">
            {[
              { k: "Email", v: auth.email },
              { k: "Phone", v: auth.phone ? `+91 ${auth.phone}` : "Not added" },
              { k: "Location", v: auth.city ? `${auth.city}, India` : "Not added" },
            ].map((r) => (
              <div key={r.k}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{r.k}</dt>
                <dd className="mt-0.5 text-[13.5px] font-medium text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </div>
  );
}

/* ── Membership ────────────────────────────────────────────────── */

export function MembershipView() {
  const role = useAppSelector(selectRole);
  const auth = useAppSelector(selectAuth);
  return (
    <Panel>
      <div className="flex flex-col items-start gap-4 rounded-card p-6 text-white" style={{ background: "linear-gradient(120deg,#053b30,#0c5a49)" }}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80">Current membership</p>
        <h2 className="text-[24px] font-bold capitalize">{auth.sellerPlan ?? `${role} (free)`}</h2>
        <p className="max-w-md text-white/85">
          {role === "seller"
            ? "You're a seller. Manage your plan and enquiries from the seller dashboard."
            : "Upgrade to a seller plan to list your business and receive qualified enquiries — phone-verified, intent-scored and routed to one seller only."}
        </p>
        <Link to={role === "seller" ? PAGES.DASHBOARD_SELLER : PAGES.PLANS}>
          <Button className="bg-white text-forest hover:bg-white/90">
            {role === "seller" ? "Go to seller dashboard" : "Become a member"}
          </Button>
        </Link>
      </div>
    </Panel>
  );
}

/* ── Settings ──────────────────────────────────────────────────── */

export function SettingsView() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const { success } = useAlert();
  const [form, setForm] = useState({ name: auth.name, city: auth.city, phone: auth.phone });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const [email, setEmail] = useState({ status: true, messages: true, digest: false, marketing: false });
  const [privacy, setPrivacy] = useState({ profile: true, online: true, recos: true });
  const tEmail = (k: keyof typeof email) => () => setEmail((p) => ({ ...p, [k]: !p[k] }));
  const tPriv = (k: keyof typeof privacy) => () => setPrivacy((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Panel title="Account information">
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(patch(form));
              success("Profile updated.");
            }}
          >
            <Input label="Full name" value={form.name} onChange={set("name")} />
            <Input label="Email address" value={auth.email} disabled optionalTag="(can't change)" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" value={form.city} onChange={set("city")} placeholder="e.g. New Delhi" />
              <Input label="Phone" leftAddon="+91" inputMode="numeric" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} />
            </div>
            <div><Button type="submit"><Icon name="check" size={16} /> Save changes</Button></div>
          </form>
        </Panel>
        <Panel title="Email notifications">
          <ToggleRow label="Connection status updates" desc="When sellers accept or decline your enquiries" checked={email.status} onChange={tEmail("status")} />
          <ToggleRow label="New messages" desc="Get notified when someone replies to your enquiry" checked={email.messages} onChange={tEmail("messages")} />
          <ToggleRow label="Weekly digest" desc="Top picks and trending items in your interests" checked={email.digest} onChange={tEmail("digest")} />
          <ToggleRow label="Marketing & offers" desc="Plan upgrades, special offers, product updates" checked={email.marketing} onChange={tEmail("marketing")} />
        </Panel>
      </div>
      <div className="space-y-4">
        <Panel title="Privacy">
          <ToggleRow label="Public profile" desc="Make your profile visible to other IB members" checked={privacy.profile} onChange={tPriv("profile")} />
          <ToggleRow label="Show online status" desc="Others can see when you're online" checked={privacy.online} onChange={tPriv("online")} />
          <ToggleRow label="Personalised recommendations" desc="Use my activity to suggest better listings" checked={privacy.recos} onChange={tPriv("recos")} />
        </Panel>
        <section className="rounded-card border border-danger/40 bg-danger-light p-5 shadow-card">
          <h2 className="mb-3 flex items-center gap-2 font-serif text-[18px] italic text-danger">
            <Icon name="flag" size={17} /> Danger zone
          </h2>
          <div className="flex flex-col items-start gap-2.5">
            <button className="inline-flex items-center gap-1.5 rounded-card border border-danger/40 bg-white px-3 py-1.5 text-[13px] font-medium text-danger hover:bg-danger-light">
              <Icon name="history" size={15} /> Deactivate account
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-card border border-danger/40 bg-white px-3 py-1.5 text-[13px] font-medium text-danger hover:bg-danger-light">
              <Icon name="trash" size={15} /> Delete account permanently
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Password & security ───────────────────────────────────────── */

const SESSIONS = [
  { icon: "dashboard" as IconName, device: "MacBook Pro · Chrome", meta: "New Delhi · Active now", current: true },
  { icon: "phone" as IconName, device: "iPhone · IB app", meta: "New Delhi · 2 hours ago", current: false },
];

export function SecurityView() {
  const { success } = useAlert();
  const [twoFa, setTwoFa] = useState({ sms: false, email: true, app: false });
  const t = (k: keyof typeof twoFa) => () => setTwoFa((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Panel title="Change password">
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              success("Password updated.");
            }}
          >
            <Input label="Current password" type="password" placeholder="••••••••" />
            <Input label="New password" type="password" placeholder="••••••••" hint="At least 8 characters, with one uppercase and one number" />
            <Input label="Confirm new password" type="password" placeholder="••••••••" />
            <div><Button type="submit"><Icon name="lock" size={16} /> Update password</Button></div>
          </form>
        </Panel>
        <Panel title="Two-factor authentication">
          <ToggleRow label="SMS verification" desc="Receive a code via SMS when logging in from a new device" checked={twoFa.sms} onChange={t("sms")} />
          <ToggleRow label="Email verification" desc="Receive a confirmation email for new device logins" checked={twoFa.email} onChange={t("email")} />
          <ToggleRow label="Authenticator app" desc="Use Google Authenticator or similar for code generation" checked={twoFa.app} onChange={t("app")} />
        </Panel>
      </div>
      <div className="space-y-4">
        <Panel title="Active sessions">
          <ul className="divide-y divide-line">
            {SESSIONS.map((s) => (
              <li key={s.device} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-card bg-sel-bg text-forest">
                  <Icon name={s.icon} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{s.device}</p>
                  <p className="text-[11px] text-muted">{s.meta}</p>
                </div>
                {s.current ? (
                  <span className="rounded-full bg-green-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-forest">Current</span>
                ) : (
                  <button className="grid h-8 w-8 place-items-center rounded-card border border-line text-muted hover:text-err" aria-label="Sign out device">
                    <Icon name="logout" size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button className="mt-3 inline-flex items-center gap-1.5 rounded-card border border-line px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-bone-tint">
            <Icon name="logout" size={15} /> Sign out all other devices
          </button>
        </Panel>
        <Panel title="Recent activity">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-card bg-sel-bg text-forest"><Icon name="user" size={17} /></span>
              <div>
                <p className="text-[13px] text-ink">Logged in from <strong>Chrome on MacBook</strong></p>
                <p className="text-[11px] text-muted">Just now · New Delhi</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-card bg-sel-bg text-forest"><Icon name="lock" size={17} /></span>
              <div>
                <p className="text-[13px] text-ink">Password last updated</p>
                <p className="text-[11px] text-muted">3 months ago</p>
              </div>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
