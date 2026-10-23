// Simple client-side password gate (static hosting; not real security).
(function () {
  var HASH = "baa04c42b873a2a5cc4b2290ac583a3ffbf666fe0110ad72b4137a62dabde15f";
  var KEY = "fm-unlocked";
  try { if (localStorage.getItem(KEY) === HASH) return; } catch (e) {}
  document.documentElement.classList.add("locked");

  async function sha256(s) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var gate = document.createElement("div");
    gate.className = "gate";
    gate.innerHTML =
      '<form><p class="gate-mono">f / m</p>' +
      '<label for="gate-pw">Please enter the password</label>' +
      '<input id="gate-pw" type="password" autocomplete="current-password" autofocus>' +
      '<button type="submit">Enter</button><p class="gate-err" hidden>Incorrect password</p></form>';
    document.body.appendChild(gate);
    gate.querySelector("form").addEventListener("submit", async function (e) {
      e.preventDefault();
      var pw = gate.querySelector("input").value.trim().toLowerCase();
      if ((await sha256(pw)) === HASH) {
        try { localStorage.setItem(KEY, HASH); } catch (err) {}
        document.documentElement.classList.remove("locked");
        gate.remove();
      } else {
        gate.querySelector(".gate-err").hidden = false;
      }
    });
  });
})();
