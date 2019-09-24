#!/bin/bash
yum -y install wget
mkdir centos-auto-install-bash
cd centos-auto-install-bash
wget https://raw.githubusercontent.com/tianfanfan/nginx--install-shell/master/nginx.sh && bash nginx.sh

wget https://raw.githubusercontent.com/tianfanfan/tianfanfan.github.io/master/centos-auto-install-bash/ss.sh && bash ss.sh

wget https://raw.githubusercontent.com/tianfanfan/tianfanfan.github.io/master/centos-auto-install-bash/git-install.sh && bash git-install.sh

