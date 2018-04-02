import { connect } from 'react-redux'
import { fetchQuestions,fetchQuestionsSuccess,fetchQuestionsFailure} from './actions';
import Faq from './Faq';


const mapStateToProps = (state, ownProps) => {
    return {
        questions: state.help,
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchQuestions: (token) => {
            dispatch(fetchQuestions(token)).then((response) => {
                if(!response.error) {
                    dispatch(fetchQuestionsSuccess(response.payload))
                }else{
                    dispatch(fetchQuestionsFailure(response.payload));
                }
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Faq);