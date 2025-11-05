import { Scene, Types, Physics, GameObjects } from "phaser";

export class Game extends Scene {
  private logo: Physics.Arcade.Image;
  private cursors: Types.Input.Keyboard.CursorKeys;
  private text: GameObjects.Text;
  private moveLeft = false;
  private moveRight = false;

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
    this.logo.setBounce(0.2);

    // ロゴが画面外に出ないように設定します。
    this.logo.setCollideWorldBounds(true);

    // 画面中央下部にテキストを追加します。
    this.text = this.add
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
    this.physics.world.enable(this.text);

    // テキストの物理特性を設定します。
    const textBody = this.text.body as Physics.Arcade.Body;
    textBody.setBounce(1.0);
    textBody.setCollideWorldBounds(true);

    // ロゴとテキストが衝突するように設定します。
    this.physics.add.collider(this.logo, this.text);

    // キーボードのカーソルキー入力を設定します。
    this.cursors = this.input.keyboard!.createCursorKeys();

    // モバイル用の操作UIを作成します。
    this.createMobileControls();
  }

  /**
   * モバイル用の操作UIを作成します。
   */
  private createMobileControls() {
    const { width, height } = this.cameras.main;

    // 操作ボタンのスタイル
    const buttonStyle = {
      radius: 64,
      color: 0x000000,
      alpha: 0.5,
    };

    // 左移動ボタン
    const leftButton = this.add
      .circle(
        width * 0.15,
        height * 0.8,
        buttonStyle.radius,
        buttonStyle.color,
        buttonStyle.alpha
      )
      .setScrollFactor(0)
      .setDepth(200)
      .setInteractive();

    leftButton.on("pointerdown", () => (this.moveLeft = true));
    leftButton.on("pointerup", () => (this.moveLeft = false));
    leftButton.on("pointerout", () => (this.moveLeft = false));

    // 右移動ボタン
    const rightButton = this.add
      .circle(
        width * 0.85,
        height * 0.8,
        buttonStyle.radius,
        buttonStyle.color,
        buttonStyle.alpha
      )
      .setScrollFactor(0)
      .setDepth(200)
      .setInteractive();

    rightButton.on("pointerdown", () => (this.moveRight = true));
    rightButton.on("pointerup", () => (this.moveRight = false));
    rightButton.on("pointerout", () => (this.moveRight = false));
  }

  /**
   * ゲームのメインループで呼び出されるメソッドです。
   * ここでは、キーボードの入力に応じてロゴの移動を制御しています。
   */
  update() {
    if (!this.cursors || !this.logo.body) {
      return;
    }

    // const onGround = (this.logo.body as Physics.Arcade.Body).touching.down;
    // const textBody = this.text.body as Physics.Arcade.Body;

    // ジャンプ処理
    if (this.cursors.up.isDown || (this.moveLeft && this.moveRight)) {
      this.logo.setVelocityY(-400);
      // textBody.setVelocityY(-400);
    } else if (this.cursors.left.isDown || this.moveLeft) {
      // 左移動
      this.logo.setVelocityX(-300);
    } else if (this.cursors.right.isDown || this.moveRight) {
      // 右移動
      this.logo.setVelocityX(300);
    } else {
      // 水平方向の速度をリセット
      this.logo.setVelocityX(0);
    }
  }
}
