const simulation = require("./simulation.js");

// the key characteristics that describe the disease's behavior
const disease = {
  // The number of days on average (there is randomness involved)
  // that an infected person will have no symptoms and carry on with their
  // normal level of social interaction.
  asymptomaticDays: 4,
  // The number of days that an infected person is exhibiting
  // symptoms. They will limit their social interactions, but will also
  // take up hospital resources while exhibiting these symptoms.
  symptomaticDays: 4,
  // The rate of people that will die (1%) when contracting the disease
  // regardless of level of care.
  deathRate: 0.01,
  // The chance a social interaction with an infected person will
  // cause the disease to spread to an uninfected person.
  infectiousness: 0.08,
  // The chance that a person who has recovered from the disease
  // can catch the disease again in another social interaction.
  // This will still include the infectiousness value, so
  // the resulting chance is very very small.
  reinfectionRate: 0.01,
  // The rate of infections that are considered severe cases. 
  // Those with a severe infection will need hospitalization if
  // possible. Without hospitalization, their chance of death
  // goes up remarkably.
  severeRate: 0.1,
  // The chacnce a person will die if not hospitalized when
  // hospitalization is needed.
  deathRateWithoutHospital: 0.3
};

// describes the key characteristics of the community being affected by the disease
const populationConfiguration = {
  // The number of people in the community
  populationSize: 100000,
  // The size of people's neighborhoods within that community. In a given area,
  // not everyone reasonably talks to everyone. During initialization, people's 
  // networks within this community will be generally 2x this number. They will
  // select a number of people at random, and they will be selected at random.
  // They will continue to interact with this same group throughout the
  // simulation.
  socialGroupSize: 50,
  // On a normal day, people will have 2x this number of social interactions.
  // These include people you talk to at the office, people you see on the street,
  // a cashier you buy something from, etc. During normal times, people will
  // engage in this many social interactions.
  normalInteractionSize: 20,
  // When people are aware they are sick, they will usually limit their
  // interactions, either because the symptoms (i.e. fever) prevent them
  // from living normally, or out of an abundance of caution. This number
  // represents the interactions these people may still make such as
  // family, doctors, etc.
  sickenedInteractionSize: 3,
  // The ratio of available hospital beds to the number of people in the 
  // community. Sadly, this small number accurately represents the number 
  // of hospital beds available in the USA - 300k for a population of 350M.
  hospitalAvailability: 0.0008,
  // The number of people who are sick at the beginning of the simulation.
  startingInfectedPopulation: 20
};

// Describes the actions the community can take to alter the 
// course of the infection.
const interventions = {
  // The percentage of the population that must be infected to cause a quarantine to take place.
  quarantineStart: 1,
  // The percentage of the population that must be infected to lift a quarantine.
  quarantineEnd: 0,
  // The rate the community tests people at. The availabilty of tests
  // represents the chance an asymptomatic person knows they are
  // infected and will, without community intervention, limit their
  // social interactions.
  testAvailability: 0,
}

simulation({
  disease,
  populationConfiguration,
  interventions,
  name: "Do Nothing"
})

simulation({
  disease: Object.assign(disease, { }),
  populationConfiguration,
  interventions: Object.assign(interventions, {
    testAvailability: 0.5 
  }),
  name: "Light Testing"
})

simulation({
  disease,
  populationConfiguration,
  interventions: Object.assign(interventions, {
    testAvailability: 0.9
  }),
  name: "Aggressive Testing"
})

simulation({
  disease,
  populationConfiguration,
  interventions: Object.assign(interventions, {
    quarantineStart: 0.25,
    quarantineEnd: .1
  }),
  name: "Light Quarantine"
})

simulation({
  disease,
  populationConfiguration,
  interventions: Object.assign(interventions, {
    quarantineStart: 0.1,
    quarantineEnd: .02
  }),
  name: "Aggressive Quarantine"
});

simulation({
  disease,
  populationConfiguration,
  interventions: Object.assign(interventions, {
    quarantineStartByFatality: 0.01,
    quarantineStopByEconomicPain: 500,
    testAvailability: 0.2
  }),
  name: "Reactive Intervention"
})
