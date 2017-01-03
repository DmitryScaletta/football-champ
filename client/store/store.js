const initial_state = {
	/*common: {
		championats:  [],
		seasons:      [],
		fcs:          [],
		players:      [],
		trainers:     [],
		countries:    [],
		cities:       [],
		lines:        [],
		matches:      [],
		fetching:     false,
		error:        null,
	},*/
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
		valid:        true,
		fetching:     false,
		error:        null,
	},
	admin_edit: {
		data:         {},
		form_data:    {},
		affected:     0,
		championats:  [],
		seasons:      [],
		fcs:          [],
		trainers:     [],
		countries:    [],
		cities:       [],
		lines:        [],
		valid:        true,
		fetching:     false,
		fetching2:    false,
		error:        null,	
		error2:       null,	
	}
}

export default initial_state
