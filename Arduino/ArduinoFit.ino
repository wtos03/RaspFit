/*
  Minimal Esp8266 Websockets Server

  This sketch:
        1. Connects to a WiFi network
        2. Starts a websocket server on port 80
        3. Waits for connections
        4. Once a client connects, it wait for a message from the client
        5. Sends an "echo" message to the client
        6. closes the connection and goes back to step 3

  Hardware:
        For this sketch you only need an ESP8266 board.

  Created 15/02/2019
  By Gil Maimon
  https://github.com/gilmaimon/ArduinoWebsockets
*/

#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <Servo.h>

#define MIN  0
#define MAX 180
const char* ssid = "SSID"; //Enter SSID
const char* password = "Password"; //Enter Password

using namespace websockets;

WebsocketsServer server;
WebsocketsClient client;
Servo a1,a2,a3,a4;
int pos[] = {0,0,0,0};


void setup() {
  pinMode(D0, OUTPUT);
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT);
  pinMode(D4, OUTPUT);
  a1.attach(D5);
  a2.attach(D6);
  a3.attach(D7);
  a4.attach(D8);
  Serial.begin(115200);
  
  // Connect to wifi
  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  for(int i = 0; i < 15 && WiFi.status() != WL_CONNECTED; i++) {
      Serial.print(".");
      delay(1000);
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());   //You can get IP address assigned to ESP

  server.listen(80);
  Serial.print("Is server live? ");
  Serial.println(server.available());
  client = server.accept();
}

char buff[20] = {"Hello "};
 char *tmp;
void loop() {
  if(client.available()) {
    WebsocketsMessage msg = client.readBlocking();

    // log
    Serial.print("Got Message: ");
    strcpy (buff,msg.data().c_str());
    Serial.println (buff);
    char *str1 = strtok(buff,","); 
    char *str2 = strtok(NULL,",");
    tmp = strtok(str1,"=");
    char *port = strtok(NULL,"=");
    Serial.print (" Port = ");
    Serial.println (port);
    tmp = strtok(str2,"=");
    char *value = strtok(NULL,"=");
    int i = atoi(value);
    Serial.print ( "Value = ");
    Serial.println (i);
    
    processPort( port, i);
  

   
    // return echo
    // client.send("Echo from Arduino: " + msg.data());

    // close the connection
//    client.close();
  }
  
//  delay(1000);
}

void processPort(char *port, int value)
{
     if (!strcmp (port,"01")) // String equal return 0
     {
       value = chkValue(value);
       digitalWrite(D0,value);
     }
     if (!strcmp (port,"02")) // String equal return 0
     {
       value = chkValue(value);
       digitalWrite(D1,value);
     }
     if (!strcmp (port,"03")) // String equal return 0
     {
       value = chkValue(value);
       digitalWrite(D2,value);
     }
     if (!strcmp (port,"04")) // String equal return 0
     {
       value = chkValue(value);
       digitalWrite(D3,value);
     }
     if (!strcmp (port,"05")) // String equal return 0
     {
       value = chkValue(value);
       digitalWrite(D4,value);
     }

     if (!strcmp (port,"06")) // String equal return 0
     {
      pos[0] = chkPos(pos[0],value);
       a1.write(pos[0]);
     }
    if (!strcmp (port,"07")) // String equal return 0
     {
      pos[1] = chkPos(pos[1],value);
       a2.write(pos[1]);
     }
    if (!strcmp (port,"08")) // String equal return 0
     {
      pos[2] = chkPos(pos[2],value);
       a2.write(pos[2]);
     }
    if (!strcmp (port,"09")) // String equal return 0
     {
      pos[3] = chkPos(pos[3],value);
       a3.write(pos[3]);
     }
    if (!strcmp (port,"10")) // String equal return 0
     {
      pos[0] = chkPos(pos[0],value);
       a1.write(pos[0]);
     }


}

int chkValue( int val)
{
   if ( val > 1 )
        val = 1;
   if ( val < 0)
        val = 0;
   return val;

}

int chkPos ( int pos, int val)
{
    
    if ( val == 1)
        pos = MAX;
    if (val == 0)
    {
        pos = MIN;
    }
    else 
    {
         pos += val;
         if (pos > MAX)
            pos = MAX;
         if (pos < 0 )
            pos = 0;     
    }
    return pos;
}
