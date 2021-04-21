<template>
  <div>
    <!-- {{ geojson }} -->
    <div
      ref="map"
      class="absolute"
      :style="{ width: mapWidth, height: mapHeight }"
    ></div>
  </div>
</template>

<script>
import bbox from "@turf/bbox";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { mapBoxStyle, accessToken } from "src/configuration";
mapboxgl.accessToken = accessToken;
export default {
  props: {
    geojson: {
      type: Object,
      required: true,
    },
  },
  data() {
    return { map: undefined, mapWidth: "300px", mapHeight: "200px" };
  },
  watch: {
    geojson: function() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.map = new mapboxgl.Map({
        container: this.$refs.map,
        style: mapBoxStyle,
        dragRotate: false,
        touchPitch: false,
        zoom: 1,
        minZoom: 1,
        maxZoom: 7,
      });
      this.map.on("load", () => {
        this.map.addSource(`country`, { type: "geojson", data: this.geojson });
        this.map.addLayer({
          id: `country`,
          type: "line",
          source: `country`,
          paint: {
            "line-color": "red",
          },
        });
        let box = bbox(this.geojson);
        box = [
          [box[0], box[1]],
          [box[2], box[3]],
        ];
        this.map.fitBounds(box, { padding: 20 });
      });
    },
  },
};
</script>
