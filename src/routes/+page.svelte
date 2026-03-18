<script lang="ts">
  import ViewMap from "../components/ViewMap.svelte";
  import { provinceMapping, SALARY_REGIONS } from "$lib/salaryData";

  let selectedRegions = $state<string[]>([]); 
  let searchedProvince = $state<string | null>(null);
  
  let tempProvinceId = $state("");

  const provinces = [
    { id: "32", name: "An Giang" },
    { id: "02", name: "Bắc Ninh" },
    { id: "34", name: "Cà Mau" },
    { id: "33", name: "Cần Thơ" },
    { id: "07", name: "Cao Bằng" },
    { id: "21", name: "Đà Nẵng" },
    { id: "25", name: "Đắk Lắk" },
    { id: "13", name: "Điện Biên" },
    { id: "28", name: "Đồng Nai" },
    { id: "24", name: "Gia Lai" },
    { id: "01", name: "Hà Nội" },
    { id: "35", name: "Hà Giang" },
    { id: "18", name: "Hà Tĩnh" },
    { id: "04", name: "Hải Phòng" },
    { id: "20", name: "Huế" },
    { id: "05", name: "Hưng Yên" },
    { id: "23", name: "Khánh Hòa" },
    { id: "14", name: "Lai Châu" },
    { id: "26", name: "Lâm Đồng" },
    { id: "11", name: "Lạng Sơn" },
    { id: "09", name: "Lào Cai" },
    { id: "17", name: "Nghệ An" },
    { id: "06", name: "Ninh Bình" },
    { id: "12", name: "Phú Thọ" },
    { id: "03", name: "Quảng Ninh" },
    { id: "22", name: "Quảng Ngãi" },
    { id: "19", name: "Quảng Trị" },
    { id: "15", name: "Sơn La" },
    { id: "27", name: "Tây Ninh" },
    { id: "10", name: "Thái Nguyên" },
    { id: "16", name: "Thanh Hóa" },
    { id: "79", name: "TP. Hồ Chí Minh" },
    { id: "08", name: "Tuyên Quang" },
    { id: "30", name: "Vĩnh Long" }
  ].sort((a, b) => a.name.localeCompare(b.name));

  function handleSearch() {
    if (tempProvinceId) {
      searchedProvince = tempProvinceId;
      selectedRegions = [];
    }
  }

  function toggleRegion(regionId: string) {
    searchedProvince = null;
    if (selectedRegions.includes(regionId)) {
      selectedRegions = selectedRegions.filter(id => id !== regionId);
    } else {
      selectedRegions = [...selectedRegions, regionId];
    }
  }

  function resetMap() {
    selectedRegions = [];
    searchedProvince = null;
    tempProvinceId = "";
  }
</script>

<div class="flex h-[100dvh] w-full flex-col md:flex-row bg-slate-50 overflow-hidden font-sans">
  
  <aside class="w-full md:w-80 bg-white border-b md:border-r border-slate-200 p-5 flex flex-col gap-4 z-10 shadow-lg shrink-0">
    <div>
      <h1 class="text-lg md:text-xl font-bold text-slate-800">Tra cứu vùng lương</h1>
      <p class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Dữ liệu cập nhật tại thời điểm 2026</p>
    </div>

    <div class="space-y-4">
      <div class="space-y-1">
        <label for="province-select" class="text-[11px] font-bold text-slate-400 uppercase">Tỉnh/Thành phố:</label>
        <div class="flex gap-2">
          <select 
            id="province-select"
            bind:value={tempProvinceId}
            class="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn --</option>
            {#each provinces as province}
              <option value={province.id}>{province.name}</option>
            {/each}
          </select>
          <button onclick={handleSearch} class="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md active:scale-95">Tìm</button>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase">Chọn vùng:</p>
          <!-- {#if selectedRegions.length > 0}
            <span class="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">{selectedRegions.length}</span>
          {/if} -->
        </div>
        <div class="grid grid-cols-4 md:grid-cols-2 gap-1.5">
          {#each Object.entries(SALARY_REGIONS) as [id, info]}
            <button 
              onclick={() => toggleRegion(id)}
              class="py-2 rounded-lg text-[10px] font-black border-2 transition-all
              {selectedRegions.includes(id) ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-100'}"
            >
              {info.label}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <div class="mt-auto pt-4 border-t">
       <button onclick={resetMap} class="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">↺ Đặt lại bản đồ</button>
    </div>
  </aside>

  <main class="flex-1 relative min-h-0 w-full overflow-hidden">
    <ViewMap selectedRegions={selectedRegions} bind:searchedProvince />
  </main>
</div>
