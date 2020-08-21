export const sortPandemicData = (data) => { 
    let lines = data.map((line) => line.split(/\s+/));
    let parsed = [];
    let current = null;

    // <initial population - fatalities, number susceptible, number infected, number recovered, number new infected, number new recovered, number fatalities>

    for (var i = 0; i < lines.length; i++) {
    var l = lines[i];

        // TIME FRAME
        if (l.length == 1 && l != "") {
            current = { time: l[0], messages: {} };
            parsed.push(current);
        }
        else {
            let model = l[3].substring(1);
            let results = l[5].split(",")
            let pop = results[0].substring(1)
            let s = results[1]
            let i = results[2]
            let r = results[3]
            let ni = results[4]
            let nr = results[5]
            let f = results[6].replace(">", "")
            // A single message, add all properties you may want
            // to put on the map here
            current.messages[model] = {
                Population: pop, 
                Susceptible: s, 
                Infected: i,
                Recovered: r, 
                newInfected: ni, 
                newRecovered: nr, 
                Fatalities: f
            };
        }
    }
    parsed.shift()
    return parsed;

}