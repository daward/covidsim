const _ = require("lodash");

let people = [];
const networkSize = 10;
const infectionRate = 0.1;
const populationSize = 40000
const pandemicPeriod = 10;
const startingPopulation = 10;

for(let i = 0; i < populationSize; i++) {
  const person = {};
  person.id = i;
  person.infected = false;
  people.push(person);
}

let infected = _.sampleSize(people, startingPopulation);
infected.forEach(p => p.infected = true);

const runInfectionDay = () => {
  let infectors = people.slice(0, people.length);
  while(infectors.length) {
    let me = infectors.pop();
    let friends = _.sampleSize(infectors, networkSize);
    friends.forEach(friend => {
      if(friend.infected && Math.random() <= infectionRate) {
        me.infected = true;
      }

      if(me.infected && Math.random() <= infectionRate) {
        friend.infected = true;
      }
    });
  }
}

for(let days = 0; days < pandemicPeriod; days++) {  
  runInfectionDay();
  console.log(people.filter(p => p.infected).length);
}

