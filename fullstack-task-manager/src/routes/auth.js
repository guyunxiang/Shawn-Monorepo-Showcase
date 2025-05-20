const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { success, error } = require("../utils/response");
const { findUserByUsername } = require("../services/users");

const { SECRET, NODE_ENV } = process.env;

module.exports = async function (fastify, opts) {
  // login api - authenticates user and issues a JWT token
  fastify.post("/auth/login", async (req, reply) => {
    const { username, password } = req.body;

    // find user by username
    const user = await findUserByUsername(username);
    // validate user existence and password correctness
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return reply.code(401).send(error("Invalid username or password"));
    }
    // generate a JWT token with user details
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET,
      {
        expiresIn: "1h", // token expires in 1 hour
      }
    );

    // set the token as an HTTP-only cookie
    reply.setCookie("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
      secure: NODE_ENV === "production", // set to true if using HTTPS
      maxAge: 3600, // cookie expires in 1 hour
    });

    return reply.send(success("Login successful"));
  });

  // logout api - clears the authentication cookie
  fastify.post("/auth/logout", async (req, reply) => {
    // clear the token cookie
    reply.clearCookie("token", { path: "/" });
    return reply.redirect("/login"); // redirect to login page
  });
};
