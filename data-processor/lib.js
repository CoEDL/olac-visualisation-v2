const fetch = require("node-fetch");
const path = require("path");
const { readFile, writeFile, ensureDir } = require("fs-extra");
const xpath = require("xpath");
const dom = require("xmldom").DOMParser;
const areaDataFiles = [
    "http://www.language-archives.org/area/africa",
    "http://www.language-archives.org/area/americas",
    "http://www.language-archives.org/area/asia",
    "http://www.language-archives.org/area/europe",
    "http://www.language-archives.org/area/pacific",
];

module.exports = {
    downloadAreaDataFiles,
    extractAreaCountries,
};

async function downloadAreaDataFiles({ folder }) {
    await ensureDir(folder);
    for (let url of areaDataFiles) {
        let response = await fetch(url);
        if (response.status !== 200) {
            console.log(`Error getting ${url}`);
            continue;
        }
        const data = await response.text();
        const area = path.join(folder, `${path.basename(url)}.html`);
        await writeFile(area, data);
    }
}

async function extractAreaCountries({ folder }) {
    let countryData = {};
    for (let url of areaDataFiles) {
        const area = path.join(folder, `${path.basename(url)}.html`);
        const data = await readFile(area);
        const doc = new dom().parseFromString(data.toString());
        //body/table[@class="doc_header"]/
        let nodes = xpath.select("//body/table[2]/tr/td/ul/li", doc);
        // console.log(nodes[0]);
        let countries = nodes.map((node) => {
            let country = {
                name: xpath.select("string(a)", node),
                dataFile: xpath.select("string(a/@href)", node),
            };
            return country;
        });
        countryData[path.basename(url)] = countries;
    }
    return countryData;
}
