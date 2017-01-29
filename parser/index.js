const fs       = require('fs');
const path     = require('path');
const request  = require('request');
const cheerio  = require('cheerio');
const co       = require('co');
const sqlite3  = require('sqlite3').verbose();
const sharp    = require('sharp');
const mkdirp   = require('mkdirp');



/* ============================================================
/* Main */
/* ============================================================ */

const MAIN_URL = 'http://www.liveresult.ru';

const championats = [
	{	name:    'Премьер-лига',
		country: 'Англия',
		seasons: [
			{ year_begin: 2015, year_end: 2016, url: 'England/Premier-League/2015-2016/' },
			{ year_begin: 2016, year_end: 2017, url: 'England/Premier-League/' }
		] },
	{	name:    'Примера',
		country: 'Испания',
		seasons: [
			{ year_begin: 2015, year_end: 2016, url: 'Spain/Primera-division/2015-2016/' },
			{ year_begin: 2016, year_end: 2017, url: 'Spain/Primera-division/' }
		] },
	{	name:    'Серия А',
		country: 'Италия',
		seasons: [
			{ year_begin: 2015, year_end: 2016, url: 'Italy/Serie-A/2015-2016/' },
			{ year_begin: 2016, year_end: 2017, url: 'Italy/Serie-A/' }
		] },
	{	name:    'Бундеслига',
		country: 'Германия',
		seasons: [
			{ year_begin: 2015, year_end: 2016, url: 'Germany/Bundesliga-I/2015-2016/' },
			{ year_begin: 2016, year_end: 2017, url: 'Germany/Bundesliga-I/' }
		] },
	{	name:    'Лига 1',
		country: 'Франция',
		seasons: [
			{ year_begin: 2015, year_end: 2016, url: 'France/Ligue-1/2015-2016/' },
			{ year_begin: 2016, year_end: 2017, url: 'France/Ligue-1/' }
		] },
];

let data = {
	championats:    [],
	seasons:        [],
	seasons_fcs:    [],
	football_clubs: [],
	players:        [],
	trainers:       [],
	countries:      [],
	cities:         [],
	lines:          [],
	matches:        []
};

data.lines = [
	{ id: 1, name: 'Вратарь',      short_name: 'ВРТ' },
	{ id: 2, name: 'Защитник',     short_name: 'ЗАЩ' },
	{ id: 3, name: 'Полузащитник', short_name: 'ПЗ'  },
	{ id: 4, name: 'Нападающий',   short_name: 'НАП' }
];

const DATABASE_FILENAME  = '../mssql/data.sqlite3';
const JSON_FILENAME      = '../mssql/data.json';

const FLAGS_SVG_FOLDER   = '../server/static/img/flags_svg/';
const FLAGS_PNG_FOLDER   = '../server/static/img/flags/';
const LOGOS_ORIG_FOLDER  = '../server/static/img/logos/orig/';
const LOGOS_SMALL_FOLDER = '../server/static/img/logos/small/';



co(function* () {

	console.time('Parse countries');
	yield* parse_wiki_countries(data, FLAGS_SVG_FOLDER, FLAGS_PNG_FOLDER);
	console.timeEnd('Parse countries');

	
	console.time('Parse championats');
	yield* parse_championats(data, championats, LOGOS_ORIG_FOLDER, LOGOS_SMALL_FOLDER);
	console.timeEnd('Parse championats');

	// fs.writeFileSync('../server/data_raw.json', JSON.stringify(data));

	console.time('Transform data');
	transform_data(data);
	console.timeEnd('Transform data');

	fs.writeFileSync(JSON_FILENAME, JSON.stringify(data));

	add_to_database(data, DATABASE_FILENAME);




	// const arr = [];
	// arr.push({ url: 'http://static1.liveresult.ru/files/sport/teams/football/arsenal.png', name: 'image.png' });

	// yield* download_images(arr, './img/');

	// yield* parse_football_club(data, 'http://www.liveresult.ru/football/teams/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D0%B0%D0%BB/');
	// yield* parse_player(data, 'http://www.liveresult.ru/football/players/%D0%9C%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%B0_%D0%9A%D1%83%D0%BA%D0%BE/', 777);
	// yield* parse_player(data, 'http://www.liveresult.ru/football/players/%D0%A4%D0%B0%D0%BB%D1%8C%D0%BA%D0%B0%D0%BE_%D0%A0%D0%B0%D0%B4%D0%B0%D0%BC%D0%B5%D0%BB%D1%8C/', 777);

	// console.log(data);
	

}).catch((e) => {
	console.log(e);
});



