import { SMFactory, SMType } from '../src/';

interface Card {
  question: string;
  answer: string;
  smdata?: string;
}

function getCardsFromSomewhere(): Card[] {
  const cards: Card[] = [
    { question: 'a', answer: 'A' },
    { question: 'b', answer: 'B' },
    { question: 'c', answer: 'C' },
    { question: 'd', answer: 'D' },
    { question: 'e', answer: 'E' },
  ];

  return cards;
}

function getMatrixFromSomewhere(): string | null {
  return localStorage.getItem('matrix');
}

function saveMatrixToSomewhere(matrix: string | undefined | null) {
  if (matrix != null) {
    localStorage.setItem('matrix', matrix);
  }
}

function getQualityFromUserResponse(card: Card): number {
  return [0,1,2,3,4,5].sort(() => Math.random() > 0.5 ? -1 : 1)[0];
}

function updateCard(card: Card, smdata: string) {
  const cardUpdated: Card = {
    ...card,
    smdata,
  };

  console.log('card with new sm info', cardUpdated);
}

// Algorithm SM-2
function SM2Example (){
  const cards = getCardsFromSomewhere();

  const sm2 = SMFactory.getSuperMemo(SMType.SM2);

  for (const card of cards) {
    const { smdata } = card;
    const quality = getQualityFromUserResponse(card);
    const result = sm2?.evaluate(quality, smdata);
    updateCard(card, result!.smdata);

    saveMatrixToSomewhere(sm2?.getMatrix());

    if (result?.repeat) {
      console.log(
        'Card need to remember again today until quality >= 4.',
        card,
      );
    }
  }
}

// Algorithm SM-4
function SM4Example (){
  const cards = getCardsFromSomewhere();
  const matrix = getMatrixFromSomewhere();

  const sm4 = SMFactory.getSuperMemo(SMType.SM4, matrix);

  for (const card of cards) {
    const { smdata } = card;
    const quality = getQualityFromUserResponse(card);
    const result = sm4?.evaluate(quality, smdata);
    updateCard(card, result!.smdata);

    saveMatrixToSomewhere(sm4?.getMatrix());

    if (result?.repeat) {
      console.log(
        'Card need to remember again today until quality >= 4.',
        card,
      );
    }
  }
}

// Algorithm SM-5
function SM5Example (){
  const cards = getCardsFromSomewhere();
  const matrix = getMatrixFromSomewhere();

  const sm5 = SMFactory.getSuperMemo(SMType.SM5, matrix);

  for (const card of cards) {
    const { smdata } = card;
    const quality = getQualityFromUserResponse(card);
    const result = sm5?.evaluate(quality, smdata);
    updateCard(card, result!.smdata);

    saveMatrixToSomewhere(sm5?.getMatrix());

    if (result?.repeat) {
      console.log(
        'Card need to remember again today until quality >= 4.',
        card,
      );
    }
  }
}
