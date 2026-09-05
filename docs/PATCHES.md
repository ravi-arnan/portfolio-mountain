# PATCHES — Riwayat & State Proyek ravi-portfolio

Dokumen ini adalah sumber kebenaran untuk evolusi proyek **ravi-portfolio** (Ravi Arnan,
developer & designer). Dibuat agar pekerjaan bisa dilanjutkan di session/agent mana pun
tanpa kehilangan konteks. Setiap patch di bawah sudah **diimplementasikan dan build-nya
hijau** pada saat penulisannya. Untuk instruksi melanjutkan ke session baru, lihat
§8.

---

## 1. Arsitektur (state saat ini)

### Stack
- **Next.js 15 App Router** (React 19, TypeScript strict), Tailwind 3.4
- **Three.js 0.172 + @react-three/fiber 9 + @react-three/postprocessing 3** — semua scene procedural, shader GLSL custom
- **GSAP 3 + ScrollTrigger + Lenis** — satu clock terkoordinasi
- **Zustand 5** (React state) + objek mutable `sceneState` (data per-frame)
- Konten MDX (`gray-matter` + `next-mdx-remote/rsc`), form route handler + Resend opsional
- `@vercel/analytics` terpasang

### Konsep visual: gunung alpine prosedural dengan waktu yang bergulir
- **Scroll = waktu**: fajar (hero) → pagi (flyover) → golden hour (work) → senja (about)
  → malam berbintang + salju + aurora (approach/contact). Detail fase di `lib/atmosphere.ts`
  (`atmo.night/snow/aurora/valleyFog/cabin/birds/accent`).
- **Kamera = narator**: `SHOTS` di `store/scene.ts` berisi 8 shot bernama
  (`hero/skim/behind/rise/work/about/approach/contact`), masing-masing = posisi kamera +
  look-at + fov + `time`. Homepage menscrub timeline lewat marker `[data-shot]`
  (`HomeChoreography`, diurutkan berdasarkan posisi scroll). Route non-home terbang ke satu shot.

### File kunci
- `store/scene.ts` — tipe `SceneTargets`, `SHOTS`, `MODE_TARGETS`, `sceneState`
- `lib/atmosphere.ts` — 4 keyframe warna (dawn/morning/golden/night) + fase + `atmo`
- `lib/terrain.ts` — heightfield deterministik (ridged noise + puncak hero)
- `lib/shaders/` — `mountain.ts` (terrain/sky), `clouds.ts` (instanced puff),
  `weather.ts` (snow/aurora/fog-layer/glow), `stars.ts`, `noise.ts`
- `components/experience/` — `Scene` (urutan render), `Sky`, `Starfield`, `Aurora`,
  `Clouds` (near+far instanced), `Terrain`, `ValleyFog`, `Birds`, `CabinLight`, `Snow`,
  `ShootingStars`, `CameraRig`, `SceneController`, `Overlays`, `CanvasBoundary`, `FallbackPoster`
- `components/providers/` — `Preloader`, `PageTransition`, `SmoothScroll`
- `components/home/` — `HomeChoreography`, `Hero`, `Flyover` (pinned 3-beat),
  `SelectedWork`, `Capabilities`, `ContactCTA`; `Manifesto.tsx` ada tapi tidak dipakai
- `components/ui/` — `Header`, `Footer`, `Cursor`, `Instruments` (ALT/TIME/TEMP strip),
  `Button`, `Magnetic`, `TransitionLink`, `Reveal`, `RevealText`, `ProjectCard`,
  `ProjectImage`, `MdxImage`, `SectionHeading`
- Layout: `app/layout.tsx` memuat `Preloader → PageTransition → Cursor → ExperienceCanvas
  → Header → Instruments → main → Footer`, JSON-LD Person, `<Analytics />`, OG image
  (`app/opengraph-image.tsx`), `app/icon.svg`

