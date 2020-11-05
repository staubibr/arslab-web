# GIS Simulation Explorer

## Purpose

Build a GIS environment based visualization for large scale spatial simulations on the web. 

## Background (Draft)

Geographical tracking and mapping of pandemic data through the application of Geographic Information Systems (GIS) has been proven to be a powerful system for disease monitoring and planning ([Buolos & Geraghty, 2020](https://ij-healthgeographics.biomedcentral.com/articles/10.1186/s12942-020-00202-8)). Such a system allows researchers to present large volumes of data in an intuitive way. For one, web-based mapping has created an environment for accessible remote collaboration between decision makers ([Franch-Pardo et al., 2020](https://www.sciencedirect.com/science/article/pii/S0048969720335531)). By integrating simulation models into map-based web applications, researchers can also highlight spatiotemporal trends in various scenarios. 

Modern open-source GIS libraries, such as OpenLayers, provide developers with the necessary tools to load and display data into dynamic map-based web applications. OpenLayers' is entirely free, easy to customize, and supports vector data rendering. D3JS, a lightweight data visualization library, also has some limited mapping capability that could be incorporated into a map-based web application. 

#### Evolution of GIS Web Applications

[GIS in the Web Era](https://esripress.esri.com/storage/esripress/images/188/115391_webgis_chapter01.pdf) 
- Good source for definition of GIS 
- 1962, Roger Tomlinson is the father of GIS when he conducted land inventory and planning

In many forms of interdisciplinary research, the diverse field of Geography shines above all others. Through use of GIS, researchers can utilize web GIS platforms and software to better analyze, conceptialize, and interpret information. Regardless of the discipline research is being conducted in, if the research data contains spatial components then GIS will be there as a major facilitator in some form **(fix grammar here)** ([Rickles, et al., 2017](https://rgs-ibg.onlinelibrary.wiley.com/doi/full/10.1002/geo2.46)). 

What can GIS reveal in data?

  - Tools available
    - Thematic mapping
  - Why have they become so useful now?
  - Their use casess 

#### The Current Work Climate

The current COVID-19 pandemic has negatively affected the lives of arguably billions around the globe. The ongoing tensions caused by the pandemic has revealed a lot of holes in local, national, and global plans for handling outbreaks. 

- Throughout the last decade, online resources like Zoom and Slack have continued developing and have proved extremely useful in adapting to the current pandemic ([Levy, 2020](https://www.cnbc.com/2020/05/11/work-from-home-is-here-to-stay-after-coronavirus.html)) 
- Confinement / restrictions 
- One might hypothesize that a lot of jobs in the digital sphere may permanently move into being optionally or completely remote. It **(remove expletive)** will be interesting to analyze whether the pandemic has caused this shift of focus towards remote workers, or whether jobs in the digital sphere were heading this way regardless.
- If employers were to remove the restriction of location for employment, it **(remove expletive)** may allow employers to focus more on the merits and qualifications (equity?) of their candidates rather than whether they live in the correct city or not.
- Many geographical factors play a role in hindering a person’s career choices or a company’s growth and operations. For example, certain companies and digital programs may require a constant access to the internet, making a stable internet connection a requirement for their operations.

#### Application 

[Use of GIS Mapping as a Public Health Tool—From Cholera to Cancer](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4089751/)

- Where do we fit in? How did we accomplish it?

In relation to current studies of COVID-19 (as well as future pandemics), such an application will be available on the web for remote collaboration and use by practitioners. Why remote collaboration? (summarize the points to maybe show why software such as this is useful if implemented on a global scale?)



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
- In `./app-gis/`, there are many folders and files to choose from
  - Folder `./app-gis/classes` contains class level functions
  - Folder `./app-gis/widgets` contains code for UI functions
  - Folder `./app-gis/data` has sample data 
  - Folder `./app-gis/ol` contains OpenLayers packages. 
    - OpenLayers can be easily bundled with gis applications through Rollup, Webpack, etc. 
  - File `app-gis/application.js` contains a bulk of the work needed to run the gis application

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

[ol.Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)  

[ol.layer.Vector](https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html)

[ol.OverLay](https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html)

[ol.layerswitcher](https://github.com/walkermatt/ol-layerswitcher)

[ol.geocoder](https://github.com/jonataswalker/ol-geocoder)

[ol.control.Sidebar](https://github.com/Turbo87/sidebar-v2/blob/master/doc/usage.md)

#### Web Development

[JavaScript - Event References](https://developer.mozilla.org/en-US/docs/Web/Events)

