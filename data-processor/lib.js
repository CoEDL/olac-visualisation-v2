const fetch = require("node-fetch");
const path = require("path");
const {
  readFile,
  writeFile,
  readdir,
  ensureDir,
  pathExists,
  stat,
} = require("fs-extra");
const xpath = require("xpath");
const { trim, compact, flattenDeep, sum } = require("lodash");
const configuration = require("./configuration");
let dom = require("xmldom").DOMParser;
dom = new dom({
  locator: {},
  errorHandler: {
    warning: () => {},
    error: e => console.log(e),
    fatalError: e => console.log(e),
  },
});

const siteUrl = "http://www.language-archives.org";
const areaDataFiles = [
  "/area/africa",
  "/area/americas",
  "/area/asia",
  "/area/europe",
  "/area/pacific",
];

module.exports = {
  downloadFile,
  extractAreaCountries,
  extractAreaData,
  downloadAreaDataFiles,
  downloadCountryDataFiles,
  downloadLanguageDataFiles,
  extractCountryLanguages,
  extractLanguageData,
  loadLanguageCoordinateData,
  loadCountryInformationDatasets,
};

async function downloadAreaDataFiles({ folder, verbose }) {
  for (let url of areaDataFiles) {
    url = `${siteUrl}${url}`;
    await downloadFile({ url, folder, verbose });
  }
}

async function downloadCountryDataFiles({ folder, countries, verbose }) {
  await ensureDir(folder);
  for (let country of countries) {
    await downloadFile({ folder, url: country.dataFile, verbose });
  }
}

async function downloadLanguageDataFiles({ folder, languages }) {
  await ensureDir(folder);
  for (let language of languages) {
    await downloadFile({ folder, url: language.dataFile });
  }
}

async function downloadFile({ url, name, folder, verbose = false }) {
  const file = name
    ? path.join(folder, name)
    : path.join(folder, `${path.basename(url)}.html`);
  if (await pathExists(file)) {
    // if file is less than one day old don't re download
    let stats = await stat(file);
    if ((Date.now() - stats.mtime) / 1000 < configuration.maxDataLifetime)
      return;
  }

  if (verbose) console.log(`Downloading ${url}`);
  await ensureDir(folder);
  try {
    let response = await fetch(url);
    if (response.status !== 200) {
      console.log(`Error getting ${url}`);
      return;
    }
    const data = await response.text();
    await writeFile(file, data);
  } catch (error) {
    console.log(`Error getting ${url}`);
    return;
  }
}

async function extractAreaData({ folder }) {
  let countryData = [];
  for (let file of await readdir(folder)) {
    // let area = path.basename(file, ".html");
    file = path.join(folder, file);
    let countries = await extractAreaCountries({ file });
    countryData.push(countries);
  }
  countryData = flattenDeep(countryData);
  return countryData;
}

async function extractAreaCountries({ file }) {
  const data = await readFile(file);
  const doc = dom.parseFromString(data.toString());
  let nodes = xpath.select("//body/table[2]/tr/td/ul/li", doc);
  let countries = nodes.map(node => {
    let country = {
      code: `${path.basename(xpath.select("string(a/@href)", node))}`,
      name: xpath.select("string(a)", node),
      dataFile: `${siteUrl}${xpath.select("string(a/@href)", node)}`,
    };
    return country;
  });
  return countries;
}

async function extractCountryLanguages({ file }) {
  const data = await readFile(file);
  const doc = dom.parseFromString(data.toString());
  let nodes = xpath.select("//body/table[2]/tr/td/ul/li", doc);
  let languages = nodes.map(node => {
    return {
      name: xpath.select("string(a)", node),
      code: path.basename(xpath.select("string(a/@href)", node)),
      dataFile: `${siteUrl}${xpath.select("string(a/@href)", node)}`,
    };
  });
  return languages;
}

async function extractLanguageData({ file }) {
  const code = path.basename(file, ".html");
  const data = await readFile(file);
  const doc = dom.parseFromString(data.toString());

  let languageData = {
    code,
    name: getLanguageName({ doc }),
    otherNamesAndDialects: getLanguageKnownNamesAndDialects({ doc }),
    dataTypes: getDataTypes({ doc }),
  };
  languageData.resources = getResources({
    doc,
    types: languageData.dataTypes,
  });
  languageData.summary = {};
  for (let resource of Object.keys(languageData.resources)) {
    languageData.summary[resource] = languageData.resources[resource].length;
  }
  languageData.totalResources = sum(
    Object.keys(languageData.resources).map(
      resource => languageData.summary[resource]
    )
  );
  if (!languageData.totalResources) {
    console.log(`ERROR: ${code} has no resources`);
  }
  return languageData;
}

function getLanguageName({ doc }) {
  let node = xpath.select("//body/table[1]/tr/td[2]", doc)[0];
  return node.textContent;
}

function getLanguageKnownNamesAndDialects({ doc }) {
  // try to get other known names
  let nodes = xpath.select("//body/p", doc);
  for (let node of nodes) {
    if (node.textContent.match("Other known names and dialect names:")) {
      return node.textContent
        .split("Other known names and dialect names:")[1]
        .split(", ")
        .map(l => trim(l));
    }
  }
}

function getDataTypes({ doc }) {
  let nodes = xpath.select("//body/h2", doc);
  let dataTypes = nodes.map(node => node.textContent);
  return dataTypes;
}

function getResources({ doc, types }) {
  let resources = {};
  for (let type of types) {
    resources[type] = [];
    let nodes = xpath.select(
      `//body/h2[text()='${type}']/following-sibling::*[1]/li`,
      doc
    );
    for (let node of nodes) {
      let isOnline =
        xpath.select("string(span)", node) === "ONLINE" ? true : false;
      let resourceLink = {
        name: xpath.select("string(a)", node),
        url: `${siteUrl}${xpath.select("string(a/@href)", node)}`,
      };

      let resourceName = [];
      for (let child of Object.keys(node.childNodes)) {
        child = node.childNodes[child];
        if (["a", "span"].includes(child.nodeName)) continue;
        resourceName.push(child.textContent);
      }
      resourceName = trim(compact(resourceName).join(" "));
      resources[type].push({
        isOnline,
        resourceName,
        resourceLink,
      });
    }
  }
  return resources;
}

async function loadLanguageCoordinateData() {
  // load language coordinate info
  let coordinates = await readFile("languages.csv");
  let languageCoordinateData = {};
  for (line of coordinates.toString().split("\n")) {
    line = line.split(",").map(e => trim(e));

    let coords = [];
    let code = line[0];
    if (line.length === 10) {
      coords = [line[9], line[8]];
    } else if (line.length === 8) {
      coords = [line[6], line[4]];
    } else {
      console.log(
        `ERROR: '${line}' in languages.csv seems to be an unexpected length`
      );
    }
    if (code) {
      languageCoordinateData[code] = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coords,
        },
        properties: {
          code: code,
        },
      };
    }
  }
  return languageCoordinateData;
}

async function loadCountryInformationDatasets({ dataBasePath }) {
  await downloadFile({
    url: configuration.country.codes,
    folder: dataBasePath,
    name: "country-codes.json",
  });

  await downloadFile({
    url: configuration.country.geojson,
    folder: dataBasePath,
    name: "countries.geojson",
  });
}