### Urutan render Scene
`SceneController → CameraRig → Sky → Starfield → Aurora → Clouds(far) → Terrain →
ValleyFog → Clouds(near) → Birds → CabinLight → Snow → ShootingStars → Effects`

### Kualitas & fallback
- Tier `high/medium/low/fallback` dari `lib/device-capabilities.ts` (WebGL check, CPU/memori/UA)
- `CanvasBoundary` (error boundary → `FallbackPoster`), `webglcontextlost` dicegah
- `prefers-reduced-motion` → tanpa canvas/GSAP, konten statis
- Scrim/frost overlay via `Overlays`; teks di atas scene pakai kelas `.on-scene` (text-shadow)

---

## 2. Kronologi patch

### 2.0 HANDOFF — fondasi v0.2 (prosedural)
- Skeleton lengkap: routes, providers, UI, store, konten MDX placeholder.
- Konsep awal: objek "Aether Field" (icosahedron + shader simplex displacement) —
  **sudah dihapus total** oleh patch berikut.

### 2.1 THEME-SPACE — black hole (dihapus di 2.5)
- "Event Horizon": event horizon + photon ring + accretion disk + starfield + lensing
  screen-space. **Semua file dihapus di MOUNTAIN** — jangan dirujuk lagi.

### 2.2 LAUNCH — crash-proofing, UX, metadata
- `CanvasBoundary`, DPR cap, `webglcontextlost` handler, preloader skip session
  (lihat 2.10 untuk revisi), curtain lebih halus, header scrim, `MdxImage` untuk gambar
  dalam MDX, `opengraph-image.tsx`, `icon.svg`, JSON-LD + `@vercel/analytics`,
  redirect `/projects` → `/work`, footer 3 kolom. `CHANGE_ME` untuk link sosial.

### 2.3 UI-POLISH — detail perangkat nyata
- Mobile: hole/objek tidak menimpa headline; cursor I-beam di form; nav active state
  (`aria-current` + warna); touch target; `hoverOnlyWhenSupported`; footer berbobot;
  `-webkit-tap-highlight-color` + `::selection`.

### 2.4 CINEMATIC — kamera jadi narator
- `SHOTS` (8 shot bernama), `CameraRig` terbang mengikuti `sceneState.current`,
  `HomeChoreography` (timeline scroll-scrubbed), `Flyover` (section pinned 3 beat),
  `useSectionMode` dihapus, marker `[data-shot]` di section, velocity skew di `SmoothScroll`.

### 2.5 MOUNTAIN — ganti black hole → gunung alpine prosedural
- Hapus `BlackHole/Lensing/blackhole.ts`. Palette baru (cream/slate/dusk/peach/alpine)
  dengan alias lama. `Terrain` heightfield + shader rock/snow + fog; `Sky` dome gradien
  + matahari; `Clouds` (16 plane billboard, awal); `Starfield` radius jauh, fade malam;
  `Scrim`; header boxed; waktu = fajar→malam.

### 2.6 DETAILS — peta momen per fase
- `atmosphere.ts` diperluas: `moonDir`, fase `night/snow/aurora/valleyFog/cabin/birds`.
  Komponen baru: `Snow` (6000 flakes + hembusan scroll), `Aurora`, `ValleyFog`,
  `Birds` (V-flock), `CabinLight` (berkedip, di ridge), `ShootingStars`, `Overlays`
  (scrim + frost). Bulan di shader langit. Salju menurunkan snowline gunung
  (`30 − snow×14`). Kamera lean 3° saat hover kartu. Preloader hitung meter
  pendakian. `Instruments` strip (ALT/TIME/TEMP + progress bar).

### 2.7 FIX-NIGHT — urutan marker & ramp malam
- **Bug**: marker `approach` (anak DOM dari `contact`) muncul sebelum `contact` dalam
  document order → timeline `…→ contact → approach` → aurora pop + footer oranye.
