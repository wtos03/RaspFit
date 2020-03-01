
const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;
const D1 = 5;
const D2 = 6;
const D3 = 13;
const D4 = 19;
const D5 = 26;
const A1 = 25;
const A2 = 12;
const A3 = 16;
const A4 = 20;
const A5 = 21;
const MAXMOVE = 2500;
const MINMOVE = 500;

const IO1 = new Gpio(D1,{mode: Gpio.OUTPUT});
const IO2 = new Gpio(D2,{mode: Gpio.OUTPUT});
const IO3 = new Gpio(D3,{mode: Gpio.OUTPUT});
const IO4 = new Gpio(D4,{mode: Gpio.OUTPUT});
const IO5 = new Gpio(D5,{mode: Gpio.OUTPUT});

const IO6 = new Gpio(A1,{mode: Gpio.OUTPUT});
const IO7 = new Gpio(A2,{mode: Gpio.OUTPUT});
const IO8 = new Gpio(A3,{mode: Gpio.OUTPUT});
const IO9 = new Gpio(A4,{mode: Gpio.OUTPUT});
const IO10 = new Gpio(A5,{mode: Gpio.OUTPUT});

var position = {servo1:0,servo2:0,servo3:0,servo4:0,servo5:0 };






const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });
var lightvalue = 1;
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var str = message.split(",");
    var tmp = str[0].split("=");
    var port  = tmp[1];
        tmp = str[1].split("=");
    var command = tmp[0];
    var value = parseInt(tmp[1]);

    console.log ('Port = %s Command = %s Value = %s',port,command,value); 
    processport(port,value);
  });
  ws.on('close', function close() {
    console.log('disconnect');
 });
  ws.send('Send from Socket Server');
});

// Check value for digital must be 1 or 0
function chkvalue (value)
{
   if (value > 1)
	value = 1;
   if (value < 0)
	value = 0;
   return value;
}

function processport (port,value)
{
   if (port == "01")
   { 	
	value = chkvalue(value);
	IO1.digitalWrite(value); //turn LED on or off   
   }
   if (port == "02")
   {
	value = chkvalue(value);
 	IO2.digitalWrite(value); //turn LED on or off   
   }
   if (port == "03")
   {
	value = chkvalue(value);
 	IO3.digitalWrite(value); //turn LED on or off   
   }
   if (port == "04")
   {
	value = chkvalue(value);
 	IO4.digitalWrite(value); //turn LED on or off   
   }
   if (port == "05")
   {
	value = chkvalue(value);
 	IO5.digitalWrite(value); //turn LED on or off   
   }

// Analog port drivers will vary depend on devices
   if ( port == "06")
   {
   	position.servo1 = servoDriver(IO6,value,position.servo1);    
   }
   if ( port == "07")
   {
   	position.servo2 = servoDriver(IO7,value,position.servo2);    
   }
   if ( port == "08")
   {
   	position.servo3 = servoDriver(IO8,value,position.servo3);    
   }
   if ( port == "09")
   {
   	position.servo4 = servoDriver(IO9,value,position.servo4);    
   }
   if ( port == "10")
   {
   	position.servo5 = servoDriver(IO10,value,position.servo5);    
   }

   
}
/* Driver for servo
  port  : Analog Port for servo
  value : Move servo step between 0 -100 From setting page in fitbit program
          If value = 1 mean press on switch (move most clockwise)
	     value = 0 mean press off switch (move most Anti-clockwise)
  pos   : Current position for servo
*/

function servoDriver (port,value,pos)
{
   var step = value;
   if (value == 1) {   // On Most Clockwise
        pos = MAXMOVE;
	step = 0; 
   }
   if (value == 0) {  // Off Most Anti-Clockwise
	pos = MINMOVE;
        step = 0;
   } 

   pos = pos+step;
   if ( pos > MAXMOVE)
	pos = MAXMOVE;
   if (pos < MINMOVE)
	pos = MINMOVE;
   console.log ('Current Servo : %d',pos);
   port.servoWrite(pos);	
   return pos;
}

process.on('SIGINT', function () { //on ctrl+c
  IO1.digitalWrite(0); // Turn LED off
  IO2.digitalWrite(0); // Turn LED off
  IO3.digitalWrite(0); // Turn LED off
  IO4.digitalWrite(0); // Turn LED off
  IO5.digitalWrite(0); // Turn LED off

 // LED.unexport(); // Unexport LED GPIO to free resources
 // pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});
