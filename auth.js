/* ============================================================
   AUTH — small helpers around DB session for gated pages.
   ============================================================ */
(function (global) {
  const Auth = {
    nextUrl() {
      const n = new URLSearchParams(location.search).get("next");
      return n ? decodeURIComponent(n) : null;
    },
    // Redirect to login if not authenticated. Returns the user if logged in.
    require(returnTo) {
      const u = global.DB ? DB.currentUser() : null;
      if (!u) {
        location.href = "login.html?next=" + encodeURIComponent(returnTo || location.pathname.split("/").pop());
        return null;
      }
      return u;
    }
  };
  global.Auth = Auth;
})(window);
