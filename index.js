import * as THREE from 'three';
import gsap from 'gsap';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.6, 1200);
camera.position.z += 10;
camera.position.y -= 1;
camera.rotation.order = 'ZXY';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xff00000});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

const rendering = function() {
    requestAnimationFrame(rendering);
    renderer.render(scene, camera);
}

rendering();

let map, locationMarker;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    this.navigator.serviceWorker.register('service-worker.js').then(function(registration) {
      console.log('Registered');
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    }).catch(function(err) {
      console.log(err);
    });
  });
  } else {
    console.log('serivce-worker is not supported');
  }


// function success(position) {
//   const pos = {
//     lat: position.coords.latitude,
//     lng: position.coords.longitude
//   };
//   map.setCenter(pos);
//   locationMarker.setPosition(pos);
// }

// function getLocation() {
//   // Try HTML5 geolocation.
//   if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(
//       success,
//       () => {
//         handleLocationError(true, map.getCenter());
//       }
//     );
//   } else {
//     // Browser doesn't support Geolocation
//     handleLocationError(false, map.getCenter());
//   }
// }

// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 15,
//   });

//   const image =
//     "https://mbavier.github.io/HUD/location.png";

//   locationMarker = new google.maps.Marker({
//     position: { lat: -34.397, lng: 150.644 },
//     map,
//     icon: image
//   });
// }

// function handleLocationError(browserHasGeolocation, pos) {
//   console.log("no location");
// }

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
      window.addEventListener("keydown", (event) => {
        if (event.key == "ArrowUp") {
          gsap.to(camera.position, { duration:0.1, x: camera.position.x - 0.1*Math.sin(camera.rotation.y), z: camera.position.z - 0.1*Math.cos(camera.rotation.y)});
        } else if (event.key == "q" || event.key == "e") {
          if (event.key == "q") {
            relativeFacingRad += 5 * (Math.PI/180);
          } else if (event.key == "e") {
            relativeFacingRad -= 5 * (Math.PI/180);
          }
          if (Math.abs(relativeFacingRad) > 2*Math.PI) {
            relativeFacingRad = 0;
            
          }
          camera.rotation.y = relativeFacingRad;
        }
      });
}
}
let compassImage = document.getElementById('compass');

// let calibrationBeta = null;
// let calibrationGamma = null;
let currentFacingRad = null;
let relativeFacingRad = null;

// Motion Handler Shake method from Shake.js
let shakeThreshold = 0.8;
let lastMotion = {
  x: null,
  y: null,
  z: null
}

let currentNS = 0;
let currentEW = 0;
let timeout = 400;
let lastTime = new Date();


function MotionHandler(eventData) {
  let current = eventData.accelerationIncludingGravity;
  let deltaX = 0;
  let deltaY = 0;
  let deltaZ = 0;
  var timeDifference;
  var currentTime;
  
  if ((lastMotion.x == null) && (lastMotion.y == null) && (lastMotion.z == null)) {
    lastMotion.x = current.x;
    lastMotion.y = current.y;
    lastMotion.z = current.z;
    return;
  }

  deltaX = Math.abs(lastMotion.x - current.x);
  deltaY = Math.abs(lastMotion.y - current.y);
  deltaZ = Math.abs(lastMotion.z - current.z);
  console.log(deltaX, deltaY, deltaZ);
  if ((((deltaX > shakeThreshold) && (deltaY > shakeThreshold)) || ((deltaX > shakeThreshold) && (deltaZ > shakeThreshold)) || ((deltaY > shakeThreshold) && (deltaZ > shakeThreshold))) && currentFacingRad != null) {
    currentTime = new Date();
    timeDifference = currentTime.getTime() - lastTime.getTime();
    
    if (timeDifference > timeout) {
      currentNS -= Math.cos(relativeFacingRad);
      currentEW += Math.sin(relativeFacingRad);
      gsap.to(camera.position, { duration:0.1, x: camera.position.x - 0.1*Math.sin(camera.rotation.y), z: camera.position.z - 0.1*Math.cos(camera.rotation.y)});
      lastTime = new Date();
    }
  }

  lastMotion.x = current.x;
  lastMotion.y = current.y;
  lastMotion.z = current.z;
}



function OrientationHandler(eventData){
  // if (calibrationBeta == null) {
  //   calibrationBeta = eventData.beta;
  //   calibrationGamma = eventData.gamma;
  // }
  compassImage.style.transform = `rotate(${eventData.webkitCompassHeading}deg)`;
  currentFacingRad = eventData.webkitCompassHeading * (Math.PI/180);
  relativeFacingRad = eventData.beta * (Math.PI/180);
  camera.rotation.y = eventData.alpha * (Math.PI/180);
  camera.rotation.z = eventData.beta * (Math.PI/180);
  // if (eventData.beta - calibrationBeta > 5) {
  //   xDisplacement.innerHTML = `X Rotation = ${eventData.beta - calibrationBeta}`;
  // } else {
  //   xDisplacement.innerHTML = `X Rotation = 0`
  // }

  // if (eventData.gamma - calibrationGamma > 5) {
  //   yDisplacement.innerHTML = `Y Rotation = ${eventData.gamma - calibrationGamma}`;
  // } else {
  //   yDisplacement.innerHTML = `Y Rotation = 0`
  // }
  
  
}

document.getElementById('start').onclick = () => {
  time0 = performance.now();
  document.getElementById('start').style.display = "none";
  // document.getElementById('map').style.visibility = "visible";
  // getLocation()
  compassOrientation();
  //requestAnimationFrame(step);
};

// window.initMap = initMap;