- **Fix**: `HomeChoreography` mengurutkan key berdasarkan **posisi scroll** (`sort a.p−b.p`).
- Ramp fase lebih panjang & smoothstep; aurora/snow di-damping (frame-independent);
  warna aksen teks mengikuti waktu: `--accent` CSS var (DUSK→ICE) ditulis tiap frame
  oleh `Overlays`; kelas yang terkunci peach diganti `text-accent`/`bg-accent`.
  `devIndicators: false`.

### 2.8 FIX-READABILITY — kontras hero + kursor
- **Bug kursor**: `quickTo` dibuat saat elemen belum mount → ring macet di (0,0),
  native cursor disembunyikan. **Fix**: `Cursor.tsx` dipecah jadi 2 effect
  (decide → wire-up setelah mount), mulai opacity 0, show saat mouse pertama bergerak,
  hide di atas form fields, `mouseleave/mouseenter` dokumen.
- **Readability**: keyframe fajar lebih moody (zenith indigo `#4A5578`, horizon lebih
  dalam, fog lebih tipis 0.006), matahari pindah az 150 (kanan-belakang puncak, bukan
  di belakang headline), bloom matahari dikecilkan (`pow 900`, ×1.05), scrim gradien
  permanen kiri-bawah di `Overlays`, teks sekunder pindah `text-muted` → `text-cream/70–90`
  + kelas `.on-scene` (text-shadow).

### 2.9 FIX-PRELOADER — intro tidak boleh dilewati Strict Mode
- **Bug**: `seen-intro` ditulis *sebelum* animasi selesai → double-mount React Strict
  Mode (dev) me-skip intro total; timer 1,6s tidak menunggu canvas.
- **Fix**: `Preloader.tsx` ditulis ulang — `sessionStorage.setItem` hanya dipanggil di
  `playCurtain` (setelah intro selesai); climb 2,8s (`MIN_MS`) menunggu `isCanvasReady`
  (subscribe store) dengan `MAX_WAIT_MS` 6s; hold 450ms di puncak; curtain expo;
  counter meter (puncak 2847 M); cleanup **tidak** menulis sessionStorage.

### 2.10 FIX-CLOUDS — awan instanced multi-puff
- **Masalah**: satu plane per awan → kartu tepi keras, gelap seperti noda, tidak
  billboard, tidak kena fog.
- **Fix**: `lib/shaders/clouds.ts` baru (instanced: billboard cylindrical, drift+wrap,
  lighting relatif matahari, fog jarak); `Clouds.tsx` ditulis ulang — 1 awan = 5–9 puff
  (puff tengah lebih besar/tinggi), dua draw call: `near` (22 awan × 9 puff, r 55–230)
  dan `far` (14 × 5, r 260–520, hampir menyatu horizon). Urutan render: far sebelum
  Terrain, near setelah ValleyFog. Cloud shader lama dihapus dari `mountain.ts`.

---

## 3. Status & verifikasi terakhir

- `npm run build` **hijau** (0 type error, 0 lint error). 14 route/asset; halaman statis
  kecuali `/api/contact` (ƒ) dan `/opengraph-image` (edge).
- Verifikasi browser (headless Chrome + CDP): 0 console error, 0 page error.
- Terverifikasi visual: hero fajar (puncak + kabut + awan puff soft + teks terbaca),
  flyover (kamera skim→behind→rise, caption sticky), rise (awan gumpal dari atas),
  night (langit biru-hitam, bintang, aurora samar, salju, `--accent` ice-blue
  `#bfd3f2`, instrumen 23:30 / −18°C / 2696 M), preloader (counter 0→2847 M,
  hold, curtain, `seen-intro` baru ditulis setelah selesai).

### Catatan lingkungan dev (penting)
- Shell ini mengekspor `NODE_ENV=production` → `next dev` harus dijalankan sebagai
  `NODE_ENV=development npm run dev`.
- `npm` memakai `omit=dev` (dari env) → instalasi perlu `npm install --include=dev
  --legacy-peer-deps` bila devDependencies hilang.
