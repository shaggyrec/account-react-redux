import { connect } from 'react-redux'
import { fetchObject, fetchObjectSuccess, fetchObjectFailure } from '../objectmain/actions'
import { SendContract, SendContractSuccess, SendContractFailure,
        FetchOrganizationByInn, FetchOrganizationByInnSuccess, FetchOrganizationByInnFailure, ResetContract,
        //FetchContract, FetchContractSuccess, FetchContractFailure,
        FetchContractData, FetchContractDataSuccess, FetchContractDataFailure,
        FetchContract, FetchContractSuccess, FetchContractFailure,
        SignContract, SignContractSuccess, SignContractFailure, ResetSuggestions
} from './actions'
import Contract from './Contract'
import { SubmissionError } from 'redux-form'


function mapStateToProps(globalState, ownProps) {
    const user = globalState.user
    let initialValues = {
        name: user.user.name,
        lastName: user.user.lastName,
        type: 'individual',
        id:0
    }
    return {
        activeObject: globalState.activeObject,
        user: user,
        objectId: ownProps.id,
        contract: globalState.contract,
        initialValues: initialValues
    };
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        fetchContractData: (id, token) => {
            dispatch(FetchContractData(id, token))
                .then((result) => {
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(FetchContractDataFailure(result.payload.response.data));
                    } else {
                        dispatch(FetchContractDataSuccess(result.payload.data))
                    }
                })
        },
        fetchObject: (id, token) => {
            dispatch(fetchObject(id, token))
                .then((result) => {
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchObjectFailure(result.payload.response.data))
                    } else {
                        dispatch(fetchObjectSuccess(result.payload.data))
                        const contractStage = result.payload.data.PROPS.CONTRACT_STAGE.VALUE
                        if(contractStage === 'S' || contractStage === 'Y'){
                            // dispatch(FetchContract(id,token))
                            //     .then((result) => {
                            //         if (result.payload.response && result.payload.response.status !== 200) {
                            //             dispatch(FetchContractFailure(result.payload.response.data))
                            //         } else {
                            //             dispatch(FetchContractSuccess(result.payload.data))
                            //         }
                            //     })
                        }
                    }
                })
        },
        sendContract: (values) => {
            const token = localStorage.getItem('jwtToken');
            let formData = new FormData()
            for(let prop in values){
                if(prop === 'documentScan' && typeof values[prop] !== 'string'){
                    var i = 0;
                    for ( let val in values[prop]) {
                        let file = values[prop][val]
                        // add the files to formData object for the data payload
                        if(typeof file === 'object' && typeof file !== 'function') {
                            formData.append(`documentScan[${i}]`, file, file.name);
                            i++
                        }
                    }
                }else {
                    formData.append(prop, values[prop])
                }
            }
            values = formData
            return dispatch(SendContract(ownProps.id, values, token))
                .then(result => {
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(SendContractFailure(result.payload.response.data));
                    } else {
                        dispatch(SendContractSuccess(result.payload.data))
                    }
                })
        },
        signContract: (id) => {
            const token = localStorage.getItem('jwtToken')
            return dispatch(SignContract(id,token))
                .then(result =>{
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(SignContractFailure(result.payload.response.data));
                    } else {
                        dispatch(SignContractSuccess(result.payload.data))
                    }
                })
        },
        FetchOrganizationByInn: (inn) => {
            const token = localStorage.getItem('jwtToken')
            return dispatch(FetchOrganizationByInn(inn,token))
                .then(result =>{
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(FetchOrganizationByInnFailure(result.payload.response.data));
                    } else {
                        dispatch(FetchOrganizationByInnSuccess(result.payload.data))
                    }
                })
        },
        ResetSuggestions: () => {
            dispatch(ResetSuggestions())
        },

        ResetMe: () => {
            dispatch(ResetContract())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Contract)