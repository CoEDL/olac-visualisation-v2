const {
    downloadFile,
    downloadCountryDataFiles,
    downloadLanguageDataFiles,
    extractAreaCountries,
    extractAreaData,
    extractCountryLanguages,
    extractLanguageData,
} = require("./lib");
const path = require("path");
const { ensureFile } = require("fs-extra");

it(`should be able to download area datafiles`, async () => {
    const folder = path.join(__dirname, "data", "area");
    await downloadFile({
        url: "http://www.language-archives.org/area/africa",
        folder,
    });
    expect(await ensureFile(path.join(folder, "africa.html"))).toBeTrue;
});
it(`should be able to extract area countries`, async () => {
    const folder = path.join(__dirname, "data", "area");

    await downloadFile({
        url: "http://www.language-archives.org/area/africa",
        folder,
    });

    let countries = await extractAreaCountries({
        file: path.join(folder, "africa.html"),
    });
    expect(countries.length).toEqual(55);

    let countryData = await extractAreaData({ folder });
    expect(Object.keys(countryData)).toEqual(["africa"]);
});
it(`should be able to download country data files`, async () => {
    let folder = path.join(__dirname, "data", "countries");
    let countries = [
        {
            name: "Algeria",
            dataFile: "http://www.language-archives.org/country/DZ",
        },
    ];
    await downloadCountryDataFiles({ folder, countries });

    let country = path.basename(countries[0].dataFile);
    expect(await ensureFile(path.join(folder, `${country}.html`))).toBeTrue;
});
it(`should be able to download language data files`, async () => {
    let folder = path.join(__dirname, "data", "languages");
    let languages = [
        {
            name: "Algerian Arabic [arq]",
            dataFile: "http://www.language-archives.org/language/arq",
        },
    ];
    await downloadLanguageDataFiles({ folder, languages });
    let language = path.basename(languages[0].dataFile);
    expect(await ensureFile(path.join(folder, `${language}.html`))).toBeTrue;
});
it("should be able to extract country languages", async () => {
    let folder = path.join(__dirname, "data", "countries");
    let url = "http://www.language-archives.org/country/DZ";
    await downloadFile({ folder, url });
    let file = path.join(folder, "DZ.html");
    let languages = await extractCountryLanguages({ file });
    expect(languages.length).toEqual(17);
});
it("should be able to extract language data", async () => {
    let folder = path.join(__dirname, "data", "languages");
    let url = "http://www.language-archives.org/language/arq";
    await downloadFile({ folder, url });

    let file = path.join(folder, "arq.html");
    let data = await extractLanguageData({ file });
    expect(Object.keys(data)).toEqual(["otherNamesAndDialects", "dataTypes", "resources"]);
    expect(data.dataTypes).toEqual([
        "Primary texts",
        "Lexical resources",
        "Language descriptions",
        "Other resources about the language",
    ]);
    expect(data.resources["Primary texts"].length).toEqual(1);
    expect(data.resources["Lexical resources"].length).toEqual(1);
    expect(data.resources["Language descriptions"].length).toEqual(2);
    expect(data.resources["Other resources about the language"].length).toEqual(5);
});
