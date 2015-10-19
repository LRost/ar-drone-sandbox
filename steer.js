var arDrone = require('ar-drone');
var client  = arDrone.createClient();

var XboxController = require('xbox-controller');
var xbox = new XboxController();

console.log(xbox.serialNumber + ' online');

const DEFAULT_MOVEMENT_SPEED = 0.2;

// Emergency mode, calibrate and flat trim
xbox.on('start:press', function (key) {
  console.log('start:press - recover from emergency mode');
  client.disableEmergency();
  client.land();
});

xbox.on('back:press', function (key) {
  console.log('back:press - calibrate magnetometer');
  client.calibrate(0);
});

xbox.on('y:press', function (key) {
  console.log('y:press - flat trim');
  client.ftrim();
});

// Takeoff and land
xbox.on('a:press', function (key) {
  console.log('a:press - takeoff');
  client.takeoff();
});

xbox.on('b:press', function (key) {
  console.log('b:press - land');
  client.land();
});

xbox.on('x:press', function (key) {
  console.log('x:press - stop and land');
  client.stop();
  client.land();
});

// Movement - Up and down
xbox.on('lefttrigger', function(position){
  var movement_speed = position * 1/255;

  if (position === 0) {
    console.log('lefttrigger:0 - stop')
    client.stop();
  } else {
    console.log('lefttrigger:' + position + '- down')
    console.log('movement speed: -' + movement_speed);
    client.down(movement_speed);
  };
});

xbox.on('righttrigger', function(position){
  var movement_speed = position * 1/255;
  console.log('movement speed: ' + movement_speed);

  if (position === 0) {
    console.log('righttrigger:0 - stop')
    client.stop();
  } else {
    console.log('righttrigger:' + position + '- up')
    client.up(movement_speed);
  };
});

// Movement - Rotate clockwise and counterclockwise
xbox.on('leftshoulder:press', function (key) {
  console.log('leftshoulder:press - rotate counterclockwise');
  client.counterClockwise(DEFAULT_MOVEMENT_SPEED);
});

xbox.on('leftshoulder:release', function (key) {
  console.log('leftshoulder:release - stop');
  client.stop();
});

xbox.on('rightshoulder:press', function (key) {
  console.log('rightshoulder:press - rotate clockwise');
  client.clockwise(DEFAULT_MOVEMENT_SPEED);
});

xbox.on('rightshoulder:release', function (key) {
  console.log('rightshoulder:release - stop');
  client.stop();
});

// Movement - Pitch (front/back) and roll (left/right)
var moving = false;

xbox.on('left:move', function(position) {
  if (moving && position.x === 0 && position.y === 0) {
    console.log('left:move - stop');
    moving = false;
    client.stop();
  };

  if (position.x != 0 || position.y != 0) {
    console.log('left:move - moving');
    moving = true;

    var movement_speed_x = Math.abs(position.x * 1/32768);
    var movement_speed_y = Math.abs(position.y * 1/32768);
    console.log('movement speed x: ' + movement_speed_x);
    console.log('movement speed y: ' + movement_speed_y);

    // (x < 0) -> left
    // (x > 0) -> right

    // (y < 0) -> front
    // (y > 0) -> back

    if (position.x < 0) {
      // Go left
      console.log('left:move:x:' + position.x + ' - moving:left');
      client.left(movement_speed_x);
    } else {
      // Go right
      console.log('left:move:x:' + position.x + ' - moving:right');
      client.right(movement_speed_x);
    };

    if (position.y < 0) {
      // Go front
      console.log('left:move:y:' + position.y + ' - moving:front');
      client.front(movement_speed_y);
    } else {
      // Go back
      console.log('left:move:y:' + position.y + ' - moving:back');
      client.back(movement_speed_y);
    };

    // var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'left:move', action:position });
    // console.log(message);
  }
});
