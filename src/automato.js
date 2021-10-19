function makePlant(x, y, r=0.0, age=0.0) {
  return {
    'x': x,
    'y': y,
    'r': r,
    'age': age
  };
}

function copyPlant(oldPlant) {
  return makePlant(oldPlant.x, oldPlant.y, oldPlant.r, oldPlant.age);
}

var plants = [];

function addPlant(x, y, r=0.0, age=0.0) {
  plants.push(makePlant(x, y, r, age));
}

function dist(a, b) {
  let dx = a.x-b.x;
  let dy = a.y-b.y;
  return Math.sqrt(dx*dx + dy*dy);
}

function areYouMyNeighbor(a, b) {
  let d = dist(a, b);
  let r = a.r+b.r;
  return d<r;
}

function areWeThereYet(a, b) {
  let d = dist(a, b);
  let r = a.r+b.r;
  let gap = d-r;
  let delta = a.growthRate + b.growthRate;
  
  if(gap*delta>0) {
    return gap/delta;
  } else {
    return Number.MAX_VALUE;
  }
}

function calcStep() {
  let newPlants = [];
  plants.forEach(p => newPlants.push(copyPlant(p)));
  
  newPlants.forEach(p => {p.neighbors=0;});
  for(var a=0; a<plants.length-1; a++) {
    for(var b=a+1; b<newPlants.length; b++) {
      if(areYouMyNeighbor(plants[a], plants[b])) {
        newPlants[a].neighbors++;
        newPlants[b].neighbors++;
      }
    }
  }
  
  for(var i=0; i<plants.length; i++) {
    switch(newPlants[i].neighbors) {
      case 0:  newPlants[i].growthRate =  1.0; break;
      case 1:  newPlants[i].growthRate =  0.6; break;
      case 2:  newPlants[i].growthRate =  0.2; break;
      case 3:  newPlants[i].growthRate = -0.2; break;
      case 4:  newPlants[i].growthRate = -0.6; break;
      default: newPlants[i].growthRate = -1.0; break;
    }
  }
  
  let soon = {'dt':Number.MAX_VALUE};
  
  for(var a=0; a<plants.length-1; a++) {
    for(var b=a+1; b<plants.length; b++) {
      let dt = areWeThereYet(newPlants[a], newPlants[b]);
      if(dt < soon.dt) {
        soon.type = "OVERLAP";
        soon.a = a;
        soon.b = b;
        soon.dt = dt;
      }
    }
  }
  
  for(var i=0; i<plants.length; i++) {
    if(newPlants[i].growthRate < 0) {
      let dt = newPlants[i].r/Math.abs(newPlants[i].growthrate);
      if(dt < soon.dt) {
        soon.type = "WILT";
        soon.i = i;
        soon.dt = dt;
      }
    }
  }
  
  if(soon.dt < Number.MAX_VALUE-1) {
    newPlants.forEach(p => {
      p.r += soon.dt*p.growthRate;
      p.age += soon.dt;
    });
    plants = [];
    newPlants.forEach(p => plants.push(copyPlant(p)));
  }
}

function renderPlant(plant) {
  let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  let p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  p.setAttribute('cx', plant.x);
  p.setAttribute('cy', plant.y);
  p.setAttribute('r', plant.r+1);
  p.setAttribute('stroke', '#00ff00');
  p.setAttribute('stroke-width', '1px');
  p.setAttribute('fill', '#00ff003f');
  g.append(p);
  
  // let t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  // t.setAttribute('x', plant.x);
  // t.setAttribute('y', plant.y);
  // t.setAttribute('stroke', '#fff');
  // t.setAttribute('fill', '#fff');
  // t.textContent=plant.age;
  // g.append(t);
  
  return g;
}

function redraw(svg) {
  let plantsGroup = document.getElementById('plants');
  while(plantsGroup.firstChild) {
    plantsGroup.removeChild(plantsGroup.lastChild);
  }
  for(const i in plants) {
    plantsGroup.append(renderPlant(plants[i]));
  }
}

window.addEventListener('load', function() {
  var svg = document.getElementById('world');
  svg.onclick = function(event) {
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    addPlant(x, y);
    redraw(svg);
  };
  
  var stepBtn = document.getElementById('step');
  stepBtn.onclick = function(event) {
    calcStep();
    redraw(svg);
  };
});