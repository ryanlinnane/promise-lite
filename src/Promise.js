
const state = {
  awaiting : 0,
  resolved: 1,
  rejected: 2
}
export default class Promise {
  constructor(cb) {
    this.callbacks = []
    this.state = state.awaiting
    this.resolvedTo = null
    this.rejectedTo = null
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this._next = this._next.bind(this)
    this.then = this.then.bind(this)
    cb(this.resolve, this.reject)
  }
  resolve(result) {
    this.state = state.resolved
    this.resolvedTo = result
    this._next(result)
  }
  reject(err) {
    this.state = state.rejected
    this.rejectedTo = err
    this._next(null, err)
  }
  _next(resolution = null, rejection = null) {

    //return a new promise...
    while(this.callbacks.length > 0) {
      const deferred = this.callbacks.shift()
      if(deferred) {
        const { didResolve, didReject } = deferred
        switch(this.state) {
          case state.resolved:
            let promise = didResolve(resolution) //may return a new promise explicitly per the user. or we wrap it in a promise
            //TODO: save our current resolution
            if(promise) {
              if(!(promise instanceof Promise)) {
                promise = new Promise((resolve) => resolve(promise))
              }
            }
            break;
          case state.rejected:
            didReject(rejection)
            break;
        }
      }
    }
    // return this
  }
  then(didResolve, didReject) {
    //only go forward with .then once we've finished up with the previous promise.
    //the callback inside of .thens can also be async.
    //if the returned callback has a promise.. we continue down the chain. and provide it as the resolution or rejection to the next then statement.
    if(this.state == state.resolved) {
      //immediately give back response.
      const resolvedTo = this.resolvedTo
      let promise = didResolve(resolvedTo)
      if(!(promise instanceof Promise)) {
        promise = new Promise((resolve) => resolve(promise))
      }
      return promise
    }
    else if(this.state == state.rejected) {
      const rejectedTo = this.rejectedTo
      return new Promise((resolve, reject) => {
        didReject(rejectedTo)
      })
    } //current promise is awaiting so we defer invocation of the .then callbacks/chains.
    else {
      const defer = {
        didResolve,
        didReject
      }
      this.callbacks = [ ...this.callbacks, defer ]
    }
    //return a new promise.
    //TODO: reject new promise of the next one in the chain, but make it dependent on the previous one. which is unresolved until the prior is called.
    //TODO: return new one so we chain here.
    return this
  }
}
