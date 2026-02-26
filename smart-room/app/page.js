"use client";

import {useEffect, useMemo, useRef, useState} from "react";

/**
 * Smart Room Automation – Glass UI (iOS-like)
 * Drop-in replacement for your page.js (Next.js App Router).
 * Uses Tailwind classes only — no extra deps.
 */

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const uid = (() => {
    let i = 0;
    return () =>
        (globalThis.crypto?.randomUUID?.() ??
            `${Date.now()}-${Math.random().toString(16).slice(2)}-${i++}`);
})();

export default function Home() {
    const [connected, setConnected] = useState(false);

    // Simulated room state (frontend-only UI; wire to your API later)
    const [presence, setPresence] = useState(true);
    const [temperature, setTemperature] = useState(20.5);
    const [targetTemp, setTargetTemp] = useState(21.0);
    const [lightsOn, setLightsOn] = useState(true);
    const [heatingOn, setHeatingOn] = useState(false);

    // Rules UI
    const [autoMode, setAutoMode] = useState(true);
    const [comfortPreset, setComfortPreset] = useState("Balanced"); // Cozy | Balanced | Eco
    const [quietHours, setQuietHours] = useState(false);

    // Events (UI log)
    const [events, setEvents] = useState(() => [
        {id: uid(), t: Date.now() - 1000 * 60 * 6, k: "Rule fired", m: "Presence detected → Lights ON"},
        {id: uid(), t: Date.now() - 1000 * 60 * 4, k: "Sensor update", m: "Temperature updated → 20.5°C"},
        {id: uid(), t: Date.now() - 1000 * 60 * 2, k: "Rule fired", m: "Temp < 19°C & occupied → Heating ON (previous session)"},
    ]);

    const tickRef = useRef(null);

    // Subtle simulation: temperature drifts based on heating/ambient
    useEffect(() => {
        // mimic "connected" after mount
        const t = setTimeout(() => setConnected(true), 500);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        // physics-ish loop
        clearInterval(tickRef.current);
        tickRef.current = setInterval(() => {
            setTemperature((prev) => {
                const ambient = 19.3; // room baseline
                const heatBoost = heatingOn ? 0.06 : 0; // degrees per tick
                const drift = (ambient - prev) * 0.02; // pull toward ambient
                const next = prev + drift + heatBoost;
                return Math.round(next * 10) / 10;
            });
        }, 1500);

        return () => clearInterval(tickRef.current);
    }, [heatingOn]);

    // Simple automation behavior (frontend-only)
    useEffect(() => {
        if (!autoMode) return;

        // Lights follow presence (unless quiet hours)
        setLightsOn(presence);

        // Heating follows preset + target
        const presetDelta = comfortPreset === "Cozy" ? 0.5 : comfortPreset === "Eco" ? -0.8 : 0.0;
        const desired = targetTemp + presetDelta;

        const shouldHeat =
            presence && !quietHours && temperature < desired - 0.2;
        const shouldStop =
            !presence || quietHours || temperature >= desired + 0.2;

        setHeatingOn((prev) => {
            if (shouldHeat && !prev) {
                pushEvent("Rule fired", `Temp ${temperature.toFixed(1)}°C < ${desired.toFixed(1)}°C → Heating ON`);
                return true;
            }
            if (shouldStop && prev) {
                pushEvent("Rule fired", `Condition met (idle/warm) → Heating OFF`);
                return false;
            }
            return prev;
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoMode, presence, temperature, targetTemp, comfortPreset, quietHours]);

    const comfortMeta = useMemo(() => {
        const presetDelta = comfortPreset === "Cozy" ? 0.5 : comfortPreset === "Eco" ? -0.8 : 0.0;
        const desired = targetTemp + presetDelta;
        const comfort =
            temperature < desired - 0.6 ? "Cool" : temperature > desired + 0.6 ? "Warm" : "Comfortable";
        const hint =
            comfort === "Comfortable"
                ? "Stable environment"
                : comfort === "Cool"
                    ? "Heating may engage"
                    : "Cooling not available (sim)";
        return {desired, comfort, hint};
    }, [temperature, targetTemp, comfortPreset]);

    function pushEvent(kind, message) {
        setEvents((prev) => {
            const next = [{id: uid(), t: Date.now(), k: kind, m: message}, ...prev];
            // Ensure every item has a valid id (covers any older items that might not)
            return next
                .map((e) => (e?.id ? e : {...e, id: uid()}))
                .slice(0, 18);
        });
    }

    function handlePresence(v) {
        setPresence(v);
        pushEvent("Sensor update", `Presence → ${v ? "Occupied" : "Empty"}`);
    }

    function handleTempSlider(v) {
        setTemperature(v);
        pushEvent("Sensor update", `Temperature set → ${v.toFixed(1)}°C`);
    }

    function handleTargetTemp(v) {
        setTargetTemp(v);
        pushEvent("User", `Target temperature → ${v.toFixed(1)}°C`);
    }

    function toggleManual(kind) {
        if (kind === "lights") {
            const next = !lightsOn;
            setLightsOn(next);
            pushEvent("Manual", `Lights → ${next ? "ON" : "OFF"}`);
        }
        if (kind === "heating") {
            const next = !heatingOn;
            setHeatingOn(next);
            pushEvent("Manual", `Heating → ${next ? "ON" : "OFF"}`);
        }
    }

    return (
        <div
            className="bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.30),transparent_55%),radial-gradient(1000px_700px_at_110%_10%,rgba(236,72,153,0.26),transparent_55%),radial-gradient(900px_600px_at_40%_110%,rgba(34,197,94,0.18),transparent_55%),linear-gradient(to_bottom,rgba(250,250,250,1),rgba(244,244,245,1))] dark:bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.22),transparent_55%),radial-gradient(1000px_700px_at_110%_10%,rgba(236,72,153,0.18),transparent_55%),radial-gradient(900px_600px_at_40%_110%,rgba(34,197,94,0.14),transparent_55%),linear-gradient(to_bottom,rgba(9,9,11,1),rgba(0,0,0,1))] text-zinc-900 dark:text-zinc-50">
            {/* Decorative grain + vignette */}
            <div className="pointer-events-none fixed inset-0 opacity-[0.08] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.25%22/></svg>')]"></div>
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(1200px_800px_at_50%_0%,transparent_30%,rgba(0,0,0,0.10)_100%)] dark:bg-[radial-gradient(1200px_800px_at_50%_0%,transparent_30%,rgba(0,0,0,0.35)_100%)]"/>

            <Shell>
                <TopBar connected={connected}/>

                <div className="mt-6 grid grid-cols-12 gap-4">
                    {/* Left: Main room */}
                    <GlassCard className="col-span-12 lg:col-span-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Smart Room
                                    <span className="ml-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Automation Dashboard
                  </span>
                                </h1>
                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                    Glassy iOS-inspired UI • frontend-only simulation (wire API later)
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Pill
                                    icon={<IconSpark/>}
                                    label={autoMode ? "Automation On" : "Automation Off"}
                                    tone={autoMode ? "good" : "muted"}
                                />
                                <button
                                    onClick={() => {
                                        setAutoMode((v) => !v);
                                        pushEvent("User", `Automation → ${!autoMode ? "ON" : "OFF"}`);
                                    }}
                                    className={cn(
                                        "rounded-full px-4 py-2 text-sm font-medium backdrop-blur-xl transition",
                                        "border border-white/30 dark:border-white/10",
                                        "bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10",
                                        "shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                                    )}
                                >
                                    {autoMode ? "Disable" : "Enable"}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-12 gap-4">
                            {/* Hero status */}
                            <div className="col-span-12 xl:col-span-7">
                                <div className="relative overflow-hidden rounded-3xl border border-white/35 bg-white/55 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                                    <div className="absolute -top-24 right-[-80px] h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"/>
                                    <div className="absolute -bottom-24 left-[-80px] h-56 w-56 rounded-full bg-pink-500/20 blur-3xl"/>

                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                                Room status
                                            </div>
                                            <div className="mt-1 text-3xl font-semibold tracking-tight">
                                                {comfortMeta.comfort}
                                            </div>
                                            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                                {comfortMeta.hint}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Now</div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-4xl font-semibold tracking-tight">
                                                    {temperature.toFixed(1)}
                                                </div>
                                                <div className="mt-1 text-zinc-600 dark:text-zinc-400">°C</div>
                                            </div>
                                            <div className="text-xs text-zinc-500 dark:text-zinc-500">
                                                Target: {comfortMeta.desired.toFixed(1)}°C
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <QuickToggle
                                            label="Presence"
                                            value={presence ? "Occupied" : "Empty"}
                                            icon={<IconPerson/>}
                                            active={presence}
                                            onClick={() => handlePresence(!presence)}
                                        />
                                        <QuickToggle
                                            label="Lights"
                                            value={lightsOn ? "On" : "Off"}
                                            icon={<IconBulb/>}
                                            active={lightsOn}
                                            onClick={() => toggleManual("lights")}
                                            hint={autoMode ? "Auto may override" : "Manual"}
                                        />
                                        <QuickToggle
                                            label="Heating"
                                            value={heatingOn ? "On" : "Off"}
                                            icon={<IconFlame/>}
                                            active={heatingOn}
                                            onClick={() => toggleManual("heating")}
                                            hint={autoMode ? "Auto may override" : "Manual"}
                                        />
                                        <QuickToggle
                                            label="Quiet hours"
                                            value={quietHours ? "Enabled" : "Off"}
                                            icon={<IconMoon/>}
                                            active={quietHours}
                                            onClick={() => {
                                                setQuietHours((v) => !v);
                                                pushEvent("User", `Quiet hours → ${!quietHours ? "ON" : "OFF"}`);
                                            }}
                                            tone="violet"
                                        />
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 gap-4">
                                        <Slider
                                            title="Simulated temperature"
                                            value={temperature}
                                            min={14}
                                            max={28}
                                            step={0.1}
                                            unit="°C"
                                            onChange={handleTempSlider}
                                            accent="blue"
                                        />
                                        <Slider
                                            title="Target temperature"
                                            value={targetTemp}
                                            min={18}
                                            max={24}
                                            step={0.1}
                                            unit="°C"
                                            onChange={handleTargetTemp}
                                            accent="emerald"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Controls */}
                            <div className="col-span-12 xl:col-span-5">
                                <div className="grid gap-4">
                                    <GlassSubCard title="Automation preset" subtitle="Comfort profile">
                                        <div className="grid grid-cols-3 gap-2">
                                            <Segment
                                                active={comfortPreset === "Cozy"}
                                                onClick={() => {
                                                    setComfortPreset("Cozy");
                                                    pushEvent("User", "Preset → Cozy");
                                                }}
                                                label="Cozy"
                                                hint="+ warmth"
                                            />
                                            <Segment
                                                active={comfortPreset === "Balanced"}
                                                onClick={() => {
                                                    setComfortPreset("Balanced");
                                                    pushEvent("User", "Preset → Balanced");
                                                }}
                                                label="Balanced"
                                                hint="stable"
                                            />
                                            <Segment
                                                active={comfortPreset === "Eco"}
                                                onClick={() => {
                                                    setComfortPreset("Eco");
                                                    pushEvent("User", "Preset → Eco");
                                                }}
                                                label="Eco"
                                                hint="save"
                                            />
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                            <MiniStat label="Presence" value={presence ? "Yes" : "No"}/>
                                            <MiniStat label="Automation" value={autoMode ? "On" : "Off"}/>
                                            <MiniStat label="Lights" value={lightsOn ? "On" : "Off"}/>
                                            <MiniStat label="Heating" value={heatingOn ? "On" : "Off"}/>
                                        </div>
                                    </GlassSubCard>

                                    <GlassSubCard title="Rules" subtitle="Editable logic (UI only)">
                                        <div className="space-y-3">
                                            <RuleRow
                                                enabled
                                                title="Lights follow presence"
                                                desc="If occupied → On, else Off"
                                                pill="Lighting"
                                            />
                                            <RuleRow
                                                enabled
                                                title="Heat when cold & occupied"
                                                desc={`If temp < ${(targetTemp - 0.2).toFixed(1)}°C → Heating On`}
                                                pill="Climate"
                                            />
                                            <RuleRow
                                                enabled={!!quietHours}
                                                title="Quiet hours suppress heat"
                                                desc="When enabled, heating remains Off"
                                                pill="Focus"
                                                tone="violet"
                                            />
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <button
                                                onClick={() => pushEvent("User", "Opened rule editor (placeholder)")}
                                                className="rounded-2xl border border-white/25 bg-white/40 px-4 py-2 text-sm font-medium backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                                            >
                                                Open editor
                                            </button>
                                            <span className="text-xs text-zinc-500">
                        Coming soon: JSON rules import/export
                      </span>
                                        </div>
                                    </GlassSubCard>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Right: Event log */}
                    <GlassCard className="col-span-12 lg:col-span-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">Activity</h2>
                                <p className="mt-1 text-sm text-zinc-600">
                                    Latest changes & rule triggers
                                </p>
                            </div>
                            <button
                                onClick={() => setEvents([])}
                                className="rounded-full border border-white/25 bg-white/40 px-3 py-1.5 text-xs font-medium backdrop-blur-xl transition hover:bg-white/60"
                            >
                                Clear
                            </button>
                        </div>

                        <div className="mt-4 space-y-2">
                            {events.length === 0 ? (
                                <div className="rounded-2xl border border-white/25 bg-white/35 p-4 text-sm text-zinc-600 backdrop-blur-xl">
                                    No events yet. Try toggling presence or adjusting temperature.
                                </div>
                            ) : (
                                events.map((e, idx) => (
                                    <EventItem key={e.id ?? `fallback-${idx}`} kind={e.k} message={e.m} time={e.t}/>
                                ))
                            )}
                        </div>
                    </GlassCard>
                </div>

                <FooterNote/>
            </Shell>
        </div>
    );
}

/* ----------------------------- Layout pieces ----------------------------- */

function Shell({children}) {
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-8xl flex-col px-4 py-6 sm:px-6 lg:px-8">
            {children}
        </div>
    );
}

