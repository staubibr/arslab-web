export const sort = () => {
  /* 
    State for model pandemic_hoya_Country1 is <1,0,16,16,0.7,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0>
    // Infected: index 5 to 20 
    The numbers have the following meaning:
    First number (1): population density
    Next number (0): The phase of the lockdown
    Next number (16): Number of infected states
    Next number (16): Number of recovered states
    Next Number(0.7): The susceptible population
    Next 16 numbers: The portion of the population in each stage of infection (the sum of which is the infected population)
    Next 16 numbers: The portion of the population in each stage of recovery (there's no really "recovered" population- 
    if someone is in a recovery phase thy cant infected, but after the last stage of recovery they can get infected again)
    */
  return new Promise(function (resolve, reject) {
    fetch("./data/pandemic_hoya_state.txt")
      .then((response) => response.text())
      .then((data) => {
        let x = [];
        let text = data.split("\n").map((line) => line.split(/\s+/));
        text.forEach((d) => {
          // Dont need cycle yet
          if (d.length == 6) {
            var obj = {};
            let y = d[5].split(",");
            let infectPop = y.splice(5, 20);
            let sumInfected = infectPop.reduce(function (a, b) {
              return a + b;
            }, 0);
            obj[d[3].substring(1)] = [parseFloat(sumInfected)];
            x.push(obj);
          }
        });
        // Group by ID next
        var merged = x.reduce((accum, obj) => {
          for (var key in obj) {
            accum[key] = accum[key] ? [...accum[key], obj[key]] : obj[key];
          }
          return accum;
        }, {});
        resolve(merged);
      });
  });
};
