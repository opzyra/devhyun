#!/bin/sh
pm2 stop devhyun
pm2 delete devhyun
export NODE_ENV=production
pm2 start --name "devhyun" npm -- start
