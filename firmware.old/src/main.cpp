#include <Arduino.h>
#include "HX711.h"

// HX711 circuit wiring
const int LOADCELL_DOUT_PIN = 2;
const int LOADCELL_SCK_PIN = 3;
const int LOADCELL_CALIBRATION_FACTOR = 3.7;

HX711 scale;

void setup() {
  Serial.begin(9600);

  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale();
  // scale.tare();

  // long zero_factor = scale.read_average();
  scale.set_scale(LOADCELL_CALIBRATION_FACTOR);
}

void loop() {

  if (scale.wait_ready_timeout(1000)) {
    long reading = scale.read();
    Serial.print("HX711 reading: ");
    Serial.println(reading);
  } else {
    Serial.println("HX711 not found.");
  }

  delay(1);
  
}