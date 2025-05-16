const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false,
});

// Handlebars helpers
const handlebars = require("./src/helpers/handlebars");

// initialize the database
const initDB = require("./src/db/initDB");
initDB();

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

fastify.register(require("@fastify/cookie"));
fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET || "jwt_secret_guyunxiang",
  cookie: {
    cookieName: "token",
    signed: false,
  },
});
 
// views routes
fastify.register(require("./src/routes/views"), { prefix: "/" });
// api tasks
fastify.register(require("./src/routes/tasks"), { prefix: "/api" });
// api auth routes
fastify.register(require("./src/routes/auth"), { prefix: "/api" });

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
