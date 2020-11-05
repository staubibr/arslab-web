import SimulationDEVS from "../../api-web-devs/simulation/simulationDEVS.js";
import Model from "../../api-web-devs/simulation/model.js";
import FrameDEVS from "../../api-web-devs/simulation/frameDEVS.js";
import TransitionDEVS from "../../api-web-devs/simulation/transitionDEVS.js";
import Port from "../../api-web-devs/simulation/port.js";

export const createSimulationObject = (features, ports, data) => { 
    ports = ports.map(p => new Port(p, "output"))

    var models = features.map((f) => {
      return new Model(f.getProperties().dauid, "atomic", null, ports);
    });

    var simulation = new SimulationDEVS("hoya", "custom", "Cell-DEVS", models);

    for (var i = 0; i < data.length; i++) {
      
      var frame = new FrameDEVS(data[i].time);

      simulation.AddFrame(frame);

      for (var id in data[i].messages) {
        ports.forEach(p => {
          var transition = new TransitionDEVS(id, p.name, data[i].messages[id][p.name]);
          frame.AddTransition(transition);
        })
        
      }
    }
    simulation.Initialize(10);

    return simulation
}