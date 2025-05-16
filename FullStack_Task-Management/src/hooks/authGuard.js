module.exports = async function (req, reply) {
  try {
    const token = req.cookies?.token;
    if (!token) throw new Error("No token");
    const user = await req.jwtVerify({ token });
    req.user = user;
  } catch (err) {
    return reply.redirect("/login");
  }
};
