let map, locationMarker;

let xDisplacement = document.getElementById('x-displacement');
let yDisplacement = document.getElementById('y-displacement');

function success(position) {
  const pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
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
  } else {
      
      // for non ios devices
      console.log("NonIOS! ");
  }

}
let compassImage = document.getElementById('compass');

let calibrationBeta = null;
let calibrationGamma = null;

function OrientationHandler(eventData){
  if (calibrationBeta == null) {
    calibrationBeta = eventData.beta;
    calibrationGamma = eventData.gamma;
  }
  compassImage.style.transform = `rotate(${eventData.webkitCompassHeading}deg)`;
  if (eventData.beta - calibrationBeta > 5) {
    xDisplacement.innerHTML = `X Rotation = ${eventData.beta - calibrationBeta}`;
  } else {
    xDisplacement.innerHTML = `X Rotation = 0`
  }

  if (eventData.gamma - calibrationGamma > 5) {
    yDisplacement.innerHTML = `Y Rotation = ${eventData.gamma - calibrationGamma}`;
  } else {
    yDisplacement.innerHTML = `Y Rotation = 0`
  }
  
  
}

document.getElementById('start').onclick = () => {
  time0 = performance.now();
  document.getElementById('start').style.display = "none";
  document.getElementById('map').style.visibility = "visible";
  getLocation()
  compassOrientation();
  //requestAnimationFrame(step);
};

window.initMap = initMap;