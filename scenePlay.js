var scenePlay = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: "scenePlay" });
  },

  preload: function () {
    this.load.setBaseURL("assets/");
    this.load.image("BG1", "BG1.png");
    this.load.image("BG2", "BG2.png");
    this.load.image("BG3", "BG3.png");
    this.load.image("GroundTransisi", "Transisi.png");
    this.load.image("Pesawat1", "Pesawat1.png");
    this.load.image("Pesawat2", "Pesawat2.png");
    this.load.image("Peluru", "Peluru.png");
    this.load.image("EfekLedakan", "EfekLedakan.png");
    this.load.image("cloud", "cloud.png");
    this.load.image("Musuh1", "Musuh1.png");
    this.load.image("Musuh2", "Musuh2.png");
    this.load.image("Musuh3", "Musuh3.png");
    this.load.image("MusuhBos", "MusuhBos.png");
    this.load.audio("snd_shoot", "fx_shoot.mp3");
    this.load.audio("snd_explode", "fx_explode.mp3");
    this.load.audio("snd_play", "music_play.mp3");
  },

  create: function () {
    // ================= CEK STATUS SUARA DARI LOCALSTORAGE =================
    let soundEnabled = parseInt(localStorage.getItem("sound_enabled"));
    if (isNaN(soundEnabled)) {
      soundEnabled = 1; // Default menyala jika belum diset
    }
    // =====================================================================

    // menentukan index atau urutan tekstur/gambar
    // background secara acak dari 1 sampai 3
    this.lastBgIndex = Phaser.Math.Between(1, 3);

    // Track last boss spawn time
    this.lastBossSpawnTime = 0;

    // membuat penampung data ukuran gambar
    // background pada lapisan paling bawah sendiri
    this.bgBottomSize = { width: 768, height: 1664 };

    // array untuk menampung semua background lapisan bawah
    this.arrBgBottom = [];

    // fungsi dengan parameter posisi x dan posisi y untuk
    // membuat background pada lapisan paling bawah sendiri
    this._createBGBottom = function (xPos, yPos) {
      let bgBottom = this.add.image(xPos, yPos, "BG" + this.lastBgIndex);
      bgBottom.setData("kecepatan", 3);
      bgBottom.setDepth(1);
      bgBottom.setData("tambahan", false);
      bgBottom.flipX = Phaser.Math.Between(0, 1);
      this.arrBgBottom.push(bgBottom);

      // menambahkan background transisi di posisi paling atas background apabila
      // urutan tekstur background sebelumnya berbeda dengan background baru
      let newBgIndex = Phaser.Math.Between(1, 3);
      while (newBgIndex === this.lastBgIndex) {
        newBgIndex = Phaser.Math.Between(1, 3);
      }
      this.lastBgIndex = newBgIndex;

      let bgBottomAddition = this.add.image(
        xPos,
        yPos - this.bgBottomSize.height / 2,
        "GroundTransisi"
      );
      bgBottomAddition.setData("kecepatan", 3);
      bgBottomAddition.setDepth(1);
      bgBottomAddition.setData("tambahan", true);
      bgBottomAddition.flipX = Phaser.Math.Between(0, 1);
      this.arrBgBottom.push(bgBottomAddition);
    };

    // fungsi untuk menentukan posisi dari background paling bawah sendiri
    // jadi untuk membuat background baru tinggal memanggil fungsi ini
    this.addBGBottom = function () {
      if (this.arrBgBottom.length > 0) {
        let lastBG = this.arrBgBottom[this.arrBgBottom.length - 1];
        if (lastBG.getData("tambahan")) {
          lastBG = this.arrBgBottom[this.arrBgBottom.length - 2];
        }
        this._createBGBottom(
          game.canvas.width / 2,
          lastBG.y - this.bgBottomSize.height
        );
      } else {
        this._createBGBottom(
          game.canvas.width / 2,
          game.canvas.height - this.bgBottomSize.height / 2
        );
      }
    };

    // membuat 3 background pada lapisan paling bawah sendiri
    // dengan cukup memanggil fungsi `addBGBottom` sebanyak 3 kali
    this.addBGBottom();
    this.addBGBottom();
    this.addBGBottom();

    // membuat background pada lapisan bagian atas
    // membuat penampung data ukuran gambar awan
    this.bgCloudSize = { width: 768, height: 1962 };

    // array untuk menampung semua background lapisan atas
    this.arrBgTop = [];

    // fungsi dengan parameter posisi x dan posisi y untuk membuat
    // background pada lapisan paling atas sendiri, yakni awan
    this.createBGTop = function (xPos, yPos) {
      var bgTop = this.add.image(xPos, yPos, "cloud");
      bgTop.setData("kecepatan", 6);
      bgTop.setDepth(3);
      bgTop.flipX = Phaser.Math.Between(0, 1);
      bgTop.setAlpha(Phaser.Math.Between(4, 7) / 10);
      this.arrBgTop.push(bgTop);
    };

    // fungsi untuk menentukan posisi dari background paling atas sendiri,
    // jadi untuk membuat background paling atas baru, tinggal panggil fungsi ini
    this.addBGTop = function () {
      if (this.arrBgTop.length > 0) {
        let lastBG = this.arrBgTop[this.arrBgTop.length - 1];
        this.createBGTop(
          game.canvas.width / 2,
          lastBG.y - this.bgCloudSize.height * Phaser.Math.Between(1, 4)
        );
      } else {
        this.createBGTop(game.canvas.width / 2, -this.bgCloudSize.height);
      }
    };

    // mengakses array BG Top untuk digerakkan dan dihapus jika sudah tidak terlihat
    for (let i = 0; i < this.arrBgTop.length; i++) {
      this.arrBgTop[i].y += this.arrBgTop[i].getData("kecepatan");
      if (
        this.arrBgTop[i].y >=
        game.canvas.height + this.bgCloudSize.height / 2
      ) {
        this.arrBgTop[i].destroy();
        this.arrBgTop.splice(i, 1);
        this.addBGTop();
        break;
      }
    }

    // membuat 1 background pada lapisan paling atas
    // dengan cukup memanggil fungsi `addBGTop` sebanyak 1 kali
    this.addBGTop();

    // membuat tampilan skor
    this.scoreLabel = this.add.text(
      X_POSITION.CENTER,
      Y_POSITION.TOP + 80,
      "0",
      {
        // menentukan jenis font yang akan ditampilkan
        fontFamily: "Verdana, Arial",
        // menentukan ukuran teks
        fontSize: "70px",
        // menentukan warna teks
        color: "#ffffff",
        // menentukan warna dari garis tepi teks
        stroke: "#5c5c5c",
        // menentukan ketebalan dari garis tepi teks
        strokeThickness: 2,
      }
    );

    // menentukan titik tumpu dari teks (0.5 berarti di tengah)
    this.scoreLabel.setOrigin(0.5);

    // mengatur posisi di lapisan ke berapa akan tampil
    this.scoreLabel.setDepth(100);

    // menambahkan pesawat hero ke dalam game
    this.heroShip = this.add.image(
      X_POSITION.CENTER,
      Y_POSITION.BOTTOM - 200,
      "Pesawat" + (currentHero + 1)
    );
    this.heroShip.setDepth(4);
    this.heroShip.setScale(0.35);

    //menyiapkan pendeteksi event untuk tombol arah keyboard
    this.cursorKeyListener = this.input.keyboard.createCursorKeys();

    // mengaktifkan deteksi pergerakan mouse atau touch pada layar
    this.input.on(
      "pointermove",
      function (pointer, currentlyOver) {
        // kode program ketika terdeteksi pergerakan mouse atau touch pada layar
        console.log(pointer);
        console.log("pointer.x : " + pointer.x + " pointer.y : " + pointer.y);

        // Membuat variabel penampung posisi baru yang akan dituju oleh pesawat hero
        // Sekaligus mengisi nilai awal dengan posisi hero terakhir
        let movementX = this.heroShip.x;
        let movementY = this.heroShip.y;

        // Mengecek posisi X pointer (horizontal) agar tetap dalam batas layar
        if (pointer.x > 70 && pointer.x < X_POSITION.RIGHT - 70) {
          movementX = pointer.x;
        } else {
          if (pointer.x <= 70) {
            movementX = 70;
          } else {
            movementX = X_POSITION.RIGHT - 70;
          }
        }

        // Mengecek posisi Y pointer (vertikal) agar tetap dalam batas layar
        if (pointer.y > 70 && pointer.y < Y_POSITION.BOTTOM - 70) {
          movementY = pointer.y;
        } else {
          if (pointer.y <= 70) {
            movementY = 70;
          } else {
            movementY = Y_POSITION.BOTTOM - 70;
          }
        }

        // Memindahkan posisi pesawat hero ke posisi baru yang telah ditentukan
        this.heroShip.x = movementX;
        this.heroShip.y = movementY;

        //menentukan jarak antara titik hero dengan titik tujuan gerak
        let a = this.heroShip.x - movementX;
        let b = this.heroShip.y - movementY;

        //menentukan durasi meluncur berdasarkan jarak yang sudah didapat
        let durationToMove = Math.sqrt(a * a + b * b) * 0.8;

        //animasi meluncur ke titik koordinat posisi pointer
        this.tweens.add({
          targets: this.heroShip,
          x: movementX,
          y: movementY,
          duration: durationToMove,
        });
      },
      this
    );

    //menambahkan beberapa titik posisi untuk membuat pola kiri A
    let pointA = [];
    pointA.push(new Phaser.Math.Vector2(-200, 100));
    pointA.push(new Phaser.Math.Vector2(250, 200));
    pointA.push(new Phaser.Math.Vector2(200, (Y_POSITION.BOTTOM + 200) / 2));
    pointA.push(new Phaser.Math.Vector2(200, Y_POSITION.BOTTOM + 200));

    //menambahkan beberapa titik posisi untuk membuat pola kanan A
    let pointB = [];
    pointB.push(new Phaser.Math.Vector2(900, 100));
    pointB.push(new Phaser.Math.Vector2(550, 200));
    pointB.push(new Phaser.Math.Vector2(500, (Y_POSITION.BOTTOM + 200) / 2));
    pointB.push(new Phaser.Math.Vector2(500, Y_POSITION.BOTTOM + 200));

    //menambahkan beberapa titik posisi untuk membuat pola kanan B
    let pointC = [];
    pointC.push(new Phaser.Math.Vector2(900, 100));
    pointC.push(new Phaser.Math.Vector2(550, 200));
    pointC.push(new Phaser.Math.Vector2(400, (Y_POSITION.BOTTOM + 200) / 2));
    pointC.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

    //menambahkan beberapa titik posisi untuk membuat pola kiri B
    let pointD = [];
    pointD.push(new Phaser.Math.Vector2(-200, 100));
    pointD.push(new Phaser.Math.Vector2(550, 200));
    pointD.push(new Phaser.Math.Vector2(650, (Y_POSITION.BOTTOM + 200) / 2));
    pointD.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

    //menampung pola-pola yang sudah ditambahkan
    //ke dalam sebuah array bernama 'points'
    var points = [];
    points.push(pointA);
    points.push(pointB);
    points.push(pointC);
    points.push(pointD);

    //menampung musuh yang ada pada game
    this.arrEnemies = [];

    //membuat sebuah class dengan nama Enemy yang nantinya akan
    //digunakan berulang-ulang untuk membuat objek musuh.
    var Enemy = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize: function Enemy(scene, idxPath) {
        Phaser.GameObjects.Image.call(this, scene);
        this.setTexture("Musuh" + Phaser.Math.Between(1, 3));
        this.setDepth(4);
        this.setScale(0.35);
        this.curve = new Phaser.Curves.Spline(points[idxPath]);

        let lastEnemyCreated = this;
        this.path = { t: 0, vec: new Phaser.Math.Vector2() };
        scene.tweens.add({
          targets: this.path,
          t: 1,
          duration: 3000,
          onComplete: function () {
            if (lastEnemyCreated) {
              lastEnemyCreated.setActive(false);
            }
          },
        });

        this.move = function () {
          this.curve.getPoint(this.path.t, this.path.vec);
          this.x = this.path.vec.x;
          this.y = this.path.vec.y;
        };
      },
    });

    var Bullet = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize: function Bullet(scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, "Peluru");
        this.setDepth(3);
        this.setPosition(x, y);
        this.setScale(0.5);
        this.speed = Phaser.Math.GetSpeed(20000, 1);
      },

      move: function () {
        this.y -= this.speed;
        if (this.y < -50) {
          this.setActive(false);
        }
      },
    });

    this.arrBullets = [];

    // INI KODE LAMA EFRAK AUDIO MENEMBAK YANG SUDAH DISESUAIKAN VOLUME-NYA
    this.snd_shoot = this.sound.add("snd_shoot", { volume: soundEnabled ? 1 : 0 });
    this.snd_explode = this.sound.add("snd_explode", { volume: soundEnabled ? 1 : 0 });

    this.time.addEvent({
      delay: 250,
      callback: function () {
        if (!this.heroShip.active) return; // ⛔ Stop menembak jika hero mati
        this.arrBullets.push(
          this.children.add(
            new Bullet(this, this.heroShip.x, this.heroShip.y - 30)
          )
        );
        this.snd_shoot.play();
      },
      callbackScope: this,
      loop: true,
    });

    this.scoreValue = 0;

    this.time.addEvent({
      delay: 1000, // spawn musuh setiap 1 detik
      callback: () => {
        if (this.arrEnemies.length < 3) {
          let pathIndex = Phaser.Math.Between(0, 3);
          let newEnemy = new Enemy(this, pathIndex);
          this.arrEnemies.push(this.children.add(newEnemy));
        }
      },
      loop: true,
    });

    // Membuat objek partikel berdasarkan aset gambar yang sudah ada
    // kemudian menampungnya di dalam variabel 'partikelExplode'
    let partikelExplode = this.add.particles("EfekLedakan");

    // Membuat partikel menjadi berada di urutan
    // lapisan yang berada di atasnya pesawat hero maupun musuh
    partikelExplode.setDepth(4);

    // Membuat emitter pertama dan menampungnya ke dalam
    // variabel emitterExplode1 untuk nanti diakses kembali
    this.emitterExplode1 = partikelExplode.createEmitter({
      // Mengatur kecepatan dari penyebaran partikel
      speed: { min: -800, max: 800 },

      // Mengatur kemiringan dari setiap partikel yang
      // tersebar secara acak, dari kemiringan 0 sampai 360
      angle: { min: 0, max: 360 },

      // Mengatur ukuran dari setiap partikel yang disebar
      // dari awal kemunculan 1.5 sampai 0 ketika keluar (lebih besar)
      scale: { start: 1.5, end: 0 },

      // Menentukan mode penampilan di layar
      blendMode: "SCREEN",

      // Menentukan lamanya tiap partikel tampil
      lifespan: 200,

      // Menentukan warna dasar dari partikel
      tint: 0xffa500,
    });

    // Mengatur posisi dari partikel, karena ini di fungsi create
    // jadi disembunyikan dulu di titik posisi yang tidak terlihat layar
    this.emitterExplode1.setPosition(-100, -100);

    // Memerintahkan agar emitter menjalankan tugasnya pertama kali
    this.emitterExplode1.explode();

    // ================= SINKRONISASI MUSIK BACKGROUND ARENA =================
    this.snd_play = this.sound.add("snd_play", { 
      loop: true, 
      volume: soundEnabled ? 0.5 : 0 // Otomatis diset ke 0 jika suara mati (OFF)
    });
    
    if (soundEnabled) {
      this.snd_play.play();
    }
    // ======================================================================
  },

  update() {
    for (let i = 0; i < this.arrBgBottom.length; i++) {
      this.arrBgBottom[i].y += this.arrBgBottom[i].getData("kecepatan");
      if (
        this.arrBgBottom[i].y >
        game.canvas.height + this.bgBottomSize.height / 2
      ) {
        this.addBGBottom();
        this.arrBgBottom[i].destroy();
        this.arrBgBottom.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < this.arrBgTop.length; i++) {
      let bg = this.arrBgTop[i];
      bg.y += bg.getData("kecepatan");

      if (bg.y >= game.canvas.height + this.bgCloudSize.height / 2) {
        bg.destroy();
        this.arrBgTop.splice(i, 1);
        this.addBGTop();
        break;
      }
    }

    if (this.cursorKeyListener.left.isDown && this.heroShip.x > 70) {
      this.heroShip.x -= 7;
    }
    if (
      this.cursorKeyListener.right.isDown &&
      this.heroShip.x < X_POSITION.RIGHT - 70
    ) {
      this.heroShip.x += 7;
    }
    if (this.cursorKeyListener.up.isDown && this.heroShip.y > 70) {
      this.heroShip.y -= 7;
    }
    if (
      this.cursorKeyListener.down.isDown &&
      this.heroShip.y < Y_POSITION.BOTTOM - 70
    ) {
      this.heroShip.y += 7;
    }

    for (let i = 0; i < this.arrEnemies.length; i++) {
      this.arrEnemies[i].move();
    }

    for (let i = 0; i < this.arrEnemies.length; i++) {
      if (!this.arrEnemies[i].active) {
        this.arrEnemies[i].destroy();
        this.arrEnemies.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < this.arrBullets.length; i++) {
      this.arrBullets[i].move();
    }

    for (let i = 0; i < this.arrBullets.length; i++) {
      if (!this.arrBullets[i].active) {
        this.arrBullets[i].destroy();
        this.arrBullets.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < this.arrEnemies.length; i++) {
      for (let j = 0; j < this.arrBullets.length; j++) {
        const enemy = this.arrEnemies[i];
        const bullet = this.arrBullets[j];
        if (enemy.getBounds().contains(bullet.x, bullet.y)) {
          bullet.setActive(false);
          if (enemy.texture.key === "MusuhBos") {
            enemy.health--;
            if (enemy.health <= 0) {
              enemy.setActive(false);

              // Efek ledakan di posisi boss
              this.emitterExplode1.setPosition(enemy.x, enemy.y);
              this.emitterExplode1.explode();
              this.snd_explode.play();
            }
          } else {
            enemy.setActive(false);
            this.scoreValue++;
            this.scoreLabel.setText(this.scoreValue);

            if (this.scoreValue >= 100) {
              if (this.snd_play) {
                this.snd_play.stop();
              }
              this.scene.start("sceneWin");
              return;
            }

            if (
              this.scoreValue % 20 === 0 &&
              this.time.now - this.lastBossSpawnTime > 10000
            ) {
              this.spawnBoss();
              this.lastBossSpawnTime = this.time.now;
            }
          }

          this.emitterExplode1.setPosition(bullet.x, bullet.y);
          this.emitterExplode1.explode();
          this.snd_explode.play();
          break;
        }
      }
    }

    for (let i = 0; i < this.arrEnemies.length; i++) {
      if (
        this.arrEnemies[i]
          .getBounds()
          .contains(this.heroShip.x, this.heroShip.y) &&
        this.heroShip.active
      ) {
        // Ledakan di posisi hero
        this.emitterExplode1.setPosition(this.heroShip.x, this.heroShip.y);
        this.emitterExplode1.explode();
      
        // Mainkan suara ledakan
        this.snd_explode.play();
      
        // Nonaktifkan hero dan jalankan game over
        this.heroShip.setActive(false);
        this.heroShip.setVisible(false);
        this.gameOver();
        break;
      }
    }

    if (this.bossBullets) {
      for (let i = 0; i < this.bossBullets.length; i++) {
        const b = this.bossBullets[i];
        if (b) {
          b.y += b.speed;
          if (b.y > Y_POSITION.BOTTOM + 50) {
            b.destroy();
          }
          if (
            this.heroShip.active &&
            b.getBounds().contains(this.heroShip.x, this.heroShip.y)
          ) {
            this.emitterExplode1.setPosition(this.heroShip.x, this.heroShip.y);
            this.emitterExplode1.explode();
            this.snd_explode.play();
            this.heroShip.setActive(false);
            this.heroShip.setVisible(false);
            this.gameOver();
            break;
          }
        }
      }
    }
  },

  spawnBoss: function () {
    const boss = this.add.image(X_POSITION.CENTER, -150, "MusuhBos");
    boss.setDepth(4);
    boss.setScale(0.8);
    boss.health = 10;
    boss.direction = 1;
    boss.speed = 2;
    boss.setActive(true);

    this.tweens.add({
      targets: boss,
      y: 150,
      duration: 2000,
      ease: "Power2",
      onComplete: () => {
        this.time.addEvent({
          delay: 200,
          callback: () => {
            if (!boss.active) return;
            const bullet = this.add.image(boss.x, boss.y + 50, "Peluru");
            bullet.setScale(0.6);
            bullet.setDepth(3);
            bullet.speed = 5;
            if (!this.bossBullets) this.bossBullets = [];
            this.bossBullets.push(bullet);
          },
          callbackScope: this,
          loop: true,
        });
      },
    });

    boss.move = () => {
      boss.x += boss.speed * boss.direction;
      if (boss.x <= 100 || boss.x >= X_POSITION.RIGHT - 100) {
        boss.direction *= -1;
      }
    };

    this.arrEnemies.push(boss);
  },

  gameOver: function () {
    if (this.snd_play) {
      this.snd_play.stop();
    }
    this.time.delayedCall(1000, () => {
      this.scene.start('sceneGameOver', { finalScore: this.scoreValue });
    }, [], this);
  },
});

