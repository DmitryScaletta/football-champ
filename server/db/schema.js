module.exports = [
	{
		name: 'Championat',
		alias: 'championats',
		url: 'championat',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'name',				type: 'NVARCHAR(50)',	required: true	},
			{	name: 'country_id',			type: 'INT',			required: true	},
		]
	},
	{
		name: 'Season',
		alias: 'seasons',
		url: 'season',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'championat_id',		type: 'INT',			required: true	},
			{	name: 'year_begin',			type: 'INT',			required: true	},
			{	name: 'year_end',			type: 'INT',			required: true	},
		]
	},
	{
		name: 'SeasonFootbalClub',
		alias: 'seasons_fcs',
		url: 'season-fc',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'season_id',			type: 'INT',			required: true	},
			{	name: 'fc_id',				type: 'INT',			required: true	},
		]
	},
	{
		name: 'FootballClub',
		alias: 'football_clubs',
		url: 'fc',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'name',				type: 'NVARCHAR(100)',	required: true	},
			{	name: 'name_eng',			type: 'NVARCHAR(50)',	},
			{	name: 'image',				type: 'NVARCHAR(100)'	},
			{	name: 'country_id',			type: 'INT',			required: true	},
			{	name: 'city_id',			type: 'INT',			required: true	},
			{	name: 'full_name',			type: 'NVARCHAR(100)'	},
			{	name: 'foundation_year',	type: 'INT'	},
			{	name: 'stadium_name',		type: 'NVARCHAR(100)'	},
			{	name: 'trainer_id',			type: 'INT'	},
			{	name: 'site',				type: 'NVARCHAR(260)'	},
			{	name: 'colors',				type: 'NVARCHAR(100)'	},
			{	name: 'previous_names',		type: 'NVARCHAR(1000)'	},
		]
	},
	{
		name: 'Player',
		alias: 'players',
		url: 'player',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'name',				type: 'NVARCHAR(100)',	required: true	},
			{	name: 'surname',			type: 'NVARCHAR(100)',	required: true	},
			{	name: 'name_eng',			type: 'NVARCHAR(50)',	},
			{	name: 'surname_eng',		type: 'NVARCHAR(50)',	},
			{	name: 'fc_id',				type: 'INT',	},
			{	name: 'country_id',			type: 'INT',			required: true	},
			{	name: 'birth_date',			type: 'BIGINT'	},
			{	name: 'player_number',		type: 'INT'	},
			{	name: 'line_id',			type: 'INT',			required: true	},
			{	name: 'weight',				type: 'INT'	},
			{	name: 'growth',				type: 'INT'	},
		]
	},
	{
		name: 'Trainer',
		alias: 'trainers',
		url: 'trainer',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'name',				type: 'NVARCHAR(100)',	required: true	},
			{	name: 'surname',			type: 'NVARCHAR(100)',	required: true	},
		]
	},
	{
		name: 'Country',
		alias: 'countries',
		url: 'country',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'name',				type: 'NVARCHAR(100)',	required: true	},
			{	name: 'short_name',			type: 'NVARCHAR(3)',	required: true	},
		]
	},
	{
		name: 'City',
		alias: 'cities',
		url: 'city',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'name',				type: 'NVARCHAR(200)',	required: true	},
			{	name: 'country_id',			type: 'INT',			required: true	},
		]
	},
	{
		name: 'Line',
		alias: 'lines',
		url: 'line',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'name',				type: 'NVARCHAR(50)',	required: true	},
			{	name: 'short_name',			type: 'NVARCHAR(10)',	required: true	},
		]
	},
	{
		name: 'Match',
		alias: 'matches',
		url: 'match',
		fields: [
			{	name: 'id',					type: 'INT',			primary:  true	},
			{	name: 'season_id',			type: 'INT',	},
			{	name: 'home_fc_id',			type: 'INT',			required: true	},
			{	name: 'away_fc_id',			type: 'INT',			required: true	},
			{	name: 'tour',				type: 'INT',	},
			{	name: 'score_home',			type: 'INT',			default: 0	},
			{	name: 'score_away',			type: 'INT',			default: 0	},
			{	name: 'match_date',			type: 'BIGINT',			required: true	},
			{	name: 'is_over',			type: 'BIT',			default: 0	},
		]
	},
]