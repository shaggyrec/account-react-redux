import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import TilesMenu from '../tilesMenu/tilesMenuContainer'
import Loader from '../utils/Loader'
import {reduxForm, Field, FieldArray, SubmissionError} from 'redux-form'
import renderFieldCheckBox from '../formFields/renderFieldCheckBox'
import renderSelect from '../formFields/renderSelect'
import ObjectServiceGroup from '../serviceGroupForm/ObjectServiceGroupContainer'

import Masonry from 'react-masonry-component';

class ObjectConditions extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //  if (!token || token === '') {return;}
        const {object} = this.props.activeObject
        if (!object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }

    renderFieldsArr = ({fields, all}) => {
        const {validateAndUpdateObject, handleSubmit} = this.props
        return (<ul>
                {fields.map((field, index) => {
                        return (
                            <li key={all[index]}>
                                <Field
                                    id={field}
                                    name={field}
                                    type='checkbox'
                                    component={renderFieldCheckBox}
                                    label={all[index]}
                                    onChange={(e) => setTimeout(handleSubmit(validateAndUpdateObject))}
                                />
                            </li>
                        )
                    }
                )}
            </ul>
        )
    }

    renderFields(propName, props) {
        if (props) {
            var propsArr = []
            let i = 0
            for (let prop in props) {
                if (prop === propName) {
                    propsArr[i] = []
                    propsArr[i]['name'] = prop
                    propsArr[i]['all'] = props[prop]['all']
                    i++;
                }
            }
            return propsArr.map((prop) => {
                return <FieldArray key={prop} name={prop.name} component={this.renderFieldsArr} all={prop.all}/>
            })

        } else {
            <div/>
        }
    }

    render() {
        const {validateAndUpdateObject, handleSubmit, zaezd, otyezd} = this.props
        const {object, loading, error} = this.props.activeObject;
        if (loading) {
            return <Loader loading={loading}/>
        } else if (error) {
            return <div className="alert alert-danger">Error: {error.message}</div>
        }
        if (object) {
            document.title = 'Условия и Ограничения ' + object.NAME
            return (
                <div className="container-fluid">
                    <form className="container-fluid" onSubmit={ handleSubmit(validateAndUpdateObject) }>
                        <div className="row">
                            <div className="col-md-3 col-12">
                                <Field
                                    name="zaezd"
                                    component={ renderSelect }
                                    label="Заезд c"
                                    options={zaezd}
                                    onChange={(e) => setTimeout(handleSubmit(validateAndUpdateObject))}
                                />
                            </div>
                            <div className="col-md-3 col-12">
                                <Field
                                    name="otyezd"
                                    component={ renderSelect }
                                    label="Отъезд c"
                                    options={otyezd}
                                    onChange={(e) => setTimeout(handleSubmit(validateAndUpdateObject))}
                                />
                            </div>
                        </div>
                    </form>
                    <Masonry>
                        <ObjectServiceGroup groupName="BRON"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.BRON : {} }
                                            objectId={object.ID}
                                            form="ObjectServiceGroupBron"
                        />
                        <ObjectServiceGroup groupName="OGRANICH"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.OGRANICH : {} }
                                            objectId={object.ID}
                                            form="ObjectServiceGroupOgranich"
                        />
                        <ObjectServiceGroup groupName="oplata"
                                            groupProps={ object.hasOwnProperty('PROPS') ? object.PROPS.oplata : {} }
                                            objectId={object.ID}
                                            form="ObjectServiceGroupOplata"
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
    form: 'ObjectConditions', // a unique identifier for this form
    fields: ['picture'],
    //validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(ObjectConditions)