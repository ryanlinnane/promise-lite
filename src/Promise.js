
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
  _unwrap(promise, resolve) {
    if(promise instanceof Promise) {
      promise.then(result => {
        this._unwrap(result, resolve)
      })
      return
    }
    resolve(promise)
  }
  //open up all callbacks that were waiting on this given promise. (.thened on it)
  _next(resolution = null, rejection = null) {
    //return a new promise...
    while(this.callbacks.length > 0) {
      const deferred = this.callbacks.shift()
      if(deferred) {
        const { didResolve, didReject, reject, resolve } = deferred
        switch(this.state) {
          case state.resolved:
            let promise = didResolve(resolution) //TODO: unwrap potential promise promise being returned from cb.
            this._unwrap(promise, resolve)
            break;
          case state.rejected:
            reject(didReject(rejection))
            break;
        }
      }
    }
  }
  then(didResolve, didReject) {

    //if no resolution callback is provided, just return a new promise with the result state.
    if(!didResolve) {
      return new Promise((resolve, reject) => {

        if(this.state == state.resolved) {
          resolve(this.resolvedTo)
        }
        else if(this.state == state.rejected) {
          reject(this.rejectedTo)
        }
        else {
          const defer = {
            didResolve: (result) => result,
            didReject: (result) => result,
            resolve,
            reject
          }
          this.callbacks = [ ...this.callbacks, defer ]
        }
      })
    }


    //only go forward with .then once we've finished up with the previous promise.
    //the callback inside of .thens can also be async.
    //if the returned callback has a promise.. we continue down the chain. and provide it as the resolution or rejection to the next then statement.
    // console.log('about to handle ', didResolve, this.state, this.resolvedTo)
    return new Promise((resolve, reject) => {
      if(this.state == state.resolved) {
        let promise = didResolve(this.resolvedTo)
        this._unwrap(promise, resolve)
      }
      else if(this.state == state.rejected) {
        // console.log('rejecting')
        reject(didReject(this.rejectedTo)) //TODO: need?
      }
      else {
        //defer this wrapped promise.
        // console.log('deferring ', didResolve)
        const defer = {
          didResolve,
          didReject,
          resolve,
          reject
        }
        this.callbacks = [ ...this.callbacks, defer ]
      }
    })
  }
}
