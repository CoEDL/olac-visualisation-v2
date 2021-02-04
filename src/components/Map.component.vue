<template>
  <div>
    <div ref="map" class="style-map" :style="{ width: mapWidth }"></div>
    <ui-button type="primary" @click="addLanguageLayer">
      render languages
    </ui-button>
  </div>
</template>

<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { mapBoxStyle, accessToken } from "../configuration";
mapboxgl.accessToken = accessToken;

export default {
  data() {
    return {
      map: undefined,
      mapWidth: this.setMapWidth(),
      colours: {
        red: [10, "#f03434"],
        yellow: [100, "#f5ab35"],
        green: [100, "#26a65b"],
      },
      zoom: [
        [1, 2],
        [2, 3],
        [4, 4],
        [5, 5],
        [6, 6],
      ],
    };
  },
  computed: {
    languages() {
      return this.$store.state.languages;
    },
  },
  watch: {
    languages: function() {
      if (this.languages.length) this.renderLanguages();
    },
  },
  mounted() {
    this.renderMap();
  },
  methods: {
    setMapWidth() {
      if (window.innerWidth < 768) {
        return "0px";
      } else if (window.innerWidth <= 1024) {
        return `${window.innerWidth}px`;
      } else {
        return "1024px";
      }
    },
    renderMap() {
      this.map = new mapboxgl.Map({
        container: this.$refs.map,
        style: mapBoxStyle,
        dragRotate: false,
        touchPitch: false,
        zoom: 1,
        minZoom: 1,
        maxZoom: 7,
        center: [14.810891, 23.962169],
      });
      this.map.addControl(
        new mapboxgl.NavigationControl({
          showCompass: false,
        })
      );
      this.map.on("load", () => {
        this.map.setZoom(1);
        this.renderLanguages();
      });
    },
    renderLanguages() {
      this.removeLayersAndSources();
      this.addLanguageSource();
      this.addLanguageLayer();
    },
    removeLayersAndSources() {
      if (this.map.getLayer(`languages`)) this.map.removeLayer(`languages`);
      if (this.map.getSource(`languages`)) this.map.removeSource(`languages`);
    },
    addLanguageSource() {
      let languages = [...this.$store.state.languages];
      this.map.addSource(`languages`, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: languages,
        },
      });
    },
    addLanguageLayer() {
      this.map.addLayer({
        id: `languages`,
        type: "circle",
        source: `languages`,
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * red circles when totalResources < 10
          //   * orange circles when 10 < totalResource < 100
          //   * green circles when totalResources > 100
          "circle-color": [
            "step",
            ["get", "total"],
            this.colours.red[1],
            this.colours.red[0],
            this.colours.yellow[1],
            this.colours.yellow[0],
            this.colours.green[1],
          ],
          "circle-radius": {
            stops: this.zoom,
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.style-map {
  height: 800px;
  width: 1200px;
}
</style>
