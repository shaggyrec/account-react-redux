import React, {Component} from 'react'
import Loader from '../utils/Loader'
import {reduxForm, Field, FieldArray, SubmissionError} from 'redux-form'
import ObjectServiceGroup from '../serviceGroupForm/ObjectServiceGroupContainer';
import Masonry from 'react-masonry-component';

class ObjectServices extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //  if (!token || token === '') {return;}
        const {object} = this.props.activeObject
        if (!object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }

    render() {
        const {object, loading, error} = this.props.activeObject;
        const { submitting } = this.props
        if (loading) {
            return <Loader loading={loading}/>
        } else if (error) {
            return <div className="alert alert-danger">Error: {error.message}</div>
        }
        if (object) {
            document.title = 'Услуги и удобства ' + object.NAME
            return (
                <div className="container-fluid">
                    <Masonry>
                        <ObjectServiceGroup groupName="parking"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.parking : {} }
                                            objectId={object.ID}
                                            form="ObjectServicesParking"
                        />
                        <ObjectServiceGroup groupName="uslugi"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.uslugi : {} }
                                            objectId={object.ID}
                                            form="ObjectServicesUslugi"
                        />
                        <ObjectServiceGroup groupName="basseyn"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.basseyn : {} }
                                            objectId={object.ID}
                                            form="ObjectServicesBasseyn"
                        />
                        <ObjectServiceGroup groupName="sport"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.sport : {} }
                                            objectId={object.ID}
                                            form="ObjectServicesSport"
                        />
                        <ObjectServiceGroup groupName="pitanie"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.pitanie : {} }
                                            objectId={object.ID}
                                            form="ObjectServicesPitanie"
                        />
                        <ObjectServiceGroup groupName="internet"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.internet : {} }
                                            objectId={object.ID}
                                            form="ObjectServicesInternet"
                        />
                        <ObjectServiceGroup groupName="filtr_zvezd"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.filtr_zvezd : {} }
                                            objectId={object.ID}
                                            form="ObjectServicesFiltr_zvezd"
                        />
                        <ObjectServiceGroup groupName="zhivnost"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.zhivnost : {} }
                                            objectId={object.ID}
                                            form="ObjectServicesZhivnost"
                        />
                    </Masonry>
                </div>
            )
        } else {
            return <div/>
        }
    }
}


export default reduxForm({
    form: 'ObjectServices', // a unique identifier for this form
    fields: ['picture'],
    //validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(ObjectServices)