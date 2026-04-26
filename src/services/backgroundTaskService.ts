import { Platform } from "react-native";
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";

const STEMM_BACKGROUND_TASK = "stemm-background-task";

let simulatedInterval: ReturnType<typeof setInterval> | null = null;

if (Platform.OS === "android") {
  TaskManager.defineTask(STEMM_BACKGROUND_TASK, async () => {
    try {
      console.log("STEMM real Background Task Running on Android");
      return BackgroundTask.BackgroundTaskResult.Success;
    } catch (error) {
      console.log("STEMM Background Task Failed", error);
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  });
}

function startSimulatedBackgroundTask(platformName: string) {
  if (simulatedInterval) return;

  simulatedInterval = setInterval(() => {
    console.log(`STEMM Simulated Background Task Running On ${platformName}`);
  }, 15000);
}

export async function registerStemmBackgroundTask() {
  if (Platform.OS === "web") {
    startSimulatedBackgroundTask("web");
    return;
  }

  if (Platform.OS === "ios") {
    startSimulatedBackgroundTask("iOS Expo Go");
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    STEMM_BACKGROUND_TASK
  );

  if (!isRegistered) {
    await BackgroundTask.registerTaskAsync(STEMM_BACKGROUND_TASK, {
      minimumInterval: 15,
    });
  }
}

export async function unregisterStemmBackgroundTask() {
  if (Platform.OS === "web" || Platform.OS === "ios") {
    if (simulatedInterval) {
      clearInterval(simulatedInterval);
      simulatedInterval = null;
    }
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    STEMM_BACKGROUND_TASK
  );

  if (isRegistered) {
    await BackgroundTask.unregisterTaskAsync(STEMM_BACKGROUND_TASK);
  }
}

export async function getBackgroundTaskStatus() {
  if (Platform.OS === "web" || Platform.OS === "ios") {
    return simulatedInterval ? "Simulated Background Task Running" : "Not Running";
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    STEMM_BACKGROUND_TASK
  );

  return isRegistered ? "Registered" : "Not Registered";
}