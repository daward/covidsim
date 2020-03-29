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
    startingInfectedPopulation
  }) {
    // seed the population
    this.people = [];
    this.socialGroupSize = socialGroupSize;
    this.sickenedInteractionSize = sickenedInteractionSize;
    this.normalInteractionSize = normalInteractionSize;
    _.times(populationSize, n => this.people.push(new Person({ id: n, disease, population: this })));
    _.sampleSize(this.people, startingInfectedPopulation).forEach(p => p.getSick());
    this.hospitalBeds = Math.ceil(populationSize * hospitalAvailability);
    this.patientsTurnedAway = 0;
  }

  run() {
    this.people.forEach(p => p.startDay());
    this.people.forEach(p => p.interact());
    return {
      infected: this.people.filter(p => p.isInfected()).length,
      dead: this.people.filter(p => !p.isAlive()).length,
      interactionSize: _.meanBy(this.people, p => p.todaysInteractions.length),
      recovered: this.people.filter(p => p.hasRecovered()).length,
      patientsTurnedAway: this.patientsTurnedAway
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