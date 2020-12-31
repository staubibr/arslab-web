## Background (Draft)

Large scale geospatial simulations, at the municipal, provincial or higher levels, typically generate massive volumes of data. Presenting these data in a comprehensive, intuitive way for non-expert users requires adequate visual support. In the case of geospatial data, web-based geographic information systems (GIS) have become well established platforms to do so. For example, modern Open Source Web GIS libraries, such as OpenLayers, provide developers with the necessary tools to load and display data into dynamic map-based web applications. OpenLayers is well-established, entirely free, easy to customize, and supports vector data rendering. There also existing other web-mapping libraries such as D3JS (limited mapping capability) which can be incorporated to support further data visualization. The DEVS-GIS Simulation Explorer we developed relies on OpenLayers, and the OpenStreetMap database to contextualize simulation results. The DEVS-GIS Simulation Explorer offers a unique opportunity for interdisciplinary studies and remote collaboration. As a case study, we use the results of the [disease spread simulation model](https://github.com/omarkawach/Geography-Based-Model), for the City of Ottawa at the Dissemination Area (DA) level and for the province of Ontario at the Census Subdivision (CSD) level. The application allows users to build choropleth maps that display the boundary polygons classified by color according to different variables produced by the simulation (infected, susceptible, deaths, recovered, etc.) Users can also animate the map to visualize each time step of the simulation and interact with individual geometries to explore the detailed results of the simulation. By analyzing the output seen in the DEVS-GIS Simulation Explorer, users may recognize high risk geographical regions which may be susceptible to outbreaks or further disease spreading.

##### Map-Based Decision Making and Visualization 

As data visualization becomes more commonplace, complex content must be made easily digestible for experts and non-experts in an effort to support decision making ([Talk about uncertainty in maps for decision making?](https://www.frontiersin.org/articles/10.3389/fcomp.2020.00032/full)). Concerning the field of geography, geospatial information can be presented on paper maps, digital static maps, and digital interactive maps. Recent mapping services appear to favour the digital interactivity route as clients increasingly become treated as map users, not map readers. Something about why users, not readers blah blah interdisciplinary ([cartography](https://www.tandfonline.com/doi/full/10.1080/23729333.2017.1288534))

- Resources:
  - https://dl.acm.org/doi/abs/10.1145/3206505.3206516
  - https://dl.acm.org/doi/10.1145/1998076.1998169
  - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7177515/

##### Symbology and Semiotics


Paraphrased Definitions from Wikipedia
- Symbology is the study / use of symbols
- Semiotics is the study of symbols as a means of communication

From 1967, French cartographer Jacques Bertin brought forth impactful theories (describe some theories here?). Til this day the same theories are applied to the science, art, and technology involved in cartography. As maps are a form of communication, maps must be easily understood non-verbally through quick observation since geospatial data can be rather complex. When making maps and / or manipulating maps, the use of visual variables is imperative. Bertin had developed various visual variables, such as position, size, value, color, orientation, and texture ([Morita, 2013](https://www.tandfonline.com/doi/full/10.1179/000870411X13038059668604?needAccess=true)). By using these visual variables, map makers can easily communicate the measurement of a statistical variable. Eventually came Alan MacEachern, Joel Morrison and Robert Roth who introduced additional visual variables ([Axis Maps, N.D.](https://www.axismaps.com/guide/visual-variables)). 

Alan (90s)
- Crispness / Fuzziness
- Resolution
- Transparency

Robert (2017) and Joel (1974)
- Color saturation
- Arrangement 

What does each variable tell us?..

- Next steps
  - Quick background https://en.wikipedia.org/wiki/Visual_variable 
  - Relate to simulation and how we can use symbology with simulation results 
    - Ex. The more cases we have at a hospital, the larger the circle becomes
  - Resource on the visual variable syste,:
    - https://gistbok.ucgis.org/bok-topics/symbolization-and-visual-variables#:~:text=Jacques%20Bertin%20(1967%2F2010),quantitative%20characteristics%20into%20each%20symbol

Maybe also mention Joel Morrison and Alan MacEachren?  and https://www.researchgate.net/publication/317266613_Visual_Variables (use this source instead https://geography.wisc.edu/cartography/research/publications/Roth_2015_EG.pdf))

##### GIS

What is it? What can it do?

What can GIS reveal in data? 

  - Tools available
    - Thematic mapping
  - Why have they become so useful now?
  - Their use cases

##### Evolution of GIS and GIS Web Applications

###### Related Work?

US COVID Atlas: 
- https://github.com/GeoDaCenter/covid
- https://geodacenter.github.io/covid/map.html
- https://geodacenter.github.io/covid/index.html

As any experienced geographer today would know, spatio-temporal analysis involves the inquiry into the relationship between space and time. In 1854, epidemiologist Dr. John Snow was the first to exemplify this phenomena by creating a spatial risk model that listed incidences of cholera outbreak ([Caplan, et al., 2020](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7105112/#:~:text=John%20Snow%20was%20an%20epidemiologist,the%20cholera%20outbreak%20in%201854.https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7105112/#:~:text=John%20Snow%20was%20an%20epidemiologist,the%20cholera%20outbreak%20in%201854.)). As the 19th century lagged in advanced qualitative methods that many now take for granted, this is what would be known as the dark ages of Geographic Information Systems (GIS) ([All Answers Ltd., 2018](https://ukdiss.com/examples/geographic-information-system.php) & [Ali, 2020](https://www.researchgate.net/publication/340182760_Geographic_Information_System_GIS_Definition_Development_Applications_Components)). Only a near hundred years later did GIS come out of the dark ages when Rogers Tomlinson, the father of GIS, computerized the way field experts work with and analyze spatial data ([ESRI, n.d.](https://esripress.esri.com/storage/esripress/images/188/115391_webgis_chapter01.pdf)). Shortly afterwards, American Geographer Waldo Tobler conceived what would be hailed as Tobler's first law of geography (TFL). The creation of TFL emphasized the influence of location where near things are more related than distant things ([Foresman, Luscombe, 2016](https://www.tandfonline.com/doi/abs/10.1080/17538947.2016.1275830)) Even with all the advances that were taking place in the field of GIS, many of the applications used were standalone until 1993 when Xerox developed the first Web-based map viewer. Having GIS on the web opened many doors to mass sharing of information on a global-scale, new user experiences, cross-platform compatibility, and other geospatial services ([ESRI, n.d.](https://esripress.esri.com/storage/esripress/images/188/115391_webgis_chapter01.pdf)). The appeal to use Web-based GIS applications does not only apply to Geographers. In many forms of interdisciplinary research, the diverse field of Geography proves most useful. Through use of GIS, researchers can utilize web GIS platforms and software to better analyze, conceptualize, and interpret information. Regardless of the discipline research is being conducted in, [Regardless of the discipline in which research is conducted] if the research data contains spatial components then GIS will be there as a major facilitator in some form ([Rickles, et al., 2017](https://rgs-ibg.onlinelibrary.wiley.com/doi/full/10.1002/geo2.46)). 

### If the content below isn't useful, maybe find a use for it elsewhere?

##### The COVID-19 Pandemic and the Move to Remote Work

The COVID-19 pandemic has negatively affected the lives of billions around the globe. As such, the ongoing tensions caused by the pandemic has also revealed how unprepared governments are for a global pandemic of this scale ([Timmis, and Brussow, 2020](https://sfamjournals.onlinelibrary.wiley.com/doi/10.1111/1462-2920.15029)). Matters are made worse by the fact that large, and even small-scale problems are difficult for humans to conceptualize and prepare for. This is especially true when we consider global issues like global warming ([Resnik et al., 2016](https://onlinelibrary.wiley.com/doi/full/10.1111/cogs.12388)). For example, even with all the warnings emphasized by Canada's pandemic preparedness report ([Federal Government of Canada, 2006](https://www.longwoods.com/articles/images/Canada_Pandemic_Influenza.pdf)), medical supplies (e.g. PPE) were limited and health systems were not adequately suited to handle spikes in hospital admissions ([Eggertson, 2020](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7145370/)). Canada's early response in the first wave of lockdowns had travel and social interactions restricted, and testing / tracing capacity increased. Such an approach may not have been enough to reduce the number of new cases as time went on since policies are constantly evolving. So, to further combat the waves of community-acquired transmission, decision makers need to look towards various forms oƒf intervention, such as case detection, isolation, contact tracing, quarantining, and physical distancing **(fix this later)**. Through imposing restrictive measures, transmission across Canada had reduced, so long as controls were not eased ([Ng, et al., 2020](https://www.cmaj.ca/content/192/37/E1053)). The restrictive measures set forth by policy makers has left the workforce in an entirely new landscape. Employers were forced to quickly adapt to have employees work from home (WFH), serve as essential, or simply be laid-off ([Kniffin et al., 2020](https://doi.apa.org/fulltext/2020-58612-001.html)). One might hypothesize, based on rising trends ([Felstead & Henseke, 2017](https://onlinelibrary.wiley.com/doi/full/10.1111/ntwe.12097)), many jobs in the digital sphere were already heading towards optionally remote or completely remote before the catalytic event that is the COVID-19 pandemic. [Felstead and Henseke (2017) stated that many jobs in the digital sphere were already heading towards optionally remote or completely remote (cite). This is even more evident now that COVID-19 has drastically reduced the number of people working in an office setting.]
The new normal of working from home may allow employers to focus more on merits and qualifications of their candidates rather than whether they live in a certain city. The geographical hurdles once faced by a company's growth and operations, or a person's career choices may become a thing of the past since employers can focus on offering flexible working arrangements ([McCausland, 2020](https://www.tandfonline.com/doi/full/10.1080/08956308.2020.1813506)). The current confinement / restrictions set in place for businesses and academic institutions have left many scrambling for effective communicative and collaborative tools ([Brynes et al., 2020](https://onlinelibrary.wiley.com/doi/full/10.1002/ca.23649)). Later in the paper, the GIS Simulation Explorer will be touched on as a remotely accessible collaborative tool for practitioners, and other decision makers.

##### GIS Web Applications for Reducing COVID-19 Spread Through Remote Collaboration 

Since the inception of TFL, researchers in the GIS community have employed such a concept to describe spatial dependence ([Leitner et al., 2018](https://www.researchgate.net/publication/323419139_Laws_of_Geography)). In the field of epidemiology, one could apply TFL to synthetically simulate the spread of infectious diseases in a geographical environment based on spatial weighting ([Zhong et al., 2009](https://www.researchgate.net/profile/Song_Dunjiang/publication/226204125_Simulation_of_the_spread_of_infectious_diseases_in_a_geographical_environment/links/00b495316b307a20ab000000/Simulation-of-the-spread-of-infectious-diseases-in-a-geographical-environment.pdf)). Such an application can play a vital role in disease prevention and control when coupled with modern spatio-temporal analysis techniques ([Watkins et al., 2007](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1805744/)). When supplementing existing research on virus spread models, geographical tracking and mapping of pandemic data through the application of GIS has been proven to be a powerful system for disease monitoring and planning ([Buolos & Geraghty, 2020](https://ij-healthgeographics.biomedcentral.com/articles/10.1186/s12942-020-00202-8)). Such a system allows researchers to present large volumes of data in an intuitive way. For one, web-based mapping has created an environment for accessible remote collaboration between decision makers ([Franch-Pardo et al., 2020](https://www.sciencedirect.com/science/article/pii/S0048969720335531)). By integrating simulation models into map-based web applications, researchers can also highlight spatio-temporal trends in various scenarios. Highlighting spatio-temporal trends would mean that researcher can observe the spatial distribution of COVID-19 cases to drive better policy decisions ([Shariati, et al., 2020](https://link.springer.com/article/10.1007/s40201-020-00565-x)).

###### Might be useful somewhere? 
- [Use of GIS Mapping as a Public Health Tool—From Cholera to Cancer](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4089751/)
  - "While traditional uses of GIS in public health are static and lacking real-time components, implementing a space-time animation in these instruments will be monumental as technology and data continue to grow."
