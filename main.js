// local variables and reset
let numMatch = 0;
let numFlipped = 0;
localStorage.clear();


let imageList = [
  'https://media.giphy.com/media/SKGo6OYe24EBG/giphy.gif',
  'https://media.giphy.com/media/vB5jiVv1Tr2tW/giphy.gif',
  'https://media.giphy.com/media/IzVwOO8xZsfks/giphy.gif',
  'https://media.giphy.com/media/5Ams0SJhK7Vq8/giphy.gif',
  'https://media.giphy.com/media/UvOcKPHrkKSLm/giphy.gif',
  'https://media.giphy.com/media/D7z8JfNANqahW/giphy.gif',
  'https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif',
  'https://media.giphy.com/media/3oriNZoNvn73MZaFYk/giphy.gif',
  'https://media.giphy.com/media/nrXif9YExO9EI/giphy.gif',
  'https://media.giphy.com/media/lvzdeWk12qjmM/giphy.gif',
  'https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif',
  'https://media.giphy.com/media/4no7ul3pa571e/giphy.gif'
]


document.addEventListener('DOMContentLoaded', () => {
  console.log('page loaded');

  startBtn.addEventListener('click', (e) => {
    // reset for subsequent rounds
    cardList.innerHTML = "";
    numMatch = 0;
    numFlipped = 0;

    startGame();
    gameArea.scrollIntoView();
  });
});

// matching game needs 24 cards, 12 pairs of card images
function startGame() {
  let list = [...Array(imageList.length).keys()];
  list = list.concat(list);
  shuffleList(list);

  // first half
  for (let i = 0; i < list.length / 2; i++) {
    let card = createCard(list[i]);
    cardList.appendChild(card);
  }

  // add score keeper
  let score = document.createElement('div');
  score.setAttribute('id', 'score');
  score.value = 0;
  score.innerHTML = `${score.value}`;
  cardList.appendChild(score);

  // second half
  for (let i = list.length / 2; i < list.length; i++) {
    let card = createCard(list[i]);
    cardList.appendChild(card);
  }
}

function createCard(indexInShuffledList) {
  let card = document.createElement('div');
  card.setAttribute('class', 'card');
  // card.setAttribute('class', 'flipped');
  card.dataset['value'] = indexInShuffledList;

  let image = imageList[indexInShuffledList];

  // for debug
  // card.innerHTML = `${indexInShuffledList}<img src=${image} class='img'>`;

  card.innerHTML = `<img src=${image} class='img'>`;

  card.addEventListener('click', flip);
  return card;
}

function flip(e) {
  // console.log(e, e.target, this);

  // validity checks
  if (numFlipped === 2) {
    console.log('already clicked 2 cards, wait for match');
    return;
  }
  // check if parent (card) is already done
  if (e.target.parentNode.classList.contains('done')) {
    console.log('clicked an already matched card, input ignored');
    return;
  }
  // check if same card
  if (e.target === this.querySelector('.img')) {
    console.log('clicked same card, input ignored');
    return;
  }

  numFlipped++;
  if (numFlipped < 2) {
    this.classList.toggle('flipped');
    score.innerHTML = `${++score.value}`;
  }
  else {//2 different cards clicked
    score.innerHTML = `${++score.value}`;
    this.classList.toggle('flipped');
    checkIfMatch();
  }
}

function checkIfMatch() {
  let flippedCards = document.querySelectorAll('.flipped');
  flippedCards = [...flippedCards];
  
  if (flippedCards[0].dataset['value'] === flippedCards[1].dataset['value']) {
    console.log('match found');
    numMatch++;

    console.log("cards matched:", numMatch);
    if (numMatch === imageList.length) {
      console.log('all matches found, game complete');

      let lscore = +localStorage['score'] || Infinity;
      if (score.value < lscore) localStorage['score'] = score.value;
      bestScore.innerHTML = `best score: ${localStorage['score']}`;
    }

    flippedCards.forEach((el) => {
      el.classList.remove('flipped');
      el.classList.add('done');
      numFlipped = 0;
    });

  }
  else {
    console.log('not a match');

    // timeout currently necessary for animation
    setTimeout(() => {
      flippedCards.forEach((el) => el.classList.remove('flipped'));
      numFlipped = 0;
    }, 1000);
  }
}

// utility functions:
// from shuffle/sample at: https://underscorejs.org/docs/underscore.html
function random(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}
function shuffleList(arr) {
  let last = arr.length - 1;
  for (let index = 0; index < arr.length; index++) {
    let rand = random(index, last);
    [arr[index], arr[rand]] = [arr[rand], arr[index]];
  }
}
