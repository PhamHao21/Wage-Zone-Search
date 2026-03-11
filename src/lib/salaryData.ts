export interface SalaryRegion {
  label: string;
  amount: string;
  color: string;
}

//Tăng trung bình 7.2% so với 2025:
export const SALARY_REGIONS: Record<number, SalaryRegion> = {
  1: { label: "Vùng I", amount: "5.310.000", color: "#ef4444" }, //Vùng I: 5.310.000 (tăng 350k từ 4.960k)
  2: { label: "Vùng II", amount: "4.730.000", color: "#f59e0b" }, //Vùng II: 4.730.000 (tăng 320k)
  3: { label: "Vùng III", amount: "4.140.000", color: "#22c55e" }, //Vùng III: 4.140.000 (tăng 280k)
  4: { label: "Vùng IV", amount: "3.700.000", color: "#3b82f6" }, //Vùng IV: 3.700.000 (tăng 250k)
};

// Mapping toàn bộ 34 mã tỉnh từ file GeoJSON
export const provinceMapping: Record<string, number> = {
  "01": 1, // Hà Nội
  "79": 1, // TP. Hồ Chí Minh (Gồm BD, BR-VT cũ)
  "04": 1, // Hải Phòng (Gồm Hải Dương cũ)
  "28": 1, // Đồng Nai (Gồm Bình Phước cũ)
  "02": 2, // Bắc Ninh (Gồm Bắc Giang cũ)
  "21": 2, // Đà Nẵng (Gồm Quảng Nam cũ)
  "33": 2, // Cần Thơ (Gồm Sóc Trăng, Hậu Giang cũ)
  "03": 2, // Quảng Ninh
  "27": 2, // Tây Ninh (Gồm Long An cũ)
  "12": 3, // Phú Thọ (Gồm Vĩnh Phúc, Hòa Bình cũ)
  "05": 3, // Hưng Yên (Gồm Thái Bình cũ)
  "23": 3, // Khánh Hòa (Gồm Ninh Thuận cũ)
  "06": 3, // Ninh Bình (Gồm Hà Nam, Nam Định cũ)
  "32": 3, // An Giang (Gồm Kiên Giang cũ)
  "10": 3, // Thái Nguyên (Gồm Bắc Kạn cũ)
  "30": 3, // Vĩnh Long (Gồm Trà Vinh, Bến Tre cũ)
  "16": 3, // Thanh Hóa
  "17": 3, // Nghệ An
  "25": 3, // Đắk Lắk (Gồm Phú Yên cũ)
  "34": 4, // Cà Mau (Gồm Bạc Liêu cũ)
  "07": 4, // Cao Bằng
  "13": 4, // Điện Biên
  "18": 4, // Hà Tĩnh
  "20": 4, // Huế
  "14": 4, // Lai Châu
  "26": 4, // Lâm Đồng (Gồm Đắk Nông, Bình Thuận cũ)
  "11": 4, // Lạng Sơn
  "09": 4, // Lào Cai (Gồm Yên Bái cũ)
  "22": 4, // Quảng Ngãi (Gồm Kon Tum cũ)
  "19": 4, // Quảng Trị (Gồm Quảng Bình cũ)
  "15": 4, // Sơn La
  "08": 4, // Tuyên Quang (Gồm Hà Giang cũ)
  "24": 4, // Gia Lai (Gồm Bình Định cũ)
  "35": 4, // Hà Giang
};
