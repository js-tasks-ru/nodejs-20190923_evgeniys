const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    if (this.data.length + chunk.length > this.limit) {
      callback(new LimitExceededError('Limit exceeded!'));
    }
    this.data = chunk;
    callback(null, this.data);
  }
}

module.exports = LimitSizeStream;
