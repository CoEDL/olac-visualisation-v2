const fetch = require("node-fetch");
const path = require("path");
const { readFile, writeFile, readdir, ensureDir, pathExists, stat } = require("fs-extra");
const xpath = require("xpath");
const { trim, compact } = require("lodash");
let dom = require("xmldom").DOMParser;
dom = new dom({
    locator: {},
    errorHandler: {
        warning: () => {},
        error: (e) => console.log(e),
        fatalError: (e) => console.log(e),
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
    downloadCountryDataFiles,
    downloadLanguageDataFiles,
    extractCountryLanguages,
    extractLanguageData,
};

async function downloadAreaDataFiles({ folder }) {
    for (let url of areaDataFiles) {
        url = `${siteUrl}${url}`;
        await downloadFile({ url, folder });
    }
}

async function downloadCountryDataFiles({ folder, countries }) {
    await ensureDir(folder);
    for (let country of countries) {
        await downloadFile({ folder, url: country.dataFile });
    }
}

async function downloadLanguageDataFiles({ folder, languages }) {
    await ensureDir(folder);
    for (let language of languages) {
        await downloadFile({ folder, url: language.dataFile });
    }
}

async function downloadFile({ url, folder }) {
    const file = path.join(folder, `${path.basename(url)}.html`);
    if (await pathExists(file)) {
        // if file is less than one day old don't re download
        let stats = await stat(file);
        if (Date.now() - stats.mtime < 86400) return;
    }

    await ensureDir(folder);
    let response = await fetch(url);
    if (response.status !== 200) {
        console.log(`Error getting ${url}`);
        return;
    }
    const data = await response.text();
    await writeFile(file, data);
}

async function extractAreaData({ folder }) {
    let countryData = {};
    for (let file of await readdir(folder)) {
        let country = path.basename(file, ".html");
        file = path.join(folder, file);
        let countries = await extractAreaCountries({ file });
        countryData[country] = countries;
    }
    return countryData;
}

async function extractAreaCountries({ file }) {
    const data = await readFile(file);
    const doc = dom.parseFromString(data.toString());
    let nodes = xpath.select("//body/table[2]/tr/td/ul/li", doc);
    let countries = nodes.map((node) => {
        let country = {
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
    let languages = nodes.map((node) => {
        return {
            name: xpath.select("string(a)", node),
            dataFile: `${siteUrl}${xpath.select("string(a/@href)", node)}`,
        };
    });
    return languages;
}

async function extractLanguageData({ file }) {
    const data = await readFile(file);
    const doc = dom.parseFromString(data.toString());

    let languageData = {
        otherNamesAndDialects: getLanguageKnownNamesAndDialects({ doc }),
        dataTypes: getDataTypes({ doc }),
    };
    languageData.resources = getResources({ doc, types: languageData.dataTypes });
    return languageData;
}

function getLanguageKnownNamesAndDialects({ doc }) {
    // try to get other known names
    let nodes = xpath.select("//body/p", doc);
    for (let node of nodes) {
        if (node.textContent.match("Other known names and dialect names:")) {
            return node.textContent
                .split("Other known names and dialect names:")[1]
                .split(", ")
                .map((l) => trim(l));
        }
    }
}

function getDataTypes({ doc }) {
    let nodes = xpath.select("//body/h2", doc);
    let dataTypes = nodes.map((node) => node.textContent);
    return dataTypes;
}

function getResources({ doc, types }) {
    let resources = {};
    for (let type of types) {
        resources[type] = [];
        let nodes = xpath.select(`//body/h2[text()='${type}']/following-sibling::*[1]/li`, doc);
        for (let node of nodes) {
            let isOnline = xpath.select("string(span)", node) === "ONLINE" ? true : false;
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
