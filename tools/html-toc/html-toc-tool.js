(function () {
  "use strict";

  var htmlInput = document.getElementById("htmlInput");
  var htmlOutput = document.getElementById("htmlOutput");
  var previewContainer = document.getElementById("previewContainer");
  var tocTitleInput = document.getElementById("tocTitleInput");
  var tocPositionSelect = document.getElementById("tocPositionSelect");
  var useInlineStyleCheckbox = document.getElementById("useInlineStyleCheckbox");
  var collapsibleTocCheckbox = document.getElementById("collapsibleTocCheckbox");
  var loadExampleBtn = document.getElementById("loadExampleBtn");
  var clearBtn = document.getElementById("clearBtn");
  var copyBtn = document.getElementById("copyBtn");
  var downloadBtn = document.getElementById("downloadBtn");
  var tabPreviewBtn = document.getElementById("tabPreviewBtn");
  var tabCodeBtn = document.getElementById("tabCodeBtn");
  var codeContainer = document.getElementById("codeContainer");
  var toast = document.getElementById("toast");
  var toastMsg = document.getElementById("toastMsg");

  var sampleTeamsHTML =
    "<h2>How to Schedule a Microsoft Teams Meeting</h2>\n" +
    "<p>Depending on your workflow and whether the session is for a specific course or general appointment, you can schedule a Teams meeting using three main methods:</p>\n\n" +
    "<h3>Method 1: Via a Teams Channel / Team Class (Best for Recurring Course Lectures)</h3>\n" +
    "<p>Scheduling directly inside a course channel ensures that all enrolled members automatically gain access to the meeting link, channel notifications, and session recordings.</p>\n" +
    "<ol>\n" +
    "  <li>Open Microsoft Teams and select Teams from the left navigation pane.</li>\n" +
    "  <li>Navigate to your specific course team and select the desired channel.</li>\n" +
    "  <li>In the top-right corner, click Meet or Schedule a meeting.</li>\n" +
    "</ol>\n\n" +
    "<h3>Method 2: Via the Teams Calendar (Best for General/Individual Meetings)</h3>\n" +
    "<p>Select Calendar from the left navigation pane and click + New meeting in the top-right corner.</p>\n\n" +
    "<h3>Method 3: Via Microsoft Outlook (Best for Email-Integrated Scheduling)</h3>\n" +
    "<p>Open Outlook Calendar, click New Event, and turn on the Teams Meeting toggle switch.</p>\n\n" +
    "<h2>How to Configure Automatic Recordings & Meeting Options</h2>\n" +
    "<p>Enabling automatic recordings ensures lectures record seamlessly from the moment a session starts.</p>\n\n" +
    "<h2>In-Meeting Management & Controls</h2>\n" +
    "<p>During live sessions, use the top control bar to manage participants and session recordings.</p>\n\n" +
    "<h2>Accessing and Sharing Recordings</h2>\n" +
    "<p>Once a session ends, Teams processes and stores the recording automatically.</p>\n\n" +
    "<h3>Method A: Via Meeting Recap (Standard Calendar Meetings)</h3>\n" +
    "<p>Navigate to the chat thread or calendar item for the scheduled meeting and click View recap.</p>\n\n" +
    "<h3>Method B: Via the Meeting Details (Class Channels & Channel Meetings)</h3>\n" +
    "<p>Open the meeting chat thread inside your Teams channel and locate the Recording file card.</p>\n\n" +
    "<h2>Need Support?</h2>\n" +
    "<p>Contact the Learning Technology team at elearning@twu.ca for help.</p>";

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fa5-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  function getHeadingLevel(headingEl) {
    return parseInt(headingEl.tagName.substring(1), 10);
  }

  /**
   * Prefer content inside an existing id/name anchor when it has visible text.
   * LMS HTML often uses an empty placeholder like <a id="5"></a> next to the
   * real title; in that case keep the full heading markup (minus the empty a).
   */
  function getHeadingInnerContent(headingEl, existingAnchor) {
    if (existingAnchor && (existingAnchor.textContent || "").trim()) {
      return existingAnchor.innerHTML;
    }

    var clone = headingEl.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll("a[id], a[name]"), function (anchor) {
      if (!(anchor.textContent || "").trim()) {
        anchor.remove();
      }
    });
    return clone.innerHTML;
  }

  function processHTML() {
    var rawHTML = htmlInput.value.trim();
    if (!rawHTML) {
      previewContainer.innerHTML = '<p class="toc-empty">請在左側輸入 HTML 內容。</p>';
      htmlOutput.value = "";
      return;
    }

    var checkedLevels = Array.prototype.slice
      .call(document.querySelectorAll(".toc-level:checked"))
      .map(function (cb) {
        return cb.value;
      });

    if (checkedLevels.length === 0) {
      previewContainer.innerHTML = rawHTML;
      htmlOutput.value = rawHTML;
      return;
    }

    var selector = checkedLevels.join(",");
    var parser = new DOMParser();
    var doc = parser.parseFromString(rawHTML, "text/html");
    var headings = Array.prototype.slice.call(doc.body.querySelectorAll(selector));

    if (headings.length === 0) {
      previewContainer.innerHTML = rawHTML;
      htmlOutput.value = rawHTML;
      return;
    }

    var usedIds = new Set();
    Array.prototype.forEach.call(doc.querySelectorAll("[id]"), function (el) {
      usedIds.add(el.id);
    });

    var tocNav = doc.createElement("nav");
    tocNav.className = "table-of-contents";

    var useInline = useInlineStyleCheckbox.checked;
    var collapsible = collapsibleTocCheckbox.checked;
    var tocTitleText = tocTitleInput.value.trim() || "Table of Contents";

    if (useInline) {
      tocNav.setAttribute(
        "style",
        "background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 0.75rem 1.25rem 1rem; margin-bottom: 2rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);"
      );
    }

    var rootUl = doc.createElement("ul");
    if (useInline) {
      rootUl.setAttribute("style", "list-style-type: none; padding-left: 0; margin: 0.75rem 0 0;");
    }

    if (collapsible) {
      var tocDetails = doc.createElement("details");
      tocDetails.className = "toc-collapsible";
      tocDetails.open = true;
      if (useInline) {
        tocDetails.setAttribute("style", "margin: 0;");
      }

      var tocSummary = doc.createElement("summary");
      tocSummary.className = "toc-title";
      tocSummary.textContent = tocTitleText;
      if (useInline) {
        tocSummary.setAttribute(
          "style",
          "display: list-item; font-size: 1.125rem; font-weight: 700; color: #1e293b; margin: 0; padding: 0.35rem 0 0.65rem; border-bottom: 2px solid #e2e8f0; cursor: pointer;"
        );
      }
      tocDetails.appendChild(tocSummary);
      tocDetails.appendChild(rootUl);
      tocNav.appendChild(tocDetails);
    } else {
      if (tocTitleInput.value.trim()) {
        var titleEl = doc.createElement("h2");
        titleEl.className = "toc-title";
        titleEl.textContent = tocTitleText;
        if (useInline) {
          titleEl.setAttribute(
            "style",
            "font-size: 1.125rem; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0;"
          );
        }
        tocNav.appendChild(titleEl);
      }
      if (useInline) {
        rootUl.setAttribute("style", "list-style-type: none; padding-left: 0; margin: 0;");
      }
      tocNav.appendChild(rootUl);
    }

    var stack = [{ level: getHeadingLevel(headings[0]), ul: rootUl }];
    var nodeCounter = 1;

    headings.forEach(function (h) {
      var existingAnchor = h.querySelector("a[id], a[name]");
      var id = existingAnchor
        ? existingAnchor.id || existingAnchor.getAttribute("name")
        : h.getAttribute("id");

      if (!id) {
        var baseSlug = slugify(h.textContent) || "section";
        id = baseSlug;
        var counter = 1;
        while (usedIds.has(id)) {
          id = baseSlug + "-" + counter++;
        }
        usedIds.add(id);
      }

      if (!h.hasAttribute("data-path-to-node")) {
        h.setAttribute("data-path-to-node", String(nodeCounter));
      }
      nodeCounter++;

      h.removeAttribute("id");

      var headingText = h.textContent.trim();
      var innerContent = getHeadingInnerContent(h, existingAnchor);
      h.innerHTML =
        '<a id="' +
        id +
        '" name="' +
        id +
        '" style="color: inherit; text-decoration: none;">' +
        innerContent +
        "</a>";

      var currentLevel = getHeadingLevel(h);
      var li = doc.createElement("li");
      if (useInline) {
        li.setAttribute("style", "margin-bottom: 0.375rem; line-height: 1.5;");
      }

      var a = doc.createElement("a");
      a.href = "#" + id;
      a.textContent = headingText;
      if (useInline) {
        a.setAttribute("style", "color: #4f46e5; text-decoration: none;");
      }
      li.appendChild(a);

      if (currentLevel > stack[stack.length - 1].level) {
        var newUl = doc.createElement("ul");
        if (useInline) {
          newUl.setAttribute(
            "style",
            "list-style-type: none; padding-left: 1.25rem; margin-top: 0.25rem; margin-bottom: 0.25rem;"
          );
        }
        var lastLi = stack[stack.length - 1].ul.lastElementChild;
        if (lastLi) {
          lastLi.appendChild(newUl);
        } else {
          stack[stack.length - 1].ul.appendChild(newUl);
        }
        stack.push({ level: currentLevel, ul: newUl });
      } else if (currentLevel < stack[stack.length - 1].level) {
        while (stack.length > 1 && currentLevel < stack[stack.length - 1].level) {
          stack.pop();
        }
      }

      stack[stack.length - 1].ul.appendChild(li);
    });

    var insertPosition = tocPositionSelect.value;
    if (insertPosition === "before-first" && headings[0]) {
      headings[0].parentNode.insertBefore(tocNav, headings[0]);
    } else {
      doc.body.insertBefore(tocNav, doc.body.firstChild);
    }

    var resultHTML = doc.body.innerHTML;
    htmlOutput.value = resultHTML;
    previewContainer.innerHTML = resultHTML;
  }

  function setActiveTab(activeBtn, inactiveBtn) {
    activeBtn.classList.add("is-active");
    activeBtn.setAttribute("aria-selected", "true");
    inactiveBtn.classList.remove("is-active");
    inactiveBtn.setAttribute("aria-selected", "false");
  }

  function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.add("is-visible");
    window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3000);
  }

  htmlInput.addEventListener("input", processHTML);
  tocTitleInput.addEventListener("input", processHTML);
  tocPositionSelect.addEventListener("change", processHTML);
  useInlineStyleCheckbox.addEventListener("change", processHTML);
  collapsibleTocCheckbox.addEventListener("change", processHTML);
  Array.prototype.forEach.call(document.querySelectorAll(".toc-level"), function (cb) {
    cb.addEventListener("change", processHTML);
  });

  loadExampleBtn.addEventListener("click", function () {
    htmlInput.value = sampleTeamsHTML;
    processHTML();
    showToast("已成功載入 Teams 指南範例！");
  });

  clearBtn.addEventListener("click", function () {
    htmlInput.value = "";
    processHTML();
  });

  tabPreviewBtn.addEventListener("click", function () {
    setActiveTab(tabPreviewBtn, tabCodeBtn);
    previewContainer.classList.remove("is-hidden");
    codeContainer.classList.add("is-hidden");
  });

  tabCodeBtn.addEventListener("click", function () {
    setActiveTab(tabCodeBtn, tabPreviewBtn);
    codeContainer.classList.remove("is-hidden");
    previewContainer.classList.add("is-hidden");
  });

  copyBtn.addEventListener("click", function () {
    if (!htmlOutput.value) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(htmlOutput.value).then(
        function () {
          showToast("已成功複製 HTML 程式碼！");
        },
        function () {
          htmlOutput.select();
          try {
            document.execCommand("copy");
            showToast("已成功複製 HTML 程式碼！");
          } catch (err) {
            showToast("複製失敗，請手動全選複製。");
          }
        }
      );
      return;
    }

    htmlOutput.select();
    try {
      document.execCommand("copy");
      showToast("已成功複製 HTML 程式碼！");
    } catch (err) {
      showToast("複製失敗，請手動全選複製。");
    }
  });

  downloadBtn.addEventListener("click", function () {
    if (!htmlOutput.value) return;
    var blob = new Blob([htmlOutput.value], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "content-with-toc.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("HTML 檔案已開始下載！");
  });

  htmlInput.value = sampleTeamsHTML;
  processHTML();
})();
