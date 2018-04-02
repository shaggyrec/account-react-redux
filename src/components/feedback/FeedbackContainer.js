import { connect } from 'react-redux'
import { SendMessage,SendMessageSuccess, SendMessageFailure, SendRequest, ResetMessage} from './actions'
import Feedback from './Feedback'
import { SubmissionError } from 'redux-form'


const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user,
        feedback: state.feedback
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        sendMessage: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(SendMessageFailure(data));
                throw new SubmissionError(data);
            }

            let formData = new FormData()
            for(let prop in values){
                if(prop == 'file'){
                    for (var i = 0; i < values[prop].length; i++) {
                        var file = values[prop][i];
                        // add the files to formData object for the data payload
                        formData.append('file', file, file.name);
                    }
                }else {
                    formData.append(prop, values[prop])
                }
            }
            values = formData

            dispatch(SendMessage(values,token)).then((response) => {
                if(!response.error) {
                    dispatch(SendMessageSuccess(response.payload))
                }else{
                    dispatch(SendMessageFailure(response.payload));
                }
            });
        },

        sendRequest: () => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(SendMessageFailure(data));
                throw new SubmissionError(data);
            }
            dispatch(SendRequest(token)).then((response) => {
                if(!response.error) {
                    dispatch(SendMessageSuccess(response.payload))
                }else{
                    dispatch(SendMessageFailure(response.payload));
                }
            });
        },
        resetMe: () => {
            dispatch(ResetMessage())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);