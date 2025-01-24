
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'USER/TO-DO CRUP OPERATION'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger.json';
const routes = ['../api/routes/user.js', '../api/routes/toDo.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);