function TopBar({connected}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/30 bg-white/55 shadow-[0_12px_40px_rgba(0,0,0,0.10)] backdrop-blur-2xl">
                    <span className="text-base font-semibold">SR</span>
                    <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/25"/>
                </div>

                <div>
                    <div className="text-sm font-semibold tracking-tight">Smart Room</div>
                    <div className="text-xs text-zinc-600">
                        Glass UI • Next.js + Tailwind
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Pill
                    icon={<IconWifi/>}
                    label={connected ? "Connected" : "Connecting…"}
                    tone={connected ? "good" : "muted"}
                />
                <button className="hidden rounded-full border border-white/25 bg-white/40 px-4 py-2 text-sm font-medium backdrop-blur-xl transition hover:bg-white/60 sm:inline-flex">
                    Settings
                </button>
            </div>
        </div>
    );
}

/* ------------------------------ Glass Cards ------------------------------ */

function GlassCard({className, children}) {
    return (
        <section
            className={cn(
                "relative overflow-hidden rounded-[28px] border border-white/35 bg-white/45 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl",
                className
            )}
        >
            <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/20 "/>
            {children}
        </section>
    );
}

function GlassSubCard({title, subtitle, children}) {
    return (
        <div className="rounded-3xl border border-white/30 bg-white/45 p-4 backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold tracking-tight">{title}</div>
                    <div className="mt-0.5 text-xs text-zinc-600">{subtitle}</div>
                </div>
                <div className="h-9 w-9 rounded-2xl border border-white/25 bg-white/45 backdrop-blur-xl"/>
            </div>
            <div className="mt-4">{children}</div>
        </div>
    );
}

