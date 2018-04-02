import { connect } from 'react-redux'
import { getUserData, getUserDataSuccess, getUserDataFailure, updateUser, updateUserSuccess, updateUserFailure } from './actions';
import Profile from './Profile';
import { SubmissionError } from 'redux-form'


const mapStateToProps = (state, ownProps) => {
    const user = state.user
    let initialValues = {}
    if(user){
        initialValues = {
            lastName: user.user.lastName,
            secondName: user.user.secondName,
            name: user.user.name,
            phone: user.data && user.data.phone,
            workPosition: user.data && user.data.workPosition
        }
    }
    return {
        user: state.user,
        initialValues: initialValues
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getUser:() => {
            const token = localStorage.getItem('jwtToken')
            return dispatch(getUserData(token)).then(result => {
                if (result.payload.response && result.payload.response.status !== 200) {
                    dispatch(getUserDataFailure(result.payload.response.data));
                }else {
                    dispatch(getUserDataSuccess(result.payload.data));
                }
            })
        },
        validateAndUpdateUser: (values) => {
            const token = localStorage.getItem('jwtToken')
            return dispatch(updateUser(values, token))
                .then(result => {
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateUserFailure(result.payload.response));
                    }else {
                        dispatch(updateUserSuccess(result.payload.data))
                    }
                });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);