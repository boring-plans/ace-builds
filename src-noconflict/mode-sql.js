ace.define("ace/mode/sql_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

  var SqlHighlightRules = function() {

    var keywords = (
      "select|insert|update|delete|from|where|and|or|group|by|order|limit|offset|having|as|case|" +
      "when|then|else|end|type|left|right|join|on|outer|desc|asc|union|create|table|primary|key|if|" +
      "foreign|not|references|default|null|inner|cross|natural|database|drop|grant"+
      'ALL|ALTER|AND|ARRAY|AS|AUTHORIZATION|BETWEEN|BIGINT|BINARY|BOOLEAN|BOTH|BY|CASE|CAST|CHAR|COLUMN|CONF|CREATE|CROSS|CUBE|CURRENT|CURRENT_DATE|CURRENT_TIMESTAMP|CURSOR|DATABASE|DATE|DECIMAL|DELETE|DESCRIBE|DISTINCT|DOUBLE|DROP|ELSE|END|EXCHANGE|EXISTS|EXTENDED|EXTERNAL|FALSE|FETCH|FLOAT|FOLLOWING|FOR|FROM|FULL|FUNCTION|GRANT|GROUP|GROUPING|HAVING|IF|IMPORT|IN|INNER|INSERT|INT|INTERSECT|INTERVAL|INTO|IS|JOIN|LATERAL|LEFT|LESS|LIKE|LOCAL|MACRO|MAP|MORE|NONE|NOT|NULL|OF|ON|OR|ORDER|OUT|OUTER|OVER|PARTIALSCAN|PARTITION|PERCENT|PRECEDING|PRESERVE|PROCEDURE|RANGE|READS|REDUCE|REVOKE|RIGHT|ROLLUP|ROW|ROWS|SELECT|SET|SMALLINT|TABLE|TABLESAMPLE|THEN|TIMESTAMP|TO|TRANSFORM|TRIGGER|TRUE|TRUNCATE|UNBOUNDED|UNION|UNIQUEJOIN|UPDATE|USER|USING|UTC_TMESTAMP|VALUES|VARCHAR|WHEN|WHERE|WINDOW|WITH|ADD|ADMIN|AFTER|ANALYZE|ARCHIVE|ASC|BEFORE|BUCKET|BUCKETS|CASCADE|CHANGE|CLUSTER|CLUSTERED|CLUSTERSTATUS|COLLECTION|COLUMNS|COMMENT|COMPACT|COMPACTIONS|COMPUTE|CONCATENATE|CONTINUE|DATA|DATABASES|DATETIME|DAY|DBPROPERTIES|DEFERRED|DEFINED|DELIMITED|DEPENDENCY|DESC|DIRECTORIES|DIRECTORY|DISABLE|DISTRIBUTE|ELEM_TYPE|ENABLE|ESCAPED|EXCLUSIVE|EXPLAIN|EXPORT|FIELDS|FILE|FILEFORMAT|FIRST|FORMAT|FORMATTED|FUNCTIONS|HOLD_DDLTIME|HOUR|IDXPROPERTIES|IGNORE|INDEX|INDEXES|INPATH|INPUTDRIVER|INPUTFORMAT|ITEMS|JAR|KEYS|KEY_TYPE|LIMIT|LINES|LOAD|LOCATION|LOCK|LOCKS|LOGICAL|LONG|MAPJOIN|MATERIALIZED|METADATA|MINUS|MINUTE|MONTH|MSCK|NOSCAN|NO_DROP|OFFLINE|OPTION|OUTPUTDRIVER|OUTPUTFORMAT|OVERWRITE|OWNER|PARTITIONED|PARTITIONS|PLUS|PRETTY|PRINCIPALS|PROTECTION|PURGE|READ|READONLY|REBUILD|RECORDREADER|RECORDWRITER|REGEXP|RELOAD|RENAME|REPAIR|REPLACE|REPLICATION|RESTRICT|REWRITE|RLIKE|ROLE|ROLES|SCHEMA|SCHEMAS|SECOND|SEMI|SERDE|SERDEPROPERTIES|SERVER|SETS|SHARED|SHOW|SHOW_DATABASE|SKEWED|SORT|SORTED|SSL|STATISTICS|STORED|STREAMTABLE|STRING|STRUCT|TABLES|TBLPROPERTIES|TEMPORARY|TERMINATED|TINYINT|TOUCH|TRANSACTIONS|UNARCHIVE|UNDO|UNIONTYPE|UNLOCK|UNSET|UNSIGNED|URI|USE|UTC|UTCTIMESTAMP|VALUE_TYPE|VIEW|WHILE|YEAR'
    );

    var builtinConstants = (
      "true|false"
    );

    var builtinFunctions = (
      "avg|count|first|last|max|min|sum|ucase|lcase|mid|len|round|rank|now|format|" +
      "coalesce|ifnull|isnull|nvl"
    );

    var dataTypes = (
      "int|numeric|decimal|date|varchar|char|bigint|float|double|bit|binary|text|set|timestamp|" +
      "money|real|number|integer"
    );

    var keywordMapper = this.createKeywordMapper({
      "support.function": builtinFunctions,
      "keyword": keywords,
      "constant.language": builtinConstants,
      "storage.type": dataTypes
    }, "identifier", true);

    this.$rules = {
      "start" : [ {
        token : "comment",
        regex : "--.*$"
      },  {
        token : "comment",
        start : "/\\*",
        end : "\\*/"
      }, {
        token : "string",           // " string
        regex : '".*?"'
      }, {
        token : "string",           // ' string
        regex : "'.*?'"
      }, {
        token : "string",           // ` string (apache drill)
        regex : "`.*?`"
      }, {
        token : "constant.numeric", // float
        regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
      }, {
        token : keywordMapper,
        regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
      }, {
        token : "keyword.operator",
        regex : "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
      }, {
        token : "paren.lparen",
        regex : "[\\(]"
      }, {
        token : "paren.rparen",
        regex : "[\\)]"
      }, {
        token : "text",
        regex : "\\s+"
      } ]
    };
    this.normalizeRules();
  };

  oop.inherits(SqlHighlightRules, TextHighlightRules);

  exports.SqlHighlightRules = SqlHighlightRules;
});

ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
  "use strict";

  var oop = require("../../lib/oop");
  var Range = require("../../range").Range;
  var BaseFoldMode = require("./fold_mode").FoldMode;

  var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
      this.foldingStartMarker = new RegExp(
        this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
      );
      this.foldingStopMarker = new RegExp(
        this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
      );
    }
  };
  oop.inherits(FoldMode, BaseFoldMode);

  (function() {

    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
      var line = session.getLine(row);

      if (this.singleLineBlockCommentRe.test(line)) {
        if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
          return "";
      }

      var fw = this._getFoldWidgetBase(session, foldStyle, row);

      if (!fw && this.startRegionRe.test(line))
        return "start"; // lineCommentRegionStart

      return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
      var line = session.getLine(row);

      if (this.startRegionRe.test(line))
        return this.getCommentRegionBlock(session, line, row);

      var match = line.match(this.foldingStartMarker);
      if (match) {
        var i = match.index;

        if (match[1])
          return this.openingBracketBlock(session, match[1], row, i);

        var range = session.getCommentFoldRange(row, i + match[0].length, 1);

        if (range && !range.isMultiLine()) {
          if (forceMultiline) {
            range = this.getSectionRange(session, row);
          } else if (foldStyle != "all")
            range = null;
        }

        return range;
      }

      if (foldStyle === "markbegin")
        return;

      var match = line.match(this.foldingStopMarker);
      if (match) {
        var i = match.index + match[0].length;

        if (match[1])
          return this.closingBracketBlock(session, match[1], row, i);

        return session.getCommentFoldRange(row, i, -1);
      }
    };

    this.getSectionRange = function(session, row) {
      var line = session.getLine(row);
      var startIndent = line.search(/\S/);
      var startRow = row;
      var startColumn = line.length;
      row = row + 1;
      var endRow = row;
      var maxRow = session.getLength();
      while (++row < maxRow) {
        line = session.getLine(row);
        var indent = line.search(/\S/);
        if (indent === -1)
          continue;
        if  (startIndent > indent)
          break;
        var subRange = this.getFoldWidgetRange(session, "all", row);

        if (subRange) {
          if (subRange.start.row <= startRow) {
            break;
          } else if (subRange.isMultiLine()) {
            row = subRange.end.row;
          } else if (startIndent == indent) {
            break;
          }
        }
        endRow = row;
      }

      return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function(session, line, row) {
      var startColumn = line.search(/\s*$/);
      var maxRow = session.getLength();
      var startRow = row;

      var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
      var depth = 1;
      while (++row < maxRow) {
        line = session.getLine(row);
        var m = re.exec(line);
        if (!m) continue;
        if (m[1]) depth--;
        else depth++;

        if (!depth) break;
      }

      var endRow = row;
      if (endRow > startRow) {
        return new Range(startRow, startColumn, endRow, line.length);
      }
    };

  }).call(FoldMode.prototype);

});

ace.define("ace/mode/folding/sql",["require","exports","module","ace/lib/oop","ace/mode/folding/cstyle"], function(require, exports, module) {
  "use strict";

  var oop = require("../../lib/oop");
  var BaseFoldMode = require("./cstyle").FoldMode;

  var FoldMode = exports.FoldMode = function() {};

  oop.inherits(FoldMode, BaseFoldMode);

  (function() {


  }).call(FoldMode.prototype);

});

ace.define("ace/mode/sql",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/sql_highlight_rules","ace/mode/folding/sql"], function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextMode = require("./text").Mode;
  var SqlHighlightRules = require("./sql_highlight_rules").SqlHighlightRules;
  var SqlFoldMode = require("./folding/sql").FoldMode;

  var Mode = function() {
    this.HighlightRules = SqlHighlightRules;
    this.foldingRules = new SqlFoldMode();
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);

  (function() {

    this.lineCommentStart = "--";
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/sql";
    this.snippetFileId = "ace/snippets/sql";
  }).call(Mode.prototype);

  exports.Mode = Mode;

});                (function() {
  ace.require(["ace/mode/sql"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
