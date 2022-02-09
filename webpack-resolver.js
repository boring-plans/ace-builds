ace.config.setModuleUrl(
  "ace/mode/sql",
  require("file-loader?esModule=false!./src-noconflict/mode-sql.js")
);
ace.config.setModuleUrl(
  "ace/theme/sqlserver",
  require("file-loader?esModule=false!./src-noconflict/theme-sqlserver.js")
);
