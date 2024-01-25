export class Coroutine {
  constructor(generator) {
    this.generator = generator;
  }

  get value() {
    return this.current.value;
  }

  get done() {
    return this.current?.done;
  }

  advance(value) {
    if (this.done) {
      throw new Error('Cannot advance a coroutine that is done');
    }
    this.current = this.generator.next(value);
    return this;
  }

  return(value) {
    if (!this.done) {
      this.current = this.generator.return(value);
    } else {
      return this.current;
    }
  }

  throw(value) {
    if (!this.done) {
      this.current = { value: undefined, done: true };

      let caught = false;
      try {
        this.generator.throw(value);
      } catch (e) {
        caught = true;
      }
      if (!caught) {
        throw new Error('Generator attempted to yield a command after failing');
      }
    } else {
      throw value;
    }
  }

  finalize() {
    // ensures failures can be logged!
    if (!this.done) {
      this.return();
    }
  }
}

export default Coroutine;
