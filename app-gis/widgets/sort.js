// NOTE : This probably shouldn't be in its own module
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
		.then(response => response.text())
		.then(data => { 			
			let lines = data.split("\n").map(line => line.split(/\s+/));
			let parsed = [];
			
			var current = null;
			
			// NOTE: for var... is faster than foreach
			for (var i = 0; i < lines.length; i++) {
				var l = lines[i];
				
				// TIME FRAME
				if (l.length == 1) {
					current = { time: l[0], messages : {} }
					
					parsed.push(current);
				}
				else {					
					let model = l[3].substring(1);
					let infected = l[5].split(",").splice(5, 20).reduce((a, b) => (+a) + (+b), 0);
					
					// A single message, add all properties you may want 
					// to put on the map here
					current.messages[model] = infected;
				}
			}			
			// Remove first item from array, seems like it's the initial state. I think we may
			// need to keep it but for now, it works.
			parsed.shift();
			
			resolve(parsed);
		});
	});
};
