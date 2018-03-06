# WeatherApp
You can find this project [here](https://tomkaar.github.io/WeatherApp/)


### map
Create the map and you can for example use ```map.getCurrentLocation()``` to get the current location set on the map.
- addListener - Google Maps Function, same as <code>addEventListener</code>
- setLocation
- - this.updateLocation
- - this.setMarker
- - this.moveToLocation
- - getLocationData
- - loadWeather
- getLocationData - Get coordinates from Google Maps GeoCoder
- this.updateLocation - update coordinates
- this.setMarker - Set a marker on the map + update marker
- this.moveToLocation - Change position on map (center)
- this.updateLocation - update current GeoLocation variable 
- this.getCurrentGeoCode - return current Geo Location
- this.getCurrentLocation - return currentLocation (lat, lng)
- this.getCurrentMarker - return/ target current marker set on map

### getMyLocation
Use HTML5 GeoLocation to find users current position and update location on map.

### showError
If something unexpected happens while trying to get the users location, print a error message and set the default location to Stockholm.
- hideErrorMessage - click on the button on the error message to hide/ remove it.

### loadWeather
Get weather data from SMHI Weather API using coordinates. When done, run buildWeather function.

### buildWeather
Using the response from the loadWeather function, display weather information on the screen.
1. Clear location - remove 'old' data from screen
2. Sort timeSeries after day
3. Create Today section
4. Create Menu + Detail Views

### Helpers
- getColdestTemp - use reduce and return coldest temperature
- getWarmestTemp - use reduce and return warmest temperature
- getAverageTemp - use forEach and reduce to get the average temperature
- mostFrequent - user filter and return the weather type that's most common on that day
- getParameter - getFirstDay Parameters
- getGeoParameter - get current location information
- addZero - add a zero in front of numbers if less then 10
- getImg - get the right image, depending on current weather numbers
- newElement - Short function to create a new element, returns custom element with class and content.
