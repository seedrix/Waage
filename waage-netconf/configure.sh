#!/bin/sh
cd "$(dirname "$0")"
gpio -g mode 15 in
IN=$(gpio -g read 15)
rm flags/*
if [ "$IN" = "0" ]
then
	cp -f client/interfaces /etc/network/interfaces
	cp -f client/dhcpcd.conf /etc/dhcpcd.conf
	echo "" > flags/client
	echo "Mode: client"
else
	cp -f accesspoint/interfaces /etc/network/interfaces
	cp -f accesspoint/dhcpcd.conf /etc/dhcpcd.conf
	echo "" > flags/accesspoint
	echo "Mode: access point"
fi
