 import SignInForm from './SignInForm'
import { connect } from 'react-redux'
import { resetUser } from './actions'

const mapDispatchToProps = (dispatch) => {
    return {
        resetMe: () =>{
            //sign up is not reused, so we dont need to resetUserFields
            //in our case, it will remove authenticated users
            dispatch(resetUser());
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: state.user,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);