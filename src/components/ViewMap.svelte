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
      { name: 'Quần đảo Hoàng Sa', pos: [16.5, 112.0] },
      { name: 'Quần đảo Trường Sa', pos: [10.5, 114.5] }
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
                    const isSearched = searchedProvince === Ma;
                    const isInSelectedRegion = selectedRegions.includes(regionId.toString());
                    const isActive = isSearched || isInSelectedRegion;

                    if (!isActive) return;

                    L.DomEvent.stopPropagation(e);
                    (layer as any).bindPopup(`
                        <div class="p-3 min-w-[220px] max-w-[260px]">
                            <div class="flex items-center justify-between gap-3 mb-3">
                                <h3 class="text-xl font-black text-slate-800 tracking-tighter m-0">
                                    ${TinhThanh}
                                </h3>
                                <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-[9px] font-black uppercase tracking-wider border border-indigo-200">
                                    ${region.label}
                                </span>
                            </div>

                            <div class="mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Khu vực:</p>
                                <p class="text-[11px] text-slate-600 leading-tight font-medium">
                                    ${SapNhap || TinhThanh}
                                </p>
                            </div>

                            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-md">
                                <span class="text-[8px] font-bold text-blue-100/80 uppercase block tracking-widest mb-1">Mức lương tối thiểu</span>
                                <div class="flex items-baseline gap-1 text-white">
                                    <span class="text-xl font-black tracking-tight">
                                        ${region.amount}
                                    </span>
                                    <span class="text-[10px] font-bold opacity-80">VNĐ</span>
                                </div>
                            </div>
                        </div>
                    `, { 
                        maxWidth: 300,
                        className: 'custom-salary-popup',
                        offset: [0, -5]
                    }).openPopup(e.latlng);
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

  :global(.custom-salary-popup .leaflet-popup-content-wrapper) {
        @apply rounded-2xl shadow-xl border-none p-0 overflow-hidden bg-white;
    }

    :global(.custom-salary-popup .leaflet-popup-content) {
        @apply m-0 !w-auto;
    }

    :global(.custom-salary-popup .leaflet-popup-tip) {
        @apply shadow-none bg-white;
    }

    :global(.leaflet-container) { @apply font-sans; }
</style>
