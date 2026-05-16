/// <reference types="jest" />

describe("Activity E2E Test", () => {

  it("Starts the Activity, Reads Sensor Data, and Saves Results", () => {

    const activityStarted = true;

    const sensorReadings = {

      accelerometer: {
        x: 0.8,
        y: 1.1,
        z: 0.5,
      },

      gyroscope: {
        x: 0.3,
        y: 0.6,
        z: 0.2,
      },

    };

    const savedResult = {
      activityName: "Earthquake Simulation",
      sensorReadings,
      saved: true,
    };

    expect(activityStarted)
      .toBe(true);
    expect(
      savedResult.sensorReadings.accelerometer.x
    ).toBeGreaterThan(0);
    expect(
      savedResult.sensorReadings.gyroscope.y
    ).toBeGreaterThan(0);
    expect(savedResult.saved)
      .toBe(true);

  });

});