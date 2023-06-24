# spaced-repetition.js

`spaced-repetition.js` is a JavaScript library for implementing the spaced repetition algorithm. Currently, it only supports the SM-2 algorithm.

## Installation

To install `spaced-repetition.js`, run:
```bash
npm install spaced-repetition.js
```

## Dependencies

`spaced-repetition.js` does not have any dependencies.

## Usage

Here is an example of how to use Spaced Repetition.js:
```javascript
import { sm2 } from 'spaced-repetition.js';

// Create a new SM2 item const item: 
// interval
const item = { 
    interval: 0,    //Integer, interval >=0
    count: 1,       //Integer, count >=1
    efactor: 2.5,   //Float, 1.3 <= efactor <= 2.5
    quality: 5      //Integer, [0,1,2,3,4,5]
};

// Calculate the next interval 
const result = sm2(item);

// Log the result 
console.log(result);
```

## Examples

For detailed examples, please see the `examples` directory.

## Features

Currently, Spaced Repetition.js only supports the SM-2 algorithm.

## Maintenance

We plan to maintain and update Spaced Repetition.js long-term. We may also add support for additional algorithms in the future. If you encounter any issues, please open a GitHub issue and we will do our best to address it as soon as possible.
