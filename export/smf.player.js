goog.require('SMF.Player');

/** @define {boolean} */
var SMF_PLAYER_EXPORT = false;

if (SMF_PLAYER_EXPORT) {
  goog.exportSymbol('SMF.Player', SMF.Player);
  goog.exportSymbol('SMF.Player.prototype.play', SMF.Player.prototype.play);
  goog.exportSymbol('SMF.Player.prototype.stop', SMF.Player.prototype.stop);
  goog.exportSymbol('SMF.Player.prototype.loadMidiFile', SMF.Player.prototype.loadMidiFile);
  goog.exportSymbol('SMF.Player.prototype.loadMldFile', SMF.Player.prototype.loadMldFile);
  goog.exportSymbol('SMF.Player.prototype.setLoop', SMF.Player.prototype.setLoop);
  goog.exportSymbol('SMF.Player.prototype.setCC111Loop', SMF.Player.prototype.setCC111Loop);
  goog.exportSymbol('SMF.Player.prototype.setFalcomLoop', SMF.Player.prototype.setFalcomLoop);
  goog.exportSymbol('SMF.Player.prototype.setMFiLoop', SMF.Player.prototype.setMFiLoop);
  goog.exportSymbol('SMF.Player.prototype.setWebMidiLink', SMF.Player.prototype.setWebMidiLink);
  goog.exportSymbol('SMF.Player.prototype.getWebMidiLink', SMF.Player.prototype.getWebMidiLink);
  goog.exportSymbol('SMF.Player.prototype.setTempoRate', SMF.Player.prototype.setTempoRate);
  goog.exportSymbol('SMF.Player.prototype.setMasterVolume', SMF.Player.prototype.setMasterVolume);
  goog.exportSymbol('SMF.Player.prototype.getCopyright', SMF.Player.prototype.getCopyright);
  goog.exportSymbol('SMF.Player.prototype.getSequenceName', SMF.Player.prototype.getSequenceName);
  goog.exportSymbol('SMF.Player.prototype.getLength', SMF.Player.prototype.getLength);
  goog.exportSymbol('SMF.Player.prototype.setPosition', SMF.Player.prototype.setPosition);
  goog.exportSymbol('SMF.Player.prototype.getPosition', SMF.Player.prototype.getPosition);
}
