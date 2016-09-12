
const state = {
  awaiting : 0,
  resolved: 1,
  rejected: 2
}
export default class Promise {
  constructor(cb) {
    this.callbacks = []
    this.state = state.awaiting
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this._next = this._next.bind(this)
    cb(this.resolve, this.reject)
  }
  resolve(result) {
    this.state = state.resolved
    this._next.call(this, result)
  }
  reject(err) {
    this.state = state.rejected
    this._next.call(this, null, err)
  }
  _next(resolution = null, rejection = null) {
    const deferred = this.callbacks.shift()
    if(deferred) {
      const { didResolve, didReject }= deferred
      switch(this.state) {
        case state.resolved:
          let promise = didResolve(resolution) //may return a new promise. if so can we inject our version of 'this'?
          if(promise) {
            if(!(promise instanceof Promise)) {
              promise = new Promise((resolve) => resolve(promise))
            }
            //add on remaining callbacks
            promise.callbacks = this.callbacks
          }
          break;
        case state.rejected:
          didReject(rejection)
          break;
      }
    }
  }
  then(didResolve, didReject) {
    //only go forward with .then once we've finished up with the previous promise.
    //the callback inside of .thens can also be async.
    //if the returned callback has a promise.. we continue down the chain. and provide it as the resolution or rejection to the next then statement.
    const defer = {
      didResolve,
      didReject
    }
    this.callbacks = [ ...this.callbacks, defer ]
    return this
  }
}
