USE [football-champ]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE [name] = N'delete_matches' AND [type] = 'TR')
BEGIN
      DROP TRIGGER [dbo].[delete_matches];
END;
GO

CREATE TRIGGER delete_matches ON FootballClub
INSTEAD OF DELETE
AS
BEGIN
	DECLARE @id INT
	SET @id = (SELECT id FROM deleted)
	
	DELETE FROM Match        WHERE home_fc_id=@id OR away_fc_id=@id
	DELETE FROM FootballClub WHERE id=@id
END;