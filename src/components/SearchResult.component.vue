<template>
  <div class="flex flex-row">
    <div class="flex flex-col">
      <div class="w-10">{{ idx + 1 }}.</div>
    </div>
    <div class="text-base flex flex-col">
      <div class="flex-grow flex flex-row">
        <div
          @click="loadResourceData"
          class="text-yellow-600 hover:underline cursor-pointer"
        >
          {{ data.resourceName }}
        </div>
      </div>
      <div v-if="href" class="flex flex-row space-x-2 p-6 bg-blue-100 rounded">
        <div>View the original resource</div>
        <div>
          <a
            :href="href"
            target="_blank"
            class="text-yellow-600 hover:underline cursor-pointer"
          >
            {{ href }}
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
      <div
        v-if="noRef || noOlacPage"
        class="flex flex-row space-x-2 p-6 bg-red-100 rounded"
      >
        <div>
          {{ errorMessage }}
        </div>
        <div>
          <a
            :href="data.resourceLink.url"
            target="_blank"
            class="text-yellow-600 hover:underline"
            >{{ data.resourceName }}</a
          >
        </div>
      </div>
      <div class="text-sm">{{ data.type }}</div>
    </div>
  </div>
</template>

<script>
const xpath = require("xpath");
let dom = require("xmldom").DOMParser;
dom = new dom({
  locator: {},
  errorHandler: {
    warning: () => {},
    error: e => {},
    fatalError: e => console.log(e),
  },
});

export default {
  props: {
    idx: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      href: undefined,
      noRef: undefined,
      noOlacPage: undefined,
      errorMessage: "",
    };
  },
  methods: {
    async loadResourceData() {
      let baseUrl = "https://language-archives.services/olacvis/olac/item";
      let resource = this.data.resourceLink.url
        .split("http://www.language-archives.org/item")
        .pop();
      let response;
      try {
        response = await fetch(`${baseUrl}/${resource}`);
      } catch (error) {
        this.noRef = true;
        this.errorMessage =
          "Unable to get a direct link to this resource. View the entry at the OLAC site.";
      }
      if (response.status !== 200) {
        this.noOlacPage = true;
        this.errorMessage = "Unable to get the original OLAC entry.";
      }
      let doc = await response.text();
      doc = dom.parseFromString(doc);
      let nodes = xpath.select("//table/tr", doc);
      let originalResource;
      for (let node of nodes.slice(1, nodes.length)) {
        let value = node.childNodes[0].textContent;
        if (value.match("Identifier.*(URI)")) {
          originalResource = node.childNodes[2].textContent;
        }
      }
      this.href = originalResource;
    },
  },
};
</script>
