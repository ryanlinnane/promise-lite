// import Promise from '../Promise'
//
// const P = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     Math.random() > .0 ? resolve('yay') : reject('nah')
//   }, 1000)
// }).then(function(resolve) {
//   console.log('resolve callback ', resolve)
//   //if we return here. it should go back into the promise chain. and it can be async here.
//   // return new Promise((resolve, reject) => {
//   //   setTimeout(() => {
//   //     Math.random() > .5 ? resolve('yay2') : reject('nah2')
//   //   }, 1000)
//   // })
//   return 5
// }, function(reject) {
//   console.log('reject callback ', reject)
//
// }).then(function(resolve) {
//   console.log('resolve callback ', resolve)
// }, function(reject) {
//   console.log('reject callback ', reject)
// })
//
//


import Promise from '../Promise';

const P = new Promise((res, rej) => {
    res(123);
});
let testsPassed = 0;
const P2 = P.then((value) => {
    console.log('P resolved.  Value is ' + value);
    testsPassed += (value === 123);
});
const P3 = P.then((value) => {
    console.log('P resolved.  Value is ' + value);
    testsPassed += (value === 123);
    return 5
}).then((value2) => {
  console.log('running after p3', value2)
  return 7
}).then((value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('fin executing async')
      resolve(1000)
    }, 1000)
    console.log('start executing async')
  })
});

P3.then((last) => {
  console.log('last ', last)
})
setTimeout(() => {
    const total = 2;
    console.log(`${testsPassed} / ${total} tests passed.`);
}, 4000);
