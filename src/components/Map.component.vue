<template>
  <div class="relative">
    <div
      ref="map"
      class="absolute"
      :style="{ width: mapWidth, height: mapHeight }"
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
      mapHeight: this.setMapHeight(),
      mapCentre: [14.810891, 23.962169],
      circle: {
        color: [
          "step",
          ["get", "total"],
          "#f03434",
          10,
          "#f5ab35",
          100,
          "#26a656",
        ],
        stroke: {
          width: ["step", ["zoom"], 0, 4, 1],
          color: ["step", ["zoom"], "#fff", 5, "#000"],
        },
        radius: [
          "step",
          ["zoom"],
          ["interpolate", ["linear"], ["get", "total"], 10, 1, 100, 2, 1000, 4],
          0,
          ["interpolate", ["linear"], ["get", "total"], 10, 2, 100, 4, 1000, 6],
          3,
          [
            "interpolate",
            ["linear"],
            ["get", "total"],
            10,
            4,
            100,
            8,
            1000,
            12,
            10000,
            16,
          ],
          5,
          [
            "interpolate",
            ["linear"],
            ["get", "total"],
            10,
            5,
            100,
            10,
            1000,
            15,
            10000,
            20,
          ],
        ],
      },
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
      if (window.innerWidth < 1024) {
        return `${window.innerWidth}px`;
      } else {
        return "100%";
      }
    },
    setMapHeight() {
      if (window.innerWidth < 1024) {
        return `${window.innerHeight - 80}px`;
      } else {
        return `${window.innerHeight}px`;
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
      // languages = languages.slice(0, 100);
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
          "circle-color": this.circle.color,
          "circle-stroke-color": this.circle.stroke.color,
          "circle-stroke-width": this.circle.stroke.width,
          "circle-radius": this.circle.radius,
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

<style scoped></style>
