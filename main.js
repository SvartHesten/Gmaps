$(document).ready(function() {
//Displaying clear map
    initialize("", 10000);
    fillPlacesNames();

//Filling list of places
    function fillPlacesNames() {
        for(var i = 0; i < places.length; i++) {
            var current = places[i];
            var option = $('<option></option>').text(current);
            $("#places-list").append(option);
        }
    }
//Functionality of Search button
    var placeName, radiusOfSearch = 10000;
    var tempList = [], locationList = [];

    $("#radius").on("keyup", function() {
        radiusOfSearch = $(this).val();
    });

    $("#search").on("click", function() {
        placeName = $("#places-list option:selected").text();
        initialize(placeName, radiusOfSearch);
        viewResults();
    });

    $("#clear").on("click", function() {
        test();
    });

//Writing location list into results area
    function viewResults() {
        for(var i = 0; i < locationList.length; i++) {
            var current = locationList[i];
            var newLocation = $('<li>' + current.name + "," + current.lat + ","
            + current.lng + "," +  current.id + "," + current.type + '</li>');
            $("#results-list").append(newLocation);
        }
    }

    var map;
    var infowindow;

    function initialize(placeName, radiusOfSearch) {
      var pyrmont = new google.maps.LatLng(51.496913, -0.126200);

      map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: pyrmont,
        zoom: 10
      });

  var request = {
    location: pyrmont,
    radius: radiusOfSearch,
    types: ['bar', 'restaraunt', 'cafe'],
    name: placeName
    
  };
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

    function callback(results, status) {
        tempList = results;
        alert("In callback");
        fillLocationList(tempList);
        alert("List filled");
        ///////////////////////////
        if(status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
        }
    }

    function createMarker(place) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    }

//Checking for duplicates in a location list
    function checkForDuplicates(tempListItem) {
        var locationExists = false;
        for(var i = 0; i < locationList.length; i++) {
            if(locationList[i].id == tempListItem.id) {
                locationExists = true;
                return locationExists;
            }
        }
        return locationExists;
    }

//Filling the location list
    function fillLocationList(tempList) {
        if(locationList.length == 0) {
            for(var i = 0; i < tempList.length; i++) {
                var current = tempList[i];
                locationList.push(createLocationObject(current));
            }
        }
        else {
            for(var i = 0; i < tempList.length; i++) {
                var current = tempList[i];
                if(checkForDuplicates(current) == false) {
                    locationList.push(createLocationObject(current));
                }
            }
        }
    }

//Creating a template of location list item
    function createLocationObject(tempListItem) {
        return {
            lat: tempListItem.geometry.location.k,
            lng: tempListItem.geometry.location.A,
            id: tempListItem.id,
            name: tempListItem.name,
            type: tempListItem.types[0]
        }
    }

    function clearResults() {
        alert("Here");
        tempList = [], locationList = [];
        var listItems = $("ul#results-list li");
        listItems.each(function() {
            this.remove();
        });
    }

    function test() {
        alert("A");
    }

});
