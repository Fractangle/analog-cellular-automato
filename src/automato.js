function makePlant(x, y, trunk=0.0, canopy=0.0) {
  return {
    'x': x,
    'y': y,
    'trunk': trunk,
    'canopy': canopy
  };
}

function clonePlant(oldPlant) {
  return makePlant(oldPlant.x, oldPlant.y, oldPlant.trunk, oldPlant.canopy);
}

function overlapOfCircles(d, r1, r2) {
  if(r1+r2 < d){return 0;}
  if(Math.abs(r1-r2) > d){return Math.min(r1,r2)*2}
  
  return (r1+r2)-d;
}

var plants = [];

function addPlant(x, y, trunk=0.0, canopy=0.0) {
  plants.push(makePlant(x, y, trunk, canopy));
}

function updateOverlaps() {
  for(var p=0; p<plants.length; p++) {
    plants[p].overlaps=[];
  }
  for(var p1=0; p1<plants.length-1; p1++) {
    for(var p2=p1+1; p2<plants.length; p2++) {
      let dx = plants[p1].x - plants[p2].x;
      let dy = plants[p1].y - plants[p2].y;
      let d = Math.sqrt(dx**2 + dy**2);
      let overlapDist = overlapOfCircles(d, plants[p1].canopy, plants[p2].canopy);
      plants[p1].overlaps.push(overlapDist);
      plants[p2].overlaps.push(overlapDist);
    }
  }
  for(var p=0; p<plants.length; p++) {
    let d = plants[p].canopy*2;
    plants[p].growthRate = plants[p].overlaps.reduce((a,b)=>a-(b/d), 1.0);
  }
}

function timewarp() {
  updateOverlaps();
}

function renderPlant(plant) {
  let plant_g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  let canopy = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  canopy.setAttribute('cx', plant.x);
  canopy.setAttribute('cy', plant.y);
  canopy.setAttribute('r', plant.canopy+1);
  canopy.setAttribute('stroke', '#00ff00');
  canopy.setAttribute('stroke-width', '1px');
  canopy.setAttribute('fill', '#00ff003f');
  plant_g.appendChild(canopy);
  let trunk = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  trunk.setAttribute('cx', plant.x);
  trunk.setAttribute('cy', plant.y);
  trunk.setAttribute('r', plant.trunk+1);
  trunk.setAttribute('stroke', '#553300');
  trunk.setAttribute('stroke-width', '1px');
  trunk.setAttribute('fill', '#5533003f');
  plant_g.appendChild(trunk);
  
  return plant_g;
}

function redraw(svg) {
  let plantsg = document.getElementById('plants');
  while(plantsg.firstChild) {
    plantsg.removeChild(plantsg.lastChild);
  }
  
  for(var i=0; i<plants.length; i++) {
    let plant = plants[i];
    plantsg.appendChild(renderPlant(plant));
  }
}

window.addEventListener('load', function() {
  var svg = document.getElementById('world');
  svg.onclick = function(event) {
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log(x, y);
    addPlant(x, y);
    redraw(svg);
  };
  
  var stepBtn = document.getElementById('step');
  stepBtn.onclick = function(event) {
    console.log("STEP");
    timewarp(0);
    redraw(svg);
  };
});