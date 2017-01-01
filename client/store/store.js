const initial_state = {
	data: {
		championats:  [],
		seasons:      [],
		fcs:          [],
		// players:      [],
		trainers:     [],
		countries:    [],
		cities:       [],
		lines:        [],
		// matches:      [],
		fetching:     false,
		error:        null,
	},
	championat: {
		items:        [],
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
		fcs:          [],
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
	admin: {
		data:         [],
		fetching:     false,
		error:        null,
	},
	admin_edit: {}
}

export default initial_state