/* ============================================================ */
/* functions */
/* ============================================================ */

function get_page_content(url, binary = false) {
	return new Promise((resolve, reject) => {
		let params = { uri: url, timeout: 240000, gzip: true };
		if (binary) params.encoding = null;
		request(params, (err, res, page) => {
			if (!err && res.statusCode == 200) {
				resolve(page);
			} else {
				reject(err);
			}
		});
	});
}

function in_array_by_prop(array, value, prop = 'name') {
	for (let i = 0; i < array.length; ++i) {
		if (array[i][prop].toLowerCase() === value.toLowerCase()) return true;
	}
	return false;
}

function get_id_by_prop(array, value, prop = 'name') {
	for (let i = 0; i < array.length; ++i) {
		if (array[i][prop].toLowerCase() === value.toLowerCase()) return array[i].id;
	}
	return -1;
}

function existsSync(filePath) {
	try {
		fs.statSync(filePath);
	} catch(err) {
		if(err.code == 'ENOENT') return false;
	}
	return true;
}


/* ============================================================ */
/* Parse Football Clubs */
/* ============================================================ */

function* parse_player(data, player_url, player_number) {
	let page;
	try {
		page = yield get_page_content(player_url);
	} catch (e) {
		console.error('Error (parse_player)', e.message);
		return;
	}

	const $ = cheerio.load(page);

	const player = {
		id:            data.players.length + 1,
		name:          '',
		surname:       '',
		name_eng:      '',
		surname_eng:   '',
		fc_id:         '',
		country_id:    '',
		birth_date:    null,
		player_number: player_number || null,
		line_id:       '',
		weight:        null,
		growth:        null
	};

	const info = $('ul.minfo li');

	info.each((i, item) => {
		try {
			switch ($('label', item).text()) {
				case 'Ф.И.О.:':        player.name          = $(item).children()['0'].next.data.trim() || '';   break;
				case 'Команда:':       player.fc_id         = $(item).children()['1'].next.data.trim() || '';   break;
				case 'Дата рождения:': player.birth_date    = $(item).children()['1'].next.data.trim() || '';   break;
				case 'Номер:':         player.player_number = $(item).children()['0'].next.data.trim() || null; break;
				case 'Амплуа:':        player.line_id       = $(item).children()['0'].next.data.trim() || '';   break;
				case 'Вес:':           player.weight        = parseInt($(item).children()['1'].next.data.trim()) || null; break;
				case 'Рост:':          player.growth        = parseInt($(item).children()['1'].next.data.trim()) || null; break;
				case 'Гражданство:':
					if ($(item).children()['0'].next.data) {
						player.country_id = $(item).children()['0'].next.data.trim();
					} else {
						player.country_id = $(item).children()['1'].next.data.trim();
					}
					break;
			}
		} catch (e) {
			return;
		}
	});

	// exclude if 
	if (player.country_id === '' || 					// don't have a country
		player.country_id.indexOf(',') > -1 ||			// more than one countries
		(player.name.match(/ /g) || []).length != 3 ||  // more or less than 2 words in name
		player.birth_date === null) { 					// don't have a birth date
		return;
	}

	const d = player.birth_date.substring(0, 10).split('.');
	player.birth_date = Date.UTC(d[2], d[1] - 1, d[0]) / 1000;

	if (player.birth_date < 0) return;

	const re = /(.+) +(.+) +\((.+) +(.+)\)/;
	let m;

	if ((m = re.exec(player.name)) !== null) {
		player.name        = m[2];
		player.surname     = m[1];
		player.name_eng    = m[3];
		player.surname_eng = m[4];

		// console.log('PARSE PLAYER:', player.name, '\t\t', player.surname);
		data.players.push(player);
	}
}

