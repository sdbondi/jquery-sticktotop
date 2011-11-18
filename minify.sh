#!/bin/bash

echo "Minifying javascript..."

basepath=.

for f in $basepath/*.js
do
    echo $f | grep 'min.js$' > /dev/null
    if [ $? -ne 0 ];then
        yui-compressor $f > ${f%.*}.min.js
        if [ $? -gt 0 ];then
            cp $f ${f%.*}.min.js
            echo "$f - ${f%.*}.min.js... Copied because of errors!"
            continue
        fi
        echo "$f - ${f%.*}.min.js... done"
    fi
done

echo 'Done!'