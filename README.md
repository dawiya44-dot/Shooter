# Shooter Plane

Game ini adalah proyek web sederhana untuk permainan tembak pesawat (plane shooter) built dengan HTML, JavaScript, dan Phaser 3.

# Shooter Plane

Game ini adalah proyek web sederhana untuk permainan tembak pesawat (plane shooter) yang dibangun menggunakan HTML, JavaScript, dan framework Phaser 3.

## 🚀 Teknologi (Tech Stack)

- **HTML5**: Struktur halaman utama game dan kontainer canvas.
- **JavaScript (ES6)**: Logika permainan, manajemen state, dan alur permainan.
- **Phaser 3**: Game engine 2D berbasis JavaScript untuk menangani rendering, *arcade physics*, dan *input handling*.
- **Phaser CDN**: Pengambilan library Phaser secara online tanpa instalasi lokal.

## 📁 Struktur Proyek

```text
├── Assets/
│   └── Picture/          # Aset gambar dan sprite game
├── index.html            # Halaman utama & entry point game
├── sceneMenu.js          # Main menu scene
├── scenePilihHero.js     # Character selection scene
├── scenePlay.js          # Gameplay utama (core loop)
└── sceneGameOver.js      # Game over & restart scene

## Cara Kloning

1. Buka terminal atau Command Prompt.
2. Jalankan perintah berikut:

```bash
git clone git https://github.com/dawiya44-dot/Shooter.git
```

3. Masuk ke folder proyek:

```bash
cd "e:\- Visual_Studio_Code\Game\Shooter"
```

## Cara Penggunaan

### Opsi 1: Buka langsung dari file

1. Buka `index.html` dengan browser web.
2. Game akan berjalan dan memuat Phaser dari CDN.

## Catatan

- Pastikan koneksi internet tersedia saat pertama menjalankan game karena Phaser 3 dimuat dari CDN.
- Jika ingin mengembangkan lebih lanjut, Anda dapat menambahkan asset baru ke `Assets` dan mengubah skrip scene.