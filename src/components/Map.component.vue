<template>
  <div class="relative">
    <div
      ref="map"
      class="style-map absolute"
      :style="{ width: mapWidth }"
    ></div>
    <div class="absolute top-2 left-2 ">
      <div
        @click="centerMapAndZoomOut"
        size="mini"
        class="border-2 border-gray-300 py-1 px-3 bg-white rounded-lg"
      >
        <i class="fas fa-crosshairs style-button-image"></i>
      </div>
    </div>
    <!-- <ui-button type="primary" @click="addLanguageLayer">
      render languages
    </ui-button> -->
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
      mapCentre: [14.810891, 23.962169],
      circle: {
        stroke: {
          color: "#2e3131",
          width: 1,
        },
      },
      colours: {
        red: [10, "#f03434"],
        yellow: [100, "#f5ab35"],
        green: [100, "#26a65b"],
      },
      zoom: [
        [1, 2],
        [2, 3],
        [4, 4],
        [5, 6],
        [6, 8],
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
        center: this.mapCentre,
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
          "circle-stroke-color": this.circle.stroke.color,
          "circle-stroke-width": [
            "step",
            ["zoom"],
            0,
            4,
            this.circle.stroke.width,
          ],
          "circle-radius": {
            stops: this.zoom,
          },
        },
      });
      this.map.on("click", "languages", e => {
        if (this.map.getZoom() > 3) {
          const language = e.features[0].properties;
          console.log(language);
          // this.$store.dispatch("loadLanguage", { code: language.code });
        }
      });
      this.map.on("mouseenter", "languages", () => {
        if (this.map.getZoom() > 3) {
          this.map.getCanvas().style.cursor = "pointer";
        }
      });
      this.map.on("mouseleave", "languages", () => {
        if (this.map.getZoom() > 3) {
          this.map.getCanvas().style.cursor = "";
        }
      });
    },
    centerMapAndZoomOut() {
      this.map.flyTo({
        center: this.mapCentre,
        zoom: 1,
        bearing: 0,
      });
    },
  },
};
</script>

<style scoped>
.style-map {
  height: 800px;
}
</style>
