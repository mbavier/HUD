function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


let map, locationMarker;

let xDisplacement = document.getElementById('x-displacement');
let yDisplacement = document.getElementById('y-displacement')

var lastPos = {
  lat: null,
  lng: null
};

function success(position) {
  const pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
  if (lastPos.lat == null) {
    lastPos = pos;
  }
  let heading = position.heading;
  if (lastPos.lat != pos.lat || lastPos.lng != pos.lng) {
    let distance = getDistanceFromLatLon(lastPos.lat, lastPos.lng, pos.lat, pos.lng);
    console.log(distance, heading);
    xDisplacement.innerHTML = `X: ${distance * Math.cos(heading)}`;
    yDisplacement.innerHTML = `Y: ${distance * Math.sin(heading)}`;
  }
  map.setCenter(pos);
  locationMarker.setPosition(pos);
}

function getLocation() {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      success,
      () => {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,
  });

  const image =
    "https://mbavier.github.io/HUD/location.png";

  locationMarker = new google.maps.Marker({
    position: { lat: -34.397, lng: 150.644 },
    map,
    icon: image
  });
}

function handleLocationError(browserHasGeolocation, pos) {
  console.log("no location");
}

let time0, time1;

// function step() {
//   time1 = performance.now();
//   if (time1 - time0 >= 10000) {
//     ;
//     time0 = time1;
//   }
//   requestAnimationFrame(step);
  
// }

function compassOrientation() {

  if (typeof DeviceMotionEvent.requestPermission === 'function') {
                      
    // for IOS devices
    console.log("IOS!");
    
    // get device orientation sensor data
    DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
            window.addEventListener('deviceorientation', OrientationHandler, true);
        }else if (result.state === 'prompt') {
          console.log("Need prompt!");
        }else{
          console.log("Not Supported!");
        }
    }).catch(console.error)

  //   DeviceMotionEvent.requestPermission().then(response => {
  //     if (response === 'granted') {
  //         window.addEventListener('devicemotion', MotionHandler, true);
  //     }else if (result.state === 'prompt') {
  //       console.log("Need prompt!");
  //     }else{
  //       console.log("Not Supported!");
  //     }
  // }).catch(console.error)
  } else {
      
      // for non ios devices
      console.log("NonIOS! ");
  }

}
let compassImage = document.getElementById('compass');

function OrientationHandler(eventData){
  compassImage.style.transform = `rotate(${eventData.webkitCompassHeading}deg)`;
}
// function MotionHandler(eventData){
//   xDisplacement.innerHTML = `X: ${eventData.webkit}`
// }

document.getElementById('start').onclick = () => {
  time0 = performance.now();
  document.getElementById('start').style.display = "none";
  document.getElementById('map').style.visibility = "visible";
  getLocation()
  compassOrientation();
  //requestAnimationFrame(step);
};

window.initMap = initMap;