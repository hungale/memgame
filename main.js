// local variables and reset
let numMatch = 0;
let numFlipped = 0;
localStorage.clear();


let imageList = [
  // 'https://learn.g2.com/hs-fs/hubfs/plan%20gif%20marketing%20strategy.gif?width=500&name=plan%20gif%20marketing%20strategy.gif',
  'https://media.giphy.com/media/SKGo6OYe24EBG/giphy.gif',
  'https://media.giphy.com/media/vB5jiVv1Tr2tW/giphy.gif',
  // 'https://media.giphy.com/media/IzVwOO8xZsfks/giphy.gif',  
  // 'https://media.giphy.com/media/5Ams0SJhK7Vq8/giphy.gif',
  // 'https://media.giphy.com/media/UvOcKPHrkKSLm/giphy.gif',
  // 'https://media.giphy.com/media/D7z8JfNANqahW/giphy.gif',
  // 'https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif',
  // 'https://media.giphy.com/media/3oriNZoNvn73MZaFYk/giphy.gif',
  // 'https://media.giphy.com/media/nrXif9YExO9EI/giphy.gif',
  // 'https://media.giphy.com/media/lvzdeWk12qjmM/giphy.gif',
  // 'https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif',
  // 'https://media.giphy.com/media/4no7ul3pa571e/giphy.gif'
]


document.addEventListener('DOMContentLoaded', () => {
  console.log('page loaded');

  startBtn.addEventListener('click', (e) => {
    // console.log('clicked', e.target);
    gameArea.scrollIntoView();

    cardList.innerHTML = "";
    numMatch = 0;

    startGame();
  });
});

// matching game needs 24 cards, 12 pairs of card images
function startGame() {
  let list = [...Array(imageList.length).keys()];
  list = list.concat(list);
  shuffleList(list);

  for (let i = 0; i < list.length / 2; i++) {
    let card = createCard(list, i);
    cardList.appendChild(card);
  }

  let score = document.createElement('div');
  // score.setAttribute('class', 'card');
  score.setAttribute('id', 'score');
  score.value = 0;
  score.innerHTML = `${score.value}`;
  cardList.appendChild(score);

  for (let i = list.length / 2; i < list.length; i++) {
    let card = createCard(list, i);
    cardList.appendChild(card);
  }
}

function createCard(list, i) {
  let card = document.createElement('div');
  card.setAttribute('class', 'card');
  // card.setAttribute('class', 'flipped');
  card.dataset['value'] = list[i];


  let image = imageList[list[i]];

  // for debug
  card.innerHTML = `${list[i]}<img src=${image} class='img'>`;
  // card.innerHTML = `<img src=${image} class='img'>`;

  card.addEventListener('click', flip);
  return card;
}

function flip(e) {
  // console.log(e, e.target, this);
  if(numFlipped === 2){
    console.log('already clicked 2 cards, wait for match');
    return;
  }

  numFlipped++;
  if(numFlipped < 2){
    this.classList.toggle('flipped');
    score.innerHTML = `${++score.value}`;
  }
  else {
    if (e.target === this.querySelector('.img'))
      console.log('clicked same card, input ignored');
    else { //2 different cards clicked
      score.innerHTML = `${++score.value}`;
      this.classList.toggle('flipped');
      checkIfMatch();
    }
  }

}

function checkIfMatch() {
  backs = document.querySelectorAll('.flipped');
  if (backs.length > 1) {
    backs = [...backs];
    
    // debug
    // backs.forEach((el) => console.log(el.dataset));
    if (backs[0].dataset['value'] === backs[1].dataset['value']) {
      console.log('match found');
      numMatch++;
      
      
      console.log("numMatch:", numMatch);
      if(numMatch === imageList.length){
        console.log('all matches found, game complete');

        let lscore = +localStorage['score'] || Infinity;
        if(score.value < lscore) localStorage['score'] = score.value;
        bestScore.innerHTML = `best score: ${localStorage['score']}`;
      }
      setTimeout(() => {
        backs.forEach((el) => {
          el.classList.remove('flipped');
          el.classList.add('done');
          numFlipped = 0;
        });
      }, 0);
    }
    else {
      console.log('not a match');
      setTimeout(() => {
        backs.forEach((el) => el.classList.remove('flipped'));
        numFlipped = 0;
      }, 1000);
    }
  }
}

// from shuffle/sample at: https://underscorejs.org/docs/underscore.html
// and https://stackoverflow.com/a/46161940
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
