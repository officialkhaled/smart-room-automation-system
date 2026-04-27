import React, {useEffect, useMemo, useState} from "react";
import SensorPanel from "./components/SensorPanel";
import StatusCards from "./components/StatusCards";
import RulesPanel from "./components/RulesPanel";
import TestingEvidence from "./components/TestingEvidence";
import ArchitecturePanel from "./components/ArchitecturePanel";
import LogPanel from "./components/LogPanel";
import {evaluateAutomationRules, getDefaultRules, getScenarioConfig} from "./utils/ruleEngine";

export default function App() {
    const [temperature, setTemperature] = useState(19);
    const [occupancy, setOccupancy] = useState(true);
    const [timeOfDay, setTimeOfDay] = useState("Morning");
    const [mode, setMode] = useState("Comfort");
    const [customThreshold, setCustomThreshold] = useState(18);
    const [customRules, setCustomRules] = useState([]);
    const [automationState, setAutomationState] = useState({
        lights: "ON",
        heating: "ON",
        triggeredRules: [],
        logs: [],
    });

    const scenario = useMemo(
        () => getScenarioConfig(mode, customThreshold),
        [mode, customThreshold]
    );

    const rules = useMemo(
        () => [...getDefaultRules(scenario), ...customRules],
        [scenario, customRules]
    );

    useEffect(() => {
        const result = evaluateAutomationRules({
            temperature,
            occupancy,
            timeOfDay,
            mode,
            rules,
            scenario,
        });
        setAutomationState(result);
    }, [temperature, occupancy, timeOfDay, mode, customRules, scenario, rules]);

    const addCustomRule = (rule) => {
        setCustomRules((prev) => [...prev, {...rule, id: crypto.randomUUID()}]);
    };

    const resetRules = () => setCustomRules([]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <header className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Smart Room Automation</p>
                            <h1 className="mt-2 text-3xl font-bold">Frontend-Only Rule-Based Room Controller</h1>
                            <p className="mt-2 max-w-3xl text-slate-300">
                                Simulate sensors, evaluate rules instantly, and visualize automation decisions without any backend.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["Comfort", "Eco", "Away", "Custom"].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setMode(item)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                        mode === item
                                            ? "bg-cyan-500 text-slate-950"
                                            : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                                    }`}
                                >
                                    {item} Mode
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        <SensorPanel
                            temperature={temperature}
                            setTemperature={setTemperature}
                            occupancy={occupancy}
                            setOccupancy={setOccupancy}
                            timeOfDay={timeOfDay}
                            setTimeOfDay={setTimeOfDay}
                            mode={mode}
                            customThreshold={customThreshold}
                            setCustomThreshold={setCustomThreshold}
                        />

                        <StatusCards
                            temperature={temperature}
                            occupancy={occupancy}
                            mode={mode}
                            scenario={scenario}
                            automationState={automationState}
                        />

                        <div className="grid gap-6 lg:grid-cols-2">
                            <ArchitecturePanel/>
                            <LogPanel logs={automationState.logs}/>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <RulesPanel
                            rules={rules}
                            mode={mode}
                            scenario={scenario}
                            onAddRule={addCustomRule}
                            onResetRules={resetRules}
                            customRules={customRules}
                            automationState={automationState}
                            temperature={temperature}
                            occupancy={occupancy}
                            timeOfDay={timeOfDay}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <TestingEvidence/>
                </div>
            </div>
        </div>
    );
}