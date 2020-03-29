
const Population = require("./population.js");
const pandemicPeriod = 50;

const disease = {
  asymptomaticDays: 4,
  symptomaticDays: 4,
  deathRate: 0.01,
  infectiousness: 0.03,
  reinfectionMultiple: 6,
  testAvailability: 0.9,
  severeRate: 0.1,
  deathRateWithoutHospital: 0.3
};

const population = new Population({
  populationSize: 100000,
  socialGroupSize: 50,
  sickenedInteractionSize: 3,
  normalInteractionSize: 20,
  disease,
  hospitalAvailability: 0.0008,
  startingInfectedPopulation: 10
});

for (let days = 0; days < pandemicPeriod; days++) {
  const stats = population.run();
  // if(stats.infected > population.people.length / 10) {
  //   population.normalInteractionSize = 2;
  // }

  // if(stats.infected < population.people.length / 25) {
  //   population.normalInteractionSize = 20;
  // }
  console.log(`${stats.infected}, ${stats.dead}, ${stats.interactionSize}, ${stats.recovered}, ${stats.patientsTurnedAway}`);
}

