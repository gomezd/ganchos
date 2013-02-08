#! /bin/bash

HOST=${HOST:-localhost};
PORT=${PORT:-80};

PATHS=( '/foo' '/bar');

for p in "${PATHS[@]}"; do
    url="http://${HOST}:${PORT}${p}";
    status=$(curl $url -o /dev/null -s -w "%{http_code}");
    echo "[${status}] ${url}";
done