/* --------------------------------- UI ---------------------------------- */

function Pill({icon, label, tone = "muted"}) {
    const toneClasses =
        tone === "good"
            ? "text-emerald-700 border-emerald-500/20 bg-emerald-400/10"
            : tone === "warn"
                ? "text-amber-700 border-amber-500/20 bg-amber-400/10"
                : tone === "violet"
                    ? "text-violet-700 border-violet-500/20 bg-violet-400/10"
                    : "text-zinc-700 border-white/25 bg-white/30";

    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-xl",
                toneClasses
            )}
        >
            <span className="opacity-90">{icon}</span>
            <span>{label}</span>
        </div>
    );
}

function QuickToggle({label, value, icon, active, onClick, hint, tone}) {
    const glow =
        tone === "violet"
            ? "from-violet-500/25 via-violet-500/5 to-transparent"
            : active
                ? "from-emerald-500/20 via-emerald-500/5 to-transparent"
                : "from-zinc-500/10 via-zinc-500/5 to-transparent";

    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/25 bg-white/40 p-4 text-left backdrop-blur-2xl transition",
                "hover:bg-white/55"
            )}
        >
            <div className={cn("pointer-events-none absolute inset-0 bg-linear-to-br", glow)}/>
            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-white/30 bg-white/45">
              {icon}
            </span>
                        {label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
                    <div className="mt-1 text-xs text-zinc-600">
                        {hint ?? (active ? "Active" : "Inactive")}
                    </div>
                </div>

                <div className="mt-1">
                    <div
                        className={cn(
                            "h-7 w-12 rounded-full border backdrop-blur-xl transition",
                            active
                                ? tone === "violet"
                                    ? "border-violet-500/30 bg-violet-400/20"
                                    : "border-emerald-500/30 bg-emerald-400/20"
                                : "border-white/25 bg-white/30"
                        )}
                    >
                        <div
                            className={cn(
                                "m-1 h-5 w-5 rounded-full bg-white shadow-[0_10px_18px_rgba(0,0,0,0.14)] transition",
                                active ? "translate-x-5" : "translate-x-0"
                            )}
                        />
                    </div>
                </div>
            </div>
        </button>
    );
}

