import { me } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";


// Get value from setting
var step,wsUri

getSettings();

console.log ("Socket Address = ",wsUri);
const websocket = new WebSocket(wsUri);

websocket.addEventListener("open", onOpen);
websocket.addEventListener("close", onClose);
websocket.addEventListener("message", onMessage);
websocket.addEventListener("error", onError);

function onOpen(evt) {
   console.log("CONNECTED");
   websocket.send('Port=connectd,on=0');
}

function onClose(evt) {
   console.log("DISCONNECTED");
}

function onMessage(evt) {
   console.log(`MESSAGE: ${evt.data}`);
}

function onError(evt) {
   console.error(`ERROR: ${evt.data}`);
}

//---------

settingsStorage.onchange = function(evt) {
  getSettings();
  sendSettings();
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  sendSettings();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  let cmd = JSON.stringify(evt.data);
  console.log(cmd);
  websocket.send (cmd);
}

function getSettings() {
  
let url = settingsStorage.getItem("ipAddress");
console.log ("URL :",url)
if (url == null) {
    try {
     url = "192.168.1.3:4000";
    }
    catch (e) {
      console.log("error parsing setting value: " + e);
    }
}
 else {
   var ip = JSON.parse(url);
   url = ip.name;
 }
   
  wsUri = "ws://"+url;
  step = settingsStorage.getItem("stepAnalog");
  if (step == null)
    step = 20;
  console.log ("ws : "+url + "  Steps : " + step);
}

function sendSettings() {
   if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      // Limit results to the number of tiles available in firmware
      let analog = [step];
      messaging.peerSocket.send(analog);
    } 
}
