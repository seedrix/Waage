#!/bin/bash
cd "$(dirname "$0")"

mkdir /etc/waage-netconf
cp -r accesspoint/  /etc/waage-netconf/accesspoint
chmod 644 accesspoint/*
cp -r client/ /etc/waage-netconf/client
chmod 644 client/*
cp configure.sh /etc/waage-netconf/configure.sh
chmod 755 configure.sh
cp waage-netconf.service.txt /etc/systemd/system/waage-netconf.service
# the copied files my not compatible with the installed versions of hostapd or dnsmasq
cp dnsmasq.service.txt /lib/systemd/system/dnsmasq.service
cp hostap /etc/init.d/hostap
mkdir /etc/waage-netconf/flags
systemctl enable dnsmasq
systemctl enable hostapd
systemctl enable waage-netconf.service