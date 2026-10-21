(function () {
  "use strict";

  var ITEMS = [
    { id: 1, text: "18歲前有自己獨立房間（非碌架床 / 客廳）", type: "checkbox", weight: 1 },
    { id: 2, text: "從未住過劏房 / 板間房 / 臨屋", type: "checkbox", weight: 1 },
    { id: 3, text: "私樓 / 居屋物業數量（非租住公屋）", type: "number", weight: 6, unit: "間" },
    { id: 4, text: "住址在名校網（如11 / 41 / 34校網）", type: "checkbox", weight: 2 },
    { id: 5, text: "有長期補習 / 私人補習（非考前臨時）", type: "checkbox", weight: 1 },
    { id: 6, text: "中學讀 Band 1 / 直資 / 私校", type: "checkbox", weight: 2 },
    { id: 7, text: "DSE 失手有 Plan B（外國升學 / 重讀）", type: "checkbox", weight: 3 },
    { id: 8, text: "父母了解升學策略（DSE 選科、JUPAS）", type: "checkbox", weight: 2 },
    { id: 9, text: "長期學樂器 / 舞蹈 / 美術 ≥ 1年", type: "checkbox", weight: 1 },
    { id: 10, text: "學過「貴族運動」（網球、馬術、高爾夫、劍擊）", type: "checkbox", weight: 3 },
    { id: 11, text: "參加過 ABRSM、Trinity 等公開考試", type: "checkbox", weight: 1 },
    { id: 12, text: "小學前已有自己電腦 / 平板", type: "checkbox", weight: 1 },
    { id: 13, text: "有人教你「錢如何生錢」", type: "checkbox", weight: 2 },
    { id: 14, text: "有固定家庭醫生 / 私家專科", type: "checkbox", weight: 3 },
    { id: 15, text: "接受過牙齒矯正", type: "checkbox", weight: 2 },
    { id: 16, text: "生病不用排政府專科", type: "checkbox", weight: 3 },
    { id: 17, text: "可自由搭的士 / Uber", type: "checkbox", weight: 1 },
    { id: 18, text: "私家車數量", type: "number", weight: 5, unit: "部" },
    { id: 19, text: "工人姐姐數量", type: "number", weight: 2, unit: "名" },
    { id: 20, text: "不需要做兼職補貼家用", type: "checkbox", weight: 1 },
    { id: 21, text: "去餐廳食飯是「日常」非「慶祝」", type: "checkbox", weight: 1 },
    { id: 22, text: "18歲前去過歐美 / 澳加旅行", type: "checkbox", weight: 4 },
    { id: 23, text: "參加過海外夏令營 / 交流", type: "checkbox", weight: 3 },
    { id: 24, text: "讀過國際學校 / ESF", type: "checkbox", weight: 10 },
    { id: 25, text: "擁有外國護照 / 永久居留", type: "checkbox", weight: 5 },
    { id: 26, text: "父母有保險 / 信託 / 基金為你準備", type: "checkbox", weight: 3 },
    { id: 27, text: "出事有人兜底（學校、法律、工作）", type: "checkbox", weight: 5 },
    { id: 28, text: "可以嘗試失敗而不影響家庭生存", type: "checkbox", weight: 5 },
    { id: 29, text: "識人可以「搭路」搵工 / 入學", type: "checkbox", weight: 5 },
  ];

  var answers = Object.create(null);
  var isDownloading = false;
  var ESCALATING_NUMBER_IDS = {
    3: true,
    18: true,
    19: true,
  };
  var WEIBULL_SHAPE = 1.6;
  var WEIBULL_SCALE = 25.3;
  var PCT_MAX_SCORE = 84;
  var CURVE_MAX_SCORE = 100;
  var WEIBULL_CDF_AT_PCT_MAX = weibullCdf(PCT_MAX_SCORE);
  var GRAPH_X_MIN = 20;
  var GRAPH_X_MAX = 380;
  var GRAPH_Y_BASELINE = 100;
  var GRAPH_Y_HEIGHT = 78;

  var itemsRoot = document.getElementById("priv-items");
  var checkedCountEl = document.getElementById("priv-checked-count");
  var totalScoreEl = document.getElementById("priv-total-score");
  var rankEl = document.getElementById("priv-rank");
  var percentileEl = document.getElementById("priv-percentile");
  var summaryEl = document.getElementById("priv-summary");
  var summaryCountEl = document.getElementById("priv-summary-count");
  var summaryListEl = document.getElementById("priv-summary-list");
  var weightBodyEl = document.getElementById("priv-weight-body");
  var resetBtn = document.getElementById("priv-reset-btn");
  var downloadBtn = document.getElementById("priv-download-btn");
  var resultCardEl = document.getElementById("priv-result-card");
  var curvePolylineEl = document.getElementById("priv-curve-polyline");
  var curvePolygonEl = document.getElementById("priv-curve-polygon");
  var markerLineEl = document.getElementById("priv-marker-line");
  var markerDotEl = document.getElementById("priv-marker-dot");
  var markerTextEl = document.getElementById("priv-marker-text");

  function weibullPdf(score) {
    if (score < 0) return 0;
    if (score === 0 && WEIBULL_SHAPE < 1) return Infinity;
    var ratio = score / WEIBULL_SCALE;
    return (WEIBULL_SHAPE / WEIBULL_SCALE) * Math.pow(ratio, WEIBULL_SHAPE - 1) * Math.exp(-Math.pow(ratio, WEIBULL_SHAPE));
  }

  function weibullCdf(score) {
    if (score <= 0) return 0;
    return 1 - Math.exp(-Math.pow(score / WEIBULL_SCALE, WEIBULL_SHAPE));
  }

  function normalizedPercentile(score) {
    if (score <= 0) return 0;
    var cdfRatio = weibullCdf(score) / WEIBULL_CDF_AT_PCT_MAX;
    return Math.min(1, cdfRatio);
  }

  function scoreToChartX(score) {
    var clamped = Math.max(0, Math.min(score, CURVE_MAX_SCORE));
    return GRAPH_X_MIN + (clamped / CURVE_MAX_SCORE) * (GRAPH_X_MAX - GRAPH_X_MIN);
  }

  function chartXToScore(x) {
    var ratio = (x - GRAPH_X_MIN) / (GRAPH_X_MAX - GRAPH_X_MIN);
    return Math.max(0, Math.min(1, ratio)) * CURVE_MAX_SCORE;
  }

  function curveMaxPdf() {
    if (WEIBULL_SHAPE <= 1) return weibullPdf(0.0001);
    var mode = WEIBULL_SCALE * Math.pow((WEIBULL_SHAPE - 1) / WEIBULL_SHAPE, 1 / WEIBULL_SHAPE);
    if (mode <= CURVE_MAX_SCORE) return weibullPdf(mode);
    return weibullPdf(CURVE_MAX_SCORE);
  }

  function scoreToCurveY(score, maxPdf) {
    var bounded = Math.max(0, Math.min(score, CURVE_MAX_SCORE));
    var densityRatio = Math.max(0, Math.min(1, weibullPdf(bounded) / maxPdf));
    return GRAPH_Y_BASELINE - densityRatio * GRAPH_Y_HEIGHT;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function buildCurve() {
    var pts = GRAPH_X_MIN + "," + GRAPH_Y_BASELINE + " ";
    var maxPdf = curveMaxPdf();
    var x;
    for (x = GRAPH_X_MIN; x <= GRAPH_X_MAX; x += 5) {
      pts += x + "," + scoreToCurveY(chartXToScore(x), maxPdf) + " ";
    }
    pts += GRAPH_X_MAX + "," + GRAPH_Y_BASELINE;
    curvePolylineEl.setAttribute("points", pts);
    curvePolygonEl.setAttribute("points", pts);
  }

  function toggleCheckbox(itemId) {
    answers[itemId] = answers[itemId] ? 0 : 1;
  }

  function updateNumber(itemId, delta) {
    var current = answers[itemId] || 0;
    answers[itemId] = Math.max(0, current + delta);
  }

  // 1個=1倍、2個=3倍、3個=6倍…（三角數），每新增一個資產都比上一個更重。
  function escalatingUnitsMultiplier(units) {
    return (units * (units + 1)) / 2;
  }

  function getItemScore(item, value) {
    if (item.type === "number" && ESCALATING_NUMBER_IDS[item.id]) {
      return item.weight * escalatingUnitsMultiplier(value);
    }
    return value * item.weight;
  }

  function calculateStats() {
    var score = 0;
    var checkedCount = 0;
    var i;
    for (i = 0; i < ITEMS.length; i += 1) {
      var item = ITEMS[i];
      var val = answers[item.id] || 0;
      if (val > 0) {
        score += getItemScore(item, val);
        checkedCount += 1;
      }
    }

    var cdf = normalizedPercentile(score);
    var pct = cdf * 100;
    var rank = "";
    if (pct < 20) rank = "草根階層";
    else if (pct < 50) rank = "夾心階層";
    else if (pct < 80) rank = "中產階級";
    else if (pct < 95) rank = "富裕階層";
    else rank = "贏在起跑線";

    return {
      totalScore: score,
      checkedCount: checkedCount,
      rank: rank,
      percentile: pct.toFixed(1),
    };
  }

  function renderItems() {
    var html = [];
    var i;
    for (i = 0; i < ITEMS.length; i += 1) {
      var item = ITEMS[i];
      var val = answers[item.id] || 0;
      var isActive = val > 0;
      html.push(
        '<div class="priv-item' +
          (isActive ? " is-active" : "") +
          '" data-id="' +
          item.id +
          '" data-item-type="' +
          item.type +
          '">'
      );
      html.push('<div class="priv-item-main">');
      if (item.type === "checkbox") {
        html.push(
          '<input class="priv-item-check" type="checkbox" data-role="checkbox" data-id="' +
            item.id +
            '"' +
            (isActive ? " checked" : "") +
            " />"
        );
      } else {
        html.push('<span class="priv-item-index">' + (i + 1) + ".</span>");
      }
      html.push(
        '<span class="priv-item-text">' +
          (item.type === "checkbox" ? '<span class="priv-item-index">' + (i + 1) + ".</span> " : "") +
          escapeHtml(item.text) +
          "</span>"
      );
      html.push("</div>");

      if (item.type === "number") {
        html.push('<div class="priv-stepper">');
        html.push(
          '<button class="priv-stepper-btn" data-role="minus" data-id="' +
            item.id +
            '"' +
            (val === 0 ? " disabled" : "") +
            ' type="button">−</button>'
        );
        html.push('<span class="priv-stepper-value">' + val + "</span>");
        html.push('<button class="priv-stepper-btn" data-role="plus" data-id="' + item.id + '" type="button">+</button>');
        html.push("</div>");
      }

      html.push("</div>");
    }
    itemsRoot.innerHTML = html.join("");
  }

  function renderSummary(stats) {
    var selected = ITEMS.filter(function (item) {
      return (answers[item.id] || 0) > 0;
    });
    summaryCountEl.textContent = String(stats.checkedCount);
    if (selected.length === 0) {
      summaryEl.hidden = true;
      summaryListEl.innerHTML = "";
      return;
    }
    summaryEl.hidden = false;

    summaryListEl.innerHTML = selected
      .map(function (item) {
        var qty = item.type === "number" ? ' <span class="priv-summary-qty">(' + (answers[item.id] || 0) + " " + item.unit + ")</span>" : "";
        return '<p class="priv-summary-row">• ' + escapeHtml(item.text) + qty + "</p>";
      })
      .join("");
  }

  function renderCurveMarker(totalScore) {
    var maxPdf = curveMaxPdf();
    var boundedScore = Math.max(0, Math.min(totalScore, CURVE_MAX_SCORE));
    var markerX = scoreToChartX(boundedScore);
    var markerY = scoreToCurveY(boundedScore, maxPdf);
    markerLineEl.setAttribute("x1", markerX);
    markerLineEl.setAttribute("x2", markerX);
    markerLineEl.setAttribute("y1", String(markerY));
    markerLineEl.setAttribute("y2", String(GRAPH_Y_BASELINE));
    markerDotEl.setAttribute("cx", markerX);
    markerDotEl.setAttribute("cy", markerY);
    markerTextEl.setAttribute("x", markerX + 10);
    markerTextEl.setAttribute("y", markerY - 4);
  }

  function renderWeights() {
    var rows = ITEMS.slice()
      .sort(function (a, b) {
        return b.weight - a.weight || a.id - b.id;
      })
      .map(function (item) {
        var typeText = "單次";
        if (item.type === "number") {
          typeText = ESCALATING_NUMBER_IDS[item.id]
            ? "遞增加權 (第n個更高)"
            : "可疊加 (每" + item.unit + ")";
        }
        return (
          "<tr>" +
          '<td><span class="priv-badge">+' +
          item.weight +
          "</span></td>" +
          "<td>" +
          escapeHtml(item.text) +
          "</td>" +
          "<td>" +
          escapeHtml(typeText) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
    weightBodyEl.innerHTML = rows;
  }

  function renderAll() {
    var stats = calculateStats();
    checkedCountEl.textContent = String(stats.checkedCount);
    totalScoreEl.textContent = String(stats.totalScore);
    rankEl.textContent = stats.rank;
    percentileEl.textContent = "超越 " + stats.percentile + "% 港人";
    renderItems();
    renderSummary(stats);
    renderCurveMarker(stats.totalScore);
  }

  function handleReset() {
    var ok = window.confirm("確定要清空所有選項重新測試？");
    if (!ok) return;
    answers = Object.create(null);
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDownload() {
    if (isDownloading) return;
    isDownloading = true;
    downloadBtn.disabled = true;
    downloadBtn.textContent = "正在生成圖片...";
    try {
      var htmlToImage = await new Function("return import('https://esm.sh/html-to-image@1.11.11')")();
      var dataUrl = await htmlToImage.toPng(resultCardEl, {
        quality: 1,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      var link = document.createElement("a");
      link.download = "hk-privilege-result.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      window.alert("無法生成圖片，請稍後再試或使用系統截圖。");
    } finally {
      isDownloading = false;
      downloadBtn.disabled = false;
      downloadBtn.textContent = "下載結果圖片";
    }
  }

  itemsRoot.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof HTMLElement)) return;
    var row = target.closest(".priv-item");
    if (!row) return;

    var rowType = row.getAttribute("data-item-type");
    var rowId = Number(row.getAttribute("data-id"));
    var role = target.getAttribute("data-role");
    var id = Number(target.getAttribute("data-id")) || rowId;
    if (!id) return;

    if (role === "checkbox") {
      toggleCheckbox(id);
      renderAll();
      return;
    }
    if (role === "minus") {
      updateNumber(id, -1);
      renderAll();
      return;
    }
    if (role === "plus") {
      updateNumber(id, 1);
      renderAll();
      return;
    }

    if (rowType === "checkbox") {
      toggleCheckbox(id);
      renderAll();
    }
  });

  resetBtn.addEventListener("click", handleReset);
  downloadBtn.addEventListener("click", handleDownload);

  buildCurve();
  renderWeights();
  renderAll();
})();
