var scenePilihHero = new Phaser.Class({
    Extends: Phaser.Scene,
  
    initialize: function () {
      Phaser.Scene.call(this, { key: "scenePilihHero" });
    },
  
    preload: function () {
      this.load.setBaseURL("assets/");
      this.load.image("BGPilihPesawat", "BGPilihPesawat.png");
      this.load.image("ButtonMenu", "ButtonMenu.png");
      this.load.image("ButtonNext", "ButtonNext.png");
      this.load.image("ButtonPrev", "ButtonPrev.png");
      this.load.image("Pesawat1", "Pesawat1.png");
      this.load.image("Pesawat2", "Pesawat2.png");
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
  
      this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "BGPilihPesawat");
  
      const buttonMenu = this.add.image(70, 70, "ButtonMenu").setInteractive();
      const buttonNext = this.add.image(X_POSITION.CENTER + 250, Y_POSITION.CENTER, "ButtonNext").setInteractive();
      const buttonPrev = this.add.image(X_POSITION.CENTER - 250, Y_POSITION.CENTER, "ButtonPrev").setInteractive();
  
      const heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "Pesawat" + (currentHero + 1)).setInteractive();
  
      const buttons = [buttonMenu, buttonNext, buttonPrev, heroShip];
      
  
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
        if (gameObject === buttonMenu) {
          this.scene.start("sceneMenu");
        }
  
        if (gameObject === buttonNext) {
          currentHero = (currentHero + 1) % countHero;
          heroShip.setTexture("Pesawat" + (currentHero + 1));
        }
  
        if (gameObject === buttonPrev) {
          currentHero = (currentHero - 1 + countHero) % countHero;
          heroShip.setTexture("Pesawat" + (currentHero + 1));
        }
  
        if (gameObject === heroShip) {
          this.scene.start("scenePlay");
        }
  
        if (buttons.includes(gameObject)) {
          gameObject.setTint(0xffffff);
        }
      });
    },
  
    update: function () {},
  });
  