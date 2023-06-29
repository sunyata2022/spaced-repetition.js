# spaced-repetition.js

[中文版](README.zh.md)

This project is a simple implementation of the spaced repetition algorithm. We have currently implemented the SM-2, SM-4, and SM-5 algorithms.

## Table of Contents

- [Introduction](#Introduction)
- [Installation](#Installation)
- [Usage](#Usage)
- [Contribution](#Contribution)
- [License](#License)

## Introduction
Spaced repetition is a memory enhancement technique created by Piotr Woźniak in the 1980s, with the aim of improving memory effectiveness and efficiency. As the name suggests, the core of spaced repetition is finding the optimal review interval for knowledge points. The algorithm calculates the optimal review interval based on the learning status of knowledge points. This algorithm has gone through many iterations.

Currently, we have only implemented SM-2, SM-4, and SM-5 according to the official documentation.

### SM-2

SM-2 is the first version of the spaced repetition algorithm. It uses the number of repetitions, learning effectiveness, and a factor called "efactor" to calculate the review interval. The algorithm is simple and widely used, with well-known products such as Anki and Mnemosyne using it.

The drawback of SM-2 is that it cannot utilize past learning data to optimize the review interval.

### SM-4

SM-4 introduces a matrix (OIMatrix) to solve the problem of SM-2 not being able to utilize learning data to optimize the review interval. According to the author, this algorithm converges too slowly, and even after several months, the matrix does not change much.

It was replaced by SM-5 after 7 months.

### SM-5

SM-5 no longer uses OIMatrix, but instead uses OFMatrix, and achieves the desired effect as expected by the author.

## Installation

To install spaced-repetition.js, simply execute the following command:

```bash
npm install spaced-repetition.js
```

## Usage

In the earlier version (1.0.x), there were too many data exported that users did not need to care about. Therefore, in version 1.1.x, we made some optimizations and integrated all these data together. Users only need to store them after calling the algorithm and pass them back when using the algorithm. This also leads to two ways of using the SM-2 algorithm.

The algorithm only cares about the number of repetitions (count), memory quality (quality), efactor, and the matrix data in SM-4 and SM-5. The algorithm calculates and uses these data by itself, and users only need to store and pass them.

### Usage of SM-2 in version 1.0.x

```ts
// Usage in 1.0.x, still applicable in 1.1.x and later.
import sm2, { SM2Item } from 'spaced-repetition.js';

// Get a flashcard containing the knowledge point to be memorized.
const card = getCardFromSomeWhere();

// Obtain the corresponding SM-2 algorithm data for the flashcard: repetition count, efactor, interval.
// Can be empty for the first use.
const { count, efactor, interval } = getSM2ItemByCard(card);

// After displaying the flashcard, the user (or the system automatically) evaluates the memory for this session, with a score of 0, 1, 2, 3, 4, or 5.
const quality = getQualityFromUserResponse(card);

// Construct the SM2Item, where quality cannot be empty.
// The other three fields can be empty, indicating a new knowledge point with no SM-2 related data.
const item: SM2Item = { count, efactor, interval, quality };

// Pass the item to the sm2 function to calculate the result.
const result: SM2Result = sm2(item);

// The result contains the needRepeat and item fields.
const { needRepeat, item } = result;
const { count, efactor, interval } = item;

// Calculate the next review date using the interval.
const nextRepetitionDate = dayjs().add(interval, 'day');
// Store the relevant data from the item to the location associated with the flashcard for future use.
saveSM2DataByCard(card, count, efactor, interval, nextRepetitionDate);

// If needRepeat is true, it means that the flashcard's memory is not strong enough and needs to be reviewed again until it becomes false.
// This means repeating the above process for this flashcard.
if (needRepeat) {
    scheduleAgain(card);
}

// Next flashcard
...
```

### Usage in 1.1.x

In version 1.1.x, the relevant data has been consolidated into a single string field (smdata). The matrix data needs to be stored separately. It is important to note that the algorithm data from different versions are not compatible and cannot be mixed.

```ts
// The following is an example usage of the SM-4 algorithm.
// To use other algorithms, simply change the SMType when calling SMFactory.getSuperMemo.

import { SMFactory, SMType } from 'spaced-repetition.js';

// Get the flashcards.
const cards = getCardsFromSomewhere();

// Get the matrix data. If it's the first time using it, it can be empty, and the algorithm will automatically initialize the data. 
// This line of code is not necessary if using the SM-2 algorithm.
const matrix = getMatrixFromSomewhere();

// Get the corresponding algorithm. You can initialize the SM-2 and SM-5 algorithms using SMType.SM2 and SMType.SM5, respectively.
// Note: The SM-2 algorithm does not require the matrix parameter.
const sm4 = SMFactory.getSuperMemo(SMType.SM4, matrix);

for (const card of cards) {
    // Get the card's corresponding data.
    const smdata = getSMDataByCard(card);

    // Get the quality of memory for the card.
    const quality = getQualityFromUserResponse(card);

    // Calculate the next interval.
    const result: SMResult = sm4?.evaluate(quality, smdata);

    // Update the card's relevant data.
    updateCard(card, result!.interval, result!.smdata);

    // After studying a flashcard, the matrix data will change. It is recommended to save it promptly.
    saveMatrixToSomewhere(sm4?.getMatrix());

    // If the card's learning is unsuccessful, it needs to be repeated.
    if (result?.repeat) {
        scheduleAgain(card);
    }
}

```

## Contribution

…

## License

MIT License