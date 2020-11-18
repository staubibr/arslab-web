# GIS Simulation Explorer

## Purpose

Build a GIS environment based visualization for large scale spatial simulations on the web. 

## Background (Draft)

Current text:
- COVID impact 
- Addressing COVID
- TFL and Zhong
- Lots of data
- GIS web apps may help
- GIS web app evolution and their usefulness / tools
- The move towards remote work and how GIS web apps can help
- Application of our tool


###### Might be useful? 
- https://www.cmaj.ca/content/192/37/E1074 

###### Mention Zhong?
 - Since the inception of TFL, researchers in the GIS community have employed such a concept to describe spatial dependence ([Leitner et al., 2018](https://www.researchgate.net/publication/323419139_Laws_of_Geography)). In the field of epidemiology, one could apply TFL to synthetically simulate the spread of infectious diseases in a geographical environment based on spatial weighting ([Zhong et al., 2009](https://www.researchgate.net/profile/Song_Dunjiang/publication/226204125_Simulation_of_the_spread_of_infectious_diseases_in_a_geographical_environment/links/00b495316b307a20ab000000/Simulation-of-the-spread-of-infectious-diseases-in-a-geographical-environment.pdf)). Such an application can play a vital role in disease prevention and control when coupled with modern spatio-temporal analysis techniques ([Watkins et al., 2007](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1805744/)). 

The COVID-19 pandemic has negatively affected the lives of arguably billions around the globe. As such, the ongoing tensions caused by the pandemic has also revealed how unprepared governments are for a global pandemic of this scale ([Timmis, and Brussow, 2020](https://sfamjournals.onlinelibrary.wiley.com/doi/10.1111/1462-2920.15029)). Matters are made worse by the fact that large, and even small-scale problems are difficult for humans to conceptualize and prepare for. This is especially true when we consider global issues like global warming ([Resnik et al., 2016](https://onlinelibrary.wiley.com/doi/full/10.1111/cogs.12388)). For example, even with all the warnings emphasized by Canada's pandemic preparedness report ([Federal Government of Canada, 2006](https://www.longwoods.com/articles/images/Canada_Pandemic_Influenza.pdf)), medical supplies (PPE for example) were limited and health systems were not adequately suited to handle spikes in hospital admission ([Eggertson, 2020](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7145370/)). Canada's early response in the first wave of lockdowns had travel and social interactions restricted, and testing / tracing capacity increased. Such an approach may not have been enough to reduce the number of new cases as time went on since policies are constantly evolving. So, to further combat the waves of community-acquired transmission, decision makers need to look towards various forms of intervention, such as case detection, isolation, contact tracing, quarantining, and physical distancing **(fix this later)**. Through imposing restrictive measures, transmission across Canada had reduced, so long as controls were not eased ([Ng, et al., 2020](https://www.cmaj.ca/content/192/37/E1053)). 

**(Have a better transition into next paragraph)**

Given the unprecedented amount of data surrounding the ongoing pandemic, local / national / global real-time, non-real-time, or simulated disease cases must be carefully analyzed to recognize high risk geographical regions which may be susceptible to outbreaks or further disease spreading.

To further supplement existing research on COVID-19 spread models, the utilization of Geographic Information Systems (GIS) may prove useful. Geographical tracking and mapping of pandemic data through the application of GIS has been proven to be a powerful system for disease monitoring and planning ([Buolos & Geraghty, 2020](https://ij-healthgeographics.biomedcentral.com/articles/10.1186/s12942-020-00202-8)). Such a system allows researchers to present large volumes of data in an intuitive way. For one, web-based mapping has created an environment for accessible remote collaboration between decision makers ([Franch-Pardo et al., 2020](https://www.sciencedirect.com/science/article/pii/S0048969720335531)). By integrating simulation models into map-based web applications, researchers can also highlight spatio-temporal trends in various scenarios **(how? Explain later)**. Highlighting spatio-temporal trends would mean that researcher can observe the spatial distribution of COVID-19 cases to drive better policy decisions ([Shariati, et al., 2020](https://link.springer.com/article/10.1007/s40201-020-00565-x)).  

**(Transition)**

Modern open-source GIS libraries, such as OpenLayers, provide developers with the necessary tools to load and display data into dynamic map-based web applications. OpenLayers' is entirely free, easy to customize, and supports vector data rendering. D3JS, a lightweight data visualization library, also has some limited mapping capability that could be incorporated into a map-based web application. 

#### Evolution of GIS Web Applications

--- Ask Bruno for more info ---

[GIS in the Web Era](https://esripress.esri.com/storage/esripress/images/188/115391_webgis_chapter01.pdf) 
- Good source for definition of GIS 
- 1962, Roger Tomlinson is the father of GIS when he conducted land inventory and planning

In many forms of interdisciplinary research, the diverse field of Geography proves most useful. Through use of GIS, researchers can utilize web GIS platforms and software to better analyze, conceptualize, and interpret information. Regardless of the discipline research is being conducted in, if the research data contains spatial components then GIS will be there as a major facilitator in some form **(fix grammar here)** ([Rickles, et al., 2017](https://rgs-ibg.onlinelibrary.wiley.com/doi/full/10.1002/geo2.46)). 

What can GIS reveal in data? 

In Geography, there are various forms of thematic mapping. For the sake of this paper, the focus will be on choropleth maps as the thematic map for presenting the COVID-19 spread model from simulation results. By shading affected regions by proportion or other statistical variables, users can recognize the impact of COVID-19 within a geographic region. 

  - Tools available
    - Thematic mapping
  - Why have they become so useful now?
  - Their use cases

[Use of GIS Mapping as a Public Health Tool—From Cholera to Cancer](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4089751/)


#### The Current Work Climate and Remote Collaboration

As a result of the COVID-19 pandemic, employers were forced to quickly adapt to have employees work from home (WFH), serve as essential, or simply be laid-off ([Kniffin, et al., 2020](https://doi.apa.org/fulltext/2020-58612-001.html)). One might hypothesize, based on rising trends ([Felstead & Henseke, 2017](https://onlinelibrary.wiley.com/doi/full/10.1111/ntwe.12097)), many jobs in the digital sphere were already heading towards optionally remote or completely remote before the catalytic event that is the COVID-19 pandemic. The new norm of working from home may allow employers to focus more on merits and qualifications of their candidates rather than whether they live in the correct city. The geographical hurdles once faced by a company's growth and operations, or a person's career choices may be a thing of the past in the near future since employers can focus on offering flexible arrangement ([McCausland, 2020](https://www.tandfonline.com/doi/full/10.1080/08956308.2020.1813506)). The current confinement / restrictions set in place for businesses and academic institutions have left many scrambling for effective communicative and collaborative tools ([Brynes, et al., 2020](https://onlinelibrary.wiley.com/doi/full/10.1002/ca.23649)). Later in the paper, the GIS Simulation Explorer will be touched on as a remotely accessible collaborative tool for practitioners, and other decision makers. 

#### Application of the GIS Simulation Explorer 

To support current studies of COVID-19 (as well as future pandemics), such an open-source application will be available on the web for remote collaboration. In the GIS Simulation Explorer's current state, simulation results are mapped to vector files, and then displayed for observation. The OpenLayers library supports...

(summarize the points to maybe show why software such as this is useful if implemented on a global scale?)

- Where do we fit in? How did we accomplish it?


## Getting Started:

### Users
[![gif](/app-gis/demo.gif)](https://www.youtube.com/watch?v=eAaeGtoMDUQ)
- Open the [GIS Simulation Explorer](https://staubibr.github.io/arslab-web/app-gis/index.html) in Chrome 
- OpenStreetMap will automatically load the world map
- Before Loading Simulations
  - You can change the number of classes and color scale
- Load Simulation 
  1. Click the database icon in the map's sidebar
  2. Drag and Drop your simulation results (.txt) and layer (.geojson)
  3. Click the `Load Simulation` button
  4. OPTIONAL: Repeat step 2 to 3
- Manipulating Simulations
  - Click the filter icon in the sidebar
  - By default, the current simulation to be manipulated is the most recently loaded one
  - The current simulation can be selected which will allow you to:
    - Download simulation object as a csv file
    - Cycle through different timestamps of the SIR simulation
    - Change legend
    - Change color
- Download Simulation
  - Click the download icon in the sidebar
  - Choose which simulation to download
  - Click the `Download` button
- Interacting with Simulations Shown on Map
    - View attributes by clicking census subdivisions
- Layer switcher 
  - Click the second icon in the top right corner of the Application
  - Use this for changing between simulations (view-only)
- Search 
  - Click the search icon shown in the Application
  - You can move anywhere on the map by typing in a location
- Playback 
  - Click the play button in the sidebar 
  - This will give you the ability to record the Application as it goes through simulation cycles

### Developers
##### Essentials:
- Download [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb)
- Open [app-gis](https://github.com/staubibr/arslab-dev/tree/master/app-gis) in your preferred text editor 
- Use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) for debugging
  - Ensure that cache is disabled in DevTools

##### Running the local server:
> Open Chrome and go to Apps

>> Click Web Server

>>> Set the current folder to /arslab-dev 

>>>> Open Web Server for Chrome by clicking the Web Server URL

![Web Server.](/app-gis/img/webserver.png "Web Server image.")

##### Development:

Features: 
  - OpenStreetMap as base layer / canvas
    - Zoom in/out
    - Layer Switcher
    - Search bar
    - Sidebar 
      - Home 
      - Load Simulation 
      - Manipulating Simulations
        - Color
        - Classes
        - SIR
      - Download Simulation
      - Playback
    - Legend
    - Interacting with Simulations Shown on Map

##### Structure of Simulation Results Text File:
    State for model _DAUID is <population, number of susceptible, number of infected, number of recovered, number of new infected, number new recovered, number fatalities>
    
    Note:

    - The population changes throughout the results file. 

    - The geojson file you loaded would likely have the initial population for the census subdivision.
    
    - The population formula is (population - population * fatalities)

## TODO:
1. General bug fixes, UI changes, and code refactoring 
2. Update instructional video demo 
3. Fix mapOnClick
   - Code gets wanky when layers are on top of each other
   - The issue could likely be fixed by looking at the layer switcher
4. Let users title their simulation 
5. Let users choose what their simulation object will contain
6. Add options to the Settings tab
   - Support for multiple languages 
7. Allow geopackage files as an accepted file format
   - Look into [GeoPackage JS](https://github.com/ngageoint/geopackage-js)
   - For now use [MyGeodata Converter](https://mygeodata.cloud/converter/gpkg-to-geojson) or QGIS to convert .gpkg to .geojson
   - Could also create a [Python script](https://www.geodose.com/2020/06/pyqgis-tutorial-shapefile-conversion.html) for the time being?
8. Fix GeoCoder so it does not add itself as a layer
   - Also maybe use a different GeoCoder? The current one seems to break often if using AdBlock
9. Integrate with DEVS Web Viewer
   - Incorporate library of models w/ backend
10. Introduce spatial analysis tools

## Credits and Acknowledgements

[Carleton University - ARSLab](https://arslab.sce.carleton.ca/)

[Tobias Bieniek - Sidebar-v2](https://github.com/Turbo87/sidebar-v2)

[Jonatas Walker - OpenLayers Control Geocoder](https://github.com/jonataswalker/ol-geocoder)

[Jean-Marc Viglino - OpenLayers Extension](https://github.com/Viglino/ol-ext)

[Matt Walker - OpenLayers Popup](https://github.com/walkermatt/ol-popup)

[OpenLayers](https://openlayers.org/)

[D3JS](https://d3js.org/)

## Resources:

#### D3JS

[D3 Legend](https://github.com/susielu/d3-legend)  

[D3 Scale](https://github.com/d3/d3-scale)

[D3 Full Video Tutorial](https://www.youtube.com/watch?v=_8V5o2UHG0E)

#### GIS

[Spatial references](https://spatialreference.org/ref/epsg/)

#### OpenLayers

**Note:** Coordinate format is Longitude / Latitude. 

OpenLayers can be easily bundled with GIS applications through Rollup, Webpack, etc. 

[ol.Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)  

[ol.layer.Vector](https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html)

[ol.OverLay](https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html)

[ol.layerswitcher](https://github.com/walkermatt/ol-layerswitcher)

[ol.geocoder](https://github.com/jonataswalker/ol-geocoder)

[ol.control.Sidebar](https://github.com/Turbo87/sidebar-v2/blob/master/doc/usage.md)

#### Web Development

[JavaScript - Event References](https://developer.mozilla.org/en-US/docs/Web/Events)

