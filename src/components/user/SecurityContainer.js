import { connect } from 'react-redux'
import {  changePassword, changePasswordSuccess, changePasswordFailure } from './actions'
import Security from './Security'

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changePassword: (values) => {
            const token = localStorage.getItem('jwtToken')
            return dispatch(changePassword(values, token))
                .then(result => {
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(changePasswordFailure(result.payload.response));
                    }else {
                        dispatch(changePasswordSuccess(result.payload.data))
                    }
                })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Security);