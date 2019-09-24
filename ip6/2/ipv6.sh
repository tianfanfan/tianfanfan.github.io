#!/bin/bash
ifconfig sit0 up
ifconfig sit0 inet6 tunnel ::209.51.161.14
ifconfig sit1 up
ifconfig sit1 inet6 add 2001:470:1f06:343::2/64
route -A inet6 add ::/0 dev sit1