import { Scene, Types, Physics } from "phaser";

export class Game extends Scene {
  private logo: Physics.Arcade.Image;
  private cursors: Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Game");
  }

  /**
   * ゲームが読み込まれる前に、アセット（画像や音声など）をロードするためのメソッドです。
   * ここでは、背景画像とロゴ画像をロードしています。
   */
  preload() {
    // アセットの場所(public/*)を指定します。
    this.load.setPath("assets");

    // 背景画像を読み込みます。
    this.load.image("background", "bg.png");

    // ロゴ画像を読み込みます。
    this.load.image("logo", "logo.png");
  }

  /**
   * ゲームの初期設定を行うメソッドです。
   * ここでは、背景画像の表示、ロゴ画像の物理設定、テキストの追加、
   * 入力イベントの設定などを行っています。
   */
  create() {
    // 背景画像を画面中央に配置します。
    this.add.image(512, 384, "background");

    // 物理エンジンを適用したロゴを追加します。
    // 物理エンジンを使用する場合は、src/game/main.tsのphysics設定も確認してください。
    this.logo = this.physics.add
      .image(512, 350, "logo")
      .setScale(0.5)
      .refreshBody();

    // ロゴが表示される奥行きを設定します。
    this.logo.setDepth(100);

    // ロゴの跳ね返りを設定します。
    this.logo.setBounce(0.8);

    // ロゴが画面外に出ないように設定します。
    this.logo.setCollideWorldBounds(true);

    // 画面中央下部にテキストを追加します。
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

    // テキストに物理エンジンを適用します。
    this.physics.world.enable(text);

    // テキストの物理特性を設定します。
    const textBody = text.body as Physics.Arcade.Body;
    textBody.setBounce(0.8);
    textBody.setCollideWorldBounds(true);

    // ロゴとテキストが衝突するように設定します。
    this.physics.add.collider(this.logo, text);

    // キーボードのカーソルキー入力を設定します。
    this.cursors = this.input.keyboard!.createCursorKeys();

    // 画面がクリックされたときのイベントを設定します。
    this.input.on("pointerdown", () => {
      this.logo.setVelocityY(-400);
      textBody.setVelocityY(-400);
    });
  }

  /**
   * ゲームのメインループで呼び出されるメソッドです。
   * ここでは、キーボードの入力に応じてロゴの移動を制御しています。
   */
  update() {
    // カーソルキーが設定されていない場合は何もしません。
    if (!this.cursors) {
      return;
    }

    // 左右のカーソルキー入力に応じてロゴの水平速度を設定します。
    if (this.cursors.left.isDown) {
      // 左キーが押されている場合、ロゴを左に移動させます。
      this.logo.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      // 右キーが押されている場合、ロゴを右に移動させます。
      this.logo.setVelocityX(200);
    } else {
      // どちらのキーも押されていない場合、ロゴの水平速度を0にします。
      this.logo.setVelocityX(0);
    }
  }
}
