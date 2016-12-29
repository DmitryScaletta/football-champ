import React from 'react'

const ErrorMessage = ({message}) => (
	<div className="row">
		<div className="col-sm-12">
			<div className="alert alert-danger">{message}</div>
		</div>
	</div>
)

ErrorMessage.propTypes = {
	message: React.PropTypes.string,
}

export default ErrorMessage