## Literature Review Research (DRAFT)

#### General

###### Cellular automation

[Simulating spatial dynamics: cellular automata theory, 1994](https://www.sciencedirect.com/science/article/abs/pii/0169204694900655)

Author says at the end that much more work needs to be done but recent research has been promising (nearly 26 years ago)

Grid-based GIS system specified within the CA framework. Simulation of vole population dynamics. "cellular automata models implemented on computers may serve as a framework for modelling complex natural phenomena
in a way that is conceptually clearer, more accurate, and more complete than conventional
mathematical systems."

Generalized CA in GIS:
- Space need not be infinite (spatial units can be can take many shapes)
- Neighbourhood does not need to be defined the same way for each local component 
  - Neighbourhood also doesn't need to be composed of adjacent spatial units 
- Transition functions can be implemented using existing GIS operators 
  - Transition function: Defines change in state of the cellular automation from its current state to next time step
  - GIS operators (or map algebra): Boolean, arithmetic, spatial proximity, etc.
- Grid based GISs are discrete which limits the number of states a cell can have, though this capability can be added
- 3 classes of neighbors in GIS
  - Cell-based GIS are defined by the cell and its immediate neighbours 
- Downside: Complex, sensitivity to initial state, requires aid of a computer
- Upside: "They do not predict changes in the real world, but have considerable validity and utility in learning about the real world."

Conclusion: The model outcome was not a test of vole population dynamics but to show the principles of CA in being able to explain complex behaviour recursively across space and time. "Cellular automata theory, because of its close
relationship to existing GIS methods and its great potential for modelling complex spatial dynamics, presents a great challenge and opportunity for the environmental planning community."

[SIMPLIFYING GIS DATA USE INSIDE DISCRETE EVENT SIMULATION MODEL THROUGH M:N-AC CELLULAR AUTOMATON](https://www.researchgate.net/publication/266402801_SIMPLIFYING_GIS_DATA_USE_INSIDE_DISCRETE_EVENT_SIMULATION_MODEL_THROUGH_MN-AC_CELLULAR_AUTOMATON)

GIS data in a simulation model can be simplified using a generalized CA structure. 

#### Agriculture 

[GIS BASED DISCRETE EVENT MODELING AND SIMULATION OF BIOMASS SUPPLY CHAIN, 2015 Winter Sim](http://simulation.su/uploads/files/default/2015-sahoo-mani.pdf)

Develop biomass supply chain modelling framework (in a discrete event simulation platform called ExtendSIM) coupled with GIS for evaluating spatio-temporal variability of Miscanthus grass yield (good source of fibre for animals) and total cost of delivery to a biorefinery. ArcGIS was used to find suitable available lands for specific crop cultivation and estimate biomass availability. Multi-criteria inclusion & exclusion model was developed to find possible plants and storage locations. See Figure 2 for workflow. 

Simulation modelling approach: Modules representing specific tasks or operations and decisions for the supply chain. 

Key modules: Information management & decision (IM&D), biomass establishment and management, harvesting and collection, transport, and storage.

Model inputs / details: 
- Time frame: 10yrs (life cycle of the energy crop)
- Iterations: 20
- Plant (factory?) running time, downtime, logistical operation (time of day and # of days), harvesting window (4 months)
- Plant storage capacity 
- Annual biomass yield

Conclusion: The model estimated the total cost of delivering biomass to the plant. The findings were that biomass yield does not have a large impact on delivery cost. Future research will incorporate new variables (energy use, soil and water quality, greenhouse gas emissions, etc.). 

#### Hydrology & Ecology

[Integrating Dynamic Spatial Models with Discrete Event Simulation](https://www.simulationaustralasia.com/files/upload/pdf/research/019-2000.pdf)

**Don't think this paper will be of much use.**

Paper models hydrological surface water run-off. Uses map algebra to construct spatial simulation models. 

Dynamic spatial modelling: 
- Address computational aspects of space-time process modelling
  - Commonly for Earth and biological studies such as, hydrology and ecology
- Drawbacks
  - Not flexible
  - No support for cellular automata 

GIS lacks the capability to perform dynamic modelling. The paper describes a prototype for a spatial modelling component that may be incorporated in GIS and computer simulation software. 

Geographical phenomena can be conceptualised from two perspective:
1. Continuously varying field
2. Set of discretely bounded objects

#### Natural Disasters 

[Design and implementation of an integrated GIS-based cellular automata model to characterize forest fire behaviour](http://www.dpi.inpe.br/gilberto/cursos/papers/Yassemi2008.pdf)

Integration of GIS and CA techniques to develop a fire behaviour model that simulates realistic forest fire scenarios. The final tool can be adapted to other CA-based spatio-temporal modelling applications. The models performance was compared to *Prometheus*, a national Canadian fire modelling tool. Simply put, their program reads a GIS raster layer(s), runs the CA, and outputs a text file that is then converted to a raster image to be visualized in a GIS. 

"CA models have been used to understand a variety of spatial phenomena including plant competition, epidemic propagation and vaccination, habitat fragmentation, pedestrian traffic flow in fire evacuation, plant invasion and dispersal, spatial dynamics of urban and regional systems, forest insect propagation, and forest fire propagation."

Modelling benefits:
- Insight into the past
- Define the present or predict the future state of natural phenomena 
- CA utilize local rules and can model complex phenomena 
  - Inherently spatial 
  - Structure compatible with geospatial datasets 
  - Can use irregular shapes

Model challenges:
- Temporal changes of environmental processes and static nature of GIS 
- Traditional environmental models don't incorporate spatial information 

Model parameters:
- Topography
- Forest fuel / ignition 
- Weather 
- Start / end times, and iteration length
- Layers

Model output:
- Dynamic fire perimeter seen in GIS



#### Disaster Planning:

[Agent-based discrete-event simulation model for no-notice natural disaster evacuation planning](https://www.sciencedirect.com/science/article/abs/pii/S0360835219300269)

GIS-based ABDES modelling framework to provide insight into traffic assignment and configuring resources for evacuation vehicles and relief facilities. The proposed evacuation simulation model works for both categories of disaster. 

Disasters are two categories (FEMA might have more information on this):
- Depends on lead time or preparation time prior to occurrence of disaster 
1. Short notice 
2. No notice 
     - Should be prepared for way ahead of time

Literature then begins going into cellular automata, DEVS, ABDES and existing evacuation simulation models. Recent years have seen more attempts at integrating simulation models with GIS as decision support tools. See Figure 3 for more. 

Model parameters: 
- Initial number of evacuees / households or the location of staging areas ()
- Traffic network
- Condition of facilities such as non-functional shelters 
- Decision rules for evacuation 
- Evacuee priority 


[Agent-based Discrete Event Simulation Modeling for Disaster Responses, 2008](http://www.cnp.pitt.edu/certificate/papers/agentpaper.pdf)

U of Pittsburgh developed a decision support system to simulate large-scale disaster responses. The framework integrates an agent-based simulation (ABS) model, GIS, databases, rule base systems for responders (Figure 3) and modules. The GIS can feed data to the simulator to make results more realistic to a specific area, especially for routing first responders. ABS is used so responders can make changes inside and outside of the simulator depending on GIS data. Operates in real time. 

Input parameters to control event (from interface): 
- Type of event
- Size of event
- Time of event 

#### Discrete Event Simulation (DES):

https://www.sciencedirect.com/science/article/pii/S1110982317300352

https://www.researchgate.net/publication/222013315_Calibration_of_the_SLEUTH_urban_growth_model_for_Lisbon_and_Porto_Portugal

http://www-personal.umich.edu/~danbrown/papers/jgs_proof.pdf

http://www.unice.fr/coquillard/pdf/Muzy%20et%20al%202008.pdf

https://core.ac.uk/download/pdf/62919299.pdf

Prof. Wainer:
- https://journals.sagepub.com/doi/10.1177/0037549706073698 

A PowerPoint:
-http://www.inf.ed.ac.uk/teaching/courses/cmgcr/lectures/CA-ABM-Ecosys.pdf
