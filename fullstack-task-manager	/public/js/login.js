$(function () {
  
  // auto fill demo account
  $(".demo-fill").on("click", function () {
    $("#username").val($(this).data("user"));
    $("#password").val($(this).data("pass"));
  });

  // login form submit handler
  $("#loginForm").on("submit", async function (e) {
    e.preventDefault();
    
    const $submitBtn = $(this).find("button[type='submit']");
    $submitBtn.prop("disabled", true).text("Logging in...");

    const username = $("#username").val().trim();
    const password = $("#password").val().trim();

    if (!username || !password) {
      alert("Username and password are required.");
      $submitBtn.prop("disabled", false).text("Login");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data?.error || "Invalid login.");
        $submitBtn.prop("disabled", false).text("Login");
        return;
      }

      window.location.href = "/";
    } catch (err) {
      alert("Login failed.");
      $submitBtn.prop("disabled", false).text("Login");
    }
  });
});
