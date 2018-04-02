import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loader from '../utils/Loader'
import { reduxForm, Field, FieldArray, SubmissionError,formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import renderFileInput from '../formFields/renderFileInput'
import DragSortableList from 'react-drag-sortable'
import Modal from '../modal'

const picDomain = 'https://test.edem-v-gosti.ru'
const deleteButtonStyles = {position:'absolute',right:'-7px',top:'-7px',background:'red'}
const buttonAnnonceStyles = {position:'absolute',left:'0',right:'0',bottom:'-1rem'}
const placeholder = (<div className="red text-white" style={{ width:'200px', height:'150px', paddingTop:'60px',textAlign:'center'}}><h5>СЮДА!</h5></div>)
const maxPhotosCount = 50
var timeId;


class ObjectPhotos extends Component {
    constructor(props){
        super(props)
        this.onPicturesSort = this.onPicturesSort.bind(this)
        this.handlePicInputChange = this.handlePicInputChange.bind(this)
        this.deletePic = this.deletePic.bind(this)
        this.state = {
            deletingPic:false,
            loading:false
        }

    }
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //  if (!token || token === '') {return;}
        const {object} = this.props.activeObject
        if (!object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }
    renderDetailPicture(pic){
        if(pic){
            return (
                <div className="mb-2">
                    <label className="control-label">Картинка для анонса</label>
                    <div>
                        <img src={`${picDomain}${pic}`} style={{height:'150px'}}/>
                    </div>
                    {this.renderTempDetail()}
                </div>
            )
        }else{
            return (
                <div className="mb-2 mt-1">
                    Картинка для анонса не задана<br/>
                    Выберите её из фотоальбома
                    {this.renderTempDetail()}
                </div>
            )
        }
    }
    renderTempDetail(){
        const { user, activeObject, validateAndUpdateObject } = this.props
        if(user.group === 'admin'){
            const pics = activeObject.object.PROPS.MORE_PHOTO
            const tempAnnonce = activeObject.object.PROPS.TEMP_ANNONCE.VALUE
            return pics.map((pic) => {
                if(pic.id == tempAnnonce) {
                    return (
                        <div key='tempAnnonce' className="mt-2">
                            <div className="alert alert-warning">
                                <p>Пользователь хочет установить эту картинку в качестве анонса:</p>
                                <img src={`${picDomain}${pic.src}`} style={{height:'150px'}}/>
                                <button type='button' className="btn btn-md red"
                                        onClick={() => {
                                            validateAndUpdateObject({'PREVIEW_PICTURE': pic.fid})
                                        }}
                                >Сделать анонсом</button>
                                <button type='button' className="btn btn-md btn-warning"
                                        onClick={() => {
                                            let reason = window.prompt('Причина:','')
                                            if(reason){
                                                validateAndUpdateObject({'TEMP_ANNONCE': reason})
                                            }
                                        }}
                                >Отказать</button>
                            </div>
                        </div>
                    )
                }
            })

        }else{
            return <div/>
        }
    }
    renderPictures (pics){
        const { validateAndUpdateObject } = this.props
        if(pics){
            let picturesList = pics.map((pic) => {
                return ({content:(<div key={`${pic.id}_${pic.fid}`} style={{
                    backgroundImage:`url(${picDomain}${pic.src}`,
                    backgroundSize:'cover',
                    backgroundPosition:'50% 50%',
                    backgroundRepeat:'no-repeat',
                    width:'200px',
                    height:'150px',
                    display:'inline-block',
                    // overflow:'hidden',
                    marginRight:'10px',
                    marginBottom:'30px',
                    border: '1px solid #d6d6d6',
                    position: 'relative'
                }}>
                    <div className="text-center" style={buttonAnnonceStyles}>
                        <button type='button' className="btn btn-md red" onClick={() => {this.makeAnnonce(pic.id)}}>Сделать анонсом</button>
                    </div>
                    <span style={deleteButtonStyles} className="badge badge-danger" onClick={() => this.beginDeletePic(pic.id)} title="Удалить"><i className="fa fa-trash" aria-hidden="true"></i></span>
                </div>)})
            })
            return <div className="pt-2 pb-2" style={{overflow:'hidden'}}><DragSortableList items={picturesList} type="grid" placeholder={placeholder} onSort={this.onPicturesSort}/></div>
        }else {
            return <div></div>
        }
    }
    onPicturesSort (sortedList, dropEvent) {
        const { validateAndUpdateObject } = this.props
        let pictures = []
        for(let el in sortedList){
            pictures.push(sortedList[el].content.key)
        }
        validateAndUpdateObject({'pictures':pictures})
    }
    makeAnnonce(id){
        const {validateAndUpdateObject} = this.props
        if(window.confirm('Вы уверены, что хотите установить это фото для анонса?')){
            validateAndUpdateObject({'TEMP_ANNONCE': id})
            alert('Ваш запрос отправлен редактору');
        }
    }
    beginDeletePic (pic){
        this.setState({deletingPic:pic})
    }
    renderDeletePicModal(){
        const { deletingPic } = this.state
        const { MORE_PHOTO } = this.props.activeObject.object.PROPS
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
    deletePic(deletingPic){
        const { deletePhoto } = this.props
        this.setState({loading:true})
        deletePhoto(deletingPic).then(data=>{
            this.setState({
                deletingPic:false,
                loading:false
            })
        })

    }
    renderError(error) {
        if(error) {
            return <div className="alert alert-danger" dangerouslySetInnerHTML={{__html:error.message}}/>
        }
    }
    // cancelCourse = () => {
    //     this.photosFromRef.reset();
    // }
    uploadPhotos( e ){
        //console.log(e)
        // e.preventDefault();
        //const { fields } = this.props;
        // // convert files to an array
        // const files = [ ...e.target.files ];
        //fields.picture.handleChange(e);
        this.props.change(e)
        this.photoFormRefSubmit.click()

    }
    handlePicInputChange(e){
        const { uploadPhotos } = this.props
        this.setState({loading:true})
        uploadPhotos({picture: e})
            .then(data=>this.setState({loading:false}))
        this.photoFormRef.reset()
    }
    render() {
        const {uploadPhotos, validateAndUpdateObject, handleSubmit,change, submitting} = this.props
        const { object, loading, error } = this.props.activeObject;
        if(loading) {
            return <Loader loading={loading}/>
        }else if(object) {
            document.title = 'Фотографии ' + object.NAME
            if(object.PROPS && object.PROPS.MORE_PHOTO.length < maxPhotosCount){
                return (
                    <div className="container-fluid">
                        {this.renderError(error)}
                        <form onSubmit={ handleSubmit(uploadPhotos) } ref={(el) => this.photoFormRef = el}>
                            <div>
                            {this.renderDetailPicture(object.PREVIEW_PICTURE)}
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                <Field
                                    name='picture'
                                    component={renderFileInput}
                                    label='Фотоальбом'
                                    accept="image/*"
                                    onChange={this.handlePicInputChange}
                                />
                                </div>
                            </div>
                            <div className="photosCount mb-1">
                                Загружено <span className="photosCount__number">{object.PROPS && object.PROPS.MORE_PHOTO.length}</span> фото. Максимальное количество - <span className="photosCount__number">{maxPhotosCount}</span>
                            </div>
                            {this.renderPictures(object.PROPS && object.PROPS.MORE_PHOTO)}
                        </form>
                        <Loader loading={submitting || this.state.loading}/>
                        {this.renderDeletePicModal()}
                    </div>
                )
            }else{
                return (
                    <div className="container-fluid">

                        <form onSubmit={ handleSubmit(uploadPhotos) }>
                            <div>
                                {this.renderDetailPicture(object.PREVIEW_PICTURE)}
                            </div>
                            <div className="photosCount mb-1">
                                Загружено максимальное количество фото - <span className="photosCount__number">{maxPhotosCount}</span>
                            </div>
                            {this.renderPictures(object.PROPS && object.PROPS.MORE_PHOTO)}
                        </form>
                        {this.renderDeletePicModal()}
                    </div>
                )
            }
        }else{
            return <div/>
        }
    }
}

ObjectPhotos = reduxForm({
    form: 'ObjectPhotos', // a unique identifier for this form
    fields: [''],
    //validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(ObjectPhotos)

const selector = formValueSelector('ObjectPhotos') // <-- same as form name
ObjectPhotos = connect(state => {
    const picture = selector(state, 'picture')
    return {
        picture
    }
})(ObjectPhotos)

export default ObjectPhotos