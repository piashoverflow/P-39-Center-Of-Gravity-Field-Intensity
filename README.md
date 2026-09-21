# P-39: Center of Gravity & Gravitational Field Intensity Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Author: Shamsuddin Piash](https://img.shields.io/badge/Author-Shamsuddin%20Piash-0ea5e9.svg)](https://piashoverflow.github.io)
[![BUET ME](https://img.shields.io/badge/Institution-BUET%20'25-10b981.svg)](https://buet.ac.bd)

> **Interactive Computational Gravitational Field & Statics Simulator**  
> Developed by **Shamsuddin Piash** | Department of Mechanical Engineering, Bangladesh University of Engineering and Technology (BUET).  
> Covers **HSC Physics 1st Paper, Chapter 6 (Gravitation & Gravity / মহাকর্ষ ও অভিকর্ষ)** — Topic Code **P-39**.

---

## 🔬 Core Physics Principles & Formulations

### 1. Center of Gravity (CG / ভারকেন্দ্র) vs. Center of Mass (CM / ভরকেন্দ্র)
- **Center of Mass (ভরকেন্দ্র)**: Point representing the mean weighted location of mass:
  $$\vec{R}_{\text{CM}} = \frac{\sum m_i \vec{r}_i}{\sum m_i}$$
- **Center of Gravity (ভারকেন্দ্র)**: Point through which the resultant force of gravity acts:
  $$\vec{R}_{\text{CG}} = \frac{\sum m_i g_i \vec{r}_i}{\sum m_i g_i}$$
- **Field Divergence**:
  - In a uniform gravitational field ($g_i = g = \text{constant}$), $\vec{R}_{\text{CG}} \equiv \vec{R}_{\text{CM}}$.
  - In a non-uniform inverse-square gravitational field $g(z) = g_0 \frac{R^2}{(R+z)^2}$, lower elements experience larger weight, pulling the center of gravity strictly below the center of mass:
    $$z_{\text{CG}} < z_{\text{CM}}$$

---

### 2. Gravitational Field Intensity $\vec{E}$ (মহাকর্ষীয় ক্ষেত্র প্রাবল্য)
The gravitational force exerted per unit test mass placed in space:
$$\vec{E} = \lim_{m_0 \to 0} \frac{\vec{F}}{m_0} = - \frac{GM}{r^2}\hat{r} = - \frac{GM}{r^3}\vec{r}$$
- Magnitude: $E = \frac{GM}{r^2}$
- SI Unit: $\text{N/kg} \equiv \text{m/s}^2$

---

### 3. Principle of Superposition & Neutral Points (উপরিলেপন ও নিরপেক্ষ বিন্দু)
- **Superposition Principle**:
  $$\vec{E}_{\text{net}} = \sum_{i=1}^n \vec{E}_i = -G \sum_{i=1}^n \frac{M_i}{r_i^2}\hat{r}_i$$
- **Neutral Point / Lagrange Point L1**: Location where opposing gravitational fields cancel:
  $$E_1 = E_2 \implies \frac{GM_1}{x^2} = \frac{GM_2}{(d - x)^2} \implies x = \frac{d}{1 + \sqrt{\frac{M_2}{M_1}}}$$
  For the Earth-Moon system ($M_1/M_2 \approx 81$):
  $$x = \frac{d}{1 + 1/9} = 0.90 d \quad (\approx 345,960\text{ km from Earth})$$

---

## 🚀 Getting Started & Local Development

```bash
# Clone repository
git clone https://github.com/piashoverflow/P-39-Center-Of-Gravity-Field-Intensity.git
cd P-39-Center-Of-Gravity-Field-Intensity

# Install dependencies
npm install

# Launch Vite development server
npm run dev

# Build for production / Vercel
npm run build
```

---

## 🌐 1-Click Deployment to Vercel
This project is configured for out-of-the-box zero-config deployment on [Vercel](https://vercel.com). Simply import this repository into your Vercel dashboard and click **Deploy**.

---

## 📜 License
MIT License © 2026 **Shamsuddin Piash**. See [LICENSE](LICENSE) for details.
