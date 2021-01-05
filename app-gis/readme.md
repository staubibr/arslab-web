# GIS Simulation Explorer (DRAFT)

## Purpose

Build a GIS environment based visualization for large scale spatial simulations on the web. 

## Table of Contents 

(add direct hyperlinks after merging to master)

###### Getting Started
Click the GIFs for video tutorials
- Users
- Developers
  - Essentials
  - Running the local server
  - Structure of Simulation Results (.txt)
  
###### TODO List

###### Important Links

###### Credits and Acknowledgements

###### Resources
  - D3JS
  - GIS
  - OpenLayers
  - JavaScript

## Getting Started

### Users
[![Video Tutorial for Users](./img/demo.gif)](https://youtu.be/iBGA77LImYE)
- Open the [GIS Simulation Explorer](https://staubibr.github.io/arslab-web/app-gis/index.html) in Chrome 
- OpenStreetMap will automatically load the world map
- Before Loading Simulations
  - You can change the number of classes and color scale
- Load Simulation 
  1. Click the database icon in the map's sidebar
  2. Drag and drop your simulation results (.txt) and layer (.geojson)
  3. Click the `Load Simulation` button
  4. **OPTIONAL**: Repeat step 2 to 3 to load more simulations
- Manipulating Simulations
  - Click the filter icon in the sidebar
  - By default, the current simulation to be manipulated is the most recently loaded one
  - The current simulation can be selected which will allow you to:
    - Download simulation object as a csv file
    - Cycle through different timestamps of the simulation
    - Change legend properties (color and classification)
    - Change color and classification of the simulation
- Download Simulation
  1. Click the download icon in the sidebar
  2. Choose which simulation to download
  3. Click the `Download` button
- Interacting with Simulations Shown on Map
    - View attributes by clicking on polygons
      - Will appear as a popup
- Layer switcher 
  - Click the second icon in the top right corner of the Application
  - Use this for changing between simulations (view-only)
- Search **(currently unavailable)**
  - Click the search icon shown in the Application
  - You can move anywhere on the map by typing in a location
- Playback 
  - Click the play button in the sidebar 
  - This will give you the ability to record the Application as it goes through simulation cycles

### Developers

[![Video Tutorial for Developers](./img/tutorial.gif)](https://www.youtube.com/watch?v=gsbRyvQ_8Ys)

##### Essentials:
- Clone the repo to your desired file directory
- Download [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) or [Live Server in VSCode](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Open [app-gis](https://github.com/staubibr/arslab-web/tree/master/app-gis) in your preferred text editor if using Web Server for Chrome, otherwise use VSCode
- Use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) for debugging
  - Ensure that cache is disabled in DevTools
- Ensure the languages you work with are included in the system PATH

##### Running the local server:

###### Web Server Chrome
> Open Chrome and go to Apps

>> Click Web Server

>>> Set the current folder to /arslab-web 

>>>> Open Web Server for Chrome by clicking the Web Server URL

###### Live Server in VSCode       

> Open VS Code and set the current folder to /arslab-web 

>> Click Go Live on the bottom right corner of VS Code 

>>> In your default web browser, localhost should open

>>>> In the web browser's listing directory, click /app-gis

##### Structure of Simulation Results (.txt):

If the structure of your text file is different, then be sure to reflect these changes in `/sortPandemicData.js` or create a new file entirely for sorting your results.

Also, if your population data has a domain of [0,1] then be sure to comment out the `this.variables.shift()` line in `/application.js`.

    State for model _DAUID is <pop, # susceptible, # infected, # recovered, # new infected, # new recovered, # fatalities>
    
    Note:

    - The population changes throughout the results file. 

    - The geojson file you loaded would also likely have initial population data.
    
    - The population formula is (initial population - (population * fatalities))

## TODO List
1. General bug fixes, UI changes, and code refactoring 
2. Fix mapOnClick
   - Code gets wanky when layers are on top of each other
   - The issue could likely be fixed by looking at the layer switcher
3. Allow non-proportional data to be mapped (therefore update the D3 scale)
4. Support for multiple languages 
5. Allow GeoPackage files as an accepted file format
   - Look into [GeoPackage JS](https://github.com/ngageoint/geopackage-js)
   - For now use [MyGeodata Converter](https://mygeodata.cloud/converter/gpkg-to-geojson) or QGIS  to convert .gpkg to .geojson
     - E.g. [How to convert shapefile to GeoJSON in QGIS](https://gist.github.com/YKCzoli/b7f5ff0e0f641faba0f47fa5d16c4d8d) (applies to GeoPackages as well)
   - Could also create a [Python script](https://www.geodose.com/2020/06/pyqgis-tutorial-shapefile-conversion.html) for the time being?
     - **NOTE**: Ensure you use an acceptable CRS (E.g.EPSG:4326) when converting a file to GeoJSON
6. Add a GeoCoder search bar (removed the old one since it was no longer working)

## Important Link(s)

[Geography-Based-Model developed by ARSLab](https://github.com/omarkawach/Geography-Based-Model)

## Credits and Acknowledgements

[Carleton University - ARSLab](https://arslab.sce.carleton.ca/)

[Tobias Bieniek - Sidebar-v2](https://github.com/Turbo87/sidebar-v2)

[Jean-Marc Viglino - OpenLayers Extension](https://github.com/Viglino/ol-ext)

[Matt Walker - OpenLayers Popup](https://github.com/walkermatt/ol-popup)

[OpenLayers](https://openlayers.org/)

[D3JS](https://d3js.org/)

## Resources

#### D3JS 

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

[ol.control.Sidebar](https://github.com/Turbo87/sidebar-v2/blob/master/doc/usage.md)

[3rd Party Extensions](https://openlayers.org/3rd-party/)

#### Web Development

[JavaScript - Event References](https://developer.mozilla.org/en-US/docs/Web/Events)

