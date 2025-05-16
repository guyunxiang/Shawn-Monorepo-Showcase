const { z } = require("zod");

// schema for creating a task with required name and description fields
const createTaskSchema = z.object({
  name: z
    .string({ required_error: "Name is required!" })
    .nonempty("Name is required!"),
  description: z
    .string({ required_error: "Description is required!" })
    .nonempty("Description is required!"),
});

// schema for updating a task with optional fields: name, description, and status
const updateTaskSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["pending", "completed"]).optional(),
});

// validate data against a given schema and return the result
function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    // collect and join all validation error messages
    const message = result.error.errors.map((err) => err.message).join("; ");
    return { success: false, message };
  }
  return { success: true, data: result.data };
}

module.exports = {
  createTaskSchema, // export schema for creating tasks
  updateTaskSchema, // export schema for updating tasks
  validate, // export validation function
};
