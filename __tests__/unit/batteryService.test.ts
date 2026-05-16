/// <reference types="jest" />
describe("Battery Service", () => {

  it("Checks if the Battery Percentage is Valid", () => {

    const batteryLevel = 85;
    expect(typeof batteryLevel).toBe("number");
    expect(batteryLevel).toBeGreaterThanOrEqual(0);
    expect(batteryLevel).toBeLessThanOrEqual(100);

  });

});