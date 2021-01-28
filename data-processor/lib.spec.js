const { downloadAreaDataFiles, extractAreaCountries } = require("./lib");
const path = require("path");
const { ensureFile } = require("fs-extra");

it.skip(`should be able to download area datafiles`, async () => {
    const folder = path.join(__dirname, "data");
    await downloadAreaDataFiles({ folder });
    expect(await ensureFile(path.join(folder, "africa.html"))).toBeTrue;
    expect(await ensureFile(path.join(folder, "americas.html"))).toBeTrue;
    expect(await ensureFile(path.join(folder, "asia.html"))).toBeTrue;
    expect(await ensureFile(path.join(folder, "europe.html"))).toBeTrue;
    expect(await ensureFile(path.join(folder, "pacific.html"))).toBeTrue;
});
it(`should be able to extract area languages`, async () => {
    const folder = path.join(__dirname, "data");
    let countryData = await extractAreaCountries({ folder });
    expect(Object.keys(countryData)).toEqual(["africa", "americas", "asia", "europe", "pacific"]);
});
