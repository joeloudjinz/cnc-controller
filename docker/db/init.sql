-- Specify the database name here
CREATE DATABASE IF NOT EXISTS cnc_iiot;

-- grant priviliges to the user from the outisde of the container
-- don't forget to change the name and password to what you want
-- '%' => from any ip adresse
GRANT ALL PRIVILEGES on cnc_iiot.*
TO 'loudjein'@'%' IDENTIFIED BY 'secret1234'
WITH GRANT OPTION;

-- After all that, delete the root user that have password, and leave only the previouse created user
DROP USER root@localhost;