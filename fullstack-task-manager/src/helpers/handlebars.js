const handlebars = require("handlebars");

handlebars.registerHelper("eq", (a, b) => a === b);
handlebars.registerHelper("ne", (a, b) => a !== b);
handlebars.registerHelper("and", (a, b) => a && b);
handlebars.registerHelper("or", (a, b) => a || b);
handlebars.registerHelper("json", (context) => JSON.stringify(context));

handlebars.registerHelper("addOne", (i) => i + 1);

module.exports = handlebars;
