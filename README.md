# Spaced Repetition.js

Spaced Repetition.js is a JavaScript library for implementing the spaced repetition algorithm. Currently, it only supports the SM-2 algorithm.

## Installation

To install Spaced Repetition.js, run:
```bash
npm install spaced-repetition
```

## Dependencies

Spaced Repetition.js does not have any dependencies.

## Usage

Here is an example of how to use Spaced Repetition.js:
```javascript
import { SM2, SM2Item } from 'spaced-repetition';

// Create a new SM2 item const item: 
SM2Item = { interval: 0, count: 1, efactor: 2.5, quantity: 0, };

// Calculate the next interval 
const result = SM2(item);

// Log the result 
console.log(result);
```

## Examples

For detailed examples, please see the `examples` directory.

## Features

Currently, Spaced Repetition.js only supports the SM-2 algorithm.

## Maintenance

We plan to maintain and update Spaced Repetition.js long-term. We may also add support for additional algorithms in the future. If you encounter any issues, please open a GitHub issue and we will do our best to address it as soon as possible.
