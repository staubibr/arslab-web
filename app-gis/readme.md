# GIS Simulation Explorer

## Getting Started (Users):
[![Demo CountPages alpha](/app-gis/demo.gif)](https://youtu.be/liGqAIcnNUo)
- Open the [GIS Simulation Explorer](https://staubibr.github.io/arslab-dev/app-gis/index.html) in Chrome 
- OpenStreetMap will automatically load the world map
- Before Loading Simulations
  - You can change the number of classes and color scale
- Load Simulation
  1. Insert your simulation results (txt) and wait until the program alerts you that you may now move to step 2
  2. Insert your GeoJSON layer 
  3. OPTIONAL: Repeat steps 2 and 3 to insert more simulations
- Manipulating Simulations
  - By default, the current simulation to be manipulated is the most recently entered one
  - The current simulation can be selected which will allow you to:
    - Download simulation object as a csv file
    - Cycle through different timestamps of the SIR simulation
    - Change legend
    - Change color
    - View attributes by clicking census subdivisions
- Layer switcher (icon in the top right corner of the OpenStreetMap)
  - Use this for changing between simulations
  

## Getting Started (Developers):
##### Essentials:
- Download [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb)
- Open [app-gis](https://github.com/staubibr/arslab-dev/tree/master/app-gis) in your preferred text editor 

##### Running the local server:
> Open Chrome and go to Apps

>> Click Web Server

>>> Set the current folder to /arslab-dev 

>>>> Open Web Server for Chrome by clicking the Web Server URL

![Web Server.](/app-gis/webserver.png "Web Server image.")

##### Development:
- In `./app-gis/`, there are many folders and files to choose from
  - Folder `./app-gis/classes` contains class level functions
  - Folder `./app-gis/widgets` contains code for UI operations
  - Folder `./app-gis/data` has sample data 
  - Folder `./app-gis/ol` contains OpenLayers packages. 
    - OpenLayers can be easily bundled with gis applications through Rollup, Webpack, etc. 
  - File `app-gis/application.js` contains a bulk of the work needed to run the gis application

##### Structure of Simulation Results Text File:
    State for model _DAUID is <1,0,16,16,0.7,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0>
    
    The numbers have the following meaning:

      First number (1): population density
      
      Next number (0): The phase of the lockdown
      
      Next number (16): Number of infected states
      
      Next number (16): Number of recovered states
      
      Next Number(0.7): The susceptible population
      
      Next 16 numbers: The portion of the population in each stage of infection (the  
      sum of which is the infected population)
      
      Next 16 numbers: The portion of the population in each stage of recovery (there's no really "recovered" population
      if someone is in a recovery phase thy cant infected, but after the last stage of recovery they can get infected again)
    
    Example of how you'd access specific data: Infected are indexes 5 to 20

## TODO:
- Let users video record the simulation
- Fix mapOnClick to be more visually friendly
- Place the legend onto the OpenLayer map
- Clean up UI

## Resources:

#### D3JS

[D3 Legend](https://github.com/susielu/d3-legend)  

[D3 Scale](https://github.com/d3/d3-scale)

[D3 Full Video Tutorial](https://www.youtube.com/watch?v=_8V5o2UHG0E)

#### GIS

[Spatial references](https://spatialreference.org/ref/epsg/)

#### OpenLayers

[ol.Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)  

[ol.layer.Vector](https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html)

[ol.OverLay](https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html)

[ol.layerswitcher](https://github.com/walkermatt/ol-layerswitcher)

[ol.geocoder](https://github.com/jonataswalker/ol-geocoder)

#### Web Development

[Event References](https://developer.mozilla.org/en-US/docs/Web/Events)