function* parse_football_club(data, fc_url) {
	
	let page;
	try {
		page = yield get_page_content(fc_url);
	} catch (e) {
		console.error('Error (parse_football_club)', e.message);
		return;
	}

	const $ = cheerio.load(page);

	let fc = {
		id:              data.football_clubs.length + 1,
		name:            '',
		name_eng:        '',
		image:           $('h1.title img').attr('src'),
		country_id:      '',
		city_id:         '',
		full_name:       '',
		foundation_year: null,
		stadium_name:    '',
		trainer_id:      '',
		site:            '',
		colors:          '',
		previous_names:  ''
	};

	const re    = /\s*(.+)\s+\((.+)\)/;	 // Арсенал (Arsenal)
	const title = $('h1').text().trim();
	let m;

	if ((m = re.exec(title)) !== null) {
		fc.name     = m[1];
		fc.name_eng = m[2];
	}

	// other fields
	const info = $('ul.minfo li');

	info.each((i, item) => {
		switch ($('label', item).text()) {
			case 'Страна:':              fc.country_id      = $('img', item).attr('alt')        || '';   break;
			case 'Город:':               fc.city_id         = $(item).children()['0'].next.data || '';   break;
			case 'Полное название:':     fc.full_name       = $(item).children()['0'].next.data || '';   break;
			case 'Год основания:':       fc.foundation_year = $(item).children()['0'].next.data || null; break;
			case 'Стадион:':             fc.stadium_name    = $(item).children()['0'].next.data || '';   break;
			case 'Главный тренер:':      fc.trainer_id      = $(item).children()['0'].next.data || '';   break;
			case 'Официальный сайт:':    fc.site            = $('a',   item).attr('href')       || $(item).children()['0'].next.data || ''; break;
			case 'Основные цвета:':      fc.colors          = $(item).children()['0'].next.data || '';   break;
			case 'Предыдущие названия:': fc.previous_names  = $('dfn', item).text()             || '';   break;
		}
	});

	data.football_clubs.push(fc);

	console.log('-', fc.name);


	// parse all players
	const raw_players = $('#teamli tbody > tr');

	let promises = [];
	raw_players.each((i, item) => {

		const player_number = $('.num', item).text().trim();
		const player_url    = $('a',    item).attr('href');

		promises.push(
			parse_player(data, MAIN_URL + player_url, player_number)
		);

	});

	try {
		yield promises;
	} catch (e) {
		console.error('Error (parse_football_club)', e.message);
	}
}

function* parse_football_clubs(data, fcs_url, season_id) {

	let page;
	try {
		page = yield get_page_content(fcs_url);
	} catch (e) {
		console.error('Error (parse_football_clubs)', e.message);
		return;
	}

	const $ = cheerio.load(page);

	let fc_array = $('.maintbl tbody > tr > td.name > a');

	let promises = [];
	fc_array.each((i, elem) => {
	
		const is_team = '/football/teams/';
		const fc_url  = $(elem).attr('href');
		const fc_name = $(elem).text();

		if (fc_url.indexOf(is_team) === -1) return;
		
		data.seasons_fcs.push({
			id:    data.seasons_fcs.length + 1,
			season_id,
			fc_id: fc_name
		});

		// parse players only if fc not exists in data
		if (!in_array_by_prop(data.football_clubs, fc_name)) {
			promises.push(
				parse_football_club(data, MAIN_URL + fc_url)
			);
		}
	});

	try {
		yield* promises;
	} catch (e) {
		console.error('Error (parse_football_clubs)', e.message);
	}
}

