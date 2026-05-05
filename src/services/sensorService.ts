import { Accelerometer, Gyroscope } from "expo-sensors";

type SensorData = {
  x: number;
  y: number;
  z: number;
};

export function startAccelerometerReading(
  onUpdate: (data: SensorData) => void
) {
  Accelerometer.setUpdateInterval(500);

  const subscription = Accelerometer.addListener((data) => {
    onUpdate({
      x: data.x,
      y: data.y,
      z: data.z,
    });
  });

  return () => subscription.remove();
}

export function startGyroscopeReading(
  onUpdate: (data: SensorData) => void
) {
  Gyroscope.setUpdateInterval(500);

  const subscription = Gyroscope.addListener((data) => {
    onUpdate({
      x: data.x,
      y: data.y,
      z: data.z,
    });
  });

  return () => subscription.remove();
}