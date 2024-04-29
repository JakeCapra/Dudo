SQL_DIR := ./sql/schema

FORMAT_CMD := npx sql-formatter --fix --config sql_formatter_conf.json

.phony: format_sql
format_sql:
	find $(SQL_DIR) -type f -name "*.sql" -exec $(FORMAT_CMD) {} \;

