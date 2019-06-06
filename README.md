# Loudjein.cnc

Back-end project that interacts with CNC machine through serial port, it generates a gcode file from an uploaded image.

## Structure

1. Users Manager:<br>
   Handles all operation on users, admins and agents.
1. Authentication:<br>
   Handles all the operations of authentication, including token refresh process.
1. Config:<br>
   Holds all the files that take configuration as a content, such as database, multer and the server configuration.
1. Files Handler:<br>
   Handle all the operation on the files and directories in the system, the types of files in the system are:
   1. Images
   2. Gcode files
   3. log files
1. Image Converter:<br>
   Take care of the full process of converting an image, from uploading it to creating gcode file.
1. Middlewares
   Used middlewares in the system
1. Public Folder:<br>
   The generated front-end assets by VueJs cli, [Project repo](https://github.com/joe-inz/cnc-controller-fe)
1. Socket Manager:<br>
   Handles all the operations for real time updates to the client.
1. Transmitter:<br>
   Handles the transmission process operations.
