USE [football-champ]
GO

IF EXISTS (
	SELECT * 
	FROM sysobjects
	WHERE 
		id = object_id(N'[dbo].[get_completed_matches]') AND 
		OBJECTPROPERTY(id, N'IsProcedure') = 1
	)
BEGIN
    DROP PROCEDURE get_completed_matches
END
GO

CREATE PROCEDURE get_completed_matches
    @season_id INT
AS
    SELECT 
		home_fc_id,
		home_fc.name AS home_fc_name,
		away_fc_id, 
		away_fc.name AS away_fc_name,
		m.score_home, 
		m.score_away
	FROM Match AS m 
	INNER JOIN FootballClub AS home_fc ON m.home_fc_id=home_fc.id
	INNER JOIN FootballClub AS away_fc ON m.away_fc_id=away_fc.id
	WHERE season_id=@season_id AND is_over=1
GO

-- EXECUTE get_completed_matches 2