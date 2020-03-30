const _ = require("lodash");

class Person {
  constructor({ id, disease, population, testAvailability }) {
    this.id = id;
    // seed all the people you might interact with, sortof like a neighborhood
    this.interactions = _.sampleSize(population.people, population.socialGroupSize);
    this.infection = {};
    this.disease = disease;
    this.population = population;
    this.testAvailability = testAvailability;
    this.todaysInteractions = [];
  }

  isInfected() {
    return this.infection.daysSick;
  }

  isAlive() {
    return !this.dead;
  }

  hasRecovered() {
    return this.recovered === true;
  }

  infect(friend) {
    const myRisk = this.hasRecovered() ? this.disease.infectiousness * this.disease.reinfectionRate : this.disease.infectiousness;
    const theirRisk = friend.hasRecovered() ? this.disease.infectiousness * this.disease.reinfectionRate : this.disease.infectiousness;
    // will this person get me sick?
    if (!this.isInfected() && friend.isInfected() && Math.random() <= myRisk) {
      this.getSick();
    }

    // will I get this person sick?
    if (this.isInfected() && !friend.isInfected() && Math.random() <= theirRisk) {
      friend.getSick();
    }

    // do I know this person? if not then I will add them for future interactions
    if (!this.interactions.filter(person => person.id === friend.id)) {
      this.interactions.push(friend);
    }

    this.todaysInteractions.push(friend);
  }

  awareOfSickness() {
    return this.isInfected() && (this.infection.daysSick > this.infection.asymptomaticDays || this.wasTested);
  }

  interact() {

    // if you're not alive, you wont be doing a lot of interacting now will you?
    if (!this.isAlive()) {
      return;
    }

    // if I'm aware of my sickess, I will make far fewer interactions
    const interactionSize = this.awareOfSickness() ?
      this.population.sickenedInteractionSize :
      this.population.normalInteractionSize;

    // but I may have already been a part of interactions initiated by others
    const neededInteractions = Math.max(0, interactionSize - this.todaysInteractions.length);
    const hasInteracted = friend => {
      return this.todaysInteractions.filter(person => person.id === friend.id).length !== 0;
    }

    // lets find who I am going to interact with today, omitting the people that 
    // have told me they are sick or that I've already interacted with today
    const friends = _.sampleSize(
      this.interactions.filter(friend =>
        !friend.awareOfSickness() &&
        !hasInteracted(friend) &&
        friend.isAlive()),
      neededInteractions);

    // now we know who I will talk to today, lets infect!
    friends.forEach(friend => friend.infect(this));
    this.todaysInteractions = this.todaysInteractions.concat(friends);
  }

  startDay() {
    if (this.isInfected()) {
      this.infection.daysSick++;

      // the disease has run its course, you can't get people sick any more
      // this would allow you to be re-infected, but that might be possible anyway
      if (this.sicknessOver() && !this.dead) {
        this.infection.daysSick = 0;

        // but did you surive?
        this.dead = this.infection.severity <= this.disease.deathRate;
        this.recovered = !this.dead;
        if (this.inHospital) {
          this.population.dischargeFromHospital();
          this.inHospital = false;
        }
      } else if (this.needsHopitalization()) {
        const admitted = this.population.admitToHospital();
        this.inHospital = admitted;
        // you were turned away from the hospital, you might die.
        if (!admitted && Math.random() < this.disease.deathRateWithoutHospital) {
          this.dead = true;
          this.infection.daysSick = 0;
          this.recovered = false;
        }
      }
    }

    this.todaysInteractions = [];
  }

  sicknessOver() {
    return this.infection.daysSick >= this.infection.asymptomaticDays + this.infection.symptomaticDays;
  }

  isSymptomatic() {
    return this.infection.daysSick > this.disease.asymptomaticDays &&
      this.infection.daysSick <= this.disease.asymptomaticDays + this.disease.symptomaticDays;
  }

  needsHopitalization() {
    return this.isSymptomatic() && this.infection.severity < this.disease.severeRate && !this.inHospital;
  }

  getSick() {
    const randDays = avg => Math.round(Math.random() * (avg / 2) + avg);
    this.infection.asymptomaticDays = randDays(this.disease.asymptomaticDays);
    this.infection.symptomaticDays = randDays(this.disease.symptomaticDays);
    this.infection.daysSick = 1;
    this.infection.severity = Math.random();
    this.wasTested = Math.random() < this.testAvailability;
  }
}

module.exports = Person;