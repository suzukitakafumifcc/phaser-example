import { Scene, Types, Physics } from "phaser";

export class Game extends Scene {
  private logo: Physics.Arcade.Image;
  private cursors: Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("background", "bg.png");
    this.load.image("logo", "logo.png");
  }

  create() {
    this.add.image(512, 384, "background");

    this.logo = this.physics.add
      .image(512, 350, "logo")
      .setScale(0.5)
      .refreshBody();
    this.logo.setDepth(100);
    this.logo.setBounce(0.8);
    this.logo.setCollideWorldBounds(true);

    const text = this.add
      .text(512, 490, "サッカーやろうぜ!\n俺がボールな!", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.physics.world.enable(text);

    const textBody = text.body as Physics.Arcade.Body;
    textBody.setBounce(0.8);
    textBody.setCollideWorldBounds(true);

    this.physics.add.collider(this.logo, text);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.input.on("pointerdown", () => {
      this.logo.setVelocityY(-400);
      textBody.setVelocityY(-400);
    });
  }

  update() {
    if (!this.cursors) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.logo.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.logo.setVelocityX(200);
    } else {
      this.logo.setVelocityX(0);
    }
  }
}
