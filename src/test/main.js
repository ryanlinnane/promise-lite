import Promise from '../Promise'

const P = new Promise((resolve, reject) => {
  setTimeout(() => {
    Math.random() > .0 ? resolve('yay') : reject('nah')
  }, 1000)
}).then(function(resolve) {
  console.log('resolve callback ', resolve)
  //if we return here. it should go back into the promise chain. and it can be async here.
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     Math.random() > .5 ? resolve('yay2') : reject('nah2')
  //   }, 1000)
  // })
  return 5
}, function(reject) {
  console.log('reject callback ', reject)

}).then(function(resolve) {
  console.log('resolve callback ', resolve)
}, function(reject) {
  console.log('reject callback ', reject)
})
