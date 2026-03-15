<script lang="ts">
  import { onMount } from "svelte";
  import { SALARY_REGIONS, provinceMapping } from "$lib/salaryData";
  import "leaflet/dist/leaflet.css";
  import type { Map, Layer, GeoJSON, Marker } from 'leaflet';

  interface Props {
    selectedRegion?: string | null;
    searchedProvince?: string | null;
    userLocation?: { lat: number, lng: number } | null;
  }

  let { 
    selectedRegion = $bindable(null), 
    searchedProvince = $bindable(null), 
    userLocation = null 
  }: Props = $props();

  let map = $state<Map | null>(null);
  let geojsonLayer = $state<GeoJSON | null>(null);
  let userMarker = $state<Marker | null>(null);
  let L = $state<any>(null);

  const regions = SALARY_REGIONS as Record<string | number, any>;

  function getStyle(feature: any) {
    const ma = feature?.properties?.Ma;
    const regionId = provinceMapping[ma] || 4;
    const isSearched = searchedProvince === ma;
    const isInSelectedRegion = selectedRegion ? (regionId.toString() === selectedRegion) : false;
    const shouldShow = isSearched || isInSelectedRegion;

    return {
      fillColor: regions[regionId].color,
      color: isSearched ? "#1d4ed8" : (isInSelectedRegion ? "white" : "transparent"),
      weight: isSearched ? 4 : (isInSelectedRegion ? 2 : 0),
      opacity: shouldShow ? 1 : 0,
      fillOpacity: shouldShow ? 0.8 : 0,
    };
  }

  onMount(async () => {
    const leafletModule = await import("leaflet");
    L = leafletModule.default;
    if (!L) return;

    map = L.map("map-container", {
      center: [16.5, 110.5], 
      zoom: 6,
      zoomControl: false,
      preferCanvas: true 
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB'
    }).addTo(map);

    const islands = [
      { name: "Hoàng Sa", pos: [16.5, 112.0] },
      { name: "Trường Sa", pos: [10.5, 114.5] }
    ];

    islands.forEach(island => {
      L.marker(island.pos as [number, number], {
        icon: L.divIcon({
          className: 'sovereignty-label',
          html: `<div>${island.name}</div>`,
          iconSize: [150, 40]
        }),
        interactive: false
      }).addTo(map!);
    });

    try {
      const res = await fetch("/Provinces.geojson");
      const data = await res.json();

      geojsonLayer = L.geoJSON(data, {
        style: getStyle,
        onEachFeature: (feature: any, layer: Layer) => {
          const { TinhThanh, Ma, SapNhap } = feature.properties;
          const regionId = provinceMapping[Ma] || 4;
          const region = regions[regionId];

          layer.on({
            click: (e) => {
              const isHighlight = searchedProvince === Ma || (selectedRegion && regionId.toString() === selectedRegion);
              if (isHighlight) {
                L.DomEvent.stopPropagation(e);
                (layer as any).bindPopup(`
                  <div class="font-sans p-2">
                    <div class="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                      <h3 class="text-2xl font-black text-slate-800 m-0 leading-tight">${TinhThanh}</h3>
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase ml-2">${region.label}</span>
                    </div>
                    <p class="text-[11px] text-slate-400 mb-3 italic leading-relaxed">Gồm: ${SapNhap || TinhThanh}</p>
                    <div class="bg-gradient-to-br from-slate-50 to-blue-50 p-3 rounded-xl border border-blue-100 shadow-sm text-center">
                      <span class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mức lương tối thiểu</span>
                      <div class="text-2xl font-black text-blue-600 tracking-tight">${region.amount} <small class="text-xs">VNĐ</small></div>
                    </div>
                  </div>
                `, { maxWidth: 300 }).openPopup();
              }
            }
          });
        }
      }).addTo(map);
    } catch (err) {
      console.error("Lỗi tải GeoJSON:", err);
    }
  });


  $effect(() => { if (geojsonLayer) geojsonLayer.setStyle(getStyle); });

  $effect(() => {
    if (!selectedRegion && !searchedProvince && map) {
      map.flyTo([16.5, 110.5], 6, { duration: 1.2 });
      map.closePopup();
    }
  });

  $effect(() => {
  if (map) {
    setTimeout(() => {
      map?.invalidateSize();
    }, 100); 
  }
});

$effect(() => {
  if (geojsonLayer && searchedProvince && map) {
    selectedRegion = null;
    geojsonLayer.eachLayer((layer: any) => {
      if (layer.feature.properties.Ma === searchedProvince) {
        map?.flyToBounds(layer.getBounds(), { 
          padding: [100, 100], 
          duration: 1.5,
          animate: true 
        });
      }
    });
  }
});
</script>

<div class="relative h-full w-full">
  <div id="map-container" class="h-full w-full bg-slate-100 z-0"></div>
  {#if !geojsonLayer}
    <div class="absolute inset-0 z-[1001] flex items-center justify-center bg-white/60 backdrop-blur-sm">
       <div class="flex flex-col items-center gap-2">
         <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
         <p class="text-sm font-medium text-slate-600">Loading data...</p>
       </div>
    </div>
  {/if}
</div>

<style>
  @reference "../app.css";

  :global(.sovereignty-label) {
    @apply flex items-center justify-center;
    background: transparent !important;
    border: none !important;
  }
  :global(.sovereignty-label div) {
    @apply text-slate-500 font-bold italic text-xs tracking-widest uppercase;
    text-shadow: 0 0 3px white, 0 0 5px white;
    pointer-events: none;
    white-space: nowrap;
  }

  :global(.leaflet-popup-content-wrapper) { @apply rounded-2xl shadow-2xl border-none p-0 overflow-hidden; }
  :global(.leaflet-popup-content) { @apply m-0 p-0 !w-72; }
  :global(.leaflet-container) { @apply font-sans; }
</style>
