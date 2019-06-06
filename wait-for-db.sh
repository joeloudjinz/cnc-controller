#!/bin/bash
until mysql -h mysql1 -u loudjein -p secret1234 -e 'select 1'; do 
        echo "still waiting for mysql"; sleep 1; done