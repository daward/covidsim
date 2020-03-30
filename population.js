const Person = require("./person.js");
const _ = require("lodash");

class Population {
  constructor({
    populationSize,
    socialGroupSize,
    sickenedInteractionSize,
    normalInteractionSize,
    disease,
    hospitalAvailability,
    startingInfectedPopulation,
    testAvailability
  }) {
    // seed the population
    this.people = [];
    this.socialGroupSize = socialGroupSize;
    this.sickenedInteractionSize = sickenedInteractionSize;
    this.expectedInteractions = normalInteractionSize * 2;
    this.normalInteractionSize = normalInteractionSize;
    _.times(populationSize, n => this.people.push(new Person({ id: n, disease, population: this, testAvailability })));
    this.hospitalBeds = Math.ceil(populationSize * hospitalAvailability);
    this.patientsTurnedAway = 0;
    this.economicPain = 0;
    _.sampleSize(this.people, startingInfectedPopulation).forEach(p => p.getSick());
  }

  run() {
    this.people.forEach(p => p.startDay());
    this.people.forEach(p => p.interact());
    const interactionSize = _.meanBy(this.people, p => p.todaysInteractions.length);
    this.economicPain += (this.expectedInteractions - interactionSize);
    return {
      infected: this.people.filter(p => p.isInfected()).length,
      dead: this.people.filter(p => !p.isAlive()).length,
      interactionSize,
      recovered: this.people.filter(p => p.hasRecovered()).length,
      patientsTurnedAway: this.patientsTurnedAway,
      economicPain: this.economicPain
    }
  }

  admitToHospital() {
    if(this.hospitalBeds) {
      this.hospitalBeds--;
      return true;
    }
    this.patientsTurnedAway++;
    return false;
  }

  dischargeFromHospital() {
    this.hospitalBeds++;
  }
}

module.exports = Population;