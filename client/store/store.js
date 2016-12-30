const initial_state = {
	championat: {
		items:        {},
		fetching:     false,
		error:        null,
	},
	season: {
		league_table: [],
		last_matches: [],
		next_matches: [],
		fetching:     false,
		error:        null,
	},
	fcs: {
		items:        [],
		filter:       0,
		fetching:     false,
		error:        null,
	},
	fc: {
		data:         {},
		players:      [],
		last_matches: [],
		next_matches: [],
		fetching:     false,
		error:        null,
	},
	players: {
		items:        [],
		fetching:     false,
		error:        null,
	},
	player: {
		data:         {},
		fetching:     false,
		error:        null,
	},
	matches: {
		last_matches: [],
		next_matches: [],
		fetching:     false,
		error:        null,
	},
	match: {
		data:         {},
		fetching:     false,
		error:        null,
	},
}

export default initial_state
