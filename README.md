# Promise-lite
Basic JS Promise Implementation for funzzies
Open to suggestions for improvements.

## Npm Module

### Install
```
  $ npm install -S Promise
```

### ES6+
```javascript
  import Promise from 'Promise'
```
### ES5
```javascript
  var Promise = require('Promise').default
```




## About
### Supports 
.then chaining and async resolution/rejection.

returning of new promise chains in a .then, and forceful unwrapping to keep the chaining flat.

### TODO:
better rejection error handling


## Development

### Install
```
  $ git clone <project>
  $ npm install
  $ npm run dev //edit src folder
```
### Build
```
  $ npm run build
```

### Example

```javascript
  import Promise from 'Promise'

  const p = new Promise((resolve, reject) => {
      setTimeout(() => resolve(5), 1000)
  })
  .then((fulfilled) => {
    console.log('fulfilled', fulfilled)
    return "success"
  }, (rejected) => {
    console.log('rejected ', rejected)
  })
  .then((fulfilled) => {
    console.log('fulfilled 2 ', fulfilled)
  }, (rejected) => {
    console.log('rejected 2 ', rejected)
  })
```
