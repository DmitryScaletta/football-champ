-- Курсач. БД

-- Курсовая работа: Максимум 40 листов без приложения (код программы), теоретическая часть - не больше 50% работы

-- Что необходимо сделать в курсовой работе:

-- На 5-6 баллов: 
-- Создать БД (минимум 6 таблиц) в SQL Server, подключить её к клиентскому (которое вы создаёте) приложению, 
-- реализовать добавление, редактирование и удаление записей

-- На 7-8 баллов: 
-- + реализовать не менее 6 различных запросов (данные-параметры вводить через клиентское приложение)
-- Т.е используете запрос с Between, то начальное и конечное значение должны не "забивать" в код, а требовать ввода данных

-- На 9 баллов: 
-- + реализовать ХП (хранимые процедуры)

-- На 10 баллов: 
-- + триггеры


-- Тема: Автоматизированная система управления футбольными командами




-- чемпионат
CREATE TABLE Championat
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(50)	NOT NULL,	-- название
	country_id		INT				NOT NULL	-- id страны
);

-- сезон
CREATE TABLE Season
(
	id				INT IDENTITY	PRIMARY KEY,
	championat_id	INT				NOT NULL,	-- id чемпионата
	year_begin		INT				NOT NULL,	-- начальный год
	year_end		INT				NOT NULL	-- конечный год
);

-- футбольный клуб в сезоне
CREATE TABLE SeasonFootballClub
(
	id				INT IDENTITY	PRIMARY KEY,
	season_id		INT				NOT NULL,	-- id сезона
	fc_id			INT				NOT NULL	-- id клуба
);

-- футбольный клуб
CREATE TABLE FootballClub
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(100)	NOT NULL,	-- название
	name_eng		NVARCHAR(50),				-- название на английском
	image			NVARCHAR(260),				-- эмблема клуба
	country_id		INT				NOT NULL,	-- id страны
	city_id			INT				NOT NULL,	-- id города
	full_name		NVARCHAR(100),				-- полное название
	foundation_year	INT,						-- год основания
	stadium_name	NVARCHAR(100),				-- стадион
	trainer_id		INT,						-- id тренера
	site			NVARCHAR(260),				-- официальный сайт
	colors			NVARCHAR(100),				-- основные цвета
	previous_names	NVARCHAR(1000)				-- предыдущие названия
);

-- игрок
CREATE TABLE Player
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(100)	NOT NULL,	-- имя на русском
	surname			NVARCHAR(100)	NOT NULL,	-- фамилия на русском
	name_eng		NVARCHAR(50),				-- имя на английском
	surname_eng		NVARCHAR(50),				-- фамилия на английском
	fc_id			INT,						-- id клуба
	country_id		INT				NOT NULL,	-- id страны
	birth_date		BIGINT,						-- дата рождения
	player_number	INT,						-- номер
	line_id			INT				NOT NULL,	-- амплуа
	weight			INT,						-- вес
	growth			INT							-- рост
);

-- тренер
CREATE TABLE Trainer
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(100)	NOT NULL,	-- имя
	surname			NVARCHAR(100)	NOT NULL	-- фамилия
);

-- страна
CREATE TABLE Country
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(100)	NOT NULL,	-- название
	short_name		NVARCHAR(3)		NOT NULL	-- сокращенное название
);

-- город
CREATE TABLE City
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(200)	NOT NULL,	-- название
	country_id		INT				NOT NULL	-- id страны
);

-- амплуа
CREATE TABLE Line
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(50)	NOT NULL,	-- название
	short_name		NVARCHAR(10)	NOT NULL	-- сокращенное название
);

-- матч
CREATE TABLE Match
(
	id				INT IDENTITY	PRIMARY KEY,
	season_id		INT,						-- id сезона
	home_fc_id		INT				NOT NULL,	-- команда дома
	away_fc_id		INT				NOT NULL,	-- команда в гостях
	tour			INT,						-- номер тура
	score_home		INT				DEFAULT 0,	-- счет первой команды
	score_away		INT				DEFAULT 0,	-- счет второй команды
	match_date		BIGINT			NOT NULL,	-- дата и время начала
	is_over			BIT				DEFAULT 0	-- матч окончен?
);
