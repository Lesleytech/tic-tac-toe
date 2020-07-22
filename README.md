This project was created with react.

The project consist of two parts

## Client Side
This is the react app. You can install the required dependencies with `yarn install`.

## Server Side
The project uses Nodejs for it's backend. You can install the required dependencies with `npm install`.

### Note
To run the development server successfully, you must:
1. Be sure to enable cors on the server and listen on any port but 3000. This is not required when running a production build.
2. Change the fetch url in the **ChooseOpponent** component from "*/api/users*" to "*http://localhost:port/api/users*". Use the port on which your server is running on.
3. In the **PlayScreen** screen, specify a url to the `_socket.connect()` method "*http://localhost:port*". Use the port on which your server is running on.
