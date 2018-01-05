goog.require('SMF.Parser');

/** @define {boolean} */
var SMF_PARSER_EXPORT = false;

if (SMF_PARSER_EXPORT) {
  goog.exportSymbol('SMF.Parser', SMF.Parser);
  goog.exportSymbol('SMF.Parser.prototype.parse', SMF.Parser.prototype.parse);
}