var sceneGameOver = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: "sceneGameOver" });
  },

  preload: function () {
    this.load.setBaseURL("assets/");
    this.load.image("BGPlay", "BGPlay.png");
    this.load.image("ButtonPlay", "ButtonPlay.png");
    this.load.image("ButtonMenu", "ButtonMenu.png");
    this.load.image("TitleGameOver", "TitleGameOver.png");
    this.load.audio("snd_gameover", "music_gameover.mp3");
    this.load.audio("snd_touchshooter", "fx_touch.mp3");
  },

  create: function (data) {
    const gameWidth = this.sys.game.canvas.width;
    const gameHeight = this.sys.game.canvas.height;
  
    const X_POSITION = {
      LEFT: 0,
      CENTER: gameWidth / 2,
      RIGHT: gameWidth,
    };
  
    const Y_POSITION = {
      TOP: 0,
      CENTER: gameHeight / 2,
      BOTTOM: gameHeight,
    };
  
    // Background
    this.add.image(0, 0, "BGPlay").setOrigin(0);
  
    // Title "Game Over"
    const titleY = Y_POSITION.CENTER - 200;
    this.add.image(X_POSITION.CENTER, titleY, "TitleGameOver").setOrigin(0.5).setScale(1);
  
    // Pengecekan status Sound On/Off dari Menu
    let soundEnabled = parseInt(localStorage.getItem("sound_enabled"));
    if (isNaN(soundEnabled)) {
      soundEnabled = 1;
    }

    // Sound Setup
    this.snd_gameover = this.sound.add("snd_gameover", { 
      loop: true, 
      volume: soundEnabled ? 0.5 : 0 
    });
    this.snd_touchshooter = this.sound.add("snd_touchshooter", {
      volume: soundEnabled ? 1 : 0
    });
    
    if (soundEnabled) {
      this.snd_gameover.play();
    }
  
    // Logic Perhitungan Score & High Score (Sudah diperbaiki biar tidak tabrakan variabel)
    const currentScore = data.score || data.finalScore || 0; 
    let savedHighScore = parseInt(localStorage.getItem("highScore")) || 0;
    
    if (currentScore > savedHighScore) {
      savedHighScore = currentScore;
      localStorage.setItem("highScore", savedHighScore);
    }
  
    const spacing = 75; 
    let currentY = titleY + 180;
  
    // Teks Score (Kembali menggunakan kata 'Score', dengan style tebal)
    this.add.text(X_POSITION.CENTER, currentY, `Score: ${currentScore}`, {
      fontFamily: "Impact, Arial Black, Verdana", 
      fontSize: "55px",
      color: "#ffffff",
      stroke: "#ff0000", 
      strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: "#000000", blur: 4, fill: true } 
    }).setOrigin(0.5);
  
    currentY += spacing;
  
    // Teks High Score (Kembali menggunakan kata 'High Score')
    this.add.text(X_POSITION.CENTER, currentY, `High Score: ${savedHighScore}`, {
      fontFamily: "Impact, Arial Black, Verdana",
      fontSize: "45px",
      color: "#ffff00", 
      stroke: "#000000",
      strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: "#000000", blur: 2, fill: true }
    }).setOrigin(0.5);
  
    // Buttons Setup
    currentY += spacing + 40;
  
    const playTexture = this.textures.get("ButtonPlay").getSourceImage();
    const menuTexture = this.textures.get("ButtonMenu").getSourceImage();

    const targetWidth = 100;
    const scalePlay = targetWidth / playTexture.width;
    const scaleMenu = targetWidth / menuTexture.width;

    const buttonPlay = this.add.image(X_POSITION.CENTER - 120, currentY, "ButtonPlay")
    .setInteractive()
    .setScale(scalePlay);

    const buttonMenu = this.add.image(X_POSITION.CENTER + 120, currentY, "ButtonMenu")
    .setInteractive()
    .setScale(scaleMenu);

    const buttons = [buttonPlay, buttonMenu];
  
    // Interactivity
    this.input.on("gameobjectover", (pointer, gameObject) => {
      if (buttons.includes(gameObject)) {
        gameObject.setTint(0x999999);
      }
    });
  
    this.input.on("gameobjectout", (pointer, gameObject) => {
      if (buttons.includes(gameObject)) {
        gameObject.setTint(0xffffff);
      }
    });
  
    this.input.on("gameobjectdown", (pointer, gameObject) => {
      if (buttons.includes(gameObject)) {
        gameObject.setTint(0x999999);
      }
    });
  
    this.input.on("gameobjectup", (pointer, gameObject) => {
      if (buttons.includes(gameObject)) {
        gameObject.setTint(0xffffff);
        this.snd_touchshooter.play();
        this.snd_gameover.stop();
  
        if (gameObject === buttonPlay) {
          this.scene.start("scenePlay");
        } else if (gameObject === buttonMenu) {
          this.scene.start("sceneMenu");
        }
      }
    });
  },

  update: function () {},
});