- Jangan `rm -rf .next` saat dev server berjalan (korup manifest).
- Dev server biasa berjalan di background port 3000; hentikan dengan kill task.

---

## 4. Open loop / pekerjaan yang tersisa

### Konten (prioritas tertinggi — tanpa ini site tidak launchable)
- `content/work/project-one|two|three.mdx` — masih placeholder ("Placeholder — …")
- `components/home/Hero.tsx` — copy generic
- `app/about/page.tsx` — paragraf placeholder ("This section is a placeholder")
- `components/home/Capabilities.tsx` — item generik
- `components/layout/Footer.tsx` + `app/layout.tsx` `jsonLd.sameAs` —
  `github.com/CHANGE_ME`, `linkedin.com/in/CHANGE_ME`
- `components/home/Flyover.tsx` — 3 baris beat placeholder ("Perspective, first. / …")
- Metadata description masih generic

### Launch
- Vercel: import repo, env `NEXT_PUBLIC_SITE_URL=https://raviarnan.dev`,
  `CONTACT_EMAIL`, `RESEND_API_KEY`
- Resend: verifikasi domain, ganti `from:` di `app/api/contact/route.ts`
  (`onboarding@resend.dev` → `hello@raviarnan.dev`)
- Tes form live, tes OG di Slack/X, Lighthouse mobile (LCP < 2.5s, CLS < 0.1)

### Ide v2 (setelah konten)
- Image-sequence Blender (upgrade painterly; `SHOTS` siap jadi kamera Blender)
- Detail momen baru (tambah marker `[data-shot]` + entri `SHOTS` = API-nya)
- Audit aksesibilitas penuh, profil performa perangkat menengah

---

## 5. Cara tuning (knob utama)

| Mau | Ubah |
|---|---|
| Warna langit / waktu | `KEYS` di `lib/atmosphere.ts` |
| Kapan fase mulai | `smooth(a,b,…)` untuk tiap fase di `updateAtmosphere` |
| Framing kamera | `SHOTS` di `store/scene.ts`; marker `[data-shot]`/`h-screen` di section |
| Kabut / painterly | `fog` di `KEYS`; `Noise opacity` di `Effects.tsx` |
| Salju | `Snow.tsx` `uSize`; window `snow` di atmosphere |
| Awan | `CFG` di `Clouds.tsx` (near/far, jumlah, opacity); threshold di `clouds.ts` |
| Aurora | `Aurora.tsx` `×0.9` → `×1.3` |
| Scrim hero | `Overlays.tsx` alpha gradien (`.55` → jangan >`.65`) |

---

## 6. Konvensi kode

- Bahasa komentar/commit bebas (campur EN/ID di riwayat), kode & UI pakai Bahasa Inggris.
- "Apply exactly, `npm run build`, fix only type errors" — jangan redesign/restrukturisasi.
- Jangan tambah library baru (Drei, Framer Motion, dll) tanpa keputusan eksplisit.
- Shader GLSL tidak disentuh kecuali gagal compile.
- `npm install --legacy-peer-deps` bila perlu (React 19 peers).

---

## 7. Perintah yang sering dipakai

```bash
NODE_ENV=development npm run dev      # dev server (wajib NODE_ENV ini di shell ini)
npm run build                          # verifikasi build
rm -rf .next && npm run build          # bersihkan state build yang korup
```

---

## 8. Untuk session/agent baru

> Proyek: portfolio Next.js 15 + Three.js/R3F dengan scene gunung alpine prosedural
> (terrain heightfield, atmosfer 4 fase waktu = scroll, awan instanced near/far, salju,
> aurora, bintang, burung, lampu pondok), kamera scroll-scrubbed lewat `SHOTS` +
> marker `[data-shot]`, preloader "pendakian" 2,8s. Konten masih placeholder dan link
> sosial masih `CHANGE_ME`. Lihat `docs/PATCHES.md` untuk arsitektur, riwayat patch,
> dan open loop. Bangun dengan `NODE_ENV=development npm run dev` / `npm run build`.
