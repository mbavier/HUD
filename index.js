let map, locationMarker;

let xDisplacement = document.getElementById('x-displacement');
let yDisplacement = document.getElementById('y-displacement')

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

    DeviceMotionEvent.requestPermission().then(response => {
      if (response === 'granted') {
          window.addEventListener('devicemotion', MotionHandler, true);
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

function OrientationHandler(eventData){
  compassImage.style.transform = `rotate(${eventData.webkitCompassHeading}deg)`;
}

let xArray = [];
let yArray = [];

let prevDisplacementX = 0;
let prevDisplacementY = 0;
let prevVelocityX = 0;
let prevVelocityY = 0;
let prevTime = 0;
function MotionHandler(eventData){
  
  let timeDiff = eventData.timeStamp - prevTime;
  prevTime = eventData.timeStamp;

  xArray.push(eventData.acceleration.x);
  yArray.push(eventData.acceleration.y);

  if(xArray.length >= 64) {
    xArray.shift();
    yArray.shift();
  }

  let xTotal = xArray.reduce( (total, val) => {
    total += val;
    return total;
  });

  let yTotal = yArray.reduce( (total, val) => {
    total += val;
    return total;
  });

  let runningXAverage = xTotal / 64;
  let runningYAverage = yTotal / 64;
  console.log(runningXAverage, runningYAverage);
  prevVelocityX = runningXAverage * (timeDiff/1000) + prevVelocityX;
  prevDisplacementX = (prevVelocityX * (timeDiff/1000)) /*+ (runningXAverage * Math.pow((timeDiff/1000),2))*/ + prevDisplacementX;
  xDisplacement.innerHTML = `X: ${prevDisplacementX}`;

  prevVelocityY = runningYAverage * (timeDiff/1000) + prevVelocityY;
  prevDisplacementY = (prevVelocityY * (timeDiff/1000)) /*+ (runningYAverage * Math.pow((timeDiff/1000),2))*/ + prevDisplacementY;
  yDisplacement.innerHTML = `Y: ${prevDisplacementY}`;
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