function* parse_matches(data, champ_url, season_id, year_begin, year_end) {
	
	function parse_match($, item, id, season_id) {

		let match = {
			id,
			season_id,
			home_fc_id: $('span.team1',      item).text().trim(),
			away_fc_id: $('span.team2',      item).text().trim(),
			tour:       $('span.match-cat',  item).text().trim().slice(4),
			score_home: null,
			score_away: null,
			match_date: null,
			is_over:    0
		};

		const score = $('span.score', item).text().trim();
		const re = /(\d+):(\d+)/;
		let m;
		if ((m = re.exec(score)) !== null) {
			match.score_home = m[1];
			match.score_away = m[2];
			match.is_over    = 1;
		}

		let d = $('span.match-time-date', item).text().trim().split('.');
		let t = $('span.match-time-time', item).text().trim().split(':');
		match.match_date = Date.parse(new Date(d[2], d[1] - 1, d[0], t[0], t[1])) / 1000;

		return match;
	}

	const date_begin = Date.parse(year_begin.toString() + '-08-01') / 1000;
	const date_end   = Date.parse(year_end  .toString() + '-06-15') / 1000;

	const SHEDULE = 'scheduled/';
	const RESULTS = 'results/';

	let shedule;
	let results;
	try {
		shedule = yield get_page_content(champ_url + SHEDULE);
		results = yield get_page_content(champ_url + RESULTS);
	} catch (e) {
		console.log('Error (parse_matches)', e.message);
		return;
	}

	let $;
	let array;

	$     = cheerio.load(shedule);
	array = $('.matches-list > a');
	console.log('SHEDULE MATCHES COUNT:', array.length);

	array.each((i, item) => {
		let match = parse_match($, item, data.matches.length + 1, season_id);

		if (match.match_date > date_begin && match.match_date < date_end) {
			data.matches.push(match);
		}
	});

	$ = cheerio.load(results);
	array = $('.matches-list > a');
	console.log('RESULTS MATCHES COUNT:', array.length, '\n');

	array.each((i, item) => {
		let match = parse_match($, item, data.matches.length + 1, season_id);

		if (match.match_date > date_begin && match.match_date < date_end) {
			// replace if match already exists
			let replaced = false;
			for (let i = 0; i < data.matches.length; ++i) {
				if (data.matches[i].season_id  === match.season_id  &&
					// data.matches[i].match_date === match.match_date &&
					data.matches[i].home_fc_id === match.home_fc_id &&
					data.matches[i].away_fc_id === match.away_fc_id) {
					data.matches[i].score_home = match.score_home;
					data.matches[i].score_away = match.score_away;
					data.matches[i].is_over    = match.is_over;
					replaced = true;
					break;
				}
			}
			if (!replaced) data.matches.push(match);
		}
	});
}

function* parse_seasons(data, seasons, champ_id) {

	const FOOTBALL = 'http://www.liveresult.ru/football/';

	for (let i = 0; i < seasons.length; ++i) {

		console.log('##', seasons[i].year_begin.toString() + '-' + seasons[i].year_end.toString());

		const season_id = data.seasons.length + 1;

		data.seasons.push({
			id:            season_id,
			championat_id: champ_id,
			year_begin:    seasons[i].year_begin,
			year_end:      seasons[i].year_end
		});

		const url = FOOTBALL + seasons[i].url;

		yield* parse_football_clubs(data, url, season_id);

		yield* parse_matches(data, url, season_id, seasons[i].year_begin, seasons[i].year_end);
	}

	console.log('\n');
}

