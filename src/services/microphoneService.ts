import { Audio } from "expo-av";

export async function requestMicrophoneAccess() {
  const permission = await Audio.requestPermissionsAsync();

  return permission.granted;
}