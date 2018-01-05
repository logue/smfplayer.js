goog.require('SMF.Worker');

/** @define {boolean} */
var SMF_WORKER_EXPORT = false;

if (SMF_WORKER_EXPORT) {
  goog.exportSymbol('SMF.Worker', SMF.Worker);
  goog.exportSymbol('SMF.Worker.prototype.play', SMF.Worker.prototype.play);
  goog.exportSymbol('SMF.Worker.prototype.stop', SMF.Worker.prototype.stop);
  goog.exportSymbol('SMF.Worker.prototype.loadMidiFile', SMF.Worker.prototype.loadMidiFile);
  goog.exportSymbol('SMF.Worker.prototype.loadMldFile', SMF.Worker.prototype.loadMldFile);
  goog.exportSymbol('SMF.Worker.prototype.setLoop', SMF.Worker.prototype.setLoop);
  goog.exportSymbol('SMF.Worker.prototype.setCC111Loop', SMF.Worker.prototype.setCC111Loop);
  goog.exportSymbol('SMF.Worker.prototype.setFalcomLoop', SMF.Worker.prototype.setFalcomLoop);
  goog.exportSymbol('SMF.Worker.prototype.setMFiLoop', SMF.Worker.prototype.setMFiLoop);
  goog.exportSymbol('SMF.Worker.prototype.setWebMidiLink', SMF.Worker.prototype.setWebMidiLink);
  goog.exportSymbol('SMF.Worker.prototype.getWebMidiLink', SMF.Worker.prototype.getWebMidiLink);
  goog.exportSymbol('SMF.Worker.prototype.setTempoRate', SMF.Worker.prototype.setTempoRate);
  goog.exportSymbol('SMF.Worker.prototype.setMasterVolume', SMF.Worker.prototype.setMasterVolume);
  goog.exportSymbol('SMF.Worker.prototype.getCopyright', SMF.Worker.prototype.getCopyright);
  goog.exportSymbol('SMF.Worker.prototype.getSequenceName', SMF.Worker.prototype.getSequenceName);
  goog.exportSymbol('SMF.Worker.prototype.getLength', SMF.Worker.prototype.getLength);
  goog.exportSymbol('SMF.Worker.prototype.getPosition', SMF.Worker.prototype.getPosition);
  goog.exportSymbol('SMF.Worker.prototype.sendGmReset', SMF.Worker.prototype.sendGmReset);
  goog.exportSymbol('SMF.Worker.prototype.sendAllSoundOff', SMF.Worker.prototype.sendAllSoundOff);
  goog.exportSymbol('SMF.Worker.prototype.time', SMF.Worker.prototype.time);
  goog.exportSymbol('SMF.Worker.prototype.timeTotal', SMF.Worker.prototype.timeTotal);
  goog.exportSymbol('SMF.Worker.prototype.getTime', SMF.Worker.prototype.getTime);
}