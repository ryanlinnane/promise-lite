import Promise from '../Promise'
const P = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 2000)
}).then(result => {  //this should append to the new promise.
    console.log('first top layer .then ', result)
    return result + 1
  //note that the final .then is called once the prior promise chain actually completes.
}).then(result => {
  console.log('second top layer .then ', result)
  //if we return a new promise here.... p will get set
  return new Promise((resolve, reject) => {
    resolve(result+1)
  })
}).then(result => {
  console.log('promise ', result)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('resolving third top layer ' + result)
      resolve(result+1)
    }, 1000)
  }).then().then(t => {
    console.log('inner promise ' + t)
    return t
  })
}).then(result => {
  console.log('final: ', result)
})