function* parse_championats(data, championats, logos_orig_folder, logos_small_folder) {

	for (let i = 0; i < championats.length; ++i) {

		console.log('#', championats[i].name, '(' + championats[i].country + ')');

		const champ_id = data.championats.length + 1;

		data.championats.push({
			id:         champ_id,
			name:       championats[i].name,
			country_id: championats[i].country
		});

		yield* parse_seasons(data, championats[i].seasons, champ_id);
	}

	// download logos
	let images = data.football_clubs.map((fc) => {
		const url = fc.image;
		fc.image = fc.name_eng.toLowerCase().replace(/ /g, '_') + '.png';
		return {
			name: fc.image,
			url
		};
	});

	const binary = true;
	yield* download_images(images, logos_orig_folder, binary);

	// convert logos
	yield* convert_images(logos_orig_folder, logos_small_folder, { width: 20, height: 20, input_format: 'png' });
}



/* ============================================================ */
/* Parse Countries */
/* ============================================================ */

function* parse_wiki_countries(data, flags_svg_folder, flags_png_folder) {

	const WIKI_COUNTRIES_URL = 'https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D0%BA%D0%BE%D0%B4%D0%BE%D0%B2_%D1%81%D1%82%D1%80%D0%B0%D0%BD_%D0%A4%D0%98%D0%A4%D0%90';


	let page = yield get_page_content(WIKI_COUNTRIES_URL);

	const $ = cheerio.load(page);

	let tables = $('.wikitable').toArray();

	let flags = [];
	for (let i = 0; i < 3; ++i) {
		let trs = $('tr', tables[i]).toArray();
		let first = true;
		trs.map((tr) => {
			if (first) {
				first = false;
			} else {
				flags.push(tr);
			}
		});
	}

	let id = 0;
	data.countries = flags.map((tr) => {
		let name       = tr.children[1].children[2].children[0].data;
		let short_name = tr.children[3].children[0].data.toLowerCase();
		let image      = tr.children[1].children[0].children[0].children[0].attribs.src;

		const re = /(\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)thumb\/(.{1}\/.{2}\/Flag_of_.+\.svg)\/.*/;
		let m;
		if ((m = re.exec(image)) !== null) {
			image = 'https:' + m[1] + m[2];
		}

		if (name === 'Молдавия')    name = 'Молдова';
		if (name === 'Кот-д’Ивуар') name = 'Кот-д\'Ивуар';
		if (name === 'Белоруссия')  name = 'Беларусь';

		return {
			id: ++id,
			name,
			short_name,
			image
		};
	});


	// download flags
	let images = data.countries.map((flag) => {
		return {
			name: flag.short_name + '.svg',
			url:  flag.image
		};
	});

	yield* download_images(images, flags_svg_folder);

	// convert flags
	yield* convert_images(flags_svg_folder, flags_png_folder, { width: 30, heigth: 18, input_format: 'svg', ignore_aspect_ratio: true});
}



/* ============================================================ */
/* Images */
/* ============================================================ */

function* convert_images(source_folder, output_folder, params) {

	params = {
		width:               (typeof params.width               !== 'undefined') ? params.width               : 30,
		height:              (typeof params.height              !== 'undefined') ? params.height              : 18,
		input_format:        (typeof params.input_format        !== 'undefined') ? params.input_format        : 'png',
		ignore_aspect_ratio: (typeof params.ignore_aspect_ratio !== 'undefined') ? params.ignore_aspect_ratio : false
	};

	mkdirp.sync(output_folder);

	const files = fs.readdirSync(source_folder);

	let arr = [];
	files.map((file) => {
		const output_filename = output_folder + path.basename(file, params.input_format) + 'png';
		const source_filename = source_folder + file;

		if (existsSync(output_filename)) return;

		let promise = sharp(source_filename).resize(params.width, params.height);
		if (params.ignore_aspect_ratio === true) promise = promise.ignoreAspectRatio();
		arr.push(
			promise.toFile(output_filename, (e) => { if (e) console.log(e.message); })
		);
	});

	yield arr;
}

