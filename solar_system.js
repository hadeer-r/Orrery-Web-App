// Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";


// Fetch JSON data
async function loadJSONData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}
let planetData = {};
// Call the function to load your JSON file
loadJSONData('https://data.nasa.gov/resource/b67r-rgxc.json')
    .then(data => {
        console.log(data); // Do something with the loaded data
        planetData = data; // Store the data in a variable
        // You can process your JSON data here
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });






// Assuming you have already set up a Three.js scene

// Function to fetch comet data
async function fetchCometData() {
    const response = await fetch('https://data.nasa.gov/resource/b67r-rgxc.json');
    const comets = await response.json();
    return comets;
}

// Function to create and display comets
function displayComets(comets) {
    comets.forEach(comet => {
        // Create a small sphere for each comet
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const cometMesh = new THREE.Mesh(geometry, material);

        // Set comet position (you might want to use actual coordinates)
        cometMesh.position.set(Math.random() * 10, Math.random() * 10, Math.random() * 10); // Example positions

        // Add comet mesh to the scene
        scene.add(cometMesh);

        // Optionally, display comet names or other info
        const cometName = comet.comet_name; // Adjust based on actual data keys
        const textGeometry = new THREE.TextGeometry(cometName, { font: yourFont, size: 0.5, height: 0.1 });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Position the text above the comet
        textMesh.position.set(cometMesh.position.x, cometMesh.position.y + 0.5, cometMesh.position.z);
        scene.add(textMesh);
    });
}

// Main function to initialize the scene and load comets
async function init() {
    // Your Three.js scene setup code here

    // Fetch and display comets
    const comets = await fetchCometData();
    displayComets(comets);
}

// Call the init function
init();

//Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//////////////////////////////////////
//texture loader
const textureLoader = new THREE.TextureLoader();

//////////////////////////////////////
//import all texture
const sunTexture = textureLoader.load("image/8k_sun.jpg");
const mercuryTexture = textureLoader.load("image/8k_mercury.jpg");
const venusTexture = textureLoader.load("image/8k_venus_surface.jpg");
const earthTexture = textureLoader.load("image/earth.jpg");
const marsTexture = textureLoader.load("image/8k_mars.jpg");
const jupiterTexture = textureLoader.load("image/8k_jupiter.jpg");
const saturnTexture = textureLoader.load("image/8k_saturn.jpg");
const uranusTexture = textureLoader.load("image/2k_uranus.jpg");
const neptuneTexture = textureLoader.load("image/2k_neptune.jpg");
const plutoTexture = textureLoader.load("image/pluto.jpg");
const saturnRingTexture = textureLoader.load("image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("image/uranus_ring.png");
const earth_moonTexture = textureLoader.load("image/8k_moon.jpg");
const mars_PhobosTexture = textureLoader.load("image/phobos_mars1.jpg");
const mars_DeimosTexture = textureLoader.load("image/Deimos_mars2.jpg");

//////////////////////////////////////
// Creating scene
const scene = new THREE.Scene();
//////////////////////////////////////


//background
const backgroundTexture = textureLoader.load("image/8k_stars.jpg");
scene.background = backgroundTexture;


//////////////////////////////////////
//Perspective Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(-50, 90, 150);

//////////////////////////////////////
//Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);

//////////////////////////////////////
//sun
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);

//////////////////////////////////////
//sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);

//////////////////////////////////////
//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

//////////////////////////////////////
//path for planet
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
    const material = new THREE.LineBasicMaterial({
        color: color,
        linewidth: width,
    });
    const geometry = new THREE.BufferGeometry();
    const lineLoopPoints = [];

    // Calculate points for the circular path
    const numSegments = 100; // Number of segments to create the circular path
    for (let i = 0; i <= numSegments; i++) {
        const angle = (i / numSegments) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        lineLoopPoints.push(x, 0, z);
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(lineLoopPoints, 3)
    );
    const lineLoop = new THREE.LineLoop(geometry, material);
    scene.add(lineLoop);
    path_of_planets.push(lineLoop);
}

///////////////////////////////////////
//create planet
const genratePlanet = (size, planetTexture, x, ring) => {
    const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: planetTexture,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    const planetObj = new THREE.Object3D();
    planet.position.set(x, 0, 0);
    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32
        );
        const ringMat = new THREE.MeshBasicMaterial({
            map: ring.ringmat,
            side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        planetObj.add(ringMesh);
        ringMesh.position.set(x, 0, 0);
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(planetObj);

    planetObj.add(planet);
    createLineLoopWithMesh(x, 0xffffff, 3);
    return {
        planetObj: planetObj,
        planet: planet,
    };
};


// Function to create the Moon and add it to Earth
const generateMoon = (size, earth_moonTexture, distanceFromEarth) => {
    const moonGeometry = new THREE.SphereGeometry(size, 50, 50);
    const moonMaterial = new THREE.MeshStandardMaterial({ map: earth_moonTexture });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Position the moon relative to Earth
    const MoonObj = new THREE.Object3D();
    moon.position.set(distanceFromEarth, 0, 0);

    scene.add(MoonObj);

    MoonObj.add(moon);
    // createLineLoopWithMesh(MoonObj, 0xffffff, 3);
    return {
        moonOrbit: MoonObj,
        moon: moon,
    };
};



const planets = [
    {
        ...genratePlanet(3.2, mercuryTexture, 28), // Mercury's diameter should be about 4,880 km
        rotaing_speed_around_sun: 0.004, // Mercury takes about 88 Earth days to orbit the Sun
        self_rotation_speed: 0.004, // Mercury rotates very slowly, one rotation takes about 58.6 Earth days
    },
    {
        ...genratePlanet(5.8, venusTexture, 44), // Venus' diameter should be about 12,104 km
        rotaing_speed_around_sun: 0.015, // Venus takes about 225 Earth days to orbit the Sun
        self_rotation_speed: 0.002, // Venus rotates very slowly and in the opposite direction (retrograde), taking about 243 Earth days per rotation
    },
    {
        ...genratePlanet(6, earthTexture, 62), // Earth's diameter is approximately 12,742 km
        rotaing_speed_around_sun: 0.01, // Earth takes 365.25 days to orbit the Sun
        self_rotation_speed: 0.02, // Earth rotates once every 24 hours
        moons: [
            generateMoon(2.5, earth_moonTexture, 85) // Earth's moon
        ],  // Adding the moon here

    },
    {
        ...genratePlanet(4, marsTexture, 78), // Mars' diameter should be about 6,779 km
        rotaing_speed_around_sun: 0.008, // Mars takes about 687 Earth days to orbit the Sun
        self_rotation_speed: 0.018, // Mars rotates once every 24.6 hours
        moons: [
            generateMoon(2.5, mars_PhobosTexture, 85), // Phobos
            generateMoon(1, mars_DeimosTexture, 90) // Deimos
        ],
    },
    {
        ...genratePlanet(12, jupiterTexture, 100), // Jupiter's diameter is about 139,820 km
        rotaing_speed_around_sun: 0.002, // Jupiter takes about 12 Earth years to orbit the Sun
        self_rotation_speed: 0.04, // Jupiter rotates very quickly, once every 10 hours
    },
    {
        ...genratePlanet(10, saturnTexture, 138, {
            innerRadius: 10,
            outerRadius: 20,
            ringmat: saturnRingTexture,
        }), // Saturn's diameter is about 116,460 km
        rotaing_speed_around_sun: 0.0009, // Saturn takes about 29.5 Earth years to orbit the Sun
        self_rotation_speed: 0.038, // Saturn rotates once every 10.7 hours
    },
    {
        ...genratePlanet(7, uranusTexture, 176, {
            innerRadius: 7,
            outerRadius: 12,
            ringmat: uranusRingTexture,
        }), // Uranus' diameter is about 50,724 km
        rotaing_speed_around_sun: 0.0004, // Uranus takes about 84 Earth years to orbit the Sun
        self_rotation_speed: 0.03, // Uranus rotates once every 17 hours
    },
    {
        ...genratePlanet(7, neptuneTexture, 200), // Neptune's diameter is about 49,244 km
        rotaing_speed_around_sun: 0.0001, // Neptune takes about 165 Earth years to orbit the Sun
        self_rotation_speed: 0.032, // Neptune rotates once every 16 hours
    },
    {
        ...genratePlanet(2.8, plutoTexture, 216), // Pluto's diameter is about 2,377 km
        rotaing_speed_around_sun: 0.0007, // Pluto takes about 248 Earth years to orbit the Sun
        self_rotation_speed: 0.008, // Pluto rotates once every 6.4 Earth days
    },


];


// Ensure you add the moon orbit object to the planet object
planets[2].planetObj.add(planets[2].moons[0].moonOrbit); // Adding Earth's moon to Earth
planets[3].planetObj.add(planets[3].moons[0].moonOrbit); // Adding Phobos to Mars
planets[3].planetObj.add(planets[3].moons[1].moonOrbit); // Adding Deimos to Mars

//////////////////////////////////////
//NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
    "Real view": true,
    "Show path": true,
    speed: 1,
};
gui.add(options, "Real view").onChange((e) => {
    ambientLight.intensity = e ? 0 : 0.5;
});
gui.add(options, "Show path").onChange((e) => {
    path_of_planets.forEach((dpath) => {
        dpath.visible = e;
    });
});
const maxSpeed = new URL(window.location.href).searchParams.get("ms") * 1;
gui.add(options, "speed", 0, maxSpeed ? maxSpeed : 20);

