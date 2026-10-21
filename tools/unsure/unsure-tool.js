(function () {
  "use strict";

  var input = document.getElementById("unsure-formula");
  var resultEl = document.getElementById("unsure-result");
  var errorEl = document.getElementById("unsure-error");
  var histogramEl = document.getElementById("unsure-histogram");
  var percentilesEl = document.getElementById("unsure-percentiles");
  var keypad = document.getElementById("unsure-keypad");

  var SAMPLE_COUNT = 1000000;
  var INVALID_THRESHOLD = 0.5;
  /** Fixed seed so algebraically equivalent formulas (same stochastic emit order) get identical MC draws. */
  var MC_RNG_SEED = 0x556e7375;

  function makeRng(seed) {
    var s = seed >>> 0;
    return function () {
      s += 0x6d2b79f5;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function addThousandsSeparator(number) {
    return number;
  }

  function divideFormat(number, divisor) {
    return addThousandsSeparator(Math.round(number / divisor).toString());
  }

  function quantizeFormat(number, step) {
    return addThousandsSeparator((Math.round(number / step) * step).toString());
  }

  var precisions = [
    { f: function (n) { return quantizeFormat(n / 1000000000, 50) + "B"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000000; } },
    { f: function (n) { return quantizeFormat(n / 1000000000, 10) + "B"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000000; } },
    { f: function (n) { return quantizeFormat(n / 1000000000, 5) + "B"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000000; } },
    { f: function (n) { return divideFormat(n, 1000000000) + "B"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000000; } },
    { f: function (n) { return (n / 1000000000).toFixed(1) + "B"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000000; } },
    { f: function (n) { return quantizeFormat(n / 1000000, 50) + "M"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000; } },
    { f: function (n) { return quantizeFormat(n / 1000000, 10) + "M"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000; } },
    { f: function (n) { return quantizeFormat(n / 1000000, 5) + "M"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000; } },
    { f: function (n) { return divideFormat(n, 1000000) + "M"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000; } },
    { f: function (n) { return (n / 1000000).toFixed(1) + "M"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000000; } },
    { f: function (n) { return quantizeFormat(n / 1000, 50) + "K"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000; } },
    { f: function (n) { return quantizeFormat(n / 1000, 10) + "K"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000; } },
    { f: function (n) { return quantizeFormat(n / 1000, 5) + "K"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000; } },
    { f: function (n) { return divideFormat(n, 1000) + "K"; }, p: function (s) { return Number(s.slice(0, -1)) * 1000; } },
    { f: function (n) { return quantizeFormat(n, 50); }, p: Number },
    { f: function (n) { return quantizeFormat(n, 10); }, p: Number },
    { f: function (n) { return quantizeFormat(n, 5); }, p: Number },
    { f: function (n) { return addThousandsSeparator(Math.round(n).toString()); }, p: Number },
    { f: function (n) { return addThousandsSeparator(n.toFixed(1)); }, p: Number },
    { f: function (n) { return addThousandsSeparator(n.toFixed(2)); }, p: Number },
    { f: function (n) { return addThousandsSeparator(n.toFixed(3)); }, p: Number },
    { f: function (n) { return addThousandsSeparator(n.toFixed(4)); }, p: Number },
    { f: function (n) { return addThousandsSeparator(n.toFixed(5)); }, p: Number },
    { f: function (n) { return addThousandsSeparator(n.toFixed(6)); }, p: Number },
    { f: function (n) { return addThousandsSeparator(n.toFixed(7)); }, p: Number },
    { f: function (n) { return addThousandsSeparator(n.toFixed(8)); }, p: Number },
  ];

  function makeFormatter(numbers) {
    var finite = numbers.filter(Number.isFinite);
    var best = {
      f: function (n) {
        return String(n);
      },
    };
    var largest = finite.reduce(function (prev, n) {
      return Math.max(prev, Math.abs(n));
    }, 0);
    for (var i = 0; i < precisions.length; i += 1) {
      var precision = precisions[i];
      var seen = new Set();
      var cumulativeError = 0;
      var ok = true;
      for (var j = 0; j < finite.length; j += 1) {
        var n = finite[j];
        var repr = precision.f(n);
        if (seen.has(repr)) {
          ok = false;
          break;
        }
        seen.add(repr);
        cumulativeError += Math.abs(n - precision.p(repr.replaceAll(",", "")));
      }
      if (!ok || cumulativeError > 0.05 * largest) continue;
      if (seen.size === finite.length) {
        best = precision;
        break;
      }
    }
    return {
      format: function (number) {
        if (number === Infinity) return "∞";
        if (number === -Infinity) return "-∞";
        if (Number.isNaN(number)) return "Not-a-Number";
        return best.f(number);
      },
    };
  }

  function normalNext(random, state) {
    if (state.hasSpare) {
      state.hasSpare = false;
      return state.spare;
    }
    var u1 = random();
    var u2 = random();
    var r = Math.sqrt(-2 * Math.log(u1));
    var t = 2 * Math.PI * u2;
    state.spare = r * Math.sin(t);
    state.hasSpare = true;
    return r * Math.cos(t);
  }

  function makeNode(type, props) {
    return Object.assign({ type: type }, props || {});
  }

  function isStochastic(node) {
    switch (node.type) {
      case "number":
        return false;
      case "range":
      case "normal":
        return true;
      case "neg":
      case "postfix":
      case "parens":
        return isStochastic(node.a);
      case "binary":
        return isStochastic(node.a) || isStochastic(node.b);
      default:
        return false;
    }
  }

  function emit(node, random) {
    switch (node.type) {
      case "number":
        return node.value;
      case "range":
        return node.min + (node.max - node.min) * random();
      case "normal":
        return normalNext(random, node.state) * node.stdDev + node.mean;
      case "neg":
        return -emit(node.a, random);
      case "postfix":
        return emit(node.a, random) * node.k;
      case "parens":
        return emit(node.a, random);
      case "binary": {
        var left = emit(node.a, random);
        var right = emit(node.b, random);
        if (node.op === "+") return left + right;
        if (node.op === "-") return left - right;
        if (node.op === "*") return left * right;
        if (node.op === "/") return left / right;
        return NaN;
      }
      default:
        return NaN;
    }
  }

  function Parser(source) {
    this.source = source;
    this.pos = 0;
  }

  Parser.prototype.peek = function () {
    return this.source[this.pos] || "";
  };

  Parser.prototype.skip = function () {
    while (/\s/.test(this.peek())) this.pos += 1;
  };

  Parser.prototype.match = function (token) {
    this.skip();
    if (this.source.slice(this.pos, this.pos + token.length).toLowerCase() === token.toLowerCase()) {
      this.pos += token.length;
      return true;
    }
    return false;
  };

  Parser.prototype.parse = function () {
    var node = this.parseAdd();
    this.skip();
    if (this.pos !== this.source.length) throw new Error("Could not parse formula near: " + this.source.slice(this.pos));
    return node;
  };

  Parser.prototype.parseAdd = function () {
    var node = this.parseMul();
    while (true) {
      if (this.match("+")) node = makeNode("binary", { op: "+", a: node, b: this.parseMul() });
      else if (this.match("-")) node = makeNode("binary", { op: "-", a: node, b: this.parseMul() });
      else break;
    }
    return node;
  };

  Parser.prototype.parseMul = function () {
    var node = this.parsePostfix();
    while (true) {
      if (this.match("*") || this.match("×") || this.match("·") || this.match("x")) {
        node = makeNode("binary", { op: "*", a: node, b: this.parsePostfix() });
      } else if (this.match("/") || this.match("÷")) {
        node = makeNode("binary", { op: "/", a: node, b: this.parsePostfix() });
      } else {
        break;
      }
    }
    return node;
  };

  Parser.prototype.parsePostfix = function () {
    var node = this.parseNormal();
    while (true) {
      if (this.match("%")) node = makeNode("postfix", { a: node, k: 1 / 100 });
      else if (this.match("K")) node = makeNode("postfix", { a: node, k: 1000 });
      else if (this.match("M")) node = makeNode("postfix", { a: node, k: 1000000 });
      else break;
    }
    return node;
  };

  Parser.prototype.parseNormal = function () {
    var node = this.parseRange();
    while (true) {
      if (this.match("+-") || this.match("±")) {
        var right = this.parseRange();
        if (isStochastic(node) || isStochastic(right)) throw new Error("Cannot create a normal distribution from stochastic values.");
        var value = emit(node, function () { return 0.5; });
        var distance = emit(right, function () { return 0.5; });
        node = makeNode("normal", {
          mean: value,
          stdDev: distance / 2,
          state: { hasSpare: false, spare: 0 },
        });
      } else {
        break;
      }
    }
    return node;
  };

  Parser.prototype.parseRange = function () {
    var node = this.parseNeg();
    while (this.match("~")) {
      var right = this.parseNeg();
      if (isStochastic(node) || isStochastic(right)) throw new Error("Cannot create a range from stochastic values.");
      var aValue = emit(node, function () { return 0.5; });
      var bValue = emit(right, function () { return 0.5; });
      if (aValue === bValue) {
        node = makeNode("number", { value: aValue });
      } else {
        var min = Math.min(aValue, bValue);
        var max = Math.max(aValue, bValue);
        node = makeNode("normal", {
          mean: min + (max - min) / 2,
          stdDev: (max - min) / 4,
          state: { hasSpare: false, spare: 0 },
        });
      }
    }
    return node;
  };

  Parser.prototype.parseNeg = function () {
    if (this.match("-")) return makeNode("neg", { a: this.parseNeg() });
    return this.parsePrimary();
  };

  Parser.prototype.parsePrimary = function () {
    this.skip();
    if (this.match("(")) {
      var child = this.parseAdd();
      if (!this.match(")")) throw new Error("Missing closing parenthesis.");
      return makeNode("parens", { a: child });
    }
    var rest = this.source.slice(this.pos);
    var match = rest.match(/^\d+(?:\.\d+)?/);
    if (!match) throw new Error("Expected number near: " + rest);
    this.pos += match[0].length;
    return makeNode("number", { value: Number(match[0]) });
  };

  function parseFormula(source) {
    var trimmed = String(source || "").trim();
    if (!trimmed) throw new Error("Enter a formula.");
    return new Parser(trimmed).parse();
  }

  function runCalculation(ast, random) {
    var values = [];
    var invalid = 0;
    var representativeInvalid = NaN;
    for (var i = 0; i < SAMPLE_COUNT; i += 1) {
      var value = emit(ast, random);
      if (!Number.isFinite(value)) {
        invalid += 1;
        representativeInvalid = value;
      } else {
        values.push(value);
      }
    }
    if (invalid / SAMPLE_COUNT > INVALID_THRESHOLD) {
      return { isInvalid: true, singleInvalidValue: representativeInvalid };
    }
    values.sort(function (a, b) {
      return a - b;
    });
    var length = values.length;
    var percentiles = new Array(101).fill(0);
    for (var p = 0; p < 100; p += 1) {
      percentiles[p] = values[Math.floor((length * p) / 100)];
    }
    percentiles[100] = values[length - 1];
    var percentage2Standard = 95.45;
    var padding2Standard = (100 - percentage2Standard) / 2;
    var with2 = {
      lower: values[Math.floor((length * padding2Standard) / 100)],
      upper: values[Math.floor((length * (100 - padding2Standard)) / 100)],
    };
    return {
      isInvalid: false,
      values: values,
      percentiles: percentiles,
      with2: with2,
      histogram: computeHistogram(values, percentiles),
    };
  }

  function computeHistogram(values, percentiles) {
    var lower = percentiles[1];
    var median = percentiles[50];
    var upper = percentiles[99];
    var bandCount = 21;
    var bandSize = (upper - lower) / bandCount;
    var counts = new Array(bandCount).fill(0);
    var below = 0;
    var above = 0;
    for (var i = 0; i < values.length; i += 1) {
      var n = values[i];
      if (!Number.isFinite(n)) continue;
      if (n < lower) {
        below += 1;
        continue;
      }
      if (n >= upper) {
        above += 1;
        continue;
      }
      var band = Math.floor((n - lower) / bandSize);
      counts[band] += 1;
    }
    return { lower: lower, median: median, upper: upper, bandSize: bandSize, bandCount: bandCount, counts: counts, below: below, above: above };
  }

  function renderSimple(result) {
    if (result.isInvalid) return String(result.singleInvalidValue);
    var formatter = makeFormatter([result.with2.lower, result.with2.upper]);
    return formatter.format(result.with2.lower) + "~" + formatter.format(result.with2.upper);
  }

  function renderHistogram(histogram) {
    if (histogram.upper <= histogram.lower) return "single value | " + makeFormatter([histogram.lower, histogram.upper]).format(histogram.lower);
    var labels = [];
    for (var i = 0; i < histogram.bandCount; i += 1) {
      labels.push(histogram.lower + i * histogram.bandSize + histogram.bandSize / 2);
    }
    var formatter = makeFormatter(labels);
    var maxCount = histogram.counts.reduce(function (max, count) {
      return Math.max(max, count);
    }, 0);
    var lines = [];
    function addLine(label, count, trailing) {
      var line = label.padStart(10, " ") + " | ";
      var barCount = maxCount === 0 ? 0 : Math.ceil((count / maxCount) * 30);
      line += "▒".repeat(barCount);
      if (trailing) line += trailing;
      lines.push(line);
    }
    addLine("above", histogram.above);
    for (var j = histogram.bandCount - 1; j >= 0; j -= 1) {
      var bandStart = histogram.lower + j * histogram.bandSize;
      var trailing = "";
      if (bandStart < histogram.median && histogram.median < bandStart + histogram.bandSize) {
        trailing = " (" + formatter.format(histogram.median) + ")";
      }
      addLine(formatter.format(labels[j]), histogram.counts[j], trailing);
    }
    addLine("below", histogram.below);
    return lines.join("\n");
  }

  function renderPercentiles(result) {
    var printed = [];
    printed.push({ label: "97.5 %", value: result.with2.upper });
    for (var i = 95; i > 0; i -= 5) {
      printed.push({ label: i + " %", value: result.percentiles[i] });
    }
    printed.push({ label: "2.5 %", value: result.with2.lower });
    var formatter = makeFormatter(printed.map(function (item) { return item.value; }));
    var longest = printed.reduce(function (max, item) {
      return Math.max(max, formatter.format(item.value).length);
    }, 0);
    return printed
      .map(function (item) {
        return item.label.padStart(10, " ") + " | " + formatter.format(item.value).padStart(longest, " ");
      })
      .join("\n");
  }

  function setError(message) {
    if (!message) {
      errorEl.className = "unsure-error";
      errorEl.textContent = "";
      return;
    }
    errorEl.className = "unsure-error is-visible";
    errorEl.textContent = message;
  }

  function compute() {
    try {
      var source = input.value.trim();
      var rng = makeRng(MC_RNG_SEED);
      var ast = parseFormula(source);
      var result = runCalculation(ast, rng);
      resultEl.textContent = renderSimple(result);
      histogramEl.textContent = result.isInvalid ? "" : renderHistogram(result.histogram);
      percentilesEl.textContent = result.isInvalid ? "" : renderPercentiles(result);
      setError("");
      try {
        history.replaceState(null, "", "#f=" + encodeURIComponent(input.value.trim()));
      } catch (_) {}
    } catch (err) {
      resultEl.textContent = "—";
      histogramEl.textContent = "";
      percentilesEl.textContent = "";
      setError(err && err.message ? err.message : "Computation failed.");
    }
  }

  function insertAtCursor(text) {
    var start = input.selectionStart || 0;
    var end = input.selectionEnd || 0;
    var value = input.value;
    input.value = value.slice(0, start) + text + value.slice(end);
    var cursor = start + text.length;
    input.focus();
    input.setSelectionRange(cursor, cursor);
  }

  keypad.addEventListener("click", function (e) {
    var target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    var action = target.getAttribute("data-action");
    var value = target.getAttribute("data-value");
    if (action === "backspace") {
      var start = input.selectionStart || 0;
      var end = input.selectionEnd || 0;
      if (start !== end) {
        input.value = input.value.slice(0, start) + input.value.slice(end);
        input.setSelectionRange(start, start);
      } else if (start > 0) {
        input.value = input.value.slice(0, start - 1) + input.value.slice(end);
        input.setSelectionRange(start - 1, start - 1);
      }
      input.focus();
      return;
    }
    if (action === "compute") {
      compute();
      return;
    }
    if (value) {
      insertAtCursor(value);
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      compute();
    }
  });

  var hashFormula = "";
  if (location.hash && location.hash.startsWith("#f=")) {
    hashFormula = decodeURIComponent(location.hash.slice(3));
  }
  input.value = hashFormula || "1400~1700 * 0.55~0.65 - 600~700 - 100~200 - 30 - 20";
  compute();
})();
