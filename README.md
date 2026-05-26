# Shooter Plane

Game ini adalah proyek web sederhana untuk permainan tembak pesawat (plane shooter) built dengan HTML, JavaScript, dan Phaser 3.

## Teknologi (Tech Stack)

- **HTML**: Struktur halaman game dan pemanggilan skrip.
- **JavaScript**: Logika permainan, scene, dan alur permainan.
- **Phaser 3**: Engine game JavaScript untuk membuat game 2D dan menangani fisika arcade.
- **Assets**: Folder untuk menyimpan gambar dan aset game.

## Struktur Proyek

- `index.html` - halaman utama untuk menjalankan game.
- `sceneMenu.js` - scene menu utama.
- `scenePilihHero.js` - scene pemilihan hero.
- `scenePlay.js` - scene permainan utama.
- `sceneGameOver.js` - scene game over.
- `Assets` - folder asset gambar.

## Cara Kloning

1. Buka terminal atau Command Prompt.
2. Jalankan perintah berikut:

```bash
git clone git https://github.com/Byatarade/Shooter-Plane-Phaser.git
```

3. Masuk ke folder proyek:

```bash
cd "e:\- Visual_Studio_Code\Game\Shooter"
```

## Cara Penggunaan

### Opsi 1: Buka langsung dari file

1. Buka `index.html` dengan browser web.
2. Game akan berjalan dan memuat Phaser dari CDN.

### Opsi 2: Jalankan dengan server lokal (direkomendasikan)

Jika browser Anda membatasi pemuatan file lokal, gunakan server lokal seperti Live Server.

Lalu buka di browser:

```text
http://127.0.0.1:5500/index.html
```

## Catatan

- Pastikan koneksi internet tersedia saat pertama menjalankan game karena Phaser 3 dimuat dari CDN.
- Jika ingin mengembangkan lebih lanjut, Anda dapat menambahkan asset baru ke `Assets/Picture` dan mengubah skrip scene.