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
    }
    if (l.length == 6) {
        let model = l[3].substring(1);
        let infected = l[5]
        .split(",")
        .splice(5, 20)
        .reduce((a, b) => +a + +b, 0);
        // A single message, add all properties you may want
        // to put on the map here
        current.messages[model] = infected;
    }
    }
    // Remove first item from array since it's the initial state. 
    parsed.shift()
    return parsed;

}