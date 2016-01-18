
    // Adds autocomplete to trip form location text field
//GOOGLE MAPS AUTO COMPLETE API = AIzaSyDRtPelzvMVwlTwyQuhN-goYUByFUVNlIo
// CONSIDER USING REDIS TO CACHE USER SEARCH

// });
app.controller('MainController', function($scope, $http, $filter) {
  $(function () {
    $('#container').highcharts({
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: National Resource Energy Lab',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'DniArr',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });
});

  // BTN DIV TOGGLE, 
  $scope.firstWrapper = false;
  $scope.firstToggle = function(){
    if(($scope.secondWrapper || $scope.thirdWrapper || $scope.fourthWrapper) === false){
      $scope.firstWrapper = !$scope.firstWrapper;
    }
  };
// second wrapper
  $scope.secondWrapper = false;
  $scope.secondToggle = function(){
    if(($scope.firstWrapper || $scope.thirdWrapper || $scope.fourthWrapper) === false){
      $scope.secondWrapper = !$scope.secondWrapper;
    }
  };

  $scope.thirdWrapper = false;
  $scope.thirdToggle = function(){
    if(($scope.firstWrapper || $scope.secondWrapper || $scope.fourthWrapper) === false){
      $scope.thirdWrapper = !$scope.thirdWrapper;
    }
  };

  $scope.fourthWrapper = false;
  $scope.fourthToggle = function(){
    if(($scope.firstWrapper || $scope.secondWrapper || $scope.thirdWrapper) === false){
      $scope.fourthWrapper = !$scope.fourthWrapper;
    }
  };
  // $scope.fillerClick = function(){

  // };
// Air Now detailed air information... API call

  // use this date to plug into the airData
  $scope.filterdatetime = $filter('date')(new Date(), 'yyyy MM dd');


// gauge for air quality
airQualityIndexGauage = function(val){
  var opts = {
    lines: 12,
    angle: 0.5,
    lineWidth: 0.1,
    limitMax: 'false', 
    percentColors: [[0.0, "#cccccc" ], [0.50, "#ffff00"], [1.0, "#ff0000"]], // !!!!
    strokeColor: '#E0E0E0',
    generateGradient: true,
      pointer: {
      length: 0.9, // The radius of the inner circle
      strokeWidth: 0.035 // The rotation offset
      // color: '#000000' // Fill color
    },
    colorStart: '#cdcdcd',   // Colors
    colorStop: '#ff0000',    // just experiment with them
    strokeColor: '#000000',   // to see which ones work best for you
    generateGradient: true
    };
    var target = document.getElementById('foo'); // your canvas element
    var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
    gauge.maxValue = 100; // set max gauge value
    gauge.animationSpeed = 32; // set animation speed (32 is default value)
    gauge.set(val); // set actual value
};

  // National Resource Energy Lab... Solar energy... Lat and Long.
  solarEnergy = function(){
    var url = "https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=aaeAF66WRB6IQou8P3WqLT7XQjXROd27QuUS4FFG&lat="+ $scope.lat +"&lon="+ $scope.lng;
    $http.get(url).then(function(solar){
      var objDni = solar.data.outputs.avg_dni.monthly,
       DniArr = _(objDni).toArray(),
      objGhi = solar.data.outputs.avg_ghi.monthly,
       GhiArr = _(objGhi).toArray(),
      objLatTilt = solar.data.outputs.avg_lat_tilt.monthly,
       LatTiltArr = _(objLatTilt).toArray();
    // do the same for other two arrays
      DniArr.forEach(function(ele,i,arr){
        console.log(ele);
      });
          
    });
  };


  weather = function(){
    var url = "http://api.openweathermap.org/data/2.5/weather?lat="+ $scope.lat+"&lon="+ $scope.lng+"&appid=2de143494c0b295cca9337e1e96b00e0"     
    $http.get(url).then(function(weather){
      // console.log(weather);
      // CLOUD NUMBER...WHAT DOES THIS MEAN???
      // console.log(weather.data.clouds);
      // main information
       console.log("wind degree: "+weather.data.wind.deg);
       console.log("Winde Speed: "+weather.data.wind.speed);

      // console.log("Temp: "+weather.data.main.temp);
      // console.log("Temp MIN: "+weather.data.main.temp_min);
      // console.log("Temp MAX: "+weather.data.main.temp_max);
      // console.log("Pressure: "+weather.data.main.pressure);
      // console.log("humidity: "+weather.data.main.humidity);


      // console.log(weather.data.main.rain);
      // console.log(weather.data.main.weather);
    });
  };
  




// breezeOmeter air info... API call
  var breezeData = function(){
    var url = "https://api.breezometer.com/baqi/?lat="+ $scope.lat +"&lon="+ $scope.lng +"&key=1827fecc1c064b05b2e2d07f90961a74";
    $http.get(url).then(function(data){
      if(data.data.data_valid === false){
        // $scope.error_message = data.data.error.message;
        // alert(data.data.error.message);
        // return;
      }
      $scope.data = {
        airQualityDesc: data.data.breezometer_description,
        airQualityIndex: data.data.breezometer_aqi,
        healthRecommendations: data.data.random_recommendations.health,
        dominantPollutant: data.data.dominant_pollutant_description,
        pollutionEffects: data.data.dominant_pollutant_text.effects
      };
      airQualityIndexGauage($scope.data.airQualityIndex);      
    });
  };

  $scope.initMap = function() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7833, lng: -85.4167},
      zoom: 8
    });
    var input = /** @type {!HTMLInputElement} */(
        document.getElementById('pac-input'));
// add a submit button
    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);
    var autocomplete = new google.maps.places.Autocomplete(input) ;
// { types: ['(cities)'], componentRestrictions : { country: 'usa' }}
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    // var marker = new google.maps.Marker({
    //   map: map,
    //   anchorPoint: new google.maps.Point(0, -29)
    // });

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      // marker.setVisible(false);
      var place = autocomplete.getPlace();
      

      // If the place has a geometry, then present it on a map.
      if(place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(16);  // Why 16? Because it looks good. :)
      }
       if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
      $scope.lat = place.geometry.location.lat();
      $scope.lng = place.geometry.location.lng();
      breezeData();
      solarEnergy();
      // weather();
      // airData();
      // CHECK TO SEE IF BREEZEOMETER DATA IS AVAILABLE. IF IT IS NOT AVAILABLE THEN RETURN A FLASH MESSAGE.
    });
  };
  $scope.initMap();






});


    
  