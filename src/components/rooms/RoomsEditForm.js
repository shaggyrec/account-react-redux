import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {reduxForm, Field, FieldArray, SubmissionError, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import renderField from '../formFields/renderField'
import renderFileInput from '../formFields/renderFileInput'
import renderFieldCheckBox from '../formFields/renderFieldCheckBox'
import renderSelect from '../formFields/renderSelect'
import Loader from '../utils/Loader'
import renderRange from '../formFields/renderRange'
import Masonry from 'react-masonry-component'
import DragSortableList from 'react-drag-sortable'
import LoaderBar from '../utils/LoaderBar'
import Modal from '../modal'
import ReactTooltip from 'react-tooltip'

const picDomain = 'https://test.edem-v-gosti.ru'
const deleteButtonStyles = {position: 'absolute', right: '-7px', top: '-7px', background: 'red'}
const buttonAnnonceStyles = {position: 'absolute', left: '0', right: '0', bottom: '-1rem'}
const placeholder = (
    <div className="red text-white" style={{width: '200px', height: '150px', paddingTop: '60px', textAlign: 'center'}}>
        <h5>СЮДА!</h5></div>)
const maxPhotosCount = 50

var timeId;
var userTypeTimeId

const lessThan = otherField => (value, previousValue, allValues) =>
    !allValues[otherField] || parseFloat(value) < parseFloat(allValues[otherField]) ? value : allValues[otherField]
const greaterThan = otherField => (value, previousValue, allValues) =>
    !allValues[otherField] || parseFloat(value) > parseFloat(allValues[otherField]) ? value : allValues[otherField]

function validate(values) {
    const errors = {};

    if (!values.TYPE || values.TYPE.trim() === '') {
        errors.TYPE = 'Выберите тип';
    }
    if (!values.VSEGO) {
        errors.VSEGO = 'Введите общее количество номеров';
    }
    if (!values.PLO || values.PLO === 0) {
        errors.PLO = 'Введите площадь номера';
    }
    if (!values.GOS_OT) {
        errors.GOS_OT = 'Введите минимальное количество гостей';
    }
    if (!values.GOS_DO) {
        errors.GOS_DO = 'Введите максимальное количество гостей';
    }

    return errors;
}

class RoomsEditForm extends Component {
    constructor(props) {
        super(props)
        this.onPicturesSort = this.onPicturesSort.bind(this)
        this.handlePicInputChange = this.handlePicInputChange.bind(this)
        this.deletePic = this.deletePic.bind(this)
        this.state = {
            deletingPic:false,
            loading:false,
            modalUserType:false
        }
    }

    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //if (!token || token === '') {return;}
        const {object} = this.props.activeObject;
        if (!object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
        const {room} = this.props.activeRoom
        if (!room || +(room.ID) !== +(this.props.roomId)) {
            this.props.fetchRoom(this.props.roomId, token);
        }
        if (!this.props.roomTypes.types) {
            this.props.fetchRoomTypes()
        }
    }

    componentWillUpdate(nextProps, newxtState) {
        /*const { USER_TYPE, validateAndUpdateRoom,parent } = this.props
         if(USER_TYPE && USER_TYPE !== nextProps.USER_TYPE){
         clearTimeout(userTypeTimeId)
         userTypeTimeId = setTimeout(()=>{
         validateAndUpdateRoom({
         'USER_TYPE':nextProps.USER_TYPE,
         'USER_TYPE_STATUS': 'M',
         'parent':parent
         })
         },1000)
         }*/
    }

    renderDetailPicture(pic) {
        if (pic) {
            return (
                <div className="mb-2">
                    <label className="control-label">Картинка для анонса</label>
                    <div>
                        <img src={`${picDomain}${pic}`} style={{height: '150px'}}/>
                    </div>
                    {this.renderTempDetail()}
                </div>
            )
        } else {
            return (
                <div className="mb-2 mt-1">
                    Картинка для анонса не задана<br/>
                    Выберите её из фотоальбома
                    {this.renderTempDetail()}
                </div>
            )
        }
    }

    renderTempDetail() {
        const {user, activeRoom, validateAndUpdateRoom} = this.props
        if (user.group === 'admin') {
            const pics = activeRoom.room.PROPS.MORE_PHOTO
            const tempAnnonce = activeRoom.room.PROPS.TEMP_ANNONCE.VALUE

            return pics.map((pic) => {
                if (pic.id == tempAnnonce) {
                    return (
                        <div key='tempAnnonce' className="mt-2">
                            <div className="alert alert-warning">
                                <p>Пользователь хочет установить эту картинку в качестве анонса:</p>
                                <img src={`${picDomain}${pic.src}`} style={{height: '150px'}}/>
                                <button type='button' className="btn btn-md red"
                                        onClick={() => {
                                            validateAndUpdateRoom({'PREVIEW_PICTURE': pic.fid})
                                        }}
                                >Сделать анонсом
                                </button>
                                <button type='button' className="btn btn-md btn-warning"
                                        onClick={() => {
                                            let reason = window.prompt('Причина:', '')
                                            if (reason) {
                                                validateAndUpdateRoom({'TEMP_ANNONCE': reason})
                                            }
                                        }}
                                >Отказать
                                </button>
                            </div>
                        </div>
                    )
                }
            })

        } else {
            return <div/>
        }
    }

    renderPictures(pics) {
        //const { validateAndUpdateRoom } = this.props
        if (pics) {
            let picturesList = pics.map((pic) => {
                return ({
                    content: (<div key={`${pic.id}_${pic.fid}`} style={{
                        backgroundImage: `url(${picDomain}${pic.src}`,
                        backgroundSize: 'cover',
                        backgroundPosition: '50% 50%',
                        backgroundRepeat: 'no-repeat',
                        width: '200px',
                        height: '150px',
                        display: 'inline-block',
                        // overflow:'hidden',
                        marginRight: '10px',
                        marginBottom: '30px',
                        border: '1px solid #d6d6d6',
                        position: 'relative'
                    }}>
                        <div className="text-center" style={buttonAnnonceStyles}>
                            <button type='button' className="btn btn-md red" onClick={() => {
                                this.makeAnnonce(pic.id)
                            }}>Сделать анонсом
                            </button>
                        </div>
                        <span style={deleteButtonStyles} className="badge badge-danger"
                              onClick={() => this.beginDeletePic(pic.id)} title="Удалить"><i className="fa fa-trash"
                                                                                        aria-hidden="true"></i></span>
                    </div>)
                })
            })
            return <div className="pt-2 pb-2" style={{overflow: 'hidden'}}><DragSortableList items={picturesList}
                                                                                             type="grid"
                                                                                             placeholder={placeholder}
                                                                                             onSort={this.onPicturesSort}/>
            </div>
        } else {
            return <div/>
        }
    }

    onPicturesSort(sortedList, dropEvent) {
        const {validateAndUpdateRoom} = this.props
        let pictures = []
        for (let el in sortedList) {
            pictures.push(sortedList[el].content.key)
        }
        this.setState({loading: true})
        validateAndUpdateRoom({'pictures': pictures}).then(data => {
            this.setState({loading: false})
        })
    }

    makeAnnonce(id) {
        const {validateAndUpdateRoom} = this.props
        if (window.confirm('Вы уверены, что хотите установить это фото для анонса?')) {
            validateAndUpdateRoom({'TEMP_ANNONCE': id})
            alert('Ваш запрос отправлен редактору');
        }
    }

    renderPhotosInstructions(prev,alb){
        if(!prev && !alb){
            return (
                <div className='card warning-color'>
                    <div className="card-block">
                        <h4>Не загружены фото и не выбрана фотография для анонса.</h4>
                        Необходимо загрузить фото номера, затем выбрать одну из них в качестве фото для анонса.
                        В противном случае номер на сайте отображаться не будет.
                    </div>
                </div>
            )
        }else if(!prev){
            return (
                <div className='card warning-color'>
                    <div className="card-block">
                        <h4>Не выбрана фотография для анонса.</h4>
                        Необходимо выбрать одну фотографию в качестве фото для анонса.
                        В противном случае номер на сайте отображаться не будет.
                    </div>
                </div>
            )
        }
    }


    renderPicturesBlock(object) {
        const {uploadPhotos, validateAndUpdateRoom, handleSubmit} = this.props
        if (object) {
            if (object.PROPS && object.PROPS.MORE_PHOTO.length < maxPhotosCount) {
                return (
                    <div>
                        <h4>Фото</h4>
                        <div>
                            {this.renderDetailPicture(object.PREVIEW_PICTURE)}
                        </div>
                        <div className="row">
                            <form className="col-md-4" ref={(el) => this.roomPhotoFormRef = el}>
                                <Field
                                    name='picture'
                                    component={renderFileInput}
                                    label='Фотоальбом'
                                    accept="image/*"
                                    onChange={this.handlePicInputChange}
                                />
                            </form>
                            <div className="col-md-8">
                                {this.renderPhotosInstructions(object.PREVIEW_PICTURE, object.PROPS.MORE_PHOTO.length)}
                            </div>
                        </div>
                        <div className="photosCount mb-1">
                            Загружено <span
                            className="photosCount__number">{object.PROPS && object.PROPS.MORE_PHOTO.length}</span>
                            фото. Максимальное количество - <span
                            className="photosCount__number">{maxPhotosCount}</span>
                        </div>
                        {this.renderPictures(object.PROPS && object.PROPS.MORE_PHOTO)}
                    </div>
                )
            } else {
                return (
                    <div className="container-fluid">
                        <h4>Фото</h4>
                        <div>
                            <div>
                                {this.renderDetailPicture(object.PREVIEW_PICTURE)}
                            </div>
                            <div className="photosCount mb-1">
                                Загружено максимальное количество фото - <span
                                className="photosCount__number">{maxPhotosCount}</span>
                            </div>
                            {this.renderPictures(object.PROPS && object.PROPS.MORE_PHOTO)}
                        </div>
                    </div>
                )
            }
        } else {
            return <div/>
        }
    }

    renderFieldsArr = ({fields, all}) => {
        const {validateAndUpdateRoom, handleSubmit} = this.props
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
                                    onChange={(e) => setTimeout(handleSubmit(validateAndUpdateRoom))}
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

    renderStatusOfUserTypeModeration() {
        const {activeRoom: {room}, validateAndUpdateRoom, USER_TYPE, objectId} = this.props
        if (room && room.PROPS.USER_TYPE_STATUS.VALUE && room.PROPS.USER_TYPE_STATUS.VALUE !== 'M') {
            return <div className="alert alert-danger">не одобрено, причина: {room.PROPS.USER_TYPE_STATUS.VALUE}</div>
        }
        else if(USER_TYPE.length > 2) {
            return (
                <div>
                    <button type="button" className="btn btn-md btn-success"
                            onClick={() => {
                                validateAndUpdateRoom({
                                    'USER_TYPE': USER_TYPE,
                                    'USER_TYPE_STATUS': 'M',
                                    'parent': objectId
                                }).then(res => {this.setState({modalUserType:true})})

                            }}
                    >
                        ОК
                    </button>
                    {room.PROPS.USER_TYPE_STATUS.VALUE == 'M' ? <div className="alert alert-warning">Ожидает модерации</div> : ''}
                    {this.renderModalRoomsUserType()}
                </div>
            )
        }
    }
    renderModalRoomsUserType(){
        return <Modal show={this.state.modalUserType} onOk={() => this.setState({modalUserType:false})}>Ваш типа номера отправлен на модерацию. Пока на сайте будет выводится старое значение.</Modal>
    }
    renderUserTypeOkButton() {
        const {user, handleSubmit, validateAndUpdateRoom, USER_TYPE, activeRoom: {room}, objectId} = this.props
        if (user.group === 'admin') {
            if (room && room.PROPS.USER_TYPE_STATUS.VALUE && room.PROPS.USER_TYPE_STATUS.VALUE == 'M') {
                return (
                    <div className="alert alert-warning" style={{marginTop: '-1rem'}}>
                        <button type="button" className="btn btn-md btn-success"
                                onClick={() => {
                                    validateAndUpdateRoom({
                                        'USER_TYPE': USER_TYPE,
                                        'USER_TYPE_STATUS': 'Y',
                                        'parent': objectId
                                    })
                                }}>
                            Одобрить
                        </button>
                        <button type="button" className="btn btn-md btn-danger"
                                onClick={() => {
                                    let reason = window.prompt('Причина:', '')
                                    if (reason) {
                                        validateAndUpdateRoom({'USER_TYPE_STATUS': reason})
                                    }
                                }}>
                            Отказать
                        </button>
                    </div>
                )
            }
            else {
                return (
                    <div style={{marginTop: '-1rem', lineHeight: '1'}}>
                        {this.renderStatusOfUserTypeModeration()}
                        <small>Ваше оригинальное название категории номера будет доступно после проверки модератором
                        </small>
                    </div>
                )
            }
        } else {
            return (
                <div style={{marginTop: '-1rem', lineHeight: '1'}}>
                    {this.renderStatusOfUserTypeModeration()}
                    <small>Ваше оригинальное название категории номера будет доступно после проверки модератором</small>
                </div>
            )
        }
    }

    renderUserTypeField() {
        const {TYPE, handleSubmit, parent, validateAndUpdateRoom} = this.props
        if (parseInt(TYPE) === 4449) {
            return (
                <div>
                    <Field
                        component={renderField}
                        type='text'
                        label='Свой тип номера'
                        name='USER_TYPE'
                        //onChange = {(e) => setTimeout(handleSubmit(validateAndUpdateRoom))}
                        // onBlur = {(e) => setTimeout((validateAndUpdateRoom({
                        //     'USER_TYPE':e.target.value,
                        //     'USER_TYPE_STATUS': 'M',
                        //     'parent':parent
                        // })))}
                    />
                    {this.renderUserTypeOkButton()}
                </div>
            )
        } else {
            return <div/>
        }
    }

    handlePicInputChange(e){
        const { validateAndUpdateRoom } = this.props
        this.setState({loading:true})
        validateAndUpdateRoom({picture: e})
            .then(data=>this.setState({loading:false}))
        this.roomPhotoFormRef.reset()
    }
    beginDeletePic (pic){
        this.setState({deletingPic:pic})
    }
    deletePic(deletingPic){
        const { deletePhoto } = this.props
        this.setState({loading:true,deletingPic:false})
        deletePhoto(deletingPic).then(data=>{
            this.setState({
                deletingPic:false,
                loading:false
            })
        })

    }
    renderDeletePicModal(){
        const { deletingPic } = this.state
        const { MORE_PHOTO } = this.props.activeRoom.room.PROPS
        let deletingPicSrc
        for(let pic of MORE_PHOTO){
            if(pic.id == deletingPic){
                deletingPicSrc = pic.src
                break
            }
        }
        if(deletingPic) {
            return (
                <Modal show={!!deletingPic} btnOkText='Да' btnCloseText='Отмена' onOk={e => {this.deletePic(deletingPic)}} onClose={e => this.setState({deletingPic:false})}>
                    <h5>Вы уверены, что хотите удалить это фото?</h5>
                    <p className="text-center">
                        <img style={{maxWidth:'200px'}} src={picDomain+deletingPicSrc}/>
                    </p>
                    <h5>Это действие невозможно будет отменить!</h5>
                </Modal>
            )
        }else{
            return <div/>
        }
    }
    renderError(error){
        if(error) {
            return <div className="alert alert-danger">Error: {error.message}</div>
        }else{
            return <div />
        }
    }
    renderStatus(isActive){
        return <i className={`fa fa-circle${isActive ? ' green-text' : '-o red-text'}`}> Номер {isActive ? 'Активен' : 'Неактивен'}</i>
    }
    render() {
        const {handleSubmit, submitting, validateAndUpdateRoom, roomTypes, objectId, typesList} = this.props
        const {room, loading, error} = this.props.activeRoom;
        if (loading) {
            return <Loader loading={loading}/>
        } if (room) {
            document.title = room ? 'Номер ' + room.NAME : 'Редактировать номер'
            const roomTypesArray = roomTypes.types || []
            return (
                <div className="container-fluid">
                    <form onSubmit={ handleSubmit(validateAndUpdateRoom) }>
                        {this.renderError(error)}
                        <div className="row">
                            <div className="col-sm-12 mb-1">
                                {this.renderStatus(room.ACTIVE === 'Y')}
                            </div>
                            <div className="col-sm-4">
                                <Field
                                    name="TYPE"
                                    component={ renderSelect }
                                    label="Тип"
                                    // options={roomTypes.types}
                                    onChange={(e) => {
                                        this.props.change('NAME', typesList[e.target.value])
                                        setTimeout(handleSubmit(validateAndUpdateRoom))
                                    }}
                                    onBlur={(e) => {
                                        this.props.change('NAME', typesList[e.target.value])
                                    }}>
                                    <option value=''>Выберите тип номера</option>
                                    {roomTypesArray.map(type => (
                                        <option key={type.ID} value={type.ID}>{type.VALUE}</option>
                                    ))}
                                </Field>
                            </div>
                            <div className="col-sm-6">
                                {this.renderUserTypeField()}
                            </div>
                        </div>
                        <Field
                            name='parent'
                            type='hidden'
                            component='input'
                        />
                        <Field
                            name='NAME'
                            type='hidden'
                            component='input'
                        />
                        <div className="row mt-5">
                            <div className="col-sm-2">
                                <Field
                                    name='PLO'
                                    type='number'
                                    label='Площадь, кв.м (потяните ползунок или введите значение в поле)'
                                    component={renderRange}
                                    defaultValue={15}
                                    min={1}
                                    max={200}
                                    step={.5}
                                    onMove={(val) => {
                                        this.props.change('PLO', val)
                                        clearTimeout(timeId)
                                        timeId = setTimeout(handleSubmit(validateAndUpdateRoom), 500)
                                    }}
                                    onchange={(e) => {clearTimeout(timeId);setTimeout(handleSubmit(validateAndUpdateRoom))}}
                                />
                            </div>
                            <div className="col-sm-2">
                                <Field
                                    name='VSEGO'
                                    type='number'
                                    label='Всего номеров'
                                    component={renderField}
                                    onChange={(e) => {
	                                    clearTimeout(timeId)
	                                    timeId = setTimeout(handleSubmit(validateAndUpdateRoom), 3000)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-sm-12 d-flex flex-column justify-content-center font-weight-bold mb-1">
                                <div>Число гостeй:</div>
                            </div>
                            <div className="col-sm-2">
                                <Field
                                    name='GOS_OT'
                                    label='От'
                                    component={renderSelect}
                                    options={{
                                        1: 1,
                                        2: 2,
                                        3: 3,
                                        4: 4,
                                        5: 5,
                                        6: 6,
                                        7: 7,
                                        8: 8,
                                        9: 9,
                                        10: 10
                                    }}
                                    normalize={lessThan('GOS_DO')}
                                    onChange={(e) => setTimeout(handleSubmit(validateAndUpdateRoom))}
                                />
                            </div>
                            <div className="col-sm-2">
                                <Field
                                    name='GOS_DO'
                                    label='До'
                                    component={renderSelect}
                                    options={{
                                        1: 1,
                                        2: 2,
                                        3: 3,
                                        4: 4,
                                        5: 5,
                                        6: 6,
                                        7: 7,
                                        8: 8,
                                        9: 9,
                                        10: 10
                                    }}
                                    normalize={greaterThan('GOS_OT')}
                                    onChange={(e) => setTimeout(handleSubmit(validateAndUpdateRoom))}
                                />
                            </div>
                            <div className="col-sm-2">
                                <Field
                                    name='EXTRA_COUNT_TO'
                                    type='number'
                                    label='Количество доп. мест'
                                    component={renderField}
                                    onChange={(e) => {
	                                    clearTimeout(timeId)
	                                    timeId = setTimeout(handleSubmit(validateAndUpdateRoom), 3000)
                                    }}
                                    
                                    // onBlur={(e) => setTimeout(handleSubmit(validateAndUpdateRoom))}
                                />
                            </div>
                            <div className="col-sm-2">
                                <Field
                                    name='CHILD_COUNT_TO'
                                    type='number'
                                    label='Количество мест для детей'
                                    component={renderField}
                                    onChange={(e) => {
	                                    clearTimeout(timeId)
	                                    timeId = setTimeout(handleSubmit(validateAndUpdateRoom), 3000)
                                    }}
                                    // onBlur={(e) => setTimeout(handleSubmit(validateAndUpdateRoom))}
                                />
                            </div>
                        </div>
                        <div className="mt-2 mb-2">
                            {this.renderPicturesBlock(room)}
                        </div>
                        <Masonry>
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4>Удобства:</h4>
                                <div className="row mt-1">
                                    {this.renderFields('udobstva_nomere', room && room.PROPS)}
                                </div>
                                <hr/>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4>Техника:</h4>
                                <div className="row mt-1">
                                    {this.renderFields('tehno_nomere', room && room.PROPS)}
                                </div>
                                <hr/>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4>Ванная/Санузел:</h4>
                                <div className="row mt-1">
                                    {this.renderFields('vannaya', room && room.PROPS)}
                                </div>
                                <hr/>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4>Питание:</h4>
                                <div className="row mt-1">
                                    {this.renderFields('pitanie_nomere', room && room.PROPS)}
                                </div>
                                <hr/>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4>Вид из окна:</h4>
                                <div className="row mt-1">
                                    {this.renderFields('vid_okno', room && room.PROPS)}
                                </div>
                                <hr/>
                            </div>
                        </Masonry>
                        <div>
                            <button type="submit" style={{display: 'none'}}>+</button>
                            <Link
                                to={`/lk/${objectId}/rooms`}><i className="fa fa-arrow-left" aria-hidden="true"></i> к
                                списку номеров
                            </Link>
                        </div>
                    </form>
                    {this.renderDeletePicModal()}
                    <LoaderBar loading={submitting || this.state.loading}/>
                </div>
            )
        } else {
            return <div/>
        }
    }
}

RoomsEditForm = reduxForm({
    form: 'RoomsEditForm', // a unique identifier for this form
    validate, // <--- validation function given to redux-form
    enableReinitialize: true
})(RoomsEditForm)

// Decorate with connect to read form values
const selector = formValueSelector('RoomsEditForm') // <-- same as form name
RoomsEditForm = connect(state => {
    const NAME = selector(state, 'NAME')
    const PLO = selector(state, 'PLO')
    const picture = selector(state, 'picture')
    const TYPE = selector(state, 'TYPE')
    const USER_TYPE = selector(state, 'USER_TYPE')
    const parent = selector(state, 'parent')
    return {
        NAME,
        PLO,
        TYPE,
        USER_TYPE,
        parent
    }
})(RoomsEditForm)

export default RoomsEditForm