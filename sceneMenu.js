var sceneMenu = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: "sceneMenu" });
  },

  preload: function () {
    this.load.setBaseURL("assets/");
    this.load.image("BGPlay", "BGPlay.png");
    this.load.image("Title", "Title.png");
    this.load.image("ButtonPlay", "ButtonPlay.png");
    this.load.image("ButtonSoundOn", "ButtonSoundOn.png");
    this.load.image("ButtonSoundOff", "ButtonSoundOff.png");
    this.load.audio("snd_menu", "music_menu.mp3");
    this.load.audio("snd_touchshooter", "fx_touch.mp3");
    this.load.audio("snd_ambience", "ambience.mp3");
  },

  create: function () {
    const gameWidth = this.sys.game.canvas.width;
    const gameHeight = this.sys.game.canvas.height;

    X_POSITION = {
      LEFT: 0,
      CENTER: gameWidth / 2,
      RIGHT: gameWidth,
    };

    Y_POSITION = {
      TOP: 0,
      CENTER: gameHeight / 2,
      BOTTOM: gameHeight,
    };

    this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "BGPlay");
    this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 150, "Title");

    // Efek suara klik tombol
    if (snd_touch == null) {
      snd_touch = this.sound.add("snd_touchshooter");
    }

    // Cek konfigurasi suara dari localStorage
    let soundEnabled = parseInt(localStorage.getItem("sound_enabled"));
    if (isNaN(soundEnabled)) {
      soundEnabled = 1;
      localStorage.setItem("sound_enabled", 1);
    }

    // Musik utama Menu
    this.snd_menu = this.sound.add("snd_menu", {
      loop: true,
      volume: soundEnabled ? 0.5 : 0,
    });
    if (soundEnabled) {
      this.snd_menu.play();
    }

    // Suara Ambience (Tugas Poin 2)
    this.snd_ambience = this.sound.add("snd_ambience", {
      loop: true,
      volume: soundEnabled ? 0.3 : 0, // Volume dibuat sedikit lebih pelan dari musik utama
    });
    if (soundEnabled) {
      this.snd_ambience.play();
    }

    // Tombol Pengaturan Suara (Tugas Poin 1)
    var buttonSound = this.add.image(
      X_POSITION.RIGHT - 140,
      Y_POSITION.BOTTOM - 70,
      soundEnabled ? "ButtonSoundOn" : "ButtonSoundOff"
    );
    buttonSound.setInteractive();

    buttonSound.on("pointerdown", () => {
      soundEnabled = soundEnabled === 1 ? 0 : 1;
      localStorage.setItem("sound_enabled", soundEnabled);
      buttonSound.setTexture(soundEnabled ? "ButtonSoundOn" : "ButtonSoundOff");
      
      if (soundEnabled) {
        this.snd_menu.resume();
        this.snd_ambience.resume(); // Ambience ikut berlanjut
        snd_touch.setVolume(1);
      } else {
        this.snd_menu.pause();
        this.snd_ambience.pause();   // Ambience ikut dijeda
        snd_touch.setVolume(0);
      }
    });

    // Tombol Play
    var buttonPlay = this.add.image(
      X_POSITION.CENTER,
      Y_POSITION.CENTER + 150,
      "ButtonPlay"
    );
    buttonPlay.setInteractive();

    this.input.on("gameobjectover", (pointer, gameObject) => {
      if (gameObject === buttonPlay) {
        buttonPlay.setTint(0x999999);
        snd_touch.play();
      }
    });

    this.input.on("gameobjectout", (pointer, gameObject) => {
      if (gameObject === buttonPlay) {
        buttonPlay.setTint(0xffffff);
      }
    });

    this.input.on("gameobjectdown", (pointer, gameObject) => {
      if (gameObject === buttonPlay) {
        buttonPlay.setTint(0x999999);
        snd_touch.play();
      }
    });

    this.input.on("gameobjectup", (pointer, gameObject) => {
      if (gameObject === buttonPlay) {
        buttonPlay.setTint(0xffffff);
        
        // Hentikan semua musik menu sebelum pindah scene permainan
        if (this.snd_menu) {
          this.snd_menu.stop();
        }
        if (this.snd_ambience) {
          this.snd_ambience.stop();
        }
        
        this.scene.start("scenePilihHero");
      }
    });

    // Antisipasi jika scene ditutup paksa
    this.events.on("shutdown", () => {
      if (this.snd_menu) {
        this.snd_menu.stop();
      }
      if (this.snd_ambience) {
        this.snd_ambience.stop();
      }
    });

    // Solusi browser autoplay block (suara aktif otomatis begitu layar diklik pertama kali)
    this.input.on('pointerdown', () => {
      if (this.sound.context.state === 'suspended') {
          this.sound.context.resume();
      }
    });
  },

  update: function () {},
});