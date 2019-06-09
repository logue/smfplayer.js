class Event {
  /**
   * @param {string} subtype event subtype name.
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @constructor
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

class ChannelEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {number} channel
   * @param {number=} opt_parameter1
   * @param {number=} opt_parameter2
   * @constructor
   * @extends {Event}
   */
  constructor(subtype, deltaTime, time, channel, opt_parameter1, opt_parameter2) {
    super(subtype, deltaTime, time);
    /** @type {number} */
    this.channel = channel;
    /** @type {(number|undefined)} */
    this.parameter1 = opt_parameter1;
    /** @type {(number|undefined)} */
    this.parameter2 = opt_parameter2;
  }
}

class SystemExclusiveEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {ByteArray} data
   * @constructor
   * @extends {Event}
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {ByteArray} */
    this.data = data;
  }
}

class MetaEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {Array.<*>} data meta data.
   * @constructor
   * @extends {Event}
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {Array.<*>} */
    this.data = data;
  };
}

export {
  ChannelEvent,
  SystemExclusiveEvent,
  MetaEvent
};