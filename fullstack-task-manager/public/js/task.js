$(function () {
  $("#taskForm").on("submit", async function (e) {
    e.preventDefault();

    const $form = $(this);
    const $submitBtn = $form.find("button[type='submit']");
    $submitBtn.prop("disabled", true).text("Saving...");

    const taskId = $form.data("task-id");
    const name = $("#name").val().trim();
    const description = $("#description").val().trim();
    const status = taskId ? $("#status").val() : "pending";

    if (!taskId && (!name || !description)) {
      alert("Both fields are required.");
      $submitBtn.prop("disabled", false).text(taskId ? "Update Task" : "Create Task");
      return;
    }

    const payload = { name, description, status };
    const method = taskId ? "PUT" : "POST";
    const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      window.location.href = "/";
    } catch (err) {
      alert("Failed to save task.");
      $submitBtn.prop("disabled", false).text(taskId ? "Update Task" : "Create Task");
    }
  });
});
