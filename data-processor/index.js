const {
  downloadAreaDataFiles,
  downloadFile,
  downloadCountryDataFiles,
  extractAreaData,
  extractCountryLanguages,
  extractLanguageData,
  loadLanguageCoordinateData,
  loadCountryInformationDatasets,
} = require("./lib");
const path = require("path");
const {
  readFile,
  writeFile,
  readdir,
  readJSON,
  writeJSON,
  ensureDir,
  pathExists,
} = require("fs-extra");
const { trim } = require("lodash");
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
  download: {
    default: true,
    type: "boolean",
  },
  extract: {
    default: true,
    type: "boolean",
  },
  languages: {
    default: true,
    type: "boolean",
  },
}).argv;

(async () => {
  if (!args.folder) {
    console.log(`--folder required`);
  }
  const verbose = args.verbose;
  const dataBasePath = args.folder;

  const areaDataPath = path.join(dataBasePath, "area");
  const countryDataPath = path.join(dataBasePath, "countries");
  const languageDataPath = path.join(dataBasePath, "languages");
  const indexesDataPath = path.join(dataBasePath, "indexes");

  await ensureDir(areaDataPath);
  await ensureDir(countryDataPath);
  await ensureDir(languageDataPath);
  await ensureDir(path.join(languageDataPath, "html"));
  await ensureDir(path.join(languageDataPath, "json"));
  await ensureDir(indexesDataPath);

  // get world country data files - data and geojson
  await loadCountryInformationDatasets({ dataBasePath });

  // load language coordinate info
  const languageCoordinateData = await loadLanguageCoordinateData();

  // get area data files and extract countries list
  if (args.download)
    await downloadAreaDataFiles({ folder: areaDataPath, verbose });
  let countries = await extractAreaData({ folder: areaDataPath });

  // get country data files
  if (args.download) {
    await downloadCountryDataFiles({
      folder: countryDataPath,
      countries,
      verbose,
    });
  }

  // extract country languages
  let languageDataFiles = {};
  let files = await readdir(countryDataPath);
  for (let file of files) {
    let countryCode = path.basename(file, ".html");
    let languages = await extractCountryLanguages({
      file: path.join(countryDataPath, file),
    });
    languages.forEach(language => {
      languageDataFiles[language.code] = language;
    });
    countries = countries.map(country => {
      if (country.code === countryCode) country.languages = languages;
      return country;
    });
  }

  // download language data files and extract the data
  if (args.languages) {
    for (let code of Object.keys(languageDataFiles).sort()) {
      let language = languageDataFiles[code];
      if (args.download) {
        await downloadFile({
          folder: path.join(languageDataPath, "html"),
          url: language.dataFile,
          verbose,
        });
      }
      let htmlFile = path.join(languageDataPath, "html", `${code}.html`);
      let jsonFile = path.join(languageDataPath, "json", `${code}.json`);

      if (args.extract && (await pathExists(htmlFile))) {
        if (verbose) console.log(`Extracting data ${htmlFile}`);
        let data = await extractLanguageData({ file: htmlFile });

        let coords = languageCoordinateData[code];
        if (!coords) {
          console.log(`ERROR: Couldn't find coordinates for ${code}`);
        } else {
          coords.properties.name = languageDataFiles[code].name;
          coords.properties.total = data.totalResources;
          // coords.properties.summary = data.summary;
          // coords.properties.dataFile = languageDataFiles[code].dataFile;
          data = {
            ...data,
            ...languageDataFiles[code],
            geojson: coords,
          };
        }
        await writeFile(jsonFile, JSON.stringify(data));
      }
    }
  }

  // write data indexes

  //   write countries index
  let countriesGeoJSON = await readJSON(
    path.join(dataBasePath, "countries.geojson")
  );
  let countryCodesJSON = await readJSON(
    path.join(dataBasePath, "country-codes.json")
  );
  countries = countries.map(country => {
    let countryData = countryCodesJSON.filter(
      c => c["alpha-2"] === country.code
    )[0];
    let countryJSON = countriesGeoJSON.features.filter(c => {
      return c.properties["ISO_A3"] === countryData["alpha-3"];
    })[0];
    country = {
      ...country,
      ...countryData,
      geojson: countryJSON,
    };
    if (!country.geojson) {
      console.log(
        `ERROR: Couldn't find bounds for ${country.name}, ${country.code}`
      );
    }
    return country;
  });
  // await writeJSON(path.join(indexesDataPath, "countries.json"), countries);
  for (let country of countries) {
    let languages = {};
    for (let language of country.languages) {
      let languageDataFile = path.join(
        languageDataPath,
        "json",
        `${language.code}.json`
      );
      if (await pathExists(languageDataFile)) {
        language = await readJSON(languageDataFile);
        languages[language.code] = language;
      } else {
        languages[language.code] = {
          error: `Language data file not available`,
        };
      }
    }
    country.languages = country.languages.map(language => {
      return {
        ...language,
        summary: languages[language.code].summary,
        totalResources: languages[language.code].totalResources,
        dataUrl: path.join("languages", "json", `${language.code}.json`),
      };
    });
    await writeJSON(
      path.join(indexesDataPath, `${country.code}.json`),
      country
    );
  }
  await writeJSON(
    path.join(indexesDataPath, "countries.json"),
    countries.map(c => ({ name: c.name, code: c.code }))
  );

  //  write languages index
  files = await readdir(path.join(languageDataPath, "json"));
  let languages = [];
  for (let file of files) {
    let data = await readJSON(path.join(languageDataPath, "json", file));
    data.dataUrl = path.join("languages", "json", file);
    if (data.geojson?.geometry?.coordinates.length)
      languages.push(data.geojson);
  }
  await writeJSON(path.join(indexesDataPath, "languages.json"), languages);
  process.exit();
})();
