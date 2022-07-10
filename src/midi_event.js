/**
 * @classdesc Midi Event abstract Structure
 * @author    imaya
 * @license   MIT
 */
class Event {
  /**
   * @param {string} subtype event subtype name.
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   */
  constructor(subtype, deltaTime, time) {
    /** @type {string} */
    this.subtype = subtype;
    /** @type {number} */
    this.deltaTime = deltaTime;
    /** @type {number} */
    this.time = time;
  }
}

/**
 * Midi Channel Event Structure
 * @extends {Event}
 */
class ChannelEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {number} channel
   * @param {number=} optParameter1
   * @param {number=} optParameter2
   */
  constructor(subtype, deltaTime, time, channel, optParameter1, optParameter2) {
    super(subtype, deltaTime, time);
    /** @type {number} */
    this.channel = channel;
    /** @type {(number|undefined)} */
    this.parameter1 = optParameter1;
    /** @type {(number|undefined)} */
    this.parameter2 = optParameter2;
  }
}

/**
 * System Exclusive Event Structure
 * @extends {Event}
 */
class SystemExclusiveEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {ByteArray} data
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {ByteArray} */
    this.data = data;
  }
}

/**
 * Midi Meta Event Structure
 * @extends {Event}
 */
class MetaEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {Array.<*>} data meta data.
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {Array.<*>} */
    this.data = data;
  }
}

export { ChannelEvent, SystemExclusiveEvent, MetaEvent };
