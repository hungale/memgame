document.addEventListener('DOMContentLoaded', () => {
  console.log('page loaded');

  startBtn.addEventListener('click', (e) =>{
    console.log('clicked', e.target);
    gameArea.scrollIntoView();
  });
  
  generateCards();
});

// matching game needs 24 cards, 12 pairs of card images
function generateCards(){
  let list = [...Array(13).keys()].slice(1);
  list = list.concat(list);
  shuffleList(list);

  for(let i = 0; i < list.length/2; i++){
    let card = createCard(list, i);
    cardList.appendChild(card);
  }
  let score = document.createElement('div');
    score.setAttribute('class', 'card');
    score.setAttribute('id', 'score');
    score.value = 0;
    score.innerHTML = `score: ${score.value}`;
    cardList.appendChild(score);
    for(let i = list.length/2; i < list.length; i++){
      let card = createCard(list, i);
      cardList.appendChild(card);
    }
}

function createCard(list, i){
  let card = document.createElement('div');
    card.setAttribute('class', 'card');
    card.dataset['value'] = list[i];

    card.innerHTML = `${list[i]}
    <img src='https://www.adobe.com/content/dam/acom/target/emea/emeastk0001/657x388_pod2.jpg' class='img'>`;
    
    card.addEventListener('click', match);
    return card;
}

function match(e){
    console.log(e, e.target, this);
    let card = this;
    let backs = document.querySelectorAll('.back');
    if(!backs.length){
      card.classList.toggle('back');
      score.innerHTML = `score: ${++score.value}`;
    }
    else{
      if(e.target === card.querySelector('.img'))
        console.log('clicked same card, input ignored');
      else{
        score.innerHTML = `score: ${++score.value}`;
        card.classList.toggle('back');
        isMatch();
      }
    }
    
}

function isMatch(){
  backs = document.querySelectorAll('.back');
    if(backs.length > 1){
      backs = [...backs];
      backs.forEach((el) => console.log(el.dataset));
      if(backs[0].dataset['value'] === backs[1].dataset['value']){
        console.log('true');
        setTimeout( ()=>{
          backs.forEach((el) => {
            el.classList.toggle('back');
            el.classList.toggle('done');
            el
          });
        }, 1000);
       
      }
      else{
        console.log('false');
        setTimeout( ()=>{
          backs.forEach((el) => el.classList.toggle('back'));
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
function shuffleList(arr){
  let last = arr.length - 1;
  for(let index = 0; index < arr.length; index++){
    let rand = random(index, last);
    [arr[index], arr[rand]] = [arr[rand], arr[index]];
  } 
}