function Slider({title, value, min, max, step, unit, onChange, accent}) {
    const pct = ((value - min) / (max - min)) * 100;
    const accentRing =
        accent === "emerald"
            ? "ring-emerald-500/20"
            : accent === "blue"
                ? "ring-blue-500/20"
                : "ring-white/20";

    return (
        <div className="rounded-2xl border border-white/25 bg-white/35 p-4 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold tracking-tight">{title}</div>
                <div className="text-sm font-semibold tabular-nums">
                    {value.toFixed(1)}
                    <span className="ml-1 text-xs font-medium text-zinc-600">{unit}</span>
                </div>
            </div>

            <div className={cn("mt-3 rounded-full ring-1", accentRing)}>
                <div className="relative h-10 rounded-full bg-white/30 px-3 backdrop-blur-xl">
                    <div
                        className="absolute left-0 top-0 h-10 rounded-full bg-white/40"
                        style={{width: `${pct}%`}}
                    />
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                        className="relative z-10 h-10 w-full cursor-pointer appearance-none bg-transparent"
                    />
                </div>
            </div>

            <div className="mt-2 flex justify-between text-xs text-zinc-500">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>

            <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 22px;
                    height: 22px;
                    border-radius: 9999px;
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 14px 26px rgba(0, 0, 0, 0.18);
                    backdrop-filter: blur(16px);
                }

                input[type="range"]::-moz-range-thumb {
                    width: 22px;
                    height: 22px;
                    border-radius: 9999px;
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 14px 26px rgba(0, 0, 0, 0.18);
                }
            `}</style>
        </div>
    );
}

function Segment({active, onClick, label, hint}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group rounded-2xl border px-3 py-3 text-left backdrop-blur-2xl transition",
                active
                    ? "border-white/40 bg-white/70 shadow-[0_18px_40px_rgba(0,0,0,0.10)] dark:border-white/15 dark:bg-white/10 dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
                    : "border-white/25 bg-white/35 hover:bg-white/55 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            )}
        >
            <div className="text-sm font-semibold tracking-tight">{label}</div>
            <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">{hint}</div>
        </button>
    );
}

function MiniStat({label, value}) {
    return (
        <div className="rounded-2xl border border-white/25 bg-white/35 p-3 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">{label}</div>
            <div className="mt-1 text-sm font-semibold">{value}</div>
        </div>
    );
}

function RuleRow({enabled, title, desc, pill, tone}) {
    return (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/25 bg-white/35 p-3 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div>
                <div className="flex items-center gap-2">
                    <div className={cn("text-sm font-semibold tracking-tight", enabled ? "" : "opacity-60")}>
                        {title}
                    </div>
                    <span
                        className={cn(
                            "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                            tone === "violet"
                                ? "border-violet-500/20 bg-violet-400/10 text-violet-700 dark:text-violet-300"
                                : "border-white/25 bg-white/30 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                        )}
                    >
            {pill}
          </span>
                </div>
                <div className={cn("mt-1 text-xs text-zinc-600 dark:text-zinc-400", enabled ? "" : "opacity-60")}>
                    {desc}
                </div>
            </div>

            <div className="mt-0.5">
                <div
                    className={cn(
                        "h-7 w-12 rounded-full border backdrop-blur-xl transition",
                        enabled
                            ? tone === "violet"
                                ? "border-violet-500/30 bg-violet-400/20"
                                : "border-emerald-500/30 bg-emerald-400/20"
                            : "border-white/25 bg-white/30 dark:border-white/10 dark:bg-white/5"
                    )}
                >
                    <div
                        className={cn(
                            "m-1 h-5 w-5 rounded-full bg-white shadow-[0_10px_18px_rgba(0,0,0,0.14)] transition",
                            enabled ? "translate-x-5" : "translate-x-0"
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

function EventItem({kind, message, time}) {
    const tone =
        kind === "Rule fired" ? "good" : kind === "Manual" ? "warn" : kind === "User" ? "violet" : "muted";

    return (
        <div className="rounded-2xl border border-white/25 bg-white/35 p-3 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-3">
                <Pill label={kind} tone={tone} icon={<IconDot/>}/>
                <div className="text-xs text-zinc-500 tabular-nums">
                    {new Date(time).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                </div>
            </div>
            <div className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">{message}</div>
        </div>
    );
}

function FooterNote() {
    return (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-3xl border border-white/25 bg-white/35 px-5 py-4 text-sm backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 sm:flex-row">
            <div className="text-zinc-700 dark:text-zinc-300">
                Tip: Toggle <span className="font-semibold">Automation</span> off to try manual controls.
            </div>
            <div className="text-xs text-zinc-500">
                UI-only demo • Replace handlers with API calls when ready
            </div>
        </div>
    );
}

/* -------------------------------- Icons -------------------------------- */

function IconWifi() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path d="M5 10c4.5-4 9.5-4 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8.5 13.5c2.5-2.2 4.5-2.2 7 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 18h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        </svg>
    );
}

function IconSpark() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path
                d="M12 2l1.2 5.3L18 9l-4.8 1.7L12 16l-1.2-5.3L6 9l4.8-1.7L12 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path d="M20 14l.7 3.1L23 18l-2.3.9L20 22l-.7-3.1L17 18l2.3-.9L20 14z" fill="currentColor" opacity="0.5"/>
        </svg>
    );
}

function IconBulb() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path
                d="M9 18h6m-5 3h4m-8-9a6 6 0 1112 0c0 2-1 3-2 4-1 1-1 2-1 2H9s0-1-1-2c-1-1-2-2-2-4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconFlame() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path
                d="M12 22c4 0 7-3 7-7 0-4-3-6-5-9 0 3-2 4-3 5-1-2-1-4 0-7-4 3-6 6-6 11 0 4 3 7 7 7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconPerson() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path
                d="M20 21a8 8 0 10-16 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M12 13a4 4 0 100-8 4 4 0 000 8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconMoon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path
                d="M21 14.5A8.5 8.5 0 1110.5 3a7 7 0 0010.5 11.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconDot() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path d="M12 12h.01" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
        </svg>
    );
}