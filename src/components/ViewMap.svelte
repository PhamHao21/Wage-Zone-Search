<script lang="ts">
  import { onMount } from 'svelte';
  import { SALARY_REGIONS, provinceMapping } from '$lib/salaryData';
  import 'leaflet/dist/leaflet.css';
  import type { Map, Layer, GeoJSON } from 'leaflet';

  interface Props {
    selectedRegions?: string[];
    searchedProvince?: string | null;
  }

  let { selectedRegions = [], searchedProvince = $bindable(null) }: Props = $props();

  let map = $state<Map | null>(null);
  let geojsonLayer = $state<GeoJSON | null>(null);
  let isDataLoaded = $state(false);
  let L = $state<any>(null);

  const regions = SALARY_REGIONS as Record<string | number, any>;

  function getStyle(feature: any) {
    const ma = feature?.properties?.Ma;
    const regionId = provinceMapping[ma] || 4;
    const isSearched = searchedProvince === ma;
    const isInSelectedRegion = selectedRegions.includes(regionId.toString());
    const isActive = isSearched || isInSelectedRegion;

    return {
      fillColor: isActive ? regions[regionId].color : '#cbd5e1',
      color: isSearched ? '#1d4ed8' : isActive ? 'white' : '#e2e8f0',
      weight: isSearched ? 3 : isActive ? 1.5 : 0.5,
      opacity: isActive ? 1 : 0.2,
      fillOpacity: isActive ? 0.6 : 0.05
    };
  }

  onMount(async () => {
    const leafletModule = await import('leaflet');
    L = leafletModule.default;
    if (!L) return;

    const mapInstance = L.map('map-container', {
      center: [16.5, 110.5],
      zoom: 6,
      zoomControl: false,
      preferCanvas: true
    });

    map = mapInstance;

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB',
      detectRetina: true,
      updateWhenIdle: true
    }).addTo(mapInstance);

    const islands = [
      { name: 'Hoàng Sa', pos: [16.5, 112.0] },
      { name: 'Trường Sa', pos: [10.5, 114.5] }
    ];

    islands.forEach((island) => {
      L.marker(island.pos as [number, number], {
        icon: L.divIcon({
          className: 'sovereignty-label',
          html: `<div>${island.name}</div>`,
          iconSize: [150, 40]
        }),
        interactive: false
      }).addTo(mapInstance);
    });

    try {
      const res = await fetch('/Provinces.geojson');
      const data = await res.json();

      geojsonLayer = L.geoJSON(data, {
        style: getStyle,
        onEachFeature: (feature: any, layer: Layer) => {
          const { TinhThanh, Ma, SapNhap } = feature.properties;
          const regionId = provinceMapping[Ma] || 4;
          const region = regions[regionId];

          layer.on({
            click: (e) => {
              L.DomEvent.stopPropagation(e);
              (layer as any).bindPopup(`
                <div class="font-sans p-1">
                  <div class="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                    <h3 class="text-xl font-black text-slate-800 m-0 leading-tight">${TinhThanh}</h3>
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase ml-2">${region.label}</span>
                  </div>
                  <div class="bg-gradient-to-br from-slate-50 to-blue-50 p-3 rounded-2xl border border-blue-100 text-center">
                    <span class="text-[9px] font-bold text-slate-500 uppercase block tracking-wider mb-1">Mức lương tối thiểu</span>
                    <div class="text-2xl font-black text-blue-600">${region.amount} <small class="text-[10px]">VNĐ</small></div>
                  </div>
                </div>
              `, { maxWidth: 260 }).openPopup(e.latlng);
            }
          });
        }
      }).addTo(mapInstance);
      isDataLoaded = true;
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    }
  });

  $effect(() => {
    if (geojsonLayer) geojsonLayer.setStyle(getStyle);
  });

  $effect(() => {
    if (map) {
      const container = document.getElementById('map-container');
      if (container) {
        const observer = new ResizeObserver(() => map?.invalidateSize());
        observer.observe(container);
        return () => observer.disconnect();
      }
    }
  });

  $effect(() => {
    if (geojsonLayer && searchedProvince && map) {
      geojsonLayer.eachLayer((layer: any) => {
        if (layer.feature.properties.Ma === searchedProvince) {
          map?.flyToBounds(layer.getBounds(), { padding: [50, 50], duration: 1.5 });
        }
      });
    }
  });
</script>

<div class="relative h-full w-full overflow-hidden bg-slate-100">
  <div id="map-container" class="h-full w-full z-0 border-none outline-none bg-slate-100"></div>

  {#if !isDataLoaded}
    <div class="absolute inset-0 z-[1001] flex items-center justify-center bg-white/60 backdrop-blur-sm">
        <div class="flex flex-col items-center gap-2">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p class="text-sm font-medium text-slate-600 tracking-widest uppercase">Loading...</p>
        </div>
    </div>
  {/if}
</div>

<style>
  @reference "../app.css";

  :global(.sovereignty-label div) {
    @apply text-slate-500 font-bold italic text-[10px] tracking-widest uppercase;
    text-shadow: 0 0 3px white, 0 0 5px white;
    pointer-events: none;
    white-space: nowrap;
  }

  :global(.leaflet-popup-content-wrapper) { @apply rounded-3xl shadow-2xl; }
  :global(.leaflet-popup-content) { @apply m-0 p-0 !w-72; }
  :global(.leaflet-container) { @apply font-sans; }
</style>
