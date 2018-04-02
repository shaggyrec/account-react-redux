import { connect } from 'react-redux'
import ObjectServices from './ObjectServices'
import { fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject, updateObject, updateObjectSuccess, updateObjectFailure, uploadObjectPhotos, uploadObjectPhotosSuccess, uploadObjectPhotosFailure,
    deleteObjectPhoto, deleteObjectPhotoSuccess, deleteObjectPhotoFailure} from './actions';
import { SubmissionError } from 'redux-form'

function mapStateToProps(globalState, ownProps) {
    //console.log(ownProps);
    let initialValues = {}
    if (globalState.activeObject && globalState.activeObject.object && globalState.activeObject.object.PROPS){
        const props = globalState.activeObject.object.PROPS
        for (let prop in props) {
            if(prop === 'FILTR_USLOV' ||
                prop === 'pitanie' ||
                prop === 'parking' ||
                prop === 'uslugi' ||
                prop === 'basseyn' ||
                prop === 'sport' ||
                prop === 'internet' ||
                prop === 'FILTR_PITANIYE1' ||
                prop === 'filtr_zvezd' ||
                prop === 'zhivnost'
            ){
                initialValues[prop] = []
                for(let val in props[prop]['all']){
                    initialValues[prop][val] = {}
                    initialValues[prop][val] = !props[prop]['VALUE_ENUM_ID'] || props[prop]['VALUE_ENUM_ID'].indexOf(val) === -1 ? false : true
                }
            }
        }
    }
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.id,
        initialValues: initialValues
    };
}
const mapDispatchToProps = (dispatch,ownProps) => {

    return {
        fetchObject: (id, token) => {
            dispatch(fetchObject(id, token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchObjectFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchObjectSuccess(result.payload.data))
                    }
                })
        },
        validateAndUpdateObject: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(updateObjectFailure(data));
                // throw new SubmissionError(data);
            }
            // if(values.picture){
            //     let formData = new FormData()
            //     for(let prop in values){
            //         if(prop == 'picture'){
            //             for (var i = 0; i < values[prop].length; i++) {
            //                 var file = values[prop][i];
            //                 // add the files to formData object for the data payload
            //                 formData.append('picture', file, file.name);
            //             }
            //         }else {
            //             formData.append(prop, values[prop])
            //         }
            //     }
            //     values = formData
            // }

            return dispatch(updateObject(ownProps.id, values, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateObjectFailure(result.payload.response.data));
                        throw new SubmissionError(result.payload.response.data);
                    }
                    //let other components know that everything is fine by updating the redux` state
                    dispatch(updateObjectSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
                });
        },
        resetMe: () => {
            //clean up both activePost(currrently open) and deletedPost(open and being deleted) states
            dispatch(resetActiveObject());
            //dispatch(resetDeletedPost());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ObjectServices);