//////////////////////////////////////
const planetNames = [
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
    "earthMoon"
];

const planetDataa = {
        sun: "The Sun is the star at the <br> center of our solar system.",
        mercury: "Mercury is the smallest <br>  planet in our solar system <br> and the closest to the Sun.",
        venus: "Venus is the second planet <br> from the Sun and is similar <br> in size to Earth.",
        earth: "Earth is the third planet <br> from the Sun and the only <br> known planet to support life.",
        mars: "Mars is known as the Red Planet <br> due to its reddish appearance.",
        jupiter: "Jupiter is the largest planet <br> in our solar system.",
        saturn: "Saturn is famous for <br> its stunning rings.",
        uranus: "Uranus is unique for its sideways <br> rotation and blue color.",
        neptune: "Neptune is the farthest planet<br> from the Sun and is known<br> for its strong winds.",
        pluto: "Pluto was reclassified <br> as a dwarf planet in 2006."
    };
// Initialize raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const planetNameDiv = document.getElementById('planet-name');
const planetInfoDiv = document.getElementById('planet-info'); // Define it here



// Event listener for mouse movement
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
const planetsWithSun = [sun, ...planets.map(p => p.planet)];

// Update planet name display based on mouse hover
function updatePlanetName() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetsWithSun);

    const planetNameDiv = document.getElementById('planet-name');
    
    // Log intersects to verify intersection
    console.log('Intersects:', intersects);

    if (intersects.length > 0) {
        const planetIndex = planetsWithSun.findIndex(p => p === intersects[0].object);
        if (planetIndex !== -1) {
            const planetName = planetNames[planetIndex];
            planetNameDiv.textContent = planetName;
            console.log('Planet Name:', planetName);  // Verify planet name

             // Use the planetDataa object to get information
            const planetKey = planetNames[planetIndex].toLowerCase(); // Get the lowercase key for the planet
            const planetInfo = planetDataa[planetKey]; // Retrieve info from planetDataa

       if (planetInfo) {
                planetInfoDiv.innerHTML = `
                   ${planetInfo}
                `;
            }
        }
    } else {
        planetNameDiv.textContent = '';
         planetInfoDiv.innerHTML = '';
    }
}

console.log(planetData);


//////////////////////////////////////
//Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    
    planets.forEach((planet) => {
        // Rotate planets
        planet.planet.rotation.y += planet.self_rotation_speed * options.speed;
        planet.planetObj.rotation.y += planet.rotaing_speed_around_sun * options.speed;

        // Check if the planet has moons
        if (planet.moons && planet.moons.length > 0) {
            // Update moon's orbit
            // Moon's orbiting speed

            planet.moons.forEach((moon) => {

                // Update moon self-rotation
                mooon.moonOrbit.rotation.y = 0.005 * planet.planetObj.rotation.y;
                moon.moon.rotation.y += 0.01 * options.speed; // Moon self-rotation

                // Ensure the moon is added to its parent orbit
                // if (!planet.moonOrbit.children.includes(moon.moon)) {
                //     planet.moonOrbit.add(moon.moon); // Ensure the moon is added if not already present
                // }
            });
        }
    });

    updatePlanetName(); // Update planet name on each frame
    orbit.update();
    
    renderer.render(scene, camera);
};


animate();

