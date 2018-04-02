import { connect } from 'react-redux'
import { fetchObjects,fetchObjectsSuccess,fetchObjectsFailure} from '../objectsList/actions';
import { resetActiveObject } from '../objectmain/actions'
import ContractsList from './ContractsList';


const mapStateToProps = (state, ownProps) => {
    return {
        objects: state.objectsList,
        user: state.user.user,
        searchTerm: state.objectsList.searchTerm || ''
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const token = localStorage.getItem('jwtToken')
    return {
        fetchObjects: (search) => {
            dispatch(fetchObjects(token, search)).then((response) => {
                if(!response.error) {
                    dispatch(fetchObjectsSuccess(response.payload))
                }else{
                    dispatch(fetchObjectsFailure(response.payload));
                }
            });
        },
        resetActiveObject: (token) => {
            dispatch(resetActiveObject(token))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContractsList);