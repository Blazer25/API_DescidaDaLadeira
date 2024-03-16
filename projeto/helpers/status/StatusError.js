class StatusError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

module.exports = StatusError;
