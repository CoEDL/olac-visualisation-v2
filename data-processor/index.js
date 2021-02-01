const {
    downloadAreaDataFiles,
    downloadFile,
    downloadCountryDataFiles,
    extractAreaData,
    extractCountryLanguages,
    extractLanguageData,
} = require("./lib");
const path = require("path");
const {
    writeFile,
    stat,
    pathExists,
    readdir,
    readJSON,
    writeJSON,
    ensureDir,
    move,
} = require("fs-extra");
const { flattenDeep } = require("lodash");
const configuration = require("./configuration");

const args = require("yargs/yargs")(process.argv.slice(2)).options({
    folder: {
        demandOption: true,
        describe: "The location to store the datafiles",
    },
    verbose: {
        default: false,
        type: "boolean",
    },
}).argv;

(async () => {
    if (!args.folder) {
        console.log(`--folder required`);
    }
    const verbose = args.verbose;

    // indexes location
    const indexesPath = path.join(args.folder, "indexes");
    ensureDir(indexesPath);

    // get area data files
    let folder = path.join(args.folder, "area");
    await downloadAreaDataFiles({ folder, verbose });

    // extract country list
    let countryData = await extractAreaData({ folder });

    // get country data files
    folder = path.join(args.folder, "countries");
    for (let area of Object.keys(countryData)) {
        let countries = countryData[area];
        await downloadCountryDataFiles({ folder, countries, verbose });
    }

    // extract country languages
    let languageDataFiles = {};
    let files = await readdir(folder);
    for (let file of files) {
        let languages = await extractCountryLanguages({ file: path.join(folder, file) });
        languages.forEach((language) => {
            languageDataFiles[language.code] = language;
        });
    }
    // console.log(languageDataFiles);

    // download language data files and extract the data
    folder = path.join(args.folder, "languages");
    for (let code of Object.keys(languageDataFiles)) {
        let language = languageDataFiles[code];
        await downloadFile({ folder: path.join(folder, "html"), url: language.dataFile, verbose });

        let htmlFile = path.join(folder, "html", `${code}.html`);
        let jsonFile = path.join(folder, "json", `${code}.json`);

        if (await pathExists(jsonFile)) {
            // if file is less than one day old don't re-process
            let stats = await stat(jsonFile);
            if ((Date.now() - stats.mtime) / 1000 < configuration.maxDataLifetime) continue;
        }

        if (verbose) console.log(`Processing ${htmlFile}`);
        let data = await extractLanguageData({ file: htmlFile });
        await writeFile(jsonFile, JSON.stringify(data));
    }

    // get country data files - data and geojson
    await downloadFile({ url: configuration.country.codes, folder: args.folder });
    await move(
        path.join(args.folder, "all.json.html"),
        path.join(args.folder, "country-codes.json"),
        {
            overwrite: true,
        }
    );

    await downloadFile({ url: configuration.country.geojson, folder: args.folder });
    await move(
        path.join(args.folder, "countries.geojson.html"),
        path.join(args.folder, "countries.geojson"),
        { overwrite: true }
    );

    // write data indexes
    let area = countryData;
    await writeJSON(path.join(indexesPath, "area.json"), area);

    let countriesGeoJSON = await readJSON(path.join(args.folder, "countries.geojson"));
    let countryCodesJSON = await readJSON(path.join(args.folder, "country-codes.json"));
    let countries = flattenDeep(Object.keys(countryData).map((area) => countryData[area]));
    countries = countries.map((country) => {
        let countryData = countryCodesJSON.filter((c) => c["alpha-2"] === country.code)[0];
        let countryJSON = countriesGeoJSON.features.filter((c) => {
            return c.properties["ISO_A3"] === countryData["alpha-3"];
        })[0];
        country = {
            ...country,
            ...countryData,
            bounds: countryJSON,
        };
        if (!country.bounds)
            console.log(`Couldn't find bounds for ${country.name}, ${country.code}`);
        return country;
    });
    await writeJSON(path.join(indexesPath, "countries.json"), countries);

    process.exit();
})();
