/**
 * @classdesc Riff Parser class
 * @author    imaya
 * @license   MIT
 */
export default class Riff {
  /**
   * @param {Uint8Array} input input buffer.
   * @param {object} optParams option parameters.
   */
  constructor(input, optParams = {}) {
    /** @type {Uint8Array} */
    this.input = input;
    /** @type {number} */
    this.ip = optParams.index || 0;
    /** @type {number} */
    this.length = optParams.length || input.length - this.ip;
    /** @type {RiffChunk[]} */
    this.chunkList = [];
    /** @type {number} */
    this.offset = this.ip;
    /** @type {boolean} */
    this.padding = optParams.padding ? optParams.padding : true;
    /** @type {boolean} */
    this.bigEndian = optParams.bigEndian ? optParams.bigEndian : false;
  }

  /**
   */
  parse() {
    /** @type {number} */
    const length = this.length + this.offset;

    this.chunkList = [];

    while (this.ip < length) {
      this.parseChunk();
    }
  }

  /**
   */
  parseChunk() {
    /** @type {Uint8Array} */
    const input = this.input;
    /** @type {number} */
    let ip = this.ip;
    /** @type {number} */
    let size;

    // Check if we have enough bytes to read the chunk header (4 bytes type + 4 bytes size)
    if (ip + 8 > input.length) {
      console.warn(
        `Riff parser: not enough data for chunk header at offset ${ip}`
      );
      this.ip = input.length; // Move to end to stop parsing
      return;
    }

    const chunkType = String.fromCharCode(
      input[ip++],
      input[ip++],
      input[ip++],
      input[ip++]
    );

    size = this.bigEndian
      ? ((input[ip++] << 24) |
          (input[ip++] << 16) |
          (input[ip++] << 8) |
          input[ip++]) >>>
        0
      : (input[ip++] |
          (input[ip++] << 8) |
          (input[ip++] << 16) |
          (input[ip++] << 24)) >>>
        0;

    // Check if chunk data fits within the buffer
    if (ip + size > input.length) {
      console.warn(
        `Riff parser: chunk "${chunkType}" size ${size} exceeds buffer length at offset ${ip}, file may be corrupted. Stopping chunk parsing.`
      );
      // Don't add this corrupted chunk to the list
      this.ip = input.length; // Move to end to stop parsing
      return;
    }

    this.chunkList.push(new RiffChunk(chunkType, size, ip));

    ip += size;

    // padding
    if (this.padding && ((ip - this.offset) & 1) === 1) {
      ip++;
    }

    this.ip = ip;
  }

  /**
   * @param {number} index chunk index.
   * @return {RiffChunk | null}
   */
  getChunk(index) {
    /** @type {RiffChunk} */
    const chunk = this.chunkList[index];
    return chunk !== undefined ? chunk : null;
  }

  /**
   * @return {number}
   */
  getNumberOfChunks() {
    return this.chunkList.length;
  }
}

/**
 * Riff Chunk Structure
 * @interface
 */
class RiffChunk {
  /**
   * @param {string} type
   * @param {number} size
   * @param {number} offset
   */
  constructor(type, size, offset) {
    /** @type {string} */
    this.type = type;
    /** @type {number} */
    this.size = size;
    /** @type {number} */
    this.offset = offset;
  }
}
