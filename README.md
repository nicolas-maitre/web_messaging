# Messaging Web App
A messaging web app using Websocket technology

## Prerequisites
- Any server running a debian-like OS
- The ports `80` and `8080` must be open on your network.

## Node modules
These node modules are already included in the project directory:
- mariadb
- uuid
- websocket

## Install steps
For theses steps, we will assume that the git directory has already been cloned into the server.
1. Install nodeJS `apt-get install nodejs`
2. Install MariaDB `apt-get install mariadb-server` then `mysql_secure_installation`
3. Execute the sql script found in `/server_resources/sql_scripts/db_creation.sql`
3. Add a mariadb user and give him editing permissions on the created database. Here is a nice tutorial: https://tableplus.io/blog/2018/09/mariadb-how-to-create-new-user-and-grant-privileges.html
4. Add the db user auth infos in `/server_resources/classes/databaseManager.js` in the `dbPool` const. Put the password in `/server_resources/private/credentials.js`
5. Configure the websocket url in `/client_resources/scripts/wsManager.js` in the `WEBSOCKET_URL` constant.
6. Configure the `/client_resources` directory path in `/server_resources/http_server/fs/filesmanager.js` in the `CLIENT_RESOURCES_PATH`
7. To start the website you must start the two servers with `node /server_resources/app_start.js`
