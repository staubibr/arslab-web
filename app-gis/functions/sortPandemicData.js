// Pandemic Data Format
// < (initial population - fatalities), number susceptible, number infected, number recovered, number new infected, number new recovered, number fatalities >

export const sortPandemicData = (data) => {
  let lines = data.map((line) => line.split(/\s+/));
  let parsed = [];
  let current = null;

  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];

    // TIME FRAME
    if (l.length == 1 && l != "") {
      current = { time: l[0], messages: {} };
      parsed.push(current);
    } else {
      let model = l[3].substring(1),
        results = l[5].split(","),
        pop = results[0].substring(1),
        s = results[1],
        i = results[2],
        r = results[3],
        ni = results[4],
        nr = results[5],
        f = results[6].replace(">", "");
      // A single message, add all properties you may want
      // to put on the map here
      current.messages[model] = {
        Population: pop,
        Susceptible: s,
        Infected: i,
        Recovered: r,
        newInfected: ni,
        newRecovered: nr,
        Fatalities: f,
      };
    }
  }
  parsed.shift();
  return parsed;
};
