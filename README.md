# smfplayer.js

[![jsdelivr CDN](https://data.jsdelivr.com/v1/package/npm/@logue/smfplayer/badge)](https://www.jsdelivr.com/package/npm/@logue/smfplayer)
[![NPM Downloads](https://img.shields.io/npm/dm/@logue/smfplayer.svg?style=flat)](https://www.npmjs.com/package/@logue/smfplayer)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@logue/smfplayer/file/README.md)
[![npm version](https://img.shields.io/npm/v/@logue/smfplayer.svg)](https://www.npmjs.com/package/@logue/smfplayer)
[![Open in Gitpod](https://shields.io/badge/Open%20in-Gitpod-green?logo=Gitpod)](https://gitpod.io/#https://github.com/logue/@logue/smfplayer)

smfplayer.js は [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) 対応シンセサイザを用いた標準 MIDI ファイルプレイヤーです。

## 使い方

```js
import SMF from '@logue/smfplayer';

const player = new SMF.Player();

window.addEventListener(
  'DOMContentLoaded',
  () => {
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
    player.setLoop(loop); // Player Loop
    player.setCC111Loop(cc111); // CC#111 Loop
    player.setFalcomLoop(falcom); // Ys2 Eternal Loop
    player.setMFiLoop(mfi); // MFi Loop
    player.setTempoRate(tempo); // Playback tempo rate
    player.setMasterVolume(volume); // Master Volume
    player.setWebMidiLink('https://logue.dev/smfplayer.js/wml.html');

    // load standard MIDI file
    loadSMF('hoge.mid');
  },
  false
);

/**
 * @param {string} url
 */
function loadSMF(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
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
          throw new Error('Unsupported format:' + ext);
      }
      player.play();
    })
    .catch(e => console.error(e));
}
```

より詳細は、[docs.js](./src/demo/docs.js)を参考にしてください。

## 命令

| メソッド/変数名                       | 内容                                                          |
| ------------------------------------- | ------------------------------------------------------------- |
| play()                                | 再生                                                          |
| stop()                                | 停止                                                          |
| sendAllSoundOff()                     | AllSoundOff 命令を WML に送る                                 |
| sendGmReset()                         | GM リセット命令を WML に送る                                  |
| load3MleFile(ArrayBuffer)             | 3MLE（\*.mml）ファイルを読み込む                              |
| loadMakiMabiSequenceFile(ArrayBuffer) | まきまびしーく（\*.mms）ファイルを読み込む                    |
| loadMidiFile(ArrayBuffer)             | MIDI 形式のファイルを読み込む                                 |
| loadMldFile(ArrayBuffer)              | ドコモ着メロ（\*.mld）形式のファイルを読み込む                |
| loadMabiIccoFile(ArrayBuffer)         | MabiIcco（\*.mmi）ファイルを読み込む                          |
| loadMs2MmlFile(ArrayBuffer)           | MapleStory2 MML（\*.ms2mml）ファイルを読み込む                |
| setCC111Loop(boolean)                 | コントロールチェンジ No.111 の値でループする                  |
| setFalcomLoop(boolean)                | Falcom で使用されている MIDI のループする                     |
| setLoop(boolean)                      | 再生中のファイルをループ再生する                              |
| setMFiLoop(boolean)                   | Mfi メタデータでループする                                    |
| setMasterVolume(number)               | マスターボリュームの設定（0~1）                               |
| setPosition(number)                   | 入力された値にジャンプする                                    |
| setTempoRate(number)                  | テンポの倍率を指定する                                        |
| setWebMidiLink(string)                | 再生に使用する WebMidiLink の URL を指定する                  |
| getCopyright()                        | メタデータの著作権情報を取得                                  |
| getLength()                           | データーの命令数を取得する                                    |
| getLyrics()                           | 呼び出し時点の歌詞を取得する（※KAR、XF のパースは行いません） |
| getPosition()                         | 呼び出し時点の現在の再生位置を取得                            |
| getSequenceName()                     | メタデータのシーケンス名を取得する（通常は曲名）              |
| getTextEvent()                        | 呼び出し時点の TextEvent を取得する                           |
| getWebMidiLink()                      | 使用している WebMidiLink の URL を出力する                    |
| getTempo()                            | 現在のテンポを取得                                            |
| getTime(number)                       | 現在の演奏時間を出力する(hh:mm:ss 形式）                      |
| getTotalTime()                        | 全演奏時間を出力する（テンポ変更はサポートせず）              |

### MML を読み込む時の制限事項

以下のファイルを読み込ませる場合、プログラムチェンジの値が MSXspirit.dls の値と一致しており、GM と互換性がありません。[MabiMmlEmu リポジトリ](https://github.com/logue/MabiMmlEmu/)から`MSXspirit.sf2`をダウンロードして、wml.html に読み込ませて使用してください。

| 拡張子 | ファイル                                                |
| ------ | ------------------------------------------------------- |
| \*.mms | [まきまびしーく](https://booth.pm/ja/items/2372062)形式 |
| \*.mml | [3MLE](http://3ml.jp/)                                  |
| \*.mmi | [MabiIcco](https://github.com/fourthline/mmlTools)      |

[MapleStory2](https://maplestory2.nexon.co.jp/)の MML ファイル（\*.ms2mml）を読み込む場合、プログラムチェンジがファイル形式に含まれていないため、楽器が 0（ピアノ固定）となります。

## 対応ブラウザ

- Firefox 7+
- Google Chrome 7+
- Safari 5.1+
- Edge

## WebMidiLink 対応

sf2synth.js は WebMidiLink の Link Level 1 にのみ対応しています。

## ライセンス

Copyright &copy; 2013 imaya / GREE Inc. / 2013-2022 by Logue.

Licensed under the MIT License.
