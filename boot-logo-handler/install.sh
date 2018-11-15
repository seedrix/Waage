#!/bin/bash
cd "$(dirname "$0")"

gcc bootscreen.c ssd1306_i2c.c -lwiringPi -o bootscreen
cp -f bootscreen /sbin/oled-bootscreen
cp oled-bootscreen.service.txt /etc/systemd/system/oled-bootscreen.service
systemctl enable oled-bootscreen.service
