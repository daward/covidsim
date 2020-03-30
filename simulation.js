
const Population = require("./population.js");
const pandemicPeriod = 100;

module.exports = ({ disease, populationConfiguration, interventions, name }) => {

  
  const population = new Population({
    ...Object.assign({}, populationConfiguration),
    disease,
    testAvailability: interventions.testAvailability
  });

  console.log(`------ ${name} -----`)
  for (let days = 0; days < pandemicPeriod; days++) {
    const stats = population.run();

    if(stats.infected / population.people.length > interventions.quarantineStart) {
      population.normalInteractionSize = interventions.sickenedInteractionSize;
    }

    if(stats.infected / population.people.length < interventions.quarantineEnd) {
      population.normalInteractionSize = populationConfiguration.normalInteractionSize;
    }
    console.log(`${stats.infected}, ${stats.dead}, ${stats.interactionSize}, ${stats.recovered}, ${stats.patientsTurnedAway}`);
    if(stats.infected === 0) {
      // save ourselves some time if the outbreak is over
      break;
    }
  }
};
