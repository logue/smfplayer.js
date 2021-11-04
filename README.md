# smfplayer.js

smfplayer.js は [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) 対応シンセサイザを用いた標準 MIDI ファイルプレイヤーです。

## 使い方

```js
const player = new Smf.Player();

window.addEventListener('DOMContentLoaded', () => {
  /** @type {boolean} */
  const loop = true;
  /** @type {boolean} */
  const cc111 = true;
  /** @type {boolean} */
  const falcom = true;
  /** @type {boolean} */
  const mfi = true;
  /** @type {number} */
  const tempo = 1.0;
  /** @type {number} 0-16383 */
  const volume = 16383 * 0.5;

  // player settings
  player.setLoop(loop);             // Player Loop
  player.setCC111Loop(cc111);       // CC#111 Loop
  player.setFalcomLoop(falcom);     // Ys2 Eternal Loop
  player.setMFiLoop(mfi);           // MFi Loop
  player.setTempoRate(tempo);       // Playback tempo rate
  player.setMasterVolume(volume);   // Master Volume
  player.setWebMidiLink('https://logue.dev/smfplayer.js/wml.html');

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
      /** @type {string} */
      const ext = url.split('.').pop();
      switch (ext) {
        case 'midi':
        case 'mid':
          // Load MIDI file
          player.loadMidiFile(arraybuffer);
          break;
        case 'mld':
          // Load Polyphonic Ringtone File
          player.loadMldFile(arraybuffer);
          break;
        case 'ms2mml':
          // Load Maple Story 2 MML File
          player.loadMs2MmlFile(arraybuffer);
          break;
        case 'mms':
          // Load MakiMabi Sequence MML File
          player.loadMakiMabiSequenceFile(arraybuffer);
          break;
        case 'mml':
          // Load 3MLE MML File
          player.load3MleFile(arraybuffer);
          break;
        case 'mmi':
          // Load Mabicco MML File
          player.loadMabiIccoFile(arraybuffer);
          break;
        default:
          throw new Error("Unsupported format:" + ext);
      }
      player.play();
    })
    .catch(e => console.error(e));
}
```

## 命令

| メソッド/変数名                        | 内容
| ------------------------------------- | ---------------------------------
| play()                                | 再生
| stop()                                | 停止
| sendAllSoundOff()                     | AllSoundOff命令をWMLに送る
| sendGmReset()                         | GMリセット命令をWMLに送る
| load3MleFile(ArrayBuffer)             | 3MLE（*.mml）ファイルを読み込む
| loadMakiMabiSequenceFile(ArrayBuffer) | まきまびしーく（*.mms）ファイルを読み込む
| loadMidiFile(ArrayBuffer)             | MIDI形式のファイルを読み込む
| loadMldFile(ArrayBuffer)              | ドコモ着メロ（*.mld）形式のファイルを読み込む
| loadMabiIccoFile(ArrayBuffer)         | MabiIcco（*.mmi）ファイルを読み込む
| loadMs2MmlFile(ArrayBuffer)           | MapleStory2 MML（*.ms2mml）ファイルを読み込む
| setCC111Loop(boolean)                 | コントロールチェンジNo.111の値でループする
| setFalcomLoop(boolean)                | Falcomで使用されているMIDIのループする
| setLoop(boolean)                      | 再生中のファイルをループ再生する
| setMFiLoop(boolean)                   | Mfiメタデータでループする
| setMasterVolume(number)               | マスターボリュームの設定（0~1）
| setPosition(number)                   | 入力された値にジャンプする
| setTempoRate(number)                  | テンポの倍率を指定する
| setWebMidiLink(string)                | 再生に使用するWebMidiLinkのURLを指定する
| getCopyright()                        | メタデータの著作権情報を取得
| getLength()                           | データーの命令数を取得する
| getLyrics()                           | 呼び出し時点の歌詞を取得する（※KAR、XFのパースは行いません）
| getPosition()                         | 呼び出し時点の現在の再生位置を取得
| getSequenceName()                     | メタデータのシーケンス名を取得する（通常は曲名）
| getTextEvent()                        | 呼び出し時点のTextEventを取得する
| getWebMidiLink()                      | 使用しているWebMidiLinkのURLを出力する
| getTempo()                            | 現在のテンポを取得
| getTime(number)                       | 現在の演奏時間を出力する(hh:mm:ss形式）
| getTotalTime()                        | 全演奏時間を出力する（テンポ変更はサポートせず）

### MMLを読み込む時の制限事項

以下のファイルを読み込ませる場合、プログラムチェンジの値がMSXSprit.dlsの値と一致しており、GMと互換性がありません。
これらのファイルを再生する場合は、WMLの値を https://logue.dev/MabiMmlEmu/wml.html にしてください。

|拡張子     |ファイル
|-----------|-------------------
|*.mms      |[まきまびしーく](https://web.archive.org/web/20190331144512/http://www.geocities.jp/makimabi/)形式
|*.mml      |[3MLE](http://3ml.jp/)
|*.mmi      |[MabiIcco](https://github.com/fourthline/mmlTools)

[MapleStory2](https://maplestory2.nexon.co.jp/)のMMLファイル（*.ms2mml）を読み込む場合、プログラムチェンジがファイル形式に含まれていないため、楽器が0（ピアノ固定）となります。

## 対応ブラウザ

- Firefox 7+
- Google Chrome 7+
- Safari 5.1+
- Edge

## WebMidiLink 対応

sf2synth.js は WebMidiLink の Link Level 1 にのみ対応しています。

## ライセンス

Copyright &copy; 2013 imaya / GREE Inc.
&copy; 2013-2021 Modified by Logue
Licensed under the MIT License.