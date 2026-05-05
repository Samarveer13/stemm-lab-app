import * as Battery from "expo-battery";

export async function getBatteryLevel() {
  const level = await Battery.getBatteryLevelAsync();
  return Math.round(level * 100);
}

export async function isCharging() {
  const state = await Battery.getBatteryStateAsync();
  return state === Battery.BatteryState.CHARGING;
}