//////////////////////////////////////
//Adjust camera on window resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Asteroids/Comets around Earth
// Asteroids/Comets around Earth
// function createAsteroids() {
//     const asteroidGroup = new THREE.Group();
//     const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 575689 });
//     let p = 20;
//     for (let i = 0; i < 15; i++) {
//         const size = Math.random() * 10;
//         const geometry = new THREE.SphereGeometry(size, 16, 16);
//         const asteroid = new THREE.Mesh(geometry, asteroidMaterial);

//         // Adjust the position around Earth
//         asteroid.position.set(
//             planets[2].planetObj.position.x + p, // Random offset around Earth
//             planets[2].planetObj.position.y + p, // Random offset around Earth
//             planets[2].planetObj.position.z   // Random offset around Earth
//         );
        
//         asteroidGroup.add(asteroid);
//         p +=10;
//     }
    
//     scene.add(asteroidGroup);
//     console.log("Asteroids added to the scene:", asteroidGroup.children.length); // Log the number of asteroids added
// }

// createAsteroids();


// Add light source for the Sun
// const sunLight = new THREE.PointLight(0xFFFFFF, 2, 100);
// sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// const apiKey = '4d2L3TDs3TJAQwG8mcEaVk6Hc1dBa6QFYfHdV63M';  // Replace with your NASA API key
// const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-10-01&end_date=2024-10-07&api_key=${apiKey}`;
// const asteroidTexture = textureLoader.load('image/asteroid4.png');
// console.log('Asteroid Texture:', asteroidTexture);

// function displayAsteroidsAroundPlanets(planets, asteroidsData) {
//     Object.keys(asteroidsData).forEach(date => {
//         asteroidsData[date].forEach(asteroid => {
//             planets.forEach(planetData => {
//                 const planetPosition = planetData.position;
//                 const asteroidName = asteroid.name;

//                 const diameterKm = (asteroid.estimated_diameter.kilometers.estimated_diameter_max + asteroid.estimated_diameter.kilometers.estimated_diameter_min) / 2;
//                 const velocity = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second); // Velocity in km/s

//                 const geometry = new THREE.SphereGeometry(diameterKm * 100, 32, 32);  // Scale the size of the asteroid
//                 const material = new THREE.MeshBasicMaterial({ map: asteroidTexture });
//                 const asteroidMesh = new THREE.Mesh(geometry, material);

//                 console.log('Asteroid Mesh:', asteroidMesh);

//                 const radius = 5 + Math.random() * 10; // Random radius around planet
//                 const angle = Math.random() * Math.PI * 2; // Random angle for position
//                 asteroidMesh.position.set(
//                     planetPosition.x + radius * Math.cos(angle),
//                     planetPosition.y,
//                     planetPosition.z + radius * Math.sin(angle)
//                 );

//                 scene.add(asteroidMesh);
//                 console.log('Asteroid added to scene:', asteroidMesh);

//                 asteroidMesh.userData = {
//                     velocity: velocity / 1000,  // Convert km/s to units more suitable for the scene
//                     angle: angle,
//                     radius: radius,
//                     planetPosition: planetPosition
//                 };

//                 const textGeometry = new THREE.TextGeometry(asteroidName, { font: yourFont, size: 30, height: 20 });
//                 const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//                 const textMesh = new THREE.Mesh(textGeometry, textMaterial);
//                 textMesh.position.set(asteroidMesh.position.x, asteroidMesh.position.y + 0.5, asteroidMesh.position.z);
//                 scene.add(textMesh);
//                 console.log('Text added to scene:', textMesh);
//             });
//         });
//     });
// }

// function animateAsteroids() {
//     scene.traverse(object => {
//         if (object.userData.velocity) {
//             object.userData.angle += object.userData.velocity * 5; 
//             object.position.set(
//                 object.userData.planetPosition.x + object.userData.radius * Math.cos(object.userData.angle),
//                 object.userData.planetPosition.y,
//                 object.userData.planetPosition.z + object.userData.radius * Math.sin(object.userData.angle)
//             );
//             console.log('Asteroid position updated:', object.position);
//         }
//     });
// }

// fetch(apiUrl)
//     .then(response => response.json())
//     .then(data => {
//         const asteroids = data.near_earth_objects;
//         console.log('Fetched Asteroids Data:', asteroids);
//         displayAsteroidsAroundPlanets(planets, asteroids);
//     })
//     .catch(error => console.error('Error fetching asteroid data:', error));

// function render() {
//     requestAnimationFrame(render);
//     animateAsteroids();  // Update asteroid positions
//     renderer.render(scene, camera);
// }
// render();
