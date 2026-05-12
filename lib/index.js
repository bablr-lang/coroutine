export class Coroutine {
  constructor(generator) {
    if (!generator.next) throw new Error();

    this.generator = generator;
  }

  get value() {
    return this.current?.value;
  }

  get done() {
    return this.current?.done;
  }

  advance(value) {
    this.current = this.generator.next(value);
    return this;
  }

  return(value) {
    if (!this.done) {
      this.current = this.generator.return?.(value);
    }
    return this;
  }

  throw(value) {
    if (!this.done) {
      this.current = this.generator.throw?.(value) || { value: undefined, done: true };
      return this;
    } else {
      throw value;
    }
  }
}

export default Coroutine;
