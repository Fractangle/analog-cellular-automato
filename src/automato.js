window.addEventListener('load', function() {
  var canvas = document.getElementById('theCanvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#553300';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});