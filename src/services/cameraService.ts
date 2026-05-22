import { Camera } from "expo-camera";

export async function requestCameraAccess() {
  const { status } = await Camera.requestCameraPermissionsAsync();

  if (status !== "granted") {
    console.log("Camera permission denied");
    return false;
  }

  return true;
}