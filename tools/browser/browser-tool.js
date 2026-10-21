(function () {
  "use strict";

  var BROWSER_ICON_SVG = {
    chrome:
      '<svg viewBox="0 0 190.5 190.5" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M95.252 142.873c26.304 0 47.627-21.324 47.627-47.628s-21.323-47.628-47.627-47.628-47.627 21.324-47.627 47.628 21.323 47.628 47.627 47.628z"/><path fill="#229342" d="m54.005 119.07-41.24-71.43a95.227 95.227 0 0 0-.003 95.25 95.234 95.234 0 0 0 82.496 47.61l41.24-71.43v-.011a47.613 47.613 0 0 1-17.428 17.443 47.62 47.62 0 0 1-47.632.007 47.62 47.62 0 0 1-17.433-17.437z"/><path fill="#fbc116" d="m136.495 119.067-41.239 71.43a95.229 95.229 0 0 0 82.489-47.622A95.24 95.24 0 0 0 190.5 95.248a95.237 95.237 0 0 0-12.772-47.623H95.249l-.01.007a47.62 47.62 0 0 1 23.819 6.372 47.618 47.618 0 0 1 17.439 17.431 47.62 47.62 0 0 1-.001 47.633z"/><path fill="#1a73e8" d="M95.252 132.961c20.824 0 37.705-16.881 37.705-37.706S116.076 57.55 95.252 57.55 57.547 74.431 57.547 95.255s16.881 37.706 37.705 37.706z"/><path fill="#e33b2e" d="M95.252 47.628h82.479A95.237 95.237 0 0 0 142.87 12.76 95.23 95.23 0 0 0 95.245 0a95.222 95.222 0 0 0-47.623 12.767 95.23 95.23 0 0 0-34.856 34.872l41.24 71.43.011.006a47.62 47.62 0 0 1-.015-47.633 47.61 47.61 0 0 1 41.252-23.815z"/></svg>',
    edge:
      '<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" x1="63.3" x2="241.7" y1="84" y2="84" gradientTransform="matrix(1 0 0 -1 0 266)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0c59a4"/><stop offset="1" stop-color="#114a8b"/></linearGradient><linearGradient id="c" x1="157.3" x2="46" y1="161.4" y2="40.1" gradientTransform="matrix(1 0 0 -1 0 266)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1b9de2"/><stop offset=".2" stop-color="#1595df"/><stop offset=".7" stop-color="#0680d7"/><stop offset="1" stop-color="#0078d4"/></linearGradient><radialGradient id="e" cx="113.4" cy="570.2" r="202.4" gradientTransform="matrix(-.04 1 2.13 .08 -1179.5 -106.7)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#35c1f1"/><stop offset=".3" stop-color="#2bc3d2"/><stop offset=".7" stop-color="#36c752"/></radialGradient></defs><path fill="url(#a)" d="M235.7 195.5a93.7 93.7 0 0 1-10.6 4.7 101.9 101.9 0 0 1-35.9 6.4c-47.3 0-88.5-32.5-88.5-74.3a31.5 31.5 0 0 1 16.4-27.3c-42.8 1.8-53.8 46.4-53.8 72.5 0 74 68.1 81.4 82.8 81.4 7.9 0 19.8-2.3 27-4.6l1.3-.4a128.3 128.3 0 0 0 66.6-52.8 4 4 0 0 0-5.3-5.6Z" transform="translate(-4.6 -5)"/><path fill="url(#c)" d="M110.3 246.3A79.2 79.2 0 0 1 87.6 225a80.7 80.7 0 0 1 29.5-120c3.2-1.5 8.5-4.1 15.6-4a32.4 32.4 0 0 1 25.7 13 31.9 31.9 0 0 1 6.3 18.7c0-.2 24.5-79.6-80-79.6-43.9 0-80 41.6-80 78.2a130.2 130.2 0 0 0 12.1 56 128 128 0 0 0 156.4 67 75.5 75.5 0 0 1-62.8-8Z" transform="translate(-4.6 -5)"/><path fill="url(#e)" d="M157 153.8c-.9 1-3.4 2.5-3.4 5.6 0 2.6 1.7 5.2 4.8 7.3 14.3 10 41.4 8.6 41.5 8.6a59.6 59.6 0 0 0 30.3-8.3 61.4 61.4 0 0 0 30.4-52.9c.3-22.4-8-37.3-11.3-43.9C228 28.8 182.3 5 132.6 5a128 128 0 0 0-128 126.2c.5-36.5 36.8-66 80-66 3.5 0 23.5.3 42 10a72.6 72.6 0 0 1 30.9 29.3c6.1 10.6 7.2 24.1 7.2 29.5s-2.7 13.3-7.8 19.9Z" transform="translate(-4.6 -5)"/></svg>',
    firefox:
      '<svg viewBox="0 0 256 265" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ff" x1="70.786" x2="6.447" y1="12.393" y2="74.468" gradientTransform="translate(-2.999 -.01) scale(3.3067)" gradientUnits="userSpaceOnUse"><stop offset=".048" stop-color="#fff44f"/><stop offset=".225" stop-color="#ffc830"/><stop offset=".368" stop-color="#ff980e"/><stop offset=".534" stop-color="#ff3647"/><stop offset=".705" stop-color="#e31587"/></linearGradient></defs><path fill="url(#ff)" d="M248.033 88.713c-5.569-13.399-16.864-27.866-25.71-32.439a133.169 133.169 0 0 1 12.979 38.9 116.067 116.067 0 0 1-3.988 86.755c-14.688 31.516-50.242 63.819-105.894 62.248C65.288 242.474 12.331 197.854 2.431 139.411c-2.246-10.324 2.308-30.23 2.37-30.491A108.26 108.26 0 0 1 21.005 74.39a112.062 112.062 0 0 1 12.03-14.342A93.373 93.373 0 0 1 45.56 49.318a22.862 22.862 0 0 1 4.279-2.271c-.291 4.434-.648 25.663 4.431 32.101h.059a94.926 94.926 0 0 1 30.849-23.841 59.407 59.407 0 0 0 .36 31.324 38.145 38.145 0 0 1 3.307 2.507A64.108 64.108 0 0 1 124.114 75.545c1.495-.103 2.983-.229 4.504-.229a64.68 64.68 0 0 1 56.154 32.793 44.241 44.241 0 0 0-30.901-7.503c46.095 23.035 33.722 102.415-30.154 99.419-6.59-.309-12.176-1.412-16.675-3.217a70.572 70.572 0 0 1-3.763-1.541c-.724-.327-1.449-.661-2.163-1.032-15.637-8.088-28.573-23.378-30.187-41.942 0 0 5.916-22.046 42.359-22.046 3.938 0 15.201-10.994 15.413-14.182-.049-1.042-22.353-9.917-31.05-18.485-4.646-4.579-6.852-6.788-8.806-8.442a64.108 64.108 0 0 0-35.269 13.593c-2.374 20.951 8.703 45.381 35.517 58.198.615.331 1.177.642 1.776.93.599.288 1.161.599 1.776.873-15.65-8.085-28.573-23.375-30.187-41.939a32.912 32.912 0 0 1-30.359-19.096 48.336 48.336 0 0 1 47.117-1.891 63.821 63.821 0 0 0 48.119 1.891c.202 3.188-11.475 14.182-15.413 14.182-36.443 0-42.359 22.046-42.359 22.046 1.614 18.564 14.537 33.854 30.187 41.939l.089.057c8.908 6.081 52.907 20.938 98.91-16.534l.073-.166c23.603-19.446 38.702-48.205 34.155-77.889-14.49-36.126-39.062-50.692-59.13-82.41a155.1 155.1 0 0 1-3.019-4.907c-.576-.993-1.042-1.852-1.412-2.645A23.31 23.31 0 0 1 168.882 0c-32.19 18.849-43.113 53.741-44.118 71.194-1.005 17.453 29.55 17.443 48.119 1.891 18.568-15.551 12.824-36.094-3.719-73.065 4.957 2.364 34.35 48.906 5.49 88.745a69.775 69.775 0 0 1 11.904 15.525 26.607 26.607 0 0 1 1.921 1.574c29.069 26.774 13.845 64.646 12.698 67.325 1.134-2.695 16.371-40.557-12.698-67.341-1.147-1.028-1.66-1.422-1.921-1.574a69.818 69.818 0 0 0-11.904-15.542c-39.839-39.839-10.446-86.381-5.489-88.732C195.5 40.4 220.072 54.966 234.562 91.092a131.8 131.8 0 0 1 13.471-2.379Z"/></svg>',
    safari:
      '<svg viewBox="0 0 66.165833 65.803795" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sa" x1="0" x2="1"><stop offset="0" stop-color="#06c2e7"/><stop offset="1" stop-color="#107ddd"/></linearGradient></defs><circle cx="33.08" cy="31.96" r="29.2" fill="url(#sa)"/><circle cx="33.08" cy="31.96" r="31.1" fill="none" stroke="#d3d3d3" stroke-width="1.2"/><path fill="#ff5150" d="m36.38 34.84-6.6-6.92 23.42-15.75z"/><path fill="#f1f1f1" d="m36.38 34.84-6.6-6.92-16.82 22.67z"/></svg>',
    opera:
      '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><linearGradient id="op" x1="0" x2="0" y1="0" y2="1"><stop offset=".3" stop-color="#ff1b2d"/><stop offset="1" stop-color="#a70014"/></linearGradient><path fill="url(#op)" d="M335.4 781.8c-55.3-65.3-91.1-161.7-93.5-270v-23.6c2.4-108.3 38.2-204.7 93.5-270C407.2 125.1 513.8 66 632.8 66c73.2 0 141.8 22.4 200.4 61.3C745.2 48.5 629.2.5 501.9 0H500C223.9 0 0 223.9 0 500c0 268.2 211.1 487 476.2 499.4 7.9.4 15.8.6 23.8.6 128 0 244.8-48.1 333.2-127.2-58.6 38.8-127.1 61.2-200.4 61.2-119 0-225.6-59.1-297.4-152.2z"/><path fill="#fff" d="M347.8 107.6c-66.5-66.4-174.4-66.4-241 0-66.5 66.4-66.5 174 0 240.3 66.5 66.4 174.4 66.4 241 0s66.6-174 0-240.3zm-10.2 78.1c-28.1 48.7-56.2 97.4-84.3 146.2-5.2 9.1-12.8 14.5-23.2 15.3-11.6.8-20.8-4.1-26.7-14.1-17.8-30.5-35.4-61.2-53-91.8-10.7-18.6-21.5-37.2-32.2-55.9-10.8-18.8 1.4-41.7 23-42.8 11.4-.6 20.2 4.7 26 14.6 7.9 13.5 15.7 27.2 23.6 40.8 5.7 9.8 11.2 19.7 17 29.3 8.4 14.1 20.8 22 37.3 23 23.3 1.4 45-15.5 47.8-40.2.2-1.8.3-3.7.4-4.6-.1-8-1.6-14.8-4.8-21.1-8.7-17.4.6-36.9 19.5-41.1 15.4-3.4 31.4 7.9 33.4 23.5 1 6.7-.4 13-3.8 18.9z"/></svg>',
    brave:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#FB542B" d="M15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633-1.38.972-3.884 2.66-4.293 2.916-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 01-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36z"/></svg>',
    bing:
      '<svg viewBox="0 0 256 388" xmlns="http://www.w3.org/2000/svg"><path fill="#00BBEC" d="m.053 241.013.054 53.689.695 3.118c2.172 9.747 5.937 16.775 12.482 23.302 3.078 3.07 5.432 4.922 8.768 6.896 7.06 4.177 14.657 6.238 22.978 6.235 8.716-.005 16.256-2.179 24.025-6.928l20.448-12.601v-127.4l-.002-58.273c-.002-37.177-.07-59.256-.188-60.988-.74-10.885-5.293-20.892-12.948-28.461-2.349-2.323-4.356-3.875-10.336-7.99C60.653 28.64 55.206 24.889 51.525 22.352 43.004 16.482 34.897 10.89 28.617 6.566 22.838 2.58 22.386 2.304 20.639 1.68 18.367.866 15.959.567 13.67.814 6.998 1.534 1.657 6.352.269 12.901.053 13.921.013 27.481.01 101.08l-.003 86.975H0l.053 53.688Z"/><path fill="#2756A9" d="m148.81 277.994-58.08 35.973-21.105 13.097c-7.77 4.75-15.31 6.923-24.025 6.928-8.321.003-15.918-2.058-22.978-6.235 7.813 30.743 30.05 55.749 60.15 67.646 8.668 3.424 17.415 5.582 26.932 6.64 3.576.4 13.699.56 17.43.276 17.117-1.296 32.02-6.334 47.308-15.996l30.086-19.047 9.69-6.121c12.348-7.759 16.03-10.483 21.766-16.102 2.392-2.342 5.997-6.34 6.176-6.848 3.036-4.492 5.06-9.995 6.064-16.484.465-3.002.462-10.342-.005-13.663-.903-6.42-2.955-13.702-5.167-18.339-3.627-7.603-11.353-14.512-22.453-20.076-3.065-1.537-6.23-2.943-6.583-2.924-.168.009-10.497 6.322-22.954 14.03-12.457 7.71-23.268 14.4-24.025 14.87z"/></svg>'
  };

  var OS_ICON_SVG = {
    windows:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#0078d4" d="M2 3.5 11 2v9H2zm10 7.5h10V2.2l-10-.1zm0 1h10v8.8L12 22zM2 12h9v10l-9-1.5z"/></svg>',
    macos:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#222" d="M15.6 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.7-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.2-1.6 2.8-.4 7 1.1 9.1.7 1 1.5 2.2 2.6 2.1 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.2-2.2-.1 0-2.3-.9-2.3-4.1Zm-2.2-6.6c.5-.7.8-1.6.7-2.5-.8 0-1.8.5-2.4 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.5 2.5-1.1Z"/></svg>',
    linux:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#222" d="M12 2c2.5 0 4 2.1 4 4.8v3.3c.7.7 1.2 1.8 1.2 2.9 0 2.4-1.9 4.3-4.2 4.3S8.8 15.4 8.8 13c0-1.1.5-2.2 1.2-2.9V6.8C10 4.1 9.5 2 12 2Zm-2.8 14.5h5.6L16 21H8z"/><circle cx="10.5" cy="8.6" r=".8" fill="#fff"/><circle cx="13.5" cy="8.6" r=".8" fill="#fff"/></svg>',
    android:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#3ddc84" d="M7 9h10v8H7z"/><path fill="#3ddc84" d="M8.4 6.5 7 4.8l.8-.7 1.5 1.8A7 7 0 0 1 12 5c1 0 1.9.2 2.7.9l1.5-1.8.8.7-1.4 1.7A5.6 5.6 0 0 1 18 11H6c0-1.9.9-3.5 2.4-4.5Z"/><circle cx="9.6" cy="8.3" r=".5" fill="#222"/><circle cx="14.4" cy="8.3" r=".5" fill="#222"/></svg>',
    ios:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#111" d="M16 3.3c-.9.1-1.9.7-2.5 1.4-.5.6-.9 1.5-.8 2.4.9.1 1.8-.5 2.4-1.2.6-.7 1-1.6.9-2.6ZM12 7.2c1.5 0 2.1-1 3.6-1 1.3 0 2.3.8 2.9 1.7-2.5 1.4-2.1 5 .3 6-.4 1.4-1.1 2.8-2.1 3.9-.8.9-1.6 1.8-2.9 1.8-1.2 0-1.6-.7-3-.7s-1.8.7-3 .7c-1.2 0-2.1-1-2.8-1.8-1.8-2-3.2-5.8-1.3-8.7 1-1.5 2.7-2.4 4.3-2.4 1.3 0 2.4.8 4 .8Z"/></svg>'
  };

  var DEVICE_ICON_SVG = {
    desktop:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" fill="#4b2e83"/><rect x="10" y="17" width="4" height="2" fill="#4b2e83"/><rect x="8" y="19" width="8" height="1.5" rx=".75" fill="#4b2e83"/></svg>',
    mobile:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="2" width="10" height="20" rx="2" fill="#4b2e83"/><rect x="9" y="5" width="6" height="12" fill="#fff"/><circle cx="12" cy="19" r="1" fill="#fff"/></svg>',
    tablet:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="2.5" width="14" height="19" rx="2" fill="#4b2e83"/><rect x="7" y="5" width="10" height="13.5" fill="#fff"/><circle cx="12" cy="20" r=".8" fill="#fff"/></svg>'
  };

  function fallback(value) {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "number" && Number.isNaN(value)) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  }

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function browserIconFor(browserName) {
    var key = normalize(browserName);
    if (key.indexOf("chrome") !== -1) return BROWSER_ICON_SVG.chrome;
    if (key.indexOf("edge") !== -1) return BROWSER_ICON_SVG.edge;
    if (key.indexOf("firefox") !== -1) return BROWSER_ICON_SVG.firefox;
    if (key.indexOf("safari") !== -1) return BROWSER_ICON_SVG.safari;
    if (key.indexOf("opera") !== -1) return BROWSER_ICON_SVG.opera;
    if (key.indexOf("brave") !== -1) return BROWSER_ICON_SVG.brave;
    if (key.indexOf("bing") !== -1) return BROWSER_ICON_SVG.bing;
    return "";
  }

  function osIconFor(systemName) {
    var key = normalize(systemName);
    if (key.indexOf("windows") !== -1) return OS_ICON_SVG.windows;
    if (key.indexOf("mac") !== -1) return OS_ICON_SVG.macos;
    if (key.indexOf("linux") !== -1 || key.indexOf("ubuntu") !== -1) return OS_ICON_SVG.linux;
    if (key.indexOf("android") !== -1) return OS_ICON_SVG.android;
    if (key.indexOf("ios") !== -1) return OS_ICON_SVG.ios;
    return "";
  }

  function deviceIconFor(deviceType) {
    var key = normalize(deviceType);
    if (key.indexOf("mobile") !== -1) return DEVICE_ICON_SVG.mobile;
    if (key.indexOf("tablet") !== -1) return DEVICE_ICON_SVG.tablet;
    if (key.indexOf("desktop") !== -1) return DEVICE_ICON_SVG.desktop;
    return "";
  }

  function valueWithIcon(value, iconSvg) {
    var safe = fallback(value);
    if (!iconSvg || safe === "-") return safe;
    return '<span class="browser-value-with-icon"><span class="browser-inline-icon">' + iconSvg + "</span><span>" + safe + "</span></span>";
  }

  function setRows(tableId, rows) {
    var table = document.getElementById(tableId);
    if (!table) return;
    table.innerHTML = rows
      .map(function (row) {
        var value = row.html ? row.value : fallback(row.value);
        return "<tr><th>" + row.label + "</th><td>" + value + "</td></tr>";
      })
      .join("");
  }

  function formatBattery(level) {
    if (level === null || level === undefined || level === -1) return "-";
    return Math.round(level * 100) + "%";
  }

  async function loadBrowserInfo() {
    var browserNameEl = document.getElementById("browser-name");
    var uaEl = document.getElementById("browser-user-agent");

    if (!window.browser || typeof window.browser.getInfo !== "function") {
      if (browserNameEl) browserNameEl.textContent = "Browser diagnostics failed to load";
      if (uaEl) uaEl.textContent = navigator.userAgent || "-";
      return;
    }

    try {
      var info = await window.browser.getInfo([
        "browser",
        "system",
        "device",
        "gpu",
        "network",
        "battery",
        "screen",
        "language",
        "timezone",
      ]);

      var browserDisplay = [info.browser, info.browserVersion].filter(Boolean).join(" ");
      if (browserNameEl) {
        var browserIcon = browserIconFor(info.browser);
        browserNameEl.innerHTML = valueWithIcon(browserDisplay || "Unknown browser", browserIcon);
      }
      if (uaEl) uaEl.textContent = info.userAgent || navigator.userAgent || "-";

      setRows("browser-details", [
        { label: "Browser", value: valueWithIcon(info.browser, browserIconFor(info.browser)), html: true },
        { label: "Version", value: info.browserVersion },
        { label: "Engine", value: info.engine },
        { label: "Is Robot", value: info.isRobot },
        { label: "Is Webview", value: info.isWebview },
        { label: "Cookie Enabled", value: info.cookieEnabled },
      ]);

      setRows("user-details", [
        { label: "IP Address", value: info.ip },
        { label: "Language", value: info.language },
        { label: "Timezone", value: info.timezone },
        { label: "Battery", value: formatBattery(info.battery) },
        { label: "Is Charging", value: info.isCharging },
        { label: "Is Online", value: info.isOnline },
        { label: "Network", value: info.network },
      ]);

      setRows("system-details", [
        {
          label: "Operating System",
          value: valueWithIcon([info.system, info.systemVersion].filter(Boolean).join(" "), osIconFor(info.system)),
          html: true,
        },
        { label: "Platform", value: info.platform },
        { label: "Architecture", value: info.architecture },
        { label: "Bitness", value: info.bitness ? info.bitness + "-bit" : "-" },
      ]);

      setRows("screen-details", [
        { label: "Screen Size", value: info.screenWidth + " x " + info.screenHeight },
        { label: "Client Size", value: info.clientWidth + " x " + info.clientHeight },
        { label: "Screen FPS", value: info.screenFPS },
        { label: "Color Depth", value: info.screenColorDepth },
        { label: "Is Touch", value: info.isTouch },
        { label: "Device Pixel Ratio", value: info.devicePixelRatio },
      ]);

      setRows("device-details", [
        { label: "Device Type", value: valueWithIcon(info.device, deviceIconFor(info.device)), html: true },
        { label: "Device Memory", value: info.deviceMemory ? info.deviceMemory + " GB" : "-" },
        { label: "GPU Vendor", value: info.gpu },
        { label: "GPU Model", value: info.gpuModel },
      ]);
    } catch (err) {
      if (browserNameEl) browserNameEl.textContent = "Could not read browser details";
      if (uaEl) uaEl.textContent = (err && err.message) || "Unknown error";
    }
  }

  loadBrowserInfo();
})();
