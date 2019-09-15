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
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.arrayBuffer();
    })
    .then(arraybuffer => {
      const ext = url.split('.').pop();
      switch (ext) {
        case 'midi':
        case 'mid':
          // Load MIDI file
          player.loadMidiFile(input);
          break;
        case 'mld':
          // Load Polyphonic Ringtone File
          player.loadMldFile(input);
          break;
        case 'ms2mml':
          // Load Maple Story 2 MML File
          player.loadMs2MmlFile(input);
          break;
        case 'mms':
          // Load MakiMabi Sequence MML File
          player.loadMmsFile(input);
          break;
        case 'mml':
          // Load 3MLE MML File
          player.loadMmlFile(input);
          break;
        case 'mmi':
          // Load Mabicco MML File
          player.loadMmiFile(input);
          break;
        default:
          throw new Error("Unsupported format:" + ext);
      }
      player.play();
    })
    .catch(e => console.error(e));
```

## 命令

| メソッド/変数名               | 内容
| ----------------------------- | ---------------------------------
| play()                        | 再生
| stop()                        | 停止
| loadMidiFile(ArrayBuffer)     | MIDI形式のファイルを読み込む
| loadMldFile(ArrayBuffer)      | MLD形式のファイルを読み込む
| loadMs2MmlFile(ArrayBuffer)   | MapleStory2 MML（*.ms2mml）ファイルを読み込む
| loadMmsFile(ArrayBuffer)      | まきまびしーく（*.mms）ファイルを読み込む
| loadMmlFile(ArrayBuffer)      | 3MLE（*.mml）ファイルを読み込む
| loadMmiFile(ArrayBuffer)      | MabiIcco（*.mmi）ファイルを読み込む
| setLoop(boolean)              | 再生中のファイルをループ再生する
| setCC111Loop(boolean)         | コントロールチェンジNo.111の値でループする
| setFalcomLoop(boolean)        | Falcomで使用されているMIDIのループする
| setMFiLoop(boolean)           | Mfiメタデータでループする
| setWebMidiLink(string)        | 再生に使用するWebMidiLinkのURLを指定する
| getWebMidiLink()              | 使用しているWebMidiLinkのURLを出力する
| setTempoRate(number)          | テンポの倍率を指定する
| setMasterVolume(number)       | マスターボリュームの設定（0~1）
| getCopyright()                | メタデータの著作権情報を取得
| getSequenceName()             | メタデータのシーケンス名を取得する
| getLength()                   | データーの命令数を取得する
| setPosition(number)           | 入力された値にジャンプする
| getPosition()                 | 現在の再生位置を取得
| sendGmReset()                 | GMリセット命令をWMLに送る
| sendAllSoundOff()             | AllSoundOff命令をWMLに送る

### MMLを読み込む時の制限事項

以下のファイルを読み込ませる場合、プログラムチェンジの値がMSXSprit.dlsの値と一致しており、GMと互換性がありません。
これらのファイルを再生する場合は、WMLの値を https://logue.dev/MabiMmlEmu/wml.html にしてください。

|拡張子     |ファイル
|-----------|-------------------
|*.mms      |[まきまびしーく](https://web.archive.org/web/20190331144512/http://www.geocities.jp/makimabi/)形式
|*.mml      |[3MLE](http://3ml.jp/)
|*.mmi      |[MabiIcco](https://github.com/fourthline/mmlTools)
|*.ms2mml   |Maple Story2 MML

MapleStory2のMMLファイルを読み込む場合、プログラムチェンジがファイル形式に含まれていないため、楽器がピアノ固定となります。

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