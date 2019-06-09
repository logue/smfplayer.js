# smfplayer.js

smfplayer.js は [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) 対応シンセサイザを用いた標準 MIDI ファイルプレイヤーです。

## 使い方

```js
var player = new Smf.Player();

window.addEventListener('DOMContentLoaded', function() {
  /** @type {boolean} */
  var loop = true;
  /** @type {boolean} */
  var cc111 = true;
  /** @type {boolean} */
  var falcom = true;
  /** @type {boolean} */
  var mfi = true;
  /** @type {number} */
  var tempo = 1.0;
  /** @type {number} 0-16383 */
  var volume = 16383 * 0.5;

  // player settings
  player.setLoop(loop); // Player Loop
  player.setCC111Loop(cc111); // CC#111 Loop
  player.setFalcomLoop(falcom); // Ys2 Eternal Loop
  player.setMFiLoop(mfi); // MFi Loop
  player.setTempoRate(tempo); // Playback tempo rate
  player.setMasterVolume(volume); // Master Volume
  player.setWebMidiLink('//cdn.rawgit.com/logue/smfplayer.js/gh-pages/wml.html');

  // load standard MIDI file
  loadSMF('hoge.mid');
}, false);

/**
 * @param {string} url
 */
function loadSMF(url) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.addEventListener('load', function (event) {
    /** @type {Uint8Array} */
    var input = new Uint8Array(event.target.response);

    // load MIDI file
    player.loadMidiFile(input);
    player.play();
  }, false);
  xhr.responseType = 'arraybuffer';
  xhr.send();
}
```

## 命令

| メソッド/変数名            | 内容
| ------------------------- | ---------------------------------
| play()                    | 再生
| stop()                    | 停止
| loadMidiFile(ArrayBuffer) | MIDI形式のファイルを読み込む
| loadMldFile(ArrayBuffer)  | MLD形式のファイルを読み込む
| setLoop(boolean)          | 再生中のファイルをループ再生する
| setCC111Loop(boolean)     | コントロールチェンジNo.111の値でループする
| setFalcomLoop(boolean)    | Falcomで使用されているMIDIのループする
| setMFiLoop(boolean)       | Mfiメタデータでループする
| setWebMidiLink(string)    | 再生に使用するWebMidiLinkのURLを指定する
| getWebMidiLink()          | 使用しているWebMidiLinkのURLを出力する
| setTempoRate(number)      | テンポの倍率を指定する
| setMasterVolume(number)   | マスターボリュームの設定（0~1）
| getCopyright()            | メタデータの著作権情報を取得
| getSequenceName()         | メタデータのシーケンス名を取得する
| getLength()               | データーの命令数を取得する
| setPosition(number)       | 入力された値にジャンプする
| getPosition()             | 現在の再生位置を取得
| sendGmReset()             | GMリセット命令をWMLに送る
| sendAllSoundOff()         | AllSoundOff命令をWMLに送る

## 対応ブラウザ

- Firefox 7+
- Google Chrome 7+
- Safari 5.1+
- Edge

## WebMidiLink 対応

sf2synth.js は WebMidiLink の Link Level 1 にのみ対応しています。

## ライセンス

Copyright &copy; 2013 imaya / GREE Inc.
Modified by Logue
Licensed under the MIT License.