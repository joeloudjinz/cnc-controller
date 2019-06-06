#!/bin/bash
until mysql -h mysql1 -u app_user -p password -e 'select 1'; do 
        echo "still waiting for mysql"; sleep 1; done