function* download_images(images, output_folder, binary = false) {

	// url = { url: 'http://site.com/my-image.png', name: 'image.png' };

	mkdirp.sync(output_folder);

	let arr = [];

	images.map((image) => {

		const filename = output_folder + image.name;

		if (!existsSync(filename)) {

			arr.push(function* () {
				let page = yield get_page_content(image.url, binary);
				fs.writeFile(filename, page, (e) => { if (e) console.log(e.message); });
			});
		}
	});

	yield arr;
}



/* ============================================================
/* Transform Data */
/* ============================================================ */

function transform_data(data) {

	data.championats = data.championats.map((championat) => {
		championat.country_id = get_id_by_prop(data.countries, championat.country_id);
		return championat;
	});

	data.seasons_fcs = data.seasons_fcs.map((seasons_fc) => {
		seasons_fc.fc_id = get_id_by_prop(data.football_clubs, seasons_fc.fc_id);
		return seasons_fc;
	});

	data.football_clubs = data.football_clubs.map((fc) => {
		fc.country_id = get_id_by_prop(data.countries, fc.country_id);

		if (!in_array_by_prop(data.cities, fc.city_id)) {
			data.cities.push({
				id:         data.cities.length + 1,
				name:       fc.city_id,
				country_id: fc.country_id
			});
		}
		fc.city_id = get_id_by_prop(data.cities, fc.city_id);

		let trainer = {
			id:      data.trainers.length + 1,
			name:    fc.trainer_id,
			surname: ''
		};

		const re = /(.+) {1}(.+)/;
		let m;
		if ((trainer.name.match(/ /g) || []).length === 1 && (m = re.exec(trainer.name)) !== null) {
			trainer.name    = m[2];
			trainer.surname = m[1];
		}

		if (trainer.name === 'Ван Галь Луи')              { trainer.name = 'Луи';          trainer.surname = 'Ван Галь';      } else
		if (trainer.name === 'Хассельбайнк Джимми Флойд') { trainer.name = 'Джимми Флойд'; trainer.surname = 'Хассельбайнк';  } else
		if (trainer.name === 'Флорес Кике Санчес')        { trainer.name = 'Кике';         trainer.surname = 'Санчес Флорес'; } else
		if (trainer.name === 'Тораль Марселино Гарсия')   { trainer.name = 'Марселино';    trainer.surname = 'Гарсия Тораль'; } else
		if (trainer.name === 'Сандоваль Хосе Рамон')      { trainer.name = 'Хосе Рамон';   trainer.surname = 'Сандоваль';     } else
		if (trainer.name === 'Мендилабар Хосе Луис')      { trainer.name = 'Хосе Луис';    trainer.surname = 'Мендилабар';    } else
		if (trainer.name === 'Ольтра Хосе Луис')          { trainer.name = 'Хосе Луис';    trainer.surname = 'Ольтра';        } else
		if (trainer.name === 'Ди Франческо Эусебио')      { trainer.name = 'Эусебио';      trainer.surname = 'Ди Франческо';  } else
		if (trainer.name === 'Гасперини Джан Пьеро')      { trainer.name = 'Джан Пьеро';   trainer.surname = 'Гасперини';     } else
		if (trainer.name === 'Де Канио Луиджи')           { trainer.name = 'Луиджи';       trainer.surname = 'Де Канио';      } else
		if (trainer.name === 'Лильо Хуан Мануэль')        { trainer.name = 'Хуан Мануэль'; trainer.surname = 'Лильо';         } else
		if (trainer.name === 'Клаудио Чезаре Пранделли')  { trainer.name = 'Чезаре';       trainer.surname = 'Пранделли';     } else
		if (trainer.name === 'Хосе Луис Мендилибар')      { trainer.name = 'Хосе Луис';    trainer.surname = 'Мендилибар';    }

		if (trainer.name !== '') {
			data.trainers.push(trainer);
			fc.trainer_id = trainer.id;
		}

		return fc;
	});

	data.players = data.players.map((player) => {
		if (player.country_id === 'Южная Корея')                        player.country_id = 'Республика Корея';
		if (player.country_id === 'Голландия')                          player.country_id = 'Нидерланды';
		if (player.country_id === 'Конго')                              player.country_id = 'Республика Конго';
		if (player.country_id === 'Центральная Африканская Республика') player.country_id = 'ЦАР';
		
		player.fc_id      = get_id_by_prop(data.football_clubs, player.fc_id);
		player.country_id = get_id_by_prop(data.countries,      player.country_id);
		player.line_id    = get_id_by_prop(data.lines,          player.line_id);
		return player;
	});

	data.players = data.players.filter((player) => player.fc_id !== -1);

	data.matches = data.matches.map((match) => {
		match.home_fc_id = get_id_by_prop(data.football_clubs, match.home_fc_id);
		match.away_fc_id = get_id_by_prop(data.football_clubs, match.away_fc_id);
		return match;
	});
}



