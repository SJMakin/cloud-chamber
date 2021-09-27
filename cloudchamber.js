var SCREEN_WIDTH;
var SCREEN_HEIGHT;

var canvas;
var context;
var particles = [];

const electron = () => {
  return {
    charge: -1,
    mass: 1
  }
};

const alpha = () => {
  return {
    charge: 2,
    mass: 1e4
  }
};

const other = () => {
  return {
    charge: 0,
    mass: Math.random() * 10
  }
}

const init = () => {
  canvas = document.getElementById('vapour');
  if (canvas && canvas.getContext) {
    context = canvas.getContext('2d');

    window.addEventListener('resize', windowResizeHandler, false);
    windowResizeHandler();
    setInterval(tick, 1000 / 60);
  }
  
  document.getElementById('alpha-count').textContent = 0;
  document.getElementById('beta-count').textContent = 0;
  document.getElementById('gamma-count').textContent = 0;
}

const windowResizeHandler = () => {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

  particles = [];
  
  for (var i = 0; i < 300; i++) {
    newParticle();
  }
}

const count = (particle) => {
  if (particle.charge == 0) {
    document.getElementById('gamma-count').textContent++;
  } else if (particle.charge > 0) {
    document.getElementById('alpha-count').textContent++;
  } else if (particle.charge < 0) {
    document.getElementById('beta-count').textContent++;
  }
}

const shiftAngle = (angle) => {
  return angle + (Math.random() - 0.5) * Math.PI * 0.5; // Angle change is limited to an arc of 0.5Pi radians centered around the original angle
}

const decay = (particle) => {
  switch (Math.round(Math.random() * 2000 - 0.5)) {
    case 0:
      return {
        ...particle,
        ...electron(),
        angle: shiftAngle(particle.angle)
      }
    case 1:
      return {
        ...particle,
        ...alpha(),
        angle: shiftAngle(particle.angle)
      };
    case 2:
      return {
        ...particle,
        ...other(),
        angle: shiftAngle(particle.angle)
      }
    default:
      return particle;
  }
}

const generateParticle = () => {
  //if (Math.random() * 1000 < 50) {
    newParticle();
  //}
}

const newParticle = () => {
  const particle = {
    size: 3,
    position: {
      x: SCREEN_WIDTH / 2,
      y: SCREEN_HEIGHT / 2
    },
    offset: 0,
    angle: Math.random() * Math.PI * 2,
    speed: Math.random() * 15 + 5,
    mass: Math.random() * 0.5 + 0.5,
    charge: Math.round(Math.random() * 2 - 1), // 50/50 chance of being charged. Of those that are charged, half are negative
    targetSize: 1, // radius of the dots, in pixels
    fillColor: '#c8c8c8' // '#' + (Math.random() * 0x404040 + 0xaaaaaa | 0).toString(16)
  }
  particles.push(particle);
}

const drawParticles = () => {
  for (var particle of particles) {
    while (particle.speed > 1.5 && particle.offset < 500) {
      let slowdown, variance;
      particle = decay(particle); // Apply a random 'decay' to the particle
      slowdown = Math.random() * 0.01 * Math.sqrt(particle.mass); // Random chance to slow down slightly
      variance = Math.random() * 0.5 + 0.5; // Linear path variance
      particle.speed = particle.speed * (1 - slowdown);
      particle.angle += Math.PI * 0.05 * particle.charge / (particle.speed * particle.mass);
      particle.offset++;

      // Determine the next position of a given particle
      particle.position.x = particle.position.x + particle.speed * Math.sin(particle.angle) * variance;
      particle.position.y = particle.position.y + particle.speed * Math.cos(particle.angle) * variance;

      context.beginPath();
      context.fillStyle = particle.fillColor;
      context.strokeStyle = particle.fillColor;
      context.stroke();
      context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
      context.fill();
    }
    // Add the appropriate particle count to the page
    count(particle);
    particles.shift();
  }
}

const tick = () => {
  generateParticle();
  drawParticles();

  // Particle Fade
  context.fillStyle = 'rgba(0,0,0,0.01)';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

window.onload = init;