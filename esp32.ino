#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

const char* ssid = "S23FE";
const char* password = "Arul2003";

const char* serverName = "*";

#define SS_PIN 21
#define RST_PIN 22
MFRC522 rfid(SS_PIN, RST_PIN);

struct RfidUser {
  String rfid;
  String name;
};

RfidUser users[] = {
  {"9C 64 A9 00", "Arul"},
  {"79 74 13 05", "Kumar"},
  {"63 B8 1C FB", "Ram"},
  {"E3 5F 6F 0E", "Sri"}
};

const int userCount = sizeof(users) / sizeof(users[0]);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Scan an RFID card...");

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  String id = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) id += "0";
    id += String(rfid.uid.uidByte[i], HEX);
    if (i != rfid.uid.size - 1) id += " ";
  }
  id.toUpperCase();

  Serial.print("RFID Read: ");
  Serial.println(id);

  String name = getNameFromRfid(id);
  if (name != "") {
    Serial.println("Authorized card detected: " + name);
    sendAttendance(id, name);
  } else {
    Serial.println("Unknown RFID detected!");
  }

  delay(1000);
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

String getNameFromRfid(String rfid) {
  for (int i = 0; i < userCount; i++) {
    if (users[i].rfid.equalsIgnoreCase(rfid)) {
      return users[i].name;
    }
  }
  return "";
}

void sendAttendance(String rfid, String name) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{\"rfid\":\"" + rfid + "\", \"name\":\"" + name + "\"}";

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println("Server Response:");
      Serial.println(response);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }
}
