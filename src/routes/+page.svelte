<script lang="ts">
  import ViewMap from "../components/ViewMap.svelte";
  import { provinceMapping, SALARY_REGIONS } from "$lib/salaryData";

  let selectedRegion = $state<string | null>(null);
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
      selectedRegion = null;
    }
  }

  function toggleRegion(regionId: string) {
    if (selectedRegion === regionId) {
      selectedRegion = null;
    } else {
      selectedRegion = regionId;
      searchedProvince = null;
    }
  }

  function resetMap() {
    selectedRegion = null;
    searchedProvince = null;
    tempProvinceId = "";
  }
</script>

<div class="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
  <aside class="w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 z-10 shadow-lg">
    <div>
      <h1 class="text-xl font-bold text-slate-800">Tra cứu vùng lương</h1>
      <p class="text-xs text-slate-500 mt-1">Dữ liệu cập nhật tại thời điểm 2026</p>
    </div>

    <div class="flex flex-col gap-2">
      <label for="province-select" class="text-sm font-semibold text-slate-700 italic">Tỉnh/Thành phố:</label>
      <select 
        id="province-select"
        bind:value={tempProvinceId}
        class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      >
        <option value="">-- Chọn Tỉnh/Thành phố --</option>
        {#each provinces as province}
          <option value={province.id}>{province.name}</option>
        {/each}
      </select>
      
      <button 
        onclick={handleSearch}
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md active:scale-95"
      >
        Tra cứu
      </button>
    </div>

    <hr class="border-slate-100" />

    <div class="flex flex-col gap-3">
      <p class="text-sm font-semibold text-slate-700 italic">Hiển thị ranh giới toàn vùng:</p>
      <div class="grid grid-cols-2 gap-2">
        {#each Object.entries(SALARY_REGIONS) as [id, info]}
          <button 
            onclick={() => toggleRegion(id)}
            class="py-2 px-3 rounded-md text-xs font-bold border-2 transition-all
            {selectedRegion === id 
              ? 'bg-slate-800 text-white border-slate-800 shadow-inner' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}"
          >
            {info.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="mt-auto">
      <button 
        onclick={resetMap}
        class="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
      >
        <span class="text-lg">↺</span> Đặt lại bản đồ
      </button>
    </div>
  </aside>

  <main class="flex-1 relative">
    <ViewMap 
      bind:selectedRegion 
      bind:searchedProvince 
    />
  </main>
</div>

<style>
  @media (max-width: 768px) {
    .flex-col { flex-direction: column; }
    aside { width: 100%; height: auto; }
  }
</style>