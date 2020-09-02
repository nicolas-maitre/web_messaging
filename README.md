# Messaging Web App
A messaging web app using Websocket technology  
Mostly realised during the end my CFC

You can access the wiki [here!](https://github.com/nicolas-maitre/web_messaging/wiki)

## Prerequisites
- Any server running a debian-like OS
- The ports `80` and `8080` must be open on your network.

## Node modules
- mariadb
- uuid
- websocket
- mime
- querystring

## Install steps
For theses steps, we will assume that the git directory has already been cloned into the server.
1. Install nodeJS `apt-get install nodejs`

2. Install MariaDB `apt-get install mariadb-server` then `mysql_secure_installation`

3. Execute the sql script found in `/server_resources/sql_scripts/db_creation.sql`

4. Add a mariadb user and give him editing permissions on the created database. Here is a nice tutorial: https://tableplus.io/blog/2018/09/mariadb-how-to-create-new-user-and-grant-privileges.html

5. Copy the `server_resources/config.js.example` into `/server_resources/config.js` and fill you db credentials in it

6. Install the dependencies in the server_resources directory: `cd server_resources && npm i`

7. To start the website you must start the two servers with `node /server_resources/app_start.js`
