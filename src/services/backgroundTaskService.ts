import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";

const STEMM_BACKGROUND_TASK = "stemm-background-task";

TaskManager.defineTask(STEMM_BACKGROUND_TASK, async () => {
  try {
    console.log("STEMM background Task Running");

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.log("STEMM Background Task Failed", error);

    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerStemmBackgroundTask() {
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
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    STEMM_BACKGROUND_TASK
  );

  if (isRegistered) {
    await BackgroundTask.unregisterTaskAsync(STEMM_BACKGROUND_TASK);
  }
}

export async function getBackgroundTaskStatus() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    STEMM_BACKGROUND_TASK
  );

  return isRegistered ? "Registered" : "Not Registered";
}