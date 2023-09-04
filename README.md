# smfplayer.js

[![jsdelivr CDN](https://data.jsdelivr.com/v1/package/npm/@logue/smfplayer/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@logue/smfplayer)
[![NPM Downloads](https://img.shields.io/npm/dm/@logue/smfplayer.svg?style=flat)](https://www.npmjs.com/package/@logue/smfplayer)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@logue/smfplayer/file/README.md)
[![npm version](https://img.shields.io/npm/v/@logue/smfplayer.svg)](https://www.npmjs.com/package/@logue/smfplayer)
[![Open in Gitpod](https://shields.io/badge/Open%20in-Gitpod-green?logo=Gitpod)](https://gitpod.io/#https://github.com/logue/@logue/smfplayer)
[![Twitter Follow](https://img.shields.io/twitter/follow/logue256?style=plastic)](https://twitter.com/logue256)

smfplayer.js is standard MIDI file player using a [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) compatible synthesizer.

This program is side of sequencer. Tone Generator side is [sf2synth.js](https://github.com/logue/sf2synth.js).

## Usage

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

For more details, please refer to the source code in [demo](./src/demo/). (Although there are many [Bootstrap](https://getbootstrap.com/) dependent codes)

### CDN

Entry point is `SMF`.

```html
<script src="https://cdn.jsdelivr.net/npm/@logue/smfplayer@latest/dist/smfplayer.iife.min.js"></script>
<script>
  const player = new SMF.Player();
  // ...
</script>
```

## Methods

| Method                                | Description                                                     |
| ------------------------------------- | --------------------------------------------------------------- |
| play()                                | Play Sequence                                                   |
| stop()                                | Stop Sequence                                                   |
| sendAllSoundOff()                     | Send AllSoundOff to WML                                         |
| sendGmReset(`lv`)                     | Send GM Reset SysEx to WML. (Set `lv` to `true` for GM Level2.) |
| sendRawMidiMessage()                  | Send Midi message directly (such as `F0,7E,7F.09.01,F7`)        |
| load3MleFile(ArrayBuffer)             | Load 3MLE（\*.mml）format MML file.                             |
| loadMakiMabiSequenceFile(ArrayBuffer) | Load MakiMabi Sequence（\*.mms）MML file.                       |
| loadMidiFile(ArrayBuffer)             | Load Standard MIDI file.(SMF1, SMF2 both supported)             |
| loadMldFile(ArrayBuffer)              | Load Docomo Ringtone Melody（\*.mld）file.                      |
| loadMabiIccoFile(ArrayBuffer)         | Load MabiIcco（\*.mmi）MML file.                                |
| loadMs2MmlFile(ArrayBuffer)           | Load MapleStory2 MML（\*.ms2mml）file.                          |
| setCC111Loop(boolean)                 | Enable loop by ControlChange No.111                             |
| setFalcomLoop(boolean)                | Enable Falcom loop (Used MIDI text)                             |
| setLoop(boolean)                      | Enable Loop                                                     |
| setMFiLoop(boolean)                   | Enable Mfi meta data loop.                                      |
| setMasterVolume(number)               | Set Master volume（0~1）                                        |
| setPosition(number)                   | Jump sequence position.                                         |
| setTempoRate(number)                  | Set Tempo Rate                                                  |
| setWebMidiLink(string)                | Set WML url.                                                    |
| getCopyright()                        | Get Copyright meta data.                                        |
| getLength()                           | Get Sequence Length.                                            |
| getLyrics()                           | Get Lyrics meta data of current position. [^1]                  |
| getPosition()                         | Get current position.                                           |
| getSequenceName()                     | Get Sequence name. (usually contains the song title.)           |
| getTextEvent()                        | Get the TextEvent of current position.                          |
| getWebMidiLink()                      | Get WebMidiLink URL                                             |
| getTempo()                            | Get current tempo.                                              |
| getTime(number)                       | Output current playing time (hh:mm:ss)                          |
| getTotalTime()                        | Output playing time of MIDI file.[^2]                           |

[^1] This program does not parse karaoke data. ([KAR](http://gnese.free.fr/Projects/KaraokeTime/Fichiers/karfaq.html), [XF](https://jp.yamaha.com/files/download/other_assets/7/321757/xfspc.pdf), etc.)
[^2] Since it is calculated based on the current tempo, if the tempo changes in the middle of the song, the value here will also change.

### Restrictions when reading MML

When reading the following files, the program change values match those of MSXspirit.dls and are not compatible with GM. Download `MSXspirit.sf2` from [MabiMmlEmu](https://github.com/logue/MabiMmlEmu/) and load it into wml.html to use it.

| Extension | Description                                            |
| --------- | ------------------------------------------------------ |
| \*.mms    | [MakiMabi Sequence](https://booth.pm/ja/items/2372062) |
| \*.mml    | [3MLE](http://3ml.jp/)                                 |
| \*.mmi    | [MabiIcco](https://github.com/fourthline/mmlTools)     |

When reading an MML file (\*.ms2mml) from [MapleStory2](https://maplestory2.nexon.co.jp/), the program change is not included in the file format, so the instrument will be 0 (fixed to piano). increase.

## Compatibility

- Firefox 7+
- Google Chrome 7+
- Safari 5.1+
- Edge

## TODO

Recomposer file (\*.rcm) support.

## License

Copyright &copy; 2013 imaya / GREE Inc.
Copyright &copy; 2013-2023 by Logue.

[PSGConverter.js](https://github.com/logue/PSGConverter) Copyright &copy; 2006-2012 by Logue.

Licensed under the [MIT](LICENSE) License.
