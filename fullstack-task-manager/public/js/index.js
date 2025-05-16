$(function () {
  const $tbody = $("tbody");
  const $statusSelect = $("#statusFilter");

  // render each task row
  function renderTaskRow(task, index) {
    return `
      <tr class="border-b hover:bg-gray-50 transition" data-id="${task.id}">
        <td class="py-3 px-4">${index + 1}</td>
        <td class="py-3 px-4 font-medium">${task.name}</td>
        <td class="py-3 px-4">${task.description}</td>
        <td class="py-3 px-4 text-sm text-gray-500">${task.username || "-"}</td>
        <td class="py-3 px-4">
          ${
            task.status === "completed"
              ? '<span class="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md">Completed</span>'
              : '<span class="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md">Pending</span>'
          }
        </td>
        <td class="py-3 px-4">
          <a href="/tasks/${
            task.id
          }" class="text-indigo-600 hover:underline mr-3">Edit</a>
          <button class="text-red-600 hover:underline delete-btn mr-3" data-id="${
            task.id
          }">Delete</button>
          ${
            task.status === "pending"
              ? `<button class="text-indigo-600 hover:underline complete-btn" data-id="${task.id}">Complete</button>`
              : ""
          }
        </td>
      </tr>
    `;
  }

  // render all tasks
  function renderTasks(tasks) {
    $tbody.empty();

    if (!tasks.length) {
      $tbody.append(`
        <tr>
          <td colspan="6" class="text-center text-gray-500 py-4">No tasks found.</td>
        </tr>
      `);
      return;
    }

    tasks.forEach((task, index) => {
      $tbody.append(renderTaskRow(task, index));
    });

    // rebind event handlers after rendering
    bindDeleteHandlers();
    bindCompleteHandlers();
  }

  function showLoading() {
    const tbodyHeight = $tbody.height() || 200; // fallback height
    $tbody.html(`
      <tr>
        <td colspan="6" class="p-0" style="height: ${tbodyHeight}px">
          <div class="h-full w-full flex items-center justify-center text-sm text-gray-500">
            Loading...
          </div>
        </td>
      </tr>
    `);
  }

  // fetch tasks
  function fetchTasks() {
    const url = new URL("/api/tasks", window.location.origin);
    const status = $statusSelect.val();
    if (status) url.searchParams.set("status", status);
    if (statusSort) {
      url.searchParams.set("sort", `${statusSort}`);
    } else {
      url.searchParams.delete("sort");
    }
    // show loading state
    showLoading();

    fetch(url)
      .then((res) => res.json())
      .then((data) => renderTasks(data.data || []))
      .catch(() => alert("Failed to load tasks"));
  }

  // bind delete handlers
  function bindDeleteHandlers() {
    $(".delete-btn")
      .off("click")
      .on("click", function () {
        const id = $(this).data("id");
        const $row = $(this).closest("tr");
        const $next = $row.next();
        const $detached = $row.detach(); // optimistic UI update

        fetch(`/api/tasks/${id}`, { method: "DELETE" })
          .then((res) => {
            if (!res.ok) throw new Error();
          })
          .catch(() => {
            alert("Delete failed. restoring...");

            if ($next.length) {
              $detached.insertBefore($next);
            } else {
              $("tbody").append($detached);
            }

            bindDeleteHandlers();
          });
      });
  }

  // bind completed task handle
  function bindCompleteHandlers() {
    $(".complete-btn")
      .off("click")
      .on("click", function () {
        const id = $(this).data("id");
        const $row = $(`tr[data-id="${id}"]`);
        const $btn = $(this);

        const $badgeCell = $row.find("td:eq(4)");
        const originalBadgeHtml = $badgeCell.html();
        $badgeCell.html(
          '<span class="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md">Completed</span>'
        );
        $btn.remove();

        fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("update failed");
          })
          .catch(() => {
            // rollback
            alert("Failed to complete task. restoring...");
            $badgeCell.html(originalBadgeHtml);
            $row.find("td:eq(5)").append($btn); // restore button
            bindCompleteHandlers(); // rebind
          });
      });
  }

  // filter status
  $("#statusFilter").on("change", function () {
    const status = $(this).val();
    const url = new URL(window.location.href);
    if (status) {
      url.searchParams.set("status", status);
    } else {
      url.searchParams.delete("status");
    }
    history.replaceState(null, "", url);
    fetchTasks();
  });

  let statusSort = null; // null → asc → desc → null loop
  $("#statusSortIcon").on("click", function () {
    if (statusSort === null) {
      statusSort = "asc";
      $("#statusSortIcon").text("↑");
    } else if (statusSort === "asc") {
      statusSort = "desc";
      $("#statusSortIcon").text("↓");
    } else {
      statusSort = null;
      $("#statusSortIcon").text("⇅");
    }
    fetchTasks();
  });

  // fetchTasks();  first time render by server
  bindDeleteHandlers();
  bindCompleteHandlers();
});
