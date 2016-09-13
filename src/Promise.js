
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
  //open up all callbacks that were waiting on this given promise. (.thened on it)
  _next(resolution = null, rejection = null) {
    //return a new promise...
    while(this.callbacks.length > 0) {
      const deferred = this.callbacks.shift()
      if(deferred) {
        const { didResolve, didReject, reject, resolve } = deferred
        switch(this.state) {
          case state.resolved:
            let promise = resolve(didResolve(resolution)) //TODO: unwrap potential promise promise being returned
            //may return a new promise explicitly per the user. or we wrap it in a promise
            //just call off the .then
            //once this one completes. it calls off it's childen
            //create new promise in then.
            //the return of this inner promise
            //TODO: save our current resolution
            if(promise) {
              // if(!(promise instanceof Promise)) {
              //   promise = new Promise((resolve) => resolve(promise))
              // }
            }
            break;
          case state.rejected:
            reject(didReject(rejection))
            break;
        }
      }
    }
  }
  then(didResolve, didReject) {
    //only go forward with .then once we've finished up with the previous promise.
    //the callback inside of .thens can also be async.
    //if the returned callback has a promise.. we continue down the chain. and provide it as the resolution or rejection to the next then statement.
    console.log('about to handle ', didResolve, this.state, this.resolvedTo)
    return new Promise((resolve, reject) => {
      if(this.state == state.resolved) {
        resolve(didResolve(this.resolvedTo)) //TODO: unwrap didResolve if it returns a promise, before resolving it.
      }
      else if(this.state == state.rejected) {
        console.log('rejecting')
        reject(didReject(this.rejectedTo)) //TODO: need?
      }
      else {
        //defer this wrapped promise.
        console.log('deferring ', didResolve)
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