/* ============================================================
/* Add to Database */
/* ============================================================ */

function add_to_database(data,  database_filename) {

	if (existsSync(database_filename)) {
		fs.unlinkSync(database_filename);
	}

	const db = new sqlite3.Database(database_filename);

	const CREATE_TABLE_CHAMPIONAT = 
`CREATE TABLE Championat
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(50)	NOT NULL,	-- название
	country_id		INT				NOT NULL	-- id страны
);`;
	const CREATE_TABLE_SEASON = 
`CREATE TABLE Season
(
	id				INT IDENTITY	PRIMARY KEY,
	championat_id	INT				NOT NULL,	-- id чемпионата
	year_begin		INT				NOT NULL,	-- начальный год
	year_end		INT				NOT NULL	-- конечный год
);`;
	const CREATE_TABLE_SEASON_FC = 
`CREATE TABLE SeasonFootballClub
(
	id				INT IDENTITY	PRIMARY KEY,
	season_id		INT				NOT NULL,	-- id сезона
	fc_id			INT				NOT NULL	-- id клуба
);`;
	const CREATE_TABLE_FC = 
`CREATE TABLE FootballClub
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
);`;
	const CREATE_TABLE_PLAYER = 
`CREATE TABLE Player
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
);`;
	const CREATE_TABLE_TRAINER = 
`CREATE TABLE Trainer
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(100)	NOT NULL,	-- имя
	surname			NVARCHAR(100)	NOT NULL	-- фамилия
);`;
	const CREATE_TABLE_COUNTRY = 
`CREATE TABLE Country
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(100)	NOT NULL,	-- название
	short_name		NVARCHAR(3)		NOT NULL	-- сокращенное название
);`;
	const CREATE_TABLE_CITY = 
`CREATE TABLE City
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(200)	NOT NULL,	-- название
	country_id		INT				NOT NULL	-- id страны
);`;
	const CREATE_TABLE_LINE = 
`CREATE TABLE Line
(
	id				INT IDENTITY	PRIMARY KEY,
	name			NVARCHAR(50)	NOT NULL,	-- название
	short_name		NVARCHAR(10)	NOT NULL	-- сокращенное название
);`;
	const CREATE_TABLE_MATCH = 
`CREATE TABLE Match
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
);`;

	const INSERT_INTO_CHAMPIONAT = 'INSERT INTO Championat         VALUES (?, ?, ?)';
	const INSERT_INTO_SEASON     = 'INSERT INTO Season             VALUES (?, ?, ?, ?)';
	const INSERT_INTO_SEASON_FC  = 'INSERT INTO SeasonFootballClub VALUES (?, ?, ?)';
	const INSERT_INTO_FC         = 'INSERT INTO FootballClub       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
	const INSERT_INTO_PLAYER     = 'INSERT INTO Player             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
	const INSERT_INTO_TRAINER    = 'INSERT INTO Trainer            VALUES (?, ?, ?)';
	const INSERT_INTO_COUNTRY    = 'INSERT INTO Country            VALUES (?, ?, ?)';
	const INSERT_INTO_CITY       = 'INSERT INTO City               VALUES (?, ?, ?)';
	const INSERT_INTO_LINE       = 'INSERT INTO Line               VALUES (?, ?, ?)';
	const INSERT_INTO_MATCH      = 'INSERT INTO Match              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';


	db.serialize(function() {

		db.run(CREATE_TABLE_CHAMPIONAT);
		db.run(CREATE_TABLE_SEASON);
		db.run(CREATE_TABLE_SEASON_FC);
		db.run(CREATE_TABLE_FC);
		db.run(CREATE_TABLE_PLAYER);
		db.run(CREATE_TABLE_TRAINER);
		db.run(CREATE_TABLE_COUNTRY);
		db.run(CREATE_TABLE_CITY);
		db.run(CREATE_TABLE_LINE);
		db.run(CREATE_TABLE_MATCH);

		db.run('BEGIN');

		let stmt;

		stmt = db.prepare(INSERT_INTO_CHAMPIONAT);
		data.championats.map((champ) => {
			stmt.run(
				champ.id,
				champ.name,
				champ.country_id
			);
		});
		stmt.finalize();

		stmt = db.prepare(INSERT_INTO_SEASON);
		data.seasons.map((season) => {
			stmt.run(
				season.id,
				season.championat_id,
				season.year_begin,
				season.year_end
			);
		});
		stmt.finalize();

		stmt = db.prepare(INSERT_INTO_SEASON_FC);
		data.seasons_fcs.map((season_fc) => {
			stmt.run(
				season_fc.id,
				season_fc.season_id,
				season_fc.fc_id
			);
		});
		stmt.finalize();

		stmt = db.prepare(INSERT_INTO_FC);
		data.football_clubs.map((fc) => {
			stmt.run(
				fc.id,
				fc.name,
				fc.name_eng,
				fc.image,
				fc.country_id,
				fc.city_id,
				fc.full_name,
				fc.foundation_year,
				fc.stadium_name,
				fc.trainer_id,
				fc.site,
				fc.colors,
				fc.previous_names
			);
		});
		stmt.finalize();

		stmt = db.prepare(INSERT_INTO_PLAYER);
		data.players.map((player) => {
			stmt.run(
				player.id,
				player.name,
				player.surname,
				player.name_eng,
				player.surname_eng,
				player.fc_id,
				player.country_id,
				player.birth_date,
				player.player_number,
				player.line_id,
				player.weight,
				player.growth
			);
		});
		stmt.finalize();

		stmt = db.prepare(INSERT_INTO_TRAINER);
		data.trainers.map((trainer) => {
			stmt.run(
				trainer.id,
				trainer.name,
				trainer.surname
			);
		});
		stmt.finalize();

		stmt = db.prepare(INSERT_INTO_COUNTRY);
		data.countries.map((country) => {
			stmt.run(
				country.id,
				country.name,
				country.short_name
			);
		});
		stmt.finalize();

		stmt = db.prepare(INSERT_INTO_CITY);
		data.cities.map((city) => {
			stmt.run(
				city.id,
				city.name,
				city.country_id
			);
		});
		stmt.finalize();

		stmt = db.prepare(INSERT_INTO_LINE);
		data.lines.map((line) => {
			stmt.run(
				line.id,
				line.name,
				line.short_name
			);
		});
		stmt.finalize();

		stmt = db.prepare(INSERT_INTO_MATCH);
		data.matches.map((match) => {
			stmt.run(
				match.id,
				match.season_id,
				match.home_fc_id,
				match.away_fc_id,
				match.tour,
				match.score_home,
				match.score_away,
				match.match_date,
				match.is_over
			);
		});
		stmt.finalize();

		db.run('COMMIT');
	});
}


