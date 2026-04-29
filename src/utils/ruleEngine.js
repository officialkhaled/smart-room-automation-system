export const getScenarioConfig = (mode, customThreshold) => {
  const base = {
    Comfort: { heatingThreshold: 20, lightsOverride: null, energyNote: "Balanced comfort and usage." },
    Eco: { heatingThreshold: 17, lightsOverride: null, energyNote: "Reduced heating for lower energy use." },
    Away: { heatingThreshold: 15, lightsOverride: "OFF", energyNote: "Minimal energy consumption while away." },
    Custom: { heatingThreshold: customThreshold, lightsOverride: null, energyNote: "User-defined threshold." },
  };
  return base[mode] || base.Comfort;
};

export const getDefaultRules = (scenario) => ([
  {
    id: "default-occupancy-lights",
    label: "Occupancy detected → Lights ON",
    conditionType: "occupancy_present",
    conditionValue: true,
    action: "TURN_LIGHTS_ON",
    priority: 100,
  },
  {
    id: "default-absence-lights",
    label: "No occupancy → Lights OFF",
    conditionType: "occupancy_present",
    conditionValue: false,
    action: "TURN_LIGHTS_OFF",
    priority: 95,
  },
  {
    id: "default-temp-heating-on",
    label: `Temperature below ${scenario.heatingThreshold}°C → Heating ON`,
    conditionType: "temperature_below",
    conditionValue: scenario.heatingThreshold,
    action: "TURN_HEATING_ON",
    priority: 90,
  },
  {
    id: "default-temp-heating-off",
    label: `Temperature at/above ${scenario.heatingThreshold}°C → Heating OFF`,
    conditionType: "temperature_above",
    conditionValue: scenario.heatingThreshold,
    action: "TURN_HEATING_OFF",
    priority: 85,
  },
  ...(scenario.lightsOverride === "OFF"
    ? [{
        id: "away-lights-off",
        label: "Away mode → Lights OFF",
        conditionType: "mode_is",
        conditionValue: "Away",
        action: "TURN_LIGHTS_OFF",
        priority: 110,
      }]
    : []),
]);

const evaluateCondition = (rule, ctx) => {
  switch (rule.conditionType) {
    case "temperature_below":
      return ctx.temperature < Number(rule.conditionValue);
    case "temperature_above":
      return ctx.temperature >= Number(rule.conditionValue);
    case "occupancy_present":
      return ctx.occupancy === rule.conditionValue;
    case "time_of_day":
      return ctx.timeOfDay === rule.conditionValue;
    case "mode_is":
      return ctx.mode === rule.conditionValue;
    default:
      return false;
  }
};

export const evaluateAutomationRules = ({ temperature, occupancy, timeOfDay, mode, rules, scenario }) => {
  const ctx = { temperature, occupancy, timeOfDay, mode, scenario };
  const sorted = [...rules].sort((a, b) => (b.priority || 0) - (a.priority || 0));

  let lights = mode === "Away" ? "OFF" : "OFF";
  let heating = temperature < scenario.heatingThreshold ? "ON" : "OFF";
  const triggeredRules = [];
  const logs = [];

  sorted.forEach((rule) => {
    if (evaluateCondition(rule, ctx)) {
      triggeredRules.push(rule.label);
      if (rule.action === "TURN_LIGHTS_ON") lights = "ON";
      if (rule.action === "TURN_LIGHTS_OFF") lights = "OFF";
      if (rule.action === "TURN_HEATING_ON") heating = "ON";
      if (rule.action === "TURN_HEATING_OFF") heating = "OFF";
      logs.unshift(`${rule.label}`);
    }
  });

  return {
    lights,
    heating,
    triggeredRules,
    logs: logs.length ? logs : ["No rule triggered. Default state maintained."],
  };
};