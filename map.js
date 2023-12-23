const apiKey = "AAPKd7a4355d2c604824982cb7a4bca78356Ou6UW9lzFTDN3khog0gMtcMo_7jz_n0D94ecNdOGfISik3oAwS5Bxj6Bh41jzZU2";
const basemapEnum = "ArcGIS:DarkGray";

const map = new maplibregl.Map({
    container: "map", // the id of the div element
    style: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`,
    // style: `https://demotiles.maplibre.org/style.json`,
    zoom: 1.2,
    maxZoom: 1.2,
    minZoom: 1.2,
    center: [0, 20], // starting location [longitude, latitude]
    attributionControl: false,
    noWrap: false,
    dragPan: false
  })

const OSM_attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const Vedant_attribution = '&copy; <a href="http://www.vedantmodi.com">Vedant Modi</a> '

map.addControl(
    new maplibregl.AttributionControl({
        
      compact: true,// reduces the copyright attributions view
      customAttribution: Vedant_attribution + OSM_attribution
    })
  );

map.scrollZoom.disable();