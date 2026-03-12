# 📍 Wage Zone Search - Vietnam Minimum Wage Lookup

An interactive web application designed to help employees and businesses easily look up regional minimum wage levels in Vietnam through an intuitive map interface.

✨ Key Features
Interactive Map: Visualizes 4 wage regions with vibrant color coding (powered by Leaflet).

Smart Search: Quickly find information by Province/City or filter by Region (I, II, III, IV).

Geolocation: Instantly identify the minimum wage at your current physical location.

National Sovereignty: Clearly displays the Hoàng Sa and Trường Sa archipelagos, affirming Vietnam's maritime territory.

2026 Ready: Built with the latest data updated according to government regulations.

🛠 Tech Stack
Framework: SvelteKit 5 (utilizing the new Runes API).

Styling: Tailwind CSS.

Map Library: Leaflet.

## 🗺 Data Source

- **Administrative Boundaries:** High-precision GeoJSON of Vietnam provinces sourced from
  [nguyenduy1133](https://github.com/nguyenduy1133/Free-GIS-Data/tree/main)

🚀 Getting Started
Follow these steps to set up the project locally:

Clone the repository:

```Bash
git clone https://github.com/PhamHao21/Wage-Zone-Search.git
```

Install dependencies:

```Bash
npm install
```

Launch the development server:

```Bash
npm run dev
```

🗺 Map Data & Sovereignty
The administrative boundary data is stored in static/Provinces.geojson. This application is committed to accurately representing the full territorial integrity and sovereignty of Vietnam, including all offshore islands.

📝 License
This project is released under personal copyright. Please cite the source when reusing or referencing this work.

💬 Frequently Asked Questions (Q&A)

1. Do you plan to expand this project further?

   Absolutely. I intend to refine the granularity of the data. Currently, the map operates on a single-tier (provincial) level, but my roadmap includes developing it into a dual-tier system to provide more precise data down to specific districts and municipalities in the future.

2. Is the current website design a bit too simple?

   I agree, and that is intentional. At this stage, this project is designed as a modular feature rather than a standalone complex site. My long-term vision is to integrate this specialized tool into a much larger, comprehensive platform that I am currently planning.

3. What inspired the focus on 2026 data?
   
   The goal was to stay ahead of the curve. By preparing the infrastructure for 2026 regulations now, I ensure that the tool remains relevant and provides high utility for users as soon as the updated wage policies take effect.

🔗 **Live Demo:** [tracuuluongtoithieu.vercel.app](https://tracuuluongtoithieu.vercel.app/)
