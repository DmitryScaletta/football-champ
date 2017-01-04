@echo off

@echo # Create Database and User
sqlcmd -i "./create_database_and_user.sql"

@echo # Create All Tables and Insert Data
sqlcmd -i "./data.sqlite3.sql"

@echo # Create Stored Procedures
sqlcmd -i "./procedure_get_completed_matches.sql"
sqlcmd -i "./procedure_get_football_clubs.sql"

@echo # Create Triggers
sqlcmd -i "./trigger_delete_matches.sql"

@echo Done!