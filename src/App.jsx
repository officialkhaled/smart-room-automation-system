import {useState, useEffect, useRef} from 'react';
import DashboardHeader from './components/DashboardHeader';
import ControlsPanel from './components/ControlsPanel';
import DemoPanel from './components/DemoPanel';
import StatusCards from './components/StatusCards';
import EnergyControlPanel from './components/EnergyControlPanel';
import CustomProfilePanel from './components/CustomProfilePanel';
import AlertsPanel from './components/AlertsPanel';

export default function App() {
    // --- STATE MANAGEMENT ---
    const [temperature, setTemperature] = useState(20);
    const [occupancy, setOccupancy] = useState(false);
    const [mode, setMode] = useState('Eco');

    const [heating, setHeating] = useState(false);
    const [lighting, setLighting] = useState(false);

    const [override, setOverride] = useState({heating: 'auto', lighting: 'auto'});
    const [customRuleActive, setCustomRuleActive] = useState(false);
    const [alerts, setAlerts] = useState([]);

    const prevHeating = useRef(heating);
    const prevLighting = useRef(lighting);

    // --- HELPER FUNCTIONS ---
    const addAlert = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setAlerts((prev) => [{time: timestamp, message}, ...prev].slice(0, 5));
    };

    const resetOverrides = () => {
        setOverride({heating: 'auto', lighting: 'auto'});
        addAlert("Manual overrides reset to Auto.");
    };

    // --- AUTOMATION ENGINE (If-This-Then-That Logic) ---
    useEffect(() => {
        let newHeating = heating;
        let newLighting = lighting;

        // 1. Evaluate Lighting Logic
        if (override.lighting !== 'auto') {
            newLighting = override.lighting === 'on';
        } else {
            newLighting = occupancy;
        }

        // 2. Evaluate Heating Logic
        if (override.heating !== 'auto') {
            newHeating = override.heating === 'on';
        } else {
            let threshold = mode === 'Comfort' ? 22 : mode === 'Eco' ? 18 : 10;

            if (customRuleActive) {
                newHeating = temperature < 20 && occupancy;
            } else {
                newHeating = temperature < threshold;
            }
        }

        // 3. Update State & Generate Alerts
        if (newHeating !== prevHeating.current) {
            if (override.heating !== 'auto') {
                addAlert(`Manual Override: Heating turned ${newHeating ? 'ON' : 'OFF'}`);
            } else if (customRuleActive) {
                addAlert(`Custom Rule triggered: Heating turned ${newHeating ? 'ON' : 'OFF'}`);
            } else {
                addAlert(`Automation: Heating turned ${newHeating ? 'ON' : 'OFF'} (Mode: ${mode})`);
            }
            setHeating(newHeating);
            prevHeating.current = newHeating;
        }

        if (newLighting !== prevLighting.current) {
            if (override.lighting !== 'auto') {
                addAlert(`Manual Override: Lighting turned ${newLighting ? 'ON' : 'OFF'}`);
            } else {
                addAlert(`Automation: Lights turned ${newLighting ? 'ON' : 'OFF'} due to occupancy change`);
            }
            setLighting(newLighting);
            prevLighting.current = newLighting;
        }

    }, [temperature, occupancy, mode, override, customRuleActive]);

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 font-sans text-slate-800 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.14),transparent_28%),radial-gradient(circle_at_75%_85%,rgba(251,191,36,0.14),transparent_30%)]"/>

            <div className="relative z-10 mx-auto max-w-6xl space-y-6">
                <DashboardHeader/>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6">
                        <ControlsPanel
                            temperature={temperature}
                            setTemperature={setTemperature}
                            occupancy={occupancy}
                            setOccupancy={setOccupancy}
                        />
                        <DemoPanel/>
                    </div>

                    <div className="space-y-6">
                        <StatusCards
                            heating={heating}
                            lighting={lighting}
                            override={override}
                        />
                        <EnergyControlPanel
                            mode={mode}
                            setMode={setMode}
                            override={override}
                            setOverride={setOverride}
                            resetOverrides={resetOverrides}
                            addAlert={addAlert}
                        />
                    </div>

                    <div className="space-y-6">
                        <CustomProfilePanel
                            customRuleActive={customRuleActive}
                            setCustomRuleActive={setCustomRuleActive}
                            addAlert={addAlert}
                        />
                        <AlertsPanel alerts={alerts}/>
                    </div>
                </div>
            </div>

        </main>
    );
}