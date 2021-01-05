## Literature Review Research (DRAFT)

#### Simulation / Visualization / GIS

The literature may help find the need for user-defined models instead of using existing third parties who draw their own conclusion.

Look into spatial analysis to build models (relationship)

See [Olga Buchel](https://www.researchgate.net/profile/Olga_Buchel) for lots of visualization literature 

[Interactive Visualizations as “Decision Support Tools” in Developing Nations: The Case of Vector-Borne Diseases](https://www.researchgate.net/publication/279446552_Interactive_Visualizations_as_Decision_Support_Tools_in_Developing_Nations_The_Case_of_Vector-Borne_Diseases_In_Transforming_Public_Health_in_Developing_Nations_eds_SheikhM_Mahamoud_A_Househ_M_Hershey)

"This chapter is meant to draw attention to interactive visualization tools that allow stakeholders to control the flow of
information, manipulate visual representations, and perform analytical tasks"

"Geographical information systems (GIS) and geovisualization tools are geographic support tools. GIS are
information systems which keep track of events, activities, other phenomena, and where they all happen
or exist"

"GIS tools with limited actions (e.g., having only zooming and panning) are not well suited for making informed decisions in a spatial context. These limitations have led researchers to recognize the need for tools that support the use of interactive and dynamically alterable thematic maps which can facilitate “visual thinking” about spatially referenced data"


[Integrating GIS, simulation models, and visualization in traffic impact analysis](https://www.sciencedirect.com/science/article/pii/S0198971504000031)

Focus is on GIS, simulation models, and computer visualization to support planning and decision making processes. 

"It is quite difficult to pass attributes stored in a GIS database into visualization software. Although technologies have provided a solid foundation for such integration, none of the off-the-shelf commercial software alone has sufficient functions across all three areas. Moreover, such software is often prohibitively expensive and requires significant training time."

GIS
- Process spatially referenced data 
- Spatial analysis 
- Display data and modelling results through maps and tables

Simulation models
- Provide information necessary for analysis, evaluation, and planning alternatives 

Visualization (can be 2D and / or 3D)
- Present large amount of data
- Identify patterns or problems with data
- Facilitate the understanding of data
- Can be achieved independent of geographic data

Integration
- GIS provides functions to allow users to examine spatial relationships
- Simulation modelling can represent the dynamic relationships between cause and effect
- Visualization can reveal patterns and relationships that are hard to detect using non-visual approaches (text, tables, etc.)
1. Integration of GIS and simulation modelling 
   - Realistic representation of spatial data
   - Can use loose coupling through exchanging data files which requires human intervention 
   - Deep coupling links GIS and simulation models with a common user interface (which appears as one system but is actually two separate)
2. Simulation modelling and visualization 
   - Can represent dynamics within a realistic virtual environment  

[A GIS-based urban simulation model for environmental health analysis](https://www.sciencedirect.com/science/article/abs/pii/S1364815214000917)

Good description of simulations: 

"Simulations are essential concepts for our understanding of reality but are not to be confused with reality itself. Rather they provide a simplified, tangible environment which implements models (e.g. mathematical, statistical or computer models) to explore the behaviour and its consequences of a real-world process or system under a specific set of input conditions (Banks, 1999, Peck, 2008). Every simulation makes, thereby, assumptions and generalisations about processes, interactions and feedbacks in the reality they describe. The legitimacy of these simplifications resonates in the interpretations of the outcome of studies run within the simulation environment. Is the result obtained an inherent feature of the reality or is it due to the simplifying assumptions?"

Simulations used for
- Environmental health studies and assessments 
- Informing policy and planning strategies 
- Analysing complex phenomena 

[A Tightly Coupled GIS and Spatiotemporal Modeling for Methane Emission Simulation in the Underground Coal Mine System](https://www.mdpi.com/2076-3417/9/9/1931/htm)

Use of LrGIS (a professional coal mine GIS platform) suitable for GIS-numerical model integration. Probably not useful.

[Introductory Chapter: Spatial Analysis, Modelling, and Planning](https://www.intechopen.com/books/spatial-analysis-modelling-and-planning/introductory-chapter-spatial-analysis-modelling-and-planning)

[Modeling and Simulation in Geographic Information Science: Integrated Models and Grand Challenges](https://core.ac.uk/download/pdf/82319633.pdf)

"However, as policy has begun to respond to much bigger ‘grand’ challenges such as climate change, urbanization, aging, migration, security, energy and so on, there is now a need for coupling together larger-scale models to form integrated assessments of such impacts across a range of spatial and temporal scales"

[Dynamic simulation and visualisation of coastal erosion](https://www.sciencedirect.com/science/article/pii/S0198971505000591)

Also includes GIS. 


#### DEVS / CELL-DEVS / CA / GIS

###### Cellular automation

[Simulating spatial dynamics: cellular automata theory, 1994](https://www.sciencedirect.com/science/article/abs/pii/0169204694900655)

Author says at the end that much more work needs to be done but recent research has been promising (nearly 26 years ago)

Grid-based GIS system specified within the CA framework. Simulation of vole population dynamics. "cellular automata models implemented on computers may serve as a framework for modelling complex natural phenomena in a way that is conceptually clearer, more accurate, and more complete than conventional mathematical systems."

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

[Spatial process and data models: Toward integration of agent-based models and GIS](http://www-personal.umich.edu/~danbrown/papers/jgs_proof.pdf)

The focus here is on middleware that links existing GIS and ABM development platforms (to manage connections between agents and spatial features). All examples use raster-based GIS. 

Topics mentioned:
- Spatial data models (2)
  - Field view (rasters)
    - Represents space as continuously varying distribution of geographic variables
  - Object view (vectors)
    - Discrete entities (location, and attributes) represented as spatial features (i.e. points, lines, or polygons)
  - Sometimes both can coexist to represent phenomena 
  - Object-oriented data models
    - Hierarchy (mainstream in GIS)
      - Ex. Geodatabases in ArcGIS
- Spatial process models (3)
  - Change
    - "The Eulerian view describes the processes that influence properties (e.g., temperature) at fixed locations, and thus is a description of change"
  - Movement
    -  "The Lagrangian perspective, on the other hand, tracks the changing location of particles through space and, therefore, is a description of movement"
  -  Change and movement models interact differently with spatial data models 
  -  GIS-based change models
     -  E.g. land use change
  -  GIS-based movement models
     -  E.g. hydrological flow
  -  Agent-based models and object-based movement 
     -  The rich temporal representations (agents and processes) of ABMs complement spatial data representations (fields, objection and functions) of GIS
- Relationships affecting process-data coupling (4)
  - Developing models that use both ABM and GIS requires implementation of relationships between agent-level process and spatial data
    - Relationships 
      - Identity
      - Casual
      - Temporal 
      - Topological 
- Software implementation (5)
  - Coupling (GIS-centric, ABM-centric, loose and tight)
  - No existing implementation of an AMB embedded completely within a GIS environment 
- Examples (6)
  - Urban land-use change
  - Military mobile communications 
  - Integrated dynamic landscape analysis and modelling system (IDLAMS)
  - Infrastructure simulation
  - Future middleware development 

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

[Modelling and simulation of fire spreading through the activity tracking paradigm](http://www.unice.fr/coquillard/pdf/Muzy%20et%20al%202008.pdf)

#### Natural Disasters 

[Design and implementation of an integrated GIS-based cellular automata model to characterize forest fire behaviour](http://www.dpi.inpe.br/gilberto/cursos/papers/Yassemi2008.pdf)

Integration of GIS and CA techniques to develop a fire behaviour model that simulates realistic forest fire scenarios. The final tool can be adapted to other CA-based spatio-temporal modelling applications. The models performance was compared to *Prometheus*, a national Canadian fire modelling tool. Simply put, their program reads a GIS raster layer(s), runs the CA, and outputs a text file that is then converted to a raster image to be visualized in a GIS. 

"CA models have been used to understand a variety of spatial phenomena including plant competition, epidemic propagation and vaccination, habitat fragmentation, pedestrian traffic flow in fire evacuation, plant invasion and dispersal, spatial dynamics of urban and regional systems, forest insect propagation, and forest fire propagation."

Modelling benefits:
- Insight into the past
- Define the present or predict the future state of natural phenomena 
- CA utilize local rules and can model complex phenomena 
  - Inherently spatial 
  - Structure compatible with geospatial datasets Integrating
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

#### Urban Studies:

This section probably isn't useful unless you want to discuss applications of models based on CA?

[Application of geo-spatial techniques and cellular automata for modelling urban growth of a heterogeneous urban fringe](https://www.sciencedirect.com/science/article/pii/S1110982317300352)

Outcome of study: Utility of GIS, remote sensing, and cellular automation based modelling for urban growth assessment / prediction. 

Urban growth is assessed using CA based SLEUTH model

SLEUTH model composed of:
1. Clarke urban growth model
2. Land cover Deltatron model

[Calibration of the SLEUTH urban growth model for Lisbon and Porto, Portugal](https://www.researchgate.net/publication/222013315_Calibration_of_the_SLEUTH_urban_growth_model_for_Lisbon_and_Porto_Portugal)

#### Other: 

[A survey of modelling and simulation software frameworks using Discrete Event System Specification](https://core.ac.uk/download/pdf/62919299.pdf)

"DEVS has been used in many application domains and this paper will present a technical survey of the major DEVS implementations and software frameworks."



Prof. Wainer:
- [Applying Cell-DEVS Methodology for Modeling the Environment](https://journals.sagepub.com/doi/10.1177/0037549706073698)

A PowerPoint:
- http://www.inf.ed.ac.uk/teaching/courses/cmgcr/lectures/CA-ABM-Ecosys.pdf

Came across spacetime cubes. Doubt they'll be helpful but pretty cool:
- [Visualizing the Space Time Cube](https://desktop.arcgis.com/en/arcmap/10.3/tools/space-time-pattern-mining-toolbox/visualizing-cube-data.htm#:~:text=The%20Create%20Space%20Time%20Cube,the%20time%2Dstep%20interval%20specified.)
- [How To: Create a space time cube from a CSV file in ArcGIS Pro](https://support.esri.com/en/technical-article/000017460#:~:text=Creating%20a%20space%20time%20cube,time%20cube%20on%20the%20map)
- [GIS and Big Data Visualization](https://www.intechopen.com/books/geographic-information-systems-and-science/gis-and-big-data-visualization)