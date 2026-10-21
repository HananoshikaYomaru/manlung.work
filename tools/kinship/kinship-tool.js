(function () {
  "use strict";

  var chainEl = document.getElementById("kin-chain");
  var resultEl = document.getElementById("kin-result");
  var errorEl = document.getElementById("kin-error");
  var keypad = document.querySelector(".kin-keypad");
  var genderFBtn = document.getElementById("kin-gender-f");
  var genderMBtn = document.getElementById("kin-gender-m");
  var ageOlderBtn = document.getElementById("kin-age-older");
  var ageYoungerBtn = document.getElementById("kin-age-younger");

  var STEP_LABEL = {
    F: "父親",
    M: "母親",
    BO: "哥哥",
    BY: "弟弟",
    SO: "姊姊",
    SY: "妹妹",
    H: "丈夫",
    W: "妻子",
    SN: "兒子",
    DT: "女兒",
  };

  var egoGender = "F";
  var ageOlder = true;
  var steps = [];

  var TITLES = buildTitleTable();

  function buildTitleTable() {
    var T = Object.create(null);

    function set(key, value) {
      T[key] = value;
    }

    set("", "我");

    set("F", "父親");
    set("M", "母親");
    set("F.F", "祖父");
    set("F.M", "祖母");
    set("M.F", "外祖父");
    set("M.M", "外祖母");
    set("F.F.F", "曾祖父");
    set("F.F.M", "曾祖母");
    set("F.M.F", "外曾祖父");
    set("F.M.M", "外曾祖母");
    set("M.F.F", "外曾祖父");
    set("M.F.M", "外曾祖母");
    set("M.M.F", "外曾祖父");
    set("M.M.M", "外曾祖母");
    set("F.F.F.F", "高祖父");
    set("F.F.F.M", "高祖母");
    set("M.F.F.F", "外高祖父");
    set("M.F.F.M", "外高祖母");

    set("SN", "兒子");
    set("DT", "女兒");
    set("SN.SN", "孫");
    set("SN.DT", "孫女");
    set("DT.SN", "外孫");
    set("DT.DT", "外孫女");
    set("SN.SN.SN", "曾孫");
    set("SN.SN.DT", "曾孫女");
    set("SN.DT.SN", "外曾孫");
    set("SN.DT.DT", "外曾孫女");
    set("DT.SN.SN", "外曾孫");
    set("DT.SN.DT", "外曾孫女");
    set("DT.DT.SN", "外曾孫");
    set("DT.DT.DT", "外曾孫女");

    set("BO", "兄");
    set("BY", "弟");
    set("SO", "姊");
    set("SY", "妹");
    set("BO.W", "嫂");
    set("BY.W", "弟妹");
    set("SO.H", "姊夫");
    set("SY.H", "妹夫");

    set("BO.SN", "姪");
    set("BO.DT", "姪女");
    set("BY.SN", "姪");
    set("BY.DT", "姪女");
    set("SO.SN", "外甥");
    set("SO.DT", "外甥女");
    set("SY.SN", "外甥");
    set("SY.DT", "外甥女");
    set("BO.SN.W", "姪媳");
    set("BO.DT.H", "姪女婿");
    set("BY.SN.W", "姪媳");
    set("BY.DT.H", "姪女婿");
    set("SO.SN.W", "外甥媳");
    set("SO.DT.H", "外甥女婿");
    set("SY.SN.W", "外甥媳");
    set("SY.DT.H", "外甥女婿");
    set("BO.SN.SN", "姪孫");
    set("BO.SN.DT", "姪孫女");
    set("SO.SN.SN", "外甥孫");
    set("SO.SN.DT", "外甥孫女");

    set("F.BO", "伯父");
    set("F.BY", "叔父");
    set("F.SO", "姑母");
    set("F.SY", "姑母");
    set("M.BO", "舅父");
    set("M.BY", "舅父");
    set("M.SO", "姨母");
    set("M.SY", "姨母");
    set("F.BO.W", "伯母");
    set("F.BY.W", "嬸母");
    set("F.SO.H", "姑丈");
    set("F.SY.H", "姑丈");
    set("M.BO.W", "舅母");
    set("M.BY.W", "舅母");
    set("M.SO.H", "姨丈");
    set("M.SY.H", "姨丈");

    var cousinPrefixes = [
      { p: "F.BO", t: "堂" },
      { p: "F.BY", t: "堂" },
      { p: "F.SO", t: "表" },
      { p: "F.SY", t: "表" },
      { p: "M.BO", t: "表" },
      { p: "M.BY", t: "表" },
      { p: "M.SO", t: "表" },
      { p: "M.SY", t: "表" },
    ];

    cousinPrefixes.forEach(function (entry) {
      var p = entry.p;
      var c = entry.t;
      set(p + ".SN_O", c + "兄");
      set(p + ".SN_Y", c + "弟");
      set(p + ".DT_O", c + "姊");
      set(p + ".DT_Y", c + "妹");
      set(p + ".SN_O.W", c + "嫂");
      set(p + ".SN_Y.W", c + "弟妹");
      set(p + ".DT_O.H", c + "姊夫");
      set(p + ".DT_Y.H", c + "妹夫");
      set(p + ".SN_O.SN", c + "姪");
      set(p + ".SN_O.DT", c + "姪女");
      set(p + ".SN_Y.SN", c + "姪");
      set(p + ".SN_Y.DT", c + "姪女");
      set(p + ".DT_O.SN", c + "外甥");
      set(p + ".DT_O.DT", c + "外甥女");
      set(p + ".DT_Y.SN", c + "外甥");
      set(p + ".DT_Y.DT", c + "外甥女");
    });

    set("F.F.BO", "伯祖父");
    set("F.F.BY", "叔祖父");
    set("F.F.SO", "姑婆");
    set("F.F.SY", "姑婆");
    set("F.F.BO.W", "伯祖母");
    set("F.F.BY.W", "叔祖母");
    set("F.F.SO.H", "姑丈公");
    set("F.F.SY.H", "姑丈公");
    set("F.M.BO", "舅公");
    set("F.M.BY", "舅公");
    set("F.M.SO", "姨婆");
    set("F.M.SY", "姨婆");
    set("F.M.BO.W", "舅婆");
    set("F.M.BY.W", "舅婆");
    set("F.M.SO.H", "姨丈公");
    set("F.M.SY.H", "姨丈公");
    set("M.F.BO", "外伯祖父");
    set("M.F.BY", "外叔祖父");
    set("M.F.SO", "外姑婆");
    set("M.F.SY", "外姑婆");
    set("M.F.BO.W", "外伯祖母");
    set("M.F.BY.W", "外叔祖母");
    set("M.F.SO.H", "外姑丈公");
    set("M.M.BO", "外舅公");
    set("M.M.BY", "外舅公");
    set("M.M.SO", "外姨婆");
    set("M.M.SY", "外姨婆");
    set("M.M.BO.W", "外舅婆");
    set("M.M.SO.H", "外姨丈公");

    [
      { p: "F.F.BO", t: "堂" },
      { p: "F.F.BY", t: "堂" },
      { p: "F.F.SO", t: "表" },
      { p: "F.F.SY", t: "表" },
      { p: "F.M.BO", t: "表" },
      { p: "F.M.BY", t: "表" },
      { p: "F.M.SO", t: "表" },
      { p: "F.M.SY", t: "表" },
      { p: "M.F.BO", t: "表" },
      { p: "M.F.BY", t: "表" },
      { p: "M.M.BO", t: "表" },
      { p: "M.M.SO", t: "表" },
    ].forEach(function (entry) {
      var p = entry.p;
      var c = entry.t;
      set(p + ".SN_O", c + "伯");
      set(p + ".SN_Y", c + "叔");
      set(p + ".DT_O", c + "姑");
      set(p + ".DT_Y", c + "姑");
      set(p + ".SN_O.W", c + "伯母");
      set(p + ".SN_Y.W", c + "嬸");
      set(p + ".DT_O.H", c + "姑丈");
      set(p + ".DT_Y.H", c + "姑丈");
      set(p + ".SN_O.SN_O", c + "兄");
      set(p + ".SN_O.SN_Y", c + "弟");
      set(p + ".SN_O.DT_O", c + "姊");
      set(p + ".SN_O.DT_Y", c + "妹");
      set(p + ".SN_Y.SN_O", c + "兄");
      set(p + ".SN_Y.SN_Y", c + "弟");
      set(p + ".SN_Y.DT_O", c + "姊");
      set(p + ".SN_Y.DT_Y", c + "妹");
      set(p + ".DT_O.SN_O", c + "兄");
      set(p + ".DT_O.SN_Y", c + "弟");
      set(p + ".DT_O.DT_O", c + "姊");
      set(p + ".DT_O.DT_Y", c + "妹");
      set(p + ".DT_Y.SN_O", c + "兄");
      set(p + ".DT_Y.SN_Y", c + "弟");
      set(p + ".DT_Y.DT_O", c + "姊");
      set(p + ".DT_Y.DT_Y", c + "妹");
    });

    set("H", "丈夫");
    set("W", "妻子");
    set("H.F", "公公");
    set("H.M", "婆婆");
    set("W.F", "岳父");
    set("W.M", "岳母");
    set("H.F.F", "太公");
    set("H.F.M", "太婆");
    set("H.M.F", "外太公");
    set("H.M.M", "外太婆");
    set("W.F.F", "太岳父");
    set("W.F.M", "太岳母");
    set("W.M.F", "外太岳父");
    set("W.M.M", "外太岳母");

    set("H.BO", "大伯");
    set("H.BY", "小叔");
    set("H.SO", "大姑");
    set("H.SY", "小姑");
    set("W.BO", "內兄 (大舅子)");
    set("W.BY", "內弟 (小舅子)");
    set("W.SO", "妻姊 (大姨子)");
    set("W.SY", "妻妹 (小姨子)");

    set("H.BO.W", "妯娌 (大嫂)");
    set("H.BY.W", "妯娌 (弟妹)");
    set("H.SO.H", "姊夫");
    set("H.SY.H", "妹夫");
    set("W.BO.W", "內嫂");
    set("W.BY.W", "內弟妹");
    set("W.SO.H", "襟兄");
    set("W.SY.H", "襟弟");

    set("H.F.BO", "伯翁 (伯公)");
    set("H.F.BY", "叔翁 (叔公)");
    set("H.F.SO", "姑母 (姑奶)");
    set("H.F.SY", "姑母 (姑奶)");
    set("H.M.BO", "舅父 (舅爺)");
    set("H.M.SO", "姨母 (姨奶)");
    set("H.F.BO.W", "伯婆");
    set("H.F.BY.W", "嬸婆");
    set("H.F.SO.H", "姑丈公");
    set("H.M.BO.W", "舅婆");
    set("H.M.SO.H", "姨丈公");

    set("W.F.BO", "伯岳父");
    set("W.F.BY", "叔岳父");
    set("W.F.SO", "姑岳母");
    set("W.F.BO.W", "伯岳母");
    set("W.F.BY.W", "叔岳母");
    set("W.M.BO", "舅岳父");
    set("W.M.SO", "姨岳母");

    set("SN.W", "媳婦");
    set("DT.H", "女婿");
    set("SN.SN.W", "孫媳");
    set("SN.DT.H", "孫女婿");
    set("DT.SN.W", "外孫媳");
    set("DT.DT.H", "外孫女婿");

    set("SN.W.F", "親家翁");
    set("SN.W.M", "親家母");
    set("DT.H.F", "親家翁");
    set("DT.H.M", "親家母");

    set("F.F.SN_O", "伯父");
    set("F.F.SN_Y", "叔父");
    set("F.F.DT_O", "姑母");
    set("F.F.DT_Y", "姑母");
    set("F.M.SN_O", "伯父");
    set("F.M.SN_Y", "叔父");
    set("F.M.DT_O", "姑母");
    set("F.M.DT_Y", "姑母");
    set("M.F.SN_O", "舅父");
    set("M.F.SN_Y", "舅父");
    set("M.F.DT_O", "姨母");
    set("M.F.DT_Y", "姨母");
    set("M.M.SN_O", "舅父");
    set("M.M.SN_Y", "舅父");
    set("M.M.DT_O", "姨母");
    set("M.M.DT_Y", "姨母");

    set("F.SN_O", "兄");
    set("F.SN_Y", "弟");
    set("F.DT_O", "姊");
    set("F.DT_Y", "妹");
    set("M.SN_O", "兄");
    set("M.SN_Y", "弟");
    set("M.DT_O", "姊");
    set("M.DT_Y", "妹");

    set("F.W", "母親");
    set("M.H", "父親");
    set("F.F.W", "祖母");
    set("F.M.H", "祖父");
    set("M.F.W", "外祖母");
    set("M.M.H", "外祖父");

    return T;
  }

  function pathKey(stepList) {
    return stepList
      .map(function (s) {
        if (s.code === "SN" || s.code === "DT") {
          return s.code + "_" + (s.age === "older" ? "O" : "Y");
        }
        return s.code;
      })
      .join(".");
  }

  function normalizeKey(key) {
    var prev;
    do {
      prev = key;
      key = key
        .replace(/(^|\.)F\.W(\.|$)/g, "$1M$2")
        .replace(/(^|\.)M\.H(\.|$)/g, "$1F$2")
        .replace(/(^|\.)[FM]\.SN_O(\.|$)/g, "$1BO$2")
        .replace(/(^|\.)[FM]\.SN_Y(\.|$)/g, "$1BY$2")
        .replace(/(^|\.)[FM]\.DT_O(\.|$)/g, "$1SO$2")
        .replace(/(^|\.)[FM]\.DT_Y(\.|$)/g, "$1SY$2");
    } while (key !== prev);
    return key;
  }

  function ageVariants(key) {
    var positions = [];
    var pattern = /_[OY]/g;
    var m;
    while ((m = pattern.exec(key)) !== null) positions.push(m.index);
    var n = positions.length;
    if (n === 0) return [key];
    var variants = [];
    for (var mask = (1 << n) - 1; mask >= 0; mask -= 1) {
      var variant = "";
      var lastIdx = 0;
      for (var i = 0; i < n; i += 1) {
        variant += key.slice(lastIdx, positions[i]);
        if ((mask >> i) & 1) variant += key.slice(positions[i], positions[i] + 2);
        lastIdx = positions[i] + 2;
      }
      variant += key.slice(lastIdx);
      variants.push(variant);
    }
    return variants;
  }

  function tryLookup(key) {
    var variants = ageVariants(key);
    for (var i = 0; i < variants.length; i += 1) {
      if (TITLES[variants[i]]) return TITLES[variants[i]];
    }
    return null;
  }

  function lookupTitle(stepList) {
    if (stepList.length === 0) return "我";
    var key = pathKey(stepList);
    var direct = tryLookup(key);
    if (direct) return direct;
    var normalized = normalizeKey(key);
    if (normalized !== key) {
      var normResult = tryLookup(normalized);
      if (normResult) return normResult;
    }
    return null;
  }

  function buildChain(stepList) {
    if (stepList.length === 0) return "我";
    var parts = ["我"];
    for (var i = 0; i < stepList.length; i += 1) {
      var s = stepList[i];
      var label = STEP_LABEL[s.code];
      if (s.code === "SN" || s.code === "DT") {
        var ageHint = ageMatters(stepList, i) ? "（" + (s.age === "older" ? "年長" : "年輕") + "）" : "";
        label += ageHint;
      }
      parts.push(label);
    }
    return parts.join("的");
  }

  function ageMatters(stepList, i) {
    var flipped = stepList.slice();
    var step = flipped[i];
    flipped[i] = { code: step.code, age: step.age === "older" ? "younger" : "older" };
    var titleNow = lookupTitle(stepList);
    var titleFlipped = lookupTitle(flipped);
    if (!titleNow && !titleFlipped) return false;
    return titleNow !== titleFlipped;
  }

  function render() {
    var chain = buildChain(steps);
    var title = lookupTitle(steps);

    if (steps.length === 0) {
      chainEl.textContent = chain;
      resultEl.classList.add("is-muted");
      resultEl.textContent = "點選關係按鈕開始 →";
    } else {
      chainEl.innerHTML = escapeHtml(chain) + ' <span class="kin-chain-eq">=</span>';
      if (title) {
        resultEl.classList.remove("is-muted");
        resultEl.textContent = title;
      } else {
        resultEl.classList.add("is-muted");
        resultEl.textContent = "（沒有對應的常見稱呼）";
      }
    }
    errorEl.classList.remove("is-visible");
    errorEl.textContent = "";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function applyOp(code) {
    var step = { code: code };
    if (code === "SN" || code === "DT") {
      step.age = ageOlder ? "older" : "younger";
    }
    steps.push(step);
    render();
    saveHash();
  }

  function clearEntry() {
    steps.pop();
    render();
    saveHash();
  }

  function clearAll() {
    steps = [];
    render();
    saveHash();
  }

  function setEgoGender(g) {
    egoGender = g;
    genderFBtn.classList.toggle("is-active", g === "F");
    genderMBtn.classList.toggle("is-active", g === "M");
    saveHash();
  }

  function setAge(older) {
    ageOlder = older;
    ageOlderBtn.classList.toggle("is-active", older);
    ageYoungerBtn.classList.toggle("is-active", !older);
  }

  function saveHash() {
    try {
      var encoded = steps
        .map(function (s) {
          if (s.code === "SN" || s.code === "DT") {
            return s.code + (s.age === "older" ? "+" : "-");
          }
          return s.code;
        })
        .join(",");
      var params = "g=" + egoGender + (encoded ? "&p=" + encodeURIComponent(encoded) : "");
      history.replaceState(null, "", "#" + params);
    } catch (_) {}
  }

  function loadHash() {
    if (!location.hash || location.hash.length < 2) return;
    var raw = location.hash.slice(1);
    var pairs = raw.split("&");
    var loaded = [];
    var gender = null;
    pairs.forEach(function (pair) {
      var kv = pair.split("=");
      if (kv[0] === "g") {
        gender = kv[1];
      } else if (kv[0] === "p") {
        var pathStr = decodeURIComponent(kv[1] || "");
        if (!pathStr) return;
        pathStr.split(",").forEach(function (tok) {
          if (!tok) return;
          var age = null;
          if (tok.endsWith("+")) {
            age = "older";
            tok = tok.slice(0, -1);
          } else if (tok.endsWith("-")) {
            age = "younger";
            tok = tok.slice(0, -1);
          }
          if (!STEP_LABEL[tok]) return;
          var step = { code: tok };
          if (age) step.age = age;
          loaded.push(step);
        });
      }
    });
    if (gender === "F" || gender === "M") {
      setEgoGender(gender);
    }
    if (loaded.length) {
      steps = loaded;
    }
  }

  keypad.addEventListener("click", function (e) {
    var target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    var op = target.getAttribute("data-op");
    var action = target.getAttribute("data-action");
    if (op) {
      applyOp(op);
      return;
    }
    if (action === "ce") {
      clearEntry();
      return;
    }
    if (action === "ac") {
      clearAll();
      return;
    }
  });

  genderFBtn.addEventListener("click", function () {
    setEgoGender("F");
    render();
  });
  genderMBtn.addEventListener("click", function () {
    setEgoGender("M");
    render();
  });
  ageOlderBtn.addEventListener("click", function () {
    setAge(true);
  });
  ageYoungerBtn.addEventListener("click", function () {
    setAge(false);
  });

  loadHash();
  setEgoGender(egoGender);
  setAge(ageOlder);
  render();
})();
