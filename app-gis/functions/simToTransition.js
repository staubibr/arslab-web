export const createTransitionFromSimulation = (data) => { 
    /*
    SimulationDEVS {cache, frames, index, listeners, models, name, selected, simulator, state, transitions, type}
    - SimulationDEVS.frames prints [FrameDEVS, FrameDEVS,..., FrameDEVS]
      - FrameDEVS prints {time: "x", transitions: Array(y)}
        - transitions: TransitionDEVS prints {model: "x", port: "y", value: z, diff: z}
    */
   let t = [];
   for (let i = 0; i < data.length; i++) {
     const element = data[i];
     for (let j = 0; j < element.transitions.length; j++) {
       const e = element.transitions[j];
       t.push({time: element.time, model: e.model, port: e.port, value: e.value})
     }
   }
   return t;
}