function success(message = "Success", data) {
  return { success: true, message, data };
}

function error(message = "Error", data, code) {
  return { success: false, message, data, code };
}

module.exports = { success, error };
