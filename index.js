let map, locationMarker;


function success(position) {
  const pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
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

  if (window.DeviceOrientationEvent) {
    DeviceOrientationEvent['requestPermission']()
    .then(permissionState => {
    if (permissionState === 'granted') {
    window.addEventListener('deviceorientation', (event) =>  {
          var alpha = null;
          //Check for iOS property
          if (event.webkitCompassHeading) {
              alpha = event.webkitCompassHeading;
          }
          //non iOS
          else {
              alpha = event.alpha;
          }
          console.log(360 - alpha);
          myLocationMarker.set('icon', locationIcon);
      }, false);
  }
}


document.getElementById('start').onclick = () => {
  time0 = performance.now();
  document.getElementById('start').style.display = "none";
  document.getElementById('map').style.visibility = "visible";
  //getLocation()
  compassOrientation();
  //requestAnimationFrame(step);
};

window.initMap = initMap;