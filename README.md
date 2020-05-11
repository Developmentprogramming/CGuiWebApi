# CGuiWebApi
A web api for CGui Web app

### `npm install`

Installs the all the dependencies.

### `npm start`

Runs the server in local.

### Enviromental variables

**PORT** required to let the server listen on this port.
**DATABASE_URL** required to connect the database.

### Endpoints

#### Method GET
**/gallery** retrieves the widgets gallery.
**/support** retrieves the support area.
**/docs/:target** retrieves the documentation, to retrieve the list of documentation set the target to **list**, and to to get documentation for a specific class set the target to **Name of the class**.
E.g
/docs/Window to retrieve the full documentation of window
**/usage/:target** retrieves the usage of specific class again set the target to **Name of the class**.
**/installation/downloadinfo** retrieves the download info and links to download for all platforms avaiable.