module.exports = {
    // max datafile lifetime - download newer version if older than this many seconds
    maxDataLifetime: 86400,

    // country data
    country: {
        codes:
            "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json",
        geojson: "https://datahub.io/core/geo-countries/r/countries.geojson",
    },
};
