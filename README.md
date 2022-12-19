# Installation
1. install node.js (https://nodejs.org/en/)
2. In the project directory, run 
```
% npm install
% npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

In src/Auth.tsx,
```
4: const ROOM_NUMBER = 1; // you can change the chat room 
```
Change the number accordingly．

### The port number must be 3000 due to CORS.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# ChatApi document
see docs/index.html

# Deployment
### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
