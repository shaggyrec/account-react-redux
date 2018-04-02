import React, {Component} from 'react';
import renderField from '../formFields/renderField';
import renderAutocompleteField from '../formFields/renderAutocompleteField';
import {Field, FieldArray, reduxForm} from 'redux-form'
import Loader from '../utils/Loader'
import FixedBottomBar from '../utils/FixedBottomBar'

class ObjectDistances extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //  if (!token || token === '') {return;}
        const {object} = this.props.activeObject
        if (!object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }

    renderSubmitButton(submitting) {
        if (submitting) {
            return (
                <button className="btn btn-success" type="submit" disabled={true}>
                    Сохраняю...
                </button>
            )
        } else {
            return (
                <button name="SAVE_ROUTE" type="submit" className="btn red cursor-pointer">
                    Применить
                </button>
            )
        }
    }

    renderSelectField = props => {
        let options = [];
        for (var key in props.all) {
            options.push(
                <option key={props.all[key].uKey}
                        value={props.all[key].value}>{props.all[key].title}</option>
            );
        }
        return (
            <div className="md-form">
                <select {...props.input} className="form-control">
                    <option value="0" key="0">Нет</option>
                    {options}
                </select>
            </div>
        );
    };

    renderFieldArray = ({fields}) => {
        let distances = this.props && this.props.initialValues.RASSTOYANIYA;
        let objectNameItems = [
            {
                label: 'Пляж песчаный',
                value: 'пляж песчаный'
            },
            {
                label: 'Пляж галечный',
                value: 'пляж галечный'
            },
            {
                label: 'Пляж песчано-галечный',
                value: 'пляж песчано-галечный'
            },
            {
                label: 'Пляж каменный',
                value: 'пляж каменный'
            },
            {
                label: 'Дикий пляж',
                value: 'дикий пляж'
            },
            {
                label: 'Набережная',
                value: 'набережная'
            },
            {
                label: 'Центр',
                value: 'центр'
            },
            {
                label: 'Аквапарк',
                value: 'аквапарк'
            },
            {
                label: 'Рынок',
                value: 'рынок'
            },
            {
                label: 'Магазин продуктов',
                value: 'магазин продуктов'
            },
            {
                label: 'Столовая',
                value: 'столовая'
            },
            {
                label: 'Кафе',
                value: 'кафе'
            },
            {
                label: 'Остановка общественного транспорта',
                value: 'остановка общественного транспорта'
            },
            {
                label: 'Банкомат',
                value: 'банкомат'
            },
            {
                label: 'Аптека',
                value: 'аптека'
            },
            {
                label: 'Река',
                value: 'река'
            },
            {
                label: 'Озеро',
                value: 'озеро'
            },
            {
                label: 'Водопад',
                value: 'водопад'
            },

        ];

        if (distances){
            distances.map(function (curElement) {
                let bIsExist = false;
                if (curElement.name_obect) {
                    for (let i = 0; i < objectNameItems.length; i++) {
                        if (objectNameItems[i].value == curElement.name_obect.toString().toLowerCase())
                        {
                            bIsExist = true;
                            break;
                        }
                    }
                    if (!bIsExist)
                    {
                        objectNameItems.push({
                            label: curElement.name_obect,
                            value: curElement.name_obect
                        });
                    }
                }
            })
        }

        let measureItems = [
            {
                uKey: 1,
                value: 'минут',
                title: 'Минут'
            },
            {
                uKey: 2,
                value: 'км',
                title: 'Км'
            },
            {
                uKey: 3,
                value: 'метров',
                title: 'Метров'
            },
            {
                uKey: 4,
                value: 'минуты',
                title: 'Минуты'
            },
            {
                uKey: 5,
                value: 'минута',
                title: 'Минута'
            },
            {
                uKey: 6,
                value: 'метры',
                title: 'Метры'
            },
            {
                uKey: 7,
                value: 'метр',
                title: 'Метр'
            },
        ];
        let transportItems = [
            {
                uKey: 4,
                value: 'пешком',
                title: 'пешком'
            },
            {
                uKey: 2,
                value: 'на авто',
                title: 'на авто'
            },
            {
                uKey: 3,
                value: 'на транспорте',
                title: 'на транспорте'
            },
        ];
        return (
            <div className="col-md-12">
                <table className="table table-hover grey lighten-4">
                    <thead>
                    <th>
                        Название объекта
                    </th>
                    <th>
                        Растояние
                    </th>
                    <th>
                        Единица измерения
                    </th>
                    <th>
                        На чем
                    </th>
                    <th>

                    </th>
                    </thead>
                    <tbody>
                    {fields.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <Field
                                        component={renderAutocompleteField}
                                        options={objectNameItems}
                                        simpleValue={true}
                                        isCreatable={true}
                                        placeholder="Введите название объекта"
                                        promptTextCreator={label => label}
                                        label=""
                                        type="text"
                                        name={`${item}.name_obect`}
                                    />
                                </td>
                                <td>
                                    <Field component={renderField} type="text" name={`${item}.rasstoyanie`}/>
                                </td>
                                <td>
                                    <Field component={this.renderSelectField} all={measureItems}
                                           name={`${item}.name_ed_izmereniya`}/>
                                </td>
                                <td>
                                    <Field component={this.renderSelectField} all={transportItems}
                                           name={`${item}.na_chem`}/>
                                </td>
                                <td>
                                    <button name="REMOVE_PART" type="button" className="btn btn-warning btn-md mt-2"
                                            onClick={() => fields.remove(index)}><i className="fa fa-remove mr-1"></i>Удалить
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <button name="ADD_DISTANCE" type="button" className="btn btn-primary cursor-pointer"
                        onClick={() => fields.push({})}>Добавить элемент
                </button>
            </div>
        );
    }

    render() {
        const {handleSubmit, submitting, validateAndUpdateObject, initialValues} = this.props;
        const {loading, error, object} = this.props.activeObject;
        let title = "Расстояния";
        if (object && object.NAME) {
            title += " от " + object.NAME;
        }
        document.title = title;
        if (loading) {
            return <Loader loading={loading}/>
        } else if (error) {
            return <div className="alert alert-danger">Error: {error.message}</div>
        }
        if (initialValues && initialValues.hasOwnProperty('RASSTOYANIYA') && initialValues.RASSTOYANIYA) {
            return (
                <div className="container-fluid mt-2">
                    <h1 dangerouslySetInnerHTML={{__html: title}}></h1>
                    <form onSubmit={handleSubmit(validateAndUpdateObject)} className="distances-form">
                        <div className="row">
                            <FieldArray name="RASSTOYANIYA" component={this.renderFieldArray}/>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <FixedBottomBar>
                                    {this.renderSubmitButton(submitting)}
                                </FixedBottomBar>
                            </div>
                            <Loader loading={submitting}/>
                        </div>
                    </form>
                </div>
            );
        }
        else {
            return (<div></div>)
        }
    }
}

export default reduxForm({
    form: 'ObjectDistances',
    enableReinitialize: true
})(ObjectDistances)