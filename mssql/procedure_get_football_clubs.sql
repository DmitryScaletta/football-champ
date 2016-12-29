USE [football-champ]
GO

IF EXISTS (
	SELECT * 
	FROM sysobjects
	WHERE 
		id = object_id(N'[dbo].[get_football_clubs]') AND 
		OBJECTPROPERTY(id, N'IsProcedure') = 1
	)
BEGIN
    DROP PROCEDURE get_football_clubs
END
GO

CREATE PROCEDURE get_football_clubs
    @season_id INT
AS
    SELECT
		fc.id,
		fc.name,
		fc.image
	FROM SeasonFootbalClub AS sfc
	INNER JOIN FootballClub AS fc ON sfc.fc_id=fc.id
	WHERE season_id=@season_id
GO

-- EXECUTE get_football_clubs 2