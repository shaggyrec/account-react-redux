import React, {Component} from 'react'
class BookingTable extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //  if (!token || token === '') {return;}
        const {object} = this.props;
        if (!object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }

    render() {
        return (
            <div className="row">
                <h4 className="col-sm-12">Заявки на бронирование</h4>
                <div className="card col-sm-5 mr-2 ml-2 mb-2">
                    <div className="card-block col-sm-12">
                        <div className="mb-1">
                            <div className="row">
                                <h4 className="col-sm-6">#1 Люкс</h4> <span
                                className="col-sm-6 text-right">16.01.2018</span>
                            </div>
                            <hr/>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Контактные данные</strong>
                                <span className="col-sm-3 text-left">Ф.И.О</span>
                                <span className="col-sm-9 text-right">Белоусов Сергей Владимирович</span>
                                <span className="col-sm-6 text-left">Номер телефона</span>
                                <span className="col-sm-6 text-right">+7 918 124-38-23</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Желаемая дата заселения</strong>
                                <span className="col-sm-6 text-left">16.01.2018 - 20.02.2018</span>
                                <span className="col-sm-6 text-right">4 ночи</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Количество</strong>
                                <span className="col-sm-4">3 гостя: </span>
                                <span className="col-sm-4"><i className="fa fa-user" aria-hidden="true"></i> 2 взрослых </span>
                                <span className="col-sm-4"><i className="fa fa-child" aria-hidden="true"></i> 1 ребенок </span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12"><i className="fa fa-square-o fa-lg"
                                                                 aria-hidden="true"></i>Трансфер</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card col-sm-5 mr-2 ml-2 mb-2">
                    <div className="card-block col-sm-12">
                        <div className="mb-1">
                            <div className="row">
                                <h4 className="col-sm-6">#34 Эконом</h4> <span className="col-sm-6 text-right">16.01.2018</span>
                            </div>
                            <hr/>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Контактные данные</strong>
                                <span className="col-sm-4 text-left">Ф.И.О</span>
                                <span className="col-sm-8 text-right">Тиль Швайгер</span>
                                <span className="col-sm-6 text-left">Номер телефона</span>
                                <span className="col-sm-6 text-right">+7 918 124-38-23</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Желаемая дата заселения</strong>
                                <span className="col-sm-6 text-left">16.01.2018 - 20.02.2018</span>
                                <span className="col-sm-6 text-right">4 ночи</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Количество</strong>
                                <span className="col-sm-4">3 гостя: </span>
                                <span className="col-sm-4"><i className="fa fa-user" aria-hidden="true"></i> 2 взрослых </span>
                                <span className="col-sm-4"><i className="fa fa-child" aria-hidden="true"></i> 1 ребенок </span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12"><i className="fa fa-check-square-o fa-lg"
                                                                 aria-hidden="true"></i>Трансфер</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card col-sm-5 mr-2 ml-2 mb-2">
                    <div className="card-block col-sm-12">
                        <div className="mb-1">
                            <div className="row">
                                <h4 className="col-sm-6">#1 Люкс</h4> <span
                                className="col-sm-6 text-right">16.01.2018</span>
                            </div>
                            <hr/>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Контактные данные</strong>
                                <span className="col-sm-4 text-left">Ф.И.О</span>
                                <span className="col-sm-8 text-right">Белоусова Лариса Леонидовна</span>
                                <span className="col-sm-6 text-left">Номер телефона</span>
                                <span className="col-sm-6 text-right">+7 918 124-38-23</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Желаемая дата заселения</strong>
                                <span className="col-sm-6 text-left">16.01.2018 - 20.02.2018</span>
                                <span className="col-sm-6 text-right">4 ночи</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Количество</strong>
                                <span className="col-sm-4">3 гостя: </span>
                                <span className="col-sm-4"><i className="fa fa-user" aria-hidden="true"></i> 2 взрослых </span>
                                <span className="col-sm-4"><i className="fa fa-child" aria-hidden="true"></i> 1 ребенок </span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12"><i className="fa fa-square-o fa-lg"
                                                                 aria-hidden="true"></i>Трансфер</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card col-sm-5 mr-2 ml-2 mb-2">
                    <div className="card-block col-sm-12">
                        <div className="mb-1">
                            <div className="row">
                                <h4 className="col-sm-6">#1 Люкс</h4> <span
                                className="col-sm-6 text-right">16.01.2018</span>
                            </div>
                            <hr/>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Контактные данные</strong>
                                <span className="col-sm-4 text-left">Ф.И.О</span>
                                <span className="col-sm-8 text-right">Арни Шварцнеггер</span>
                                <span className="col-sm-6 text-left">Номер телефона</span>
                                <span className="col-sm-6 text-right">+7 918 124-38-23</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Желаемая дата заселения</strong>
                                <span className="col-sm-6 text-left">16.01.2018 - 20.02.2018</span>
                                <span className="col-sm-6 text-right">4 ночи</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Количество</strong>
                                <span className="col-sm-4">3 гостя: </span>
                                <span className="col-sm-4"><i className="fa fa-user" aria-hidden="true"></i> 2 взрослых </span>
                                <span className="col-sm-4"><i className="fa fa-child" aria-hidden="true"></i> 1 ребенок </span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12"><i className="fa fa-square-o fa-lg"
                                                                 aria-hidden="true"></i>Трансфер</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card col-sm-5 mr-2 ml-2 mb-2">
                    <div className="card-block col-sm-12">
                        <div className="mb-1">
                            <div className="row">
                                <h4 className="col-sm-6">#1 Люкс</h4> <span
                                className="col-sm-6 text-right">16.01.2018</span>
                            </div>
                            <hr/>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Контактные данные</strong>
                                <span className="col-sm-4 text-left">Ф.И.О</span>
                                <span className="col-sm-8 text-right">Джеки Чан</span>
                                <span className="col-sm-6 text-left">Номер телефона</span>
                                <span className="col-sm-6 text-right">+7 918 124-38-23</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Желаемая дата заселения</strong>
                                <span className="col-sm-6 text-left">16.01.2018 - 20.02.2018</span>
                                <span className="col-sm-6 text-right">4 ночи</span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12">Количество</strong>
                                <span className="col-sm-4">3 гостя: </span>
                                <span className="col-sm-4"><i className="fa fa-user" aria-hidden="true"></i> 2 взрослых </span>
                                <span className="col-sm-4"><i className="fa fa-child" aria-hidden="true"></i> 1 ребенок </span>
                            </div>
                            <div className="row mt-1">
                                <strong className="col-sm-12"><i className="fa fa-square-o fa-lg"
                                                                 aria-hidden="true"></i>Трансфер</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BookingTable;