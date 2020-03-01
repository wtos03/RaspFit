import * as messaging from "messaging";
import document from "document";

const APORT = 4; // Digital port 0 - 4,  Analog port 5-9
let step = 20;   // Default value for Servo
let tumbler = document.getElementById("tumbler");


tumbler.onselect = function(evt) {
  chktumbler();
} 


function  chktumbler() {
  let selectedIndex = tumbler.value;
  let selectedItem = tumbler.getElementById("item" + selectedIndex);
  let selectedValue = selectedItem.getElementById("content").text; 
  let pt =  document.getElementById("porttype");
  
  console.log(`index: ${selectedIndex} :: value: ${selectedValue}`);

  if (selectedIndex > APORT)
    // Analog Port
      pt.text = "Analog";
  else
      pt.text = "Digital";
  return selectedValue;
}


let btnBR = document.getElementById("btn-br");
btnBR.onactivate = function(evt) {
  let msg = chktumbler();
  console.log("Off Pressed " + msg);
  messaging.peerSocket.send("Port="+msg+",switch=0");

} 


let btnTR = document.getElementById("btn-tr");
btnTR.onactivate = function(evt) {
  let msg = chktumbler();
  console.log("On Pressed " + msg);
  messaging.peerSocket.send("Port="+msg+",switch=1");
} 


let btnBL = document.getElementById("btn-bl");
btnBL.onactivate = function(evt) {
  let msg = chktumbler();
  console.log("Decrease Pressed " + msg);
  messaging.peerSocket.send("Port="+msg+",value="+(0-step));
} 


let btnTL = document.getElementById("btn-tl");
btnTL.onactivate = function(evt) {
  let msg = chktumbler();
  console.log("Increase Pressed " + msg);
  messaging.peerSocket.send("Port="+msg+",value="+step);
}  

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  messaging.peerSocket.send("Port=opened"+",Step="+step);
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  step = parseInt(evt.data[0]);
}

messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.error(`ERROR: ${e`);
}





