"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

define("ace/mode/toml_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");

  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

  var TomlHighlightRules = function TomlHighlightRules() {
    var keywordMapper = this.createKeywordMapper({
      "constant.language.boolean": "true|false"
    }, "identifier");
    var identifierRe = "[a-zA-Z\\$_\xA1-\uFFFF][a-zA-Z\\d\\$_\xA1-\uFFFF]*\\b";
    this.$rules = {
      "start": [{
        token: "comment.toml",
        regex: /#.*$/
      }, {
        token: "string",
        regex: '"(?=.)',
        next: "qqstring"
      }, {
        token: ["variable.keygroup.toml"],
        regex: "(?:^\\s*)(\\[\\[([^\\]]+)\\]\\])"
      }, {
        token: ["variable.keygroup.toml"],
        regex: "(?:^\\s*)(\\[([^\\]]+)\\])"
      }, {
        token: keywordMapper,
        regex: identifierRe
      }, {
        token: "support.date.toml",
        regex: "\\d{4}-\\d{2}-\\d{2}(T)\\d{2}:\\d{2}:\\d{2}(Z)"
      }, {
        token: "constant.numeric.toml",
        regex: "-?\\d+(\\.?\\d+)?"
      }],
      "qqstring": [{
        token: "string",
        regex: "\\\\$",
        next: "qqstring"
      }, {
        token: "constant.language.escape",
        regex: '\\\\[0tnr"\\\\]'
      }, {
        token: "string",
        regex: '"|$',
        next: "start"
      }, {
        defaultToken: "string"
      }]
    };
  };

  oop.inherits(TomlHighlightRules, TextHighlightRules);
  exports.TomlHighlightRules = TomlHighlightRules;
});
define("ace/mode/folding/ini", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (require, exports, module) {
  "use strict";

  var oop = require("../../lib/oop");

  var Range = require("../../range").Range;

  var BaseFoldMode = require("./fold_mode").FoldMode;

  var FoldMode = exports.FoldMode = function () {};

  oop.inherits(FoldMode, BaseFoldMode);
  (function () {
    this.foldingStartMarker = /^\s*\[([^\])]*)]\s*(?:$|[;#])/;

    this.getFoldWidgetRange = function (session, foldStyle, row) {
      var re = this.foldingStartMarker;
      var line = session.getLine(row);
      var m = line.match(re);
      if (!m) return;
      var startName = m[1] + ".";
      var startColumn = line.length;
      var maxRow = session.getLength();
      var startRow = row;
      var endRow = row;

      while (++row < maxRow) {
        line = session.getLine(row);
        if (/^\s*$/.test(line)) continue;
        m = line.match(re);
        if (m && m[1].lastIndexOf(startName, 0) !== 0) break;
        endRow = row;
      }

      if (endRow > startRow) {
        var endColumn = session.getLine(endRow).length;
        return new Range(startRow, startColumn, endRow, endColumn);
      }
    };
  }).call(FoldMode.prototype);
});
define("ace/mode/toml", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/toml_highlight_rules", "ace/mode/folding/ini"], function (require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");

  var TextMode = require("./text").Mode;

  var TomlHighlightRules = require("./toml_highlight_rules").TomlHighlightRules;

  var FoldMode = require("./folding/ini").FoldMode;

  var Mode = function Mode() {
    this.HighlightRules = TomlHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
  };

  oop.inherits(Mode, TextMode);
  (function () {
    this.lineCommentStart = "#";
    this.$id = "ace/mode/toml";
  }).call(Mode.prototype);
  exports.Mode = Mode;
});

(function () {
  window.require(["ace/mode/toml"], function (m) {
    if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == "object" && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && module) {
      module.exports = m;
    }
  });
})();