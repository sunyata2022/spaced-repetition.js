import sm4, { SM4Item, SM4Result, getInterval } from '../src/sm4';

interface Card {
    question: string,
    answer: string,
    count?: number,
    efactor?: number,
};

function getCardsFromSomewhere(): Card[] {
    const cards: Card[] = [
        { question: 'a', answer: 'A' },
        { question: 'b', answer: 'B', count: 1, efactor: 2.5 },
        { question: 'c', answer: 'C', count: 2, efactor: 1.8 },
        { question: 'd', answer: 'D', count: 3, efactor: 1.3 },
        { question: 'e', answer: 'E', count: 4, efactor: 2.1 },
    ];

    return cards;
}

function getMatrixFromSomewhere() {
    const matrix = localStorage.getItem('matrix');

    if (matrix == null) return null;

    return JSON.parse(matrix);
}

function saveMatrixToSomewhere(matrix) {
    localStorage.setItem('matrix', JSON.stringify(matrix));
}

function getQualityFromUserResponse(card: Card): number {
    return Math.round(Math.random() * 5);
}

function updateCard(card: Card, item: SM4Item) {
    const { count, efactor, matrix } = item;
    const cardUpdated: Card = { 
        ...card, 
        interval: getInterval(item), 
        count, 
        efactor 
    };

    console.log('card with new sm info', cardUpdated);
}

function main() {
    const cards = getCardsFromSomewhere();
    const matrix = getMatrixFromSomewhere();

    for (const card of cards) {
        const { count, efactor } = card;
        const quality = getQualityFromUserResponse(card);
        const {item, needRepeat} = sm4({ count, efactor, quality, matrix });
        updateCard(card, item);

        saveMatrixToSomewhere(item.matrix);

        if(needRepeat) {
            console.log('Card need to remember again today until quality >= 4.', card);
        }
    }
}

main();