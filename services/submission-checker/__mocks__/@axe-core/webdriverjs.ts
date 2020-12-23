const mockResult = `{}`;

export default class AxeBuilder {
  constructor(driver) {}

  options(options) {
    return this;
  }
  async analyze() {
    return new Promise((resolve) => setImmediate(() => resolve(mockResult)));
  }
}
