import React            from 'react'
import Moment           from 'moment'


const DateTime = ({ timestamp = 0, format = 'L', years = false }) => {
	Moment.locale('ru')
	return (
		<span>
			{Moment.unix(timestamp).format(format)}
			{years ? ` (${Moment().diff(Moment.unix(timestamp), 'years')})` : null}
		</span>
	)
}

DateTime.propTypes = {
	timestamp: React.PropTypes.number,
	format:    React.PropTypes.string,
	years:     React.PropTypes.bool,
}

export default DateTime