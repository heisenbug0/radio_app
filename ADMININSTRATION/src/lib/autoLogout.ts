export function setupAutoLogout() {
  if (typeof window === "undefined") return;
  const LOGOUT_KEY = "auto_logout_time";
  const now = Date.now();
  const expire = now + 12 * 60 * 60 * 1000; // 12 hours
  localStorage.setItem(LOGOUT_KEY, expire.toString());

  function checkLogout() {
    const expireAt = parseInt(localStorage.getItem(LOGOUT_KEY) || "0", 10);
    if (Date.now() > expireAt) {
      // Clear cookies
      document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Strict; Secure";
      document.cookie = "user_role=; Path=/; Max-Age=0; SameSite=Strict; Secure";
      localStorage.removeItem(LOGOUT_KEY);
      window.location.href = "/";
    }
  }

  setInterval(checkLogout, 60 * 1000);
}
