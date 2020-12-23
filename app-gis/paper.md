## Literature Review Research (DRAFT)

Find examples based on GIS Simulations (cell-DEVS, DEVS, cellular automata)

Find literature (summarize into sub topics)

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

 

http://www.dpi.inpe.br/gilberto/cursos/papers/Yassemi2008.pdf

http://www-personal.umich.edu/~danbrown/papers/jgs_proof.pdf

http://www.unice.fr/coquillard/pdf/Muzy%20et%20al%202008.pdf

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



https://core.ac.uk/download/pdf/62919299.pdf

Prof. Wainer:
- https://journals.sagepub.com/doi/10.1177/0037549706073698 

A PowerPoint:
-http://www.inf.ed.ac.uk/teaching/courses/cmgcr/lectures/CA-ABM-Ecosys.pdf

## Background (Draft)

Large scale geospatial simulations, at the municipal, provincial or higher levels, typically generate massive volumes of data. Presenting these data in a comprehensive, intuitive way for non-expert users requires adequate visual support. In the case of geospatial data, web-based geographic information systems (GIS) have become well established platforms to do so. For example, modern Open Source Web GIS libraries, such as OpenLayers, provide developers with the necessary tools to load and display data into dynamic map-based web applications. OpenLayers is well-established, entirely free, easy to customize, and supports vector data rendering. There also existing other web-mapping libraries such as D3JS (limited mapping capability) which can be incorporated to support further data visualization. The DEVS-GIS Simulation Explorer we developed relies on OpenLayers, and the OpenStreetMap database to contextualize simulation results. The DEVS-GIS Simulation Explorer offers a unique opportunity for interdisciplinary studies and remote collaboration. As a case study, we use the results of the [disease spread simulation model](https://github.com/omarkawach/Geography-Based-Model), for the City of Ottawa at the Dissemination Area (DA) level and for the province of Ontario at the Census Subdivision (CSD) level. The application allows users to build choropleth maps that display the boundary polygons classified by color according to different variables produced by the simulation (infected, susceptible, deaths, recovered, etc.) Users can also animate the map to visualize each time step of the simulation and interact with individual geometries to explore the detailed results of the simulation. By analyzing the output seen in the DEVS-GIS Simulation Explorer, users may recognize high risk geographical regions which may be susceptible to outbreaks or further disease spreading.

###### Related Work?
https://geodacenter.github.io/covid/map.html
https://geodacenter.github.io/covid/index.html

###### Might be useful somewhere? 
- [Use of GIS Mapping as a Public Health Tool—From Cholera to Cancer](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4089751/)

##### Map-Based Decision Making and Visualization 

As data visualization becomes more commonplace, complex content must be made easily digestible for experts and non-experts in an effort to support decision making ([Talk about uncertainty in maps for decision making?](https://www.frontiersin.org/articles/10.3389/fcomp.2020.00032/full)). Concerning the field of geography, geospatial information can be presented on paper maps, digital static maps, and digital interactive maps. Recent mapping services appear to favour the digital interactivity route as clients increasingly become treated as map users, not map readers. Something about why users, not readers blah blah interdisciplinary ([cartography](https://www.tandfonline.com/doi/full/10.1080/23729333.2017.1288534))

- Resources:
  - Good writer https://www.researchgate.net/profile/Olga_Buchel
  - https://dl.acm.org/doi/abs/10.1145/3206505.3206516
  - https://dl.acm.org/doi/10.1145/1998076.1998169
  - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7177515/

##### Symbology and Semiotics

- Symbology is the study / use of symbols
- Semiotics is the study of symbols as a means of communication

From 1967, French cartographer Jacques Bertin brought forth impactful theories (describe here?). Til this day the same theories are applied to the science, art, and technology involved in cartography. As maps are a form of communication, maps must be easily understood non-verbally through quick observation since geospatial data can be rather complex. When making maps and / or manipulating maps, the use of visual variables is imperative. Bertin had developed various visual variables, such as position, size, value, color, orientation, and texture ([Morita, 2013](https://www.tandfonline.com/doi/full/10.1179/000870411X13038059668604?needAccess=true)). 

What does each variable tell us?..




- Reference symbology guru Jacques Bertin (1967 / 1970)
  - Relate to simulation and how we can use it with simulation results 
  - Ex. The more cases we have at a hospital, the larger the circle becomes
  - Resources:
    - https://gistbok.ucgis.org/bok-topics/symbolization-and-visual-variables#:~:text=Jacques%20Bertin%20(1967%2F2010),quantitative%20characteristics%20into%20each%20symbol

Maybe also mention Joel Morrison and Alan MacEachren? (https://www.axismaps.com/guide/visual-variables and https://www.researchgate.net/publication/317266613_Visual_Variables)

##### GIS

What is it? What can it do?

What can GIS reveal in data? 

  - Tools available
    - Thematic mapping
  - Why have they become so useful now?
  - Their use cases

##### Evolution of GIS and GIS Web Applications

As any experienced geographer today would know, spatio-temporal analysis involves the inquiry into the relationship between space and time. In 1854, epidemiologist Dr. John Snow was the first to exemplify this phenomena by creating a spatial risk model that listed incidences of cholera outbreak ([Caplan, et al., 2020](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7105112/#:~:text=John%20Snow%20was%20an%20epidemiologist,the%20cholera%20outbreak%20in%201854.https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7105112/#:~:text=John%20Snow%20was%20an%20epidemiologist,the%20cholera%20outbreak%20in%201854.)). As the 19th century lagged in advanced qualitative methods that many now take for granted, this is what would be known as the dark ages of Geographic Information Systems (GIS) ([All Answers Ltd., 2018](https://ukdiss.com/examples/geographic-information-system.php) & [Ali, 2020](https://www.researchgate.net/publication/340182760_Geographic_Information_System_GIS_Definition_Development_Applications_Components)). Only a near hundred years later did GIS come out of the dark ages when Rogers Tomlinson, the father of GIS, computerized the way field experts work with and analyze spatial data ([ESRI, n.d.](https://esripress.esri.com/storage/esripress/images/188/115391_webgis_chapter01.pdf)). Shortly afterwards, American Geographer Waldo Tobler conceived what would be hailed as Tobler's first law of geography (TFL). The creation of TFL emphasized the influence of location where near things are more related than distant things ([Foresman, Luscombe, 2016](https://www.tandfonline.com/doi/abs/10.1080/17538947.2016.1275830)) Even with all the advances that were taking place in the field of GIS, many of the applications used were standalone until 1993 when Xerox developed the first Web-based map viewer. Having GIS on the web opened many doors to mass sharing of information on a global-scale, new user experiences, cross-platform compatibility, and other geospatial services ([ESRI, n.d.](https://esripress.esri.com/storage/esripress/images/188/115391_webgis_chapter01.pdf)). The appeal to use Web-based GIS applications does not only apply to Geographers. In many forms of interdisciplinary research, the diverse field of Geography proves most useful. Through use of GIS, researchers can utilize web GIS platforms and software to better analyze, conceptualize, and interpret information. Regardless of the discipline research is being conducted in, [Regardless of the discipline in which research is conducted] if the research data contains spatial components then GIS will be there as a major facilitator in some form ([Rickles, et al., 2017](https://rgs-ibg.onlinelibrary.wiley.com/doi/full/10.1002/geo2.46)). 

### If the content below isn't useful, maybe find a use for it elsewhere?

##### The COVID-19 Pandemic and the Move to Remote Work

The COVID-19 pandemic has negatively affected the lives of billions around the globe. As such, the ongoing tensions caused by the pandemic has also revealed how unprepared governments are for a global pandemic of this scale ([Timmis, and Brussow, 2020](https://sfamjournals.onlinelibrary.wiley.com/doi/10.1111/1462-2920.15029)). Matters are made worse by the fact that large, and even small-scale problems are difficult for humans to conceptualize and prepare for. This is especially true when we consider global issues like global warming ([Resnik et al., 2016](https://onlinelibrary.wiley.com/doi/full/10.1111/cogs.12388)). For example, even with all the warnings emphasized by Canada's pandemic preparedness report ([Federal Government of Canada, 2006](https://www.longwoods.com/articles/images/Canada_Pandemic_Influenza.pdf)), medical supplies (e.g. PPE) were limited and health systems were not adequately suited to handle spikes in hospital admissions ([Eggertson, 2020](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7145370/)). Canada's early response in the first wave of lockdowns had travel and social interactions restricted, and testing / tracing capacity increased. Such an approach may not have been enough to reduce the number of new cases as time went on since policies are constantly evolving. So, to further combat the waves of community-acquired transmission, decision makers need to look towards various forms oƒf intervention, such as case detection, isolation, contact tracing, quarantining, and physical distancing **(fix this later)**. Through imposing restrictive measures, transmission across Canada had reduced, so long as controls were not eased ([Ng, et al., 2020](https://www.cmaj.ca/content/192/37/E1053)). The restrictive measures set forth by policy makers has left the workforce in an entirely new landscape. Employers were forced to quickly adapt to have employees work from home (WFH), serve as essential, or simply be laid-off ([Kniffin et al., 2020](https://doi.apa.org/fulltext/2020-58612-001.html)). One might hypothesize, based on rising trends ([Felstead & Henseke, 2017](https://onlinelibrary.wiley.com/doi/full/10.1111/ntwe.12097)), many jobs in the digital sphere were already heading towards optionally remote or completely remote before the catalytic event that is the COVID-19 pandemic. [Felstead and Henseke (2017) stated that many jobs in the digital sphere were already heading towards optionally remote or completely remote (cite). This is even more evident now that COVID-19 has drastically reduced the number of people working in an office setting.]
The new normal of working from home may allow employers to focus more on merits and qualifications of their candidates rather than whether they live in a certain city. The geographical hurdles once faced by a company's growth and operations, or a person's career choices may become a thing of the past since employers can focus on offering flexible working arrangements ([McCausland, 2020](https://www.tandfonline.com/doi/full/10.1080/08956308.2020.1813506)). The current confinement / restrictions set in place for businesses and academic institutions have left many scrambling for effective communicative and collaborative tools ([Brynes et al., 2020](https://onlinelibrary.wiley.com/doi/full/10.1002/ca.23649)). Later in the paper, the GIS Simulation Explorer will be touched on as a remotely accessible collaborative tool for practitioners, and other decision makers.

##### GIS Web Applications for Reducing COVID-19 Spread Through Remote Collaboration 

Since the inception of TFL, researchers in the GIS community have employed such a concept to describe spatial dependence ([Leitner et al., 2018](https://www.researchgate.net/publication/323419139_Laws_of_Geography)). In the field of epidemiology, one could apply TFL to synthetically simulate the spread of infectious diseases in a geographical environment based on spatial weighting ([Zhong et al., 2009](https://www.researchgate.net/profile/Song_Dunjiang/publication/226204125_Simulation_of_the_spread_of_infectious_diseases_in_a_geographical_environment/links/00b495316b307a20ab000000/Simulation-of-the-spread-of-infectious-diseases-in-a-geographical-environment.pdf)). Such an application can play a vital role in disease prevention and control when coupled with modern spatio-temporal analysis techniques ([Watkins et al., 2007](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1805744/)). When supplementing existing research on virus spread models, geographical tracking and mapping of pandemic data through the application of GIS has been proven to be a powerful system for disease monitoring and planning ([Buolos & Geraghty, 2020](https://ij-healthgeographics.biomedcentral.com/articles/10.1186/s12942-020-00202-8)). Such a system allows researchers to present large volumes of data in an intuitive way. For one, web-based mapping has created an environment for accessible remote collaboration between decision makers ([Franch-Pardo et al., 2020](https://www.sciencedirect.com/science/article/pii/S0048969720335531)). By integrating simulation models into map-based web applications, researchers can also highlight spatio-temporal trends in various scenarios. Highlighting spatio-temporal trends would mean that researcher can observe the spatial distribution of COVID-19 cases to drive better policy decisions ([Shariati, et al., 2020](https://link.springer.com/article/10.1007/s40201-020-00565-x)).


