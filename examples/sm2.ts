import sm2, { SM2Item } from '../src/sm2';

interface Card {
    question: string,
    answer: string,
    interval?: number,
    count?: number,
    efactor?: number,
};

function getCardsFromSomewhere(): Card[] {
    const cards: Card[] = [
        { question: 'a', answer: 'A' },
        { question: 'b', answer: 'B', interval: 1, count: 1, efactor: 2.5 },
        { question: 'c', answer: 'C', interval: 6, count: 2, efactor: 1.8 },
        { question: 'd', answer: 'D', interval: 8, count: 3, efactor: 1.3 },
        { question: 'e', answer: 'E', interval: 16, count: 4, efactor: 2.1 },
    ];

    return cards;
}

function getQualityFromUserResponse(card: Card): number {
    return Math.round(Math.random() * 5);
}

function updateCard(card: Card, item: SM2Item) {
    const { interval, count, efactor } = item;
    const cardUpdated: Card = { ...card, interval, count, efactor };

    console.log('card with new sm info', cardUpdated);
}

function main() {
    const cards = getCardsFromSomewhere();

    for (const card of cards) {
        const { interval, count, efactor } = card;
        const quality = getQualityFromUserResponse(card);
        const {item, needRepeat} = sm2({ interval, count, efactor, quality });
        updateCard(card, item);

        if(needRepeat) {
            console.log('Card need to remember again today until quality >= 4.', card);
        }
    }
}

main();