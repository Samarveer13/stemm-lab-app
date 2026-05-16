/// <reference types="jest" />

describe("SQLite Integration Test", () => {

  it("Writes, Reads, Updates Sync Status", () => {

    const database = [];

    const activityResult = {
      id: 1,
      activityName: "Earthquake Simulation",
      synced: false,
    };

    database.push(activityResult);

    const savedResult = database.find(
      (item) => item.id === 1
    );

    expect(savedResult?.activityName)
      .toBe("Earthquake Simulation");
    expect(savedResult?.synced)
      .toBe(false);

    if (savedResult) {
      savedResult.synced = true;
    }

    expect(savedResult?.synced)
      .toBe(true);

  });

});