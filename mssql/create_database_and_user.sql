CREATE DATABASE [football-champ]
GO
USE [football-champ]
GO
CREATE LOGIN [football-admin] WITH PASSWORD = 'Tt9VMXGRjgZXtu0x'
GO
CREATE USER [football-admin] FOR LOGIN [football-admin]
GO


ALTER AUTHORIZATION ON SCHEMA::[db_datareader] TO [football-admin]
GO
USE [football-champ]
GO
ALTER AUTHORIZATION ON SCHEMA::[db_owner] TO [football-admin]
GO


USE [football-champ]
GO
ALTER ROLE [db_datareader] ADD MEMBER [football-admin]
GO
USE [football-champ]
GO
ALTER ROLE [db_owner] ADD MEMBER [football-admin]
GO
