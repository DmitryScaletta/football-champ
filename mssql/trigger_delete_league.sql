USE [football-champ]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE [name] = N'delete_league' AND [type] = 'TR')
BEGIN
      DROP TRIGGER [dbo].[delete_league];
END;
GO

CREATE TRIGGER delete_league ON Championat
INSTEAD OF DELETE
AS
BEGIN
	DECLARE @id INT
	SET @id = (SELECT id FROM deleted)

	DELETE FROM SeasonFootballClub WHERE season_id IN (SELECT id FROM Season WHERE championat_id=@id)
	DELETE FROM Season             WHERE championat_id=@id
	DELETE FROM Championat         WHERE id=@id
END;