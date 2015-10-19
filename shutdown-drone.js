var arDrone = require('ar-drone');
var client  = arDrone.createClient();

console.log("Shutting down drone...");
client.stop();
client.land();
console.log("Shut down drone!");

process.exit();
