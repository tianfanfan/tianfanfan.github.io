1: 10g
2: 20g

## ip6 自动下载配置
curl -o- -L https://raw.githubusercontent.com/tianfanfan/tianfanfan.github.io/master/ip6/1/ipv6.sh | bash -s -- --v 1.0.0

## ip6 自动下载配置
curl -o- -L https://raw.githubusercontent.com/tianfanfan/tianfanfan.github.io/master/ip6/2/ipv6.sh | bash -s -- --v 1.0.0

echo 'curl -o- -L https://raw.githubusercontent.com/tianfanfan/tianfanfan.github.io/master/ip6/2/ipv6.sh | bash -s -- --v 1.0.0' >> /etc/rc.d/rc.local

yum -y install wget

mkdir centos-auto-install-bash

cd centos-auto-install-bash

wget https://raw.githubusercontent.com/tianfanfan/tianfanfan.github.io/master/centos-auto-install-bash/ss.sh && bash ss.sh

sed -i "s/old/new/g" /etc/shadowsocks.json

cat /etc/shadowsocks.json

reboot