import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from '../utils/Loader'
import Error from '../utils/Error'
import ObjectReview from './ObjectReview'
import ObjectBooking from '../booking/ObjectBookingContainer'

class ObjectMain extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        if (!token || token === '') {
            return;
        }
        const {object} = this.props.activeObject
        if (!object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }
    renderReviews(reviews){
        if(reviews && reviews.length && reviews.length > 0) {
            return reviews.map((review, i) => {
                if (i < 3) {
                    return <ObjectReview key={review.ID} review={review} />
                }
            })
        }else{
            return <div>Отзывов пока нет :,-(</div>
        }
    }

    render() {
        const {object, loading, error} = this.props.activeObject;
        if (loading) {
            return <Loader loading={true}/>
        } else if (error) {
            return <div className="alert alert-danger"><Error error={error}/></div>
        }
        if (object) {
            document.title = object.NAME.replace(/&quot;/g, '\"')
            return (
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-block">
                            <ObjectBooking objectId={object.ID} mode="light" limit="3"/>
                            <div className="mb-4">
                                <h4>Общий рейтинг объекта</h4>
                                <hr/>
                                <div className="card-data fontSize3" style={{overflow: 'hidden'}}>
                                    <div className="float-left">
                                                {object.RATING || 0}
                                    </div>
                                    <div className="orange-text float-left">
                                                <i className={`fa fa-star${object.RATING > 0 ?'':'-o'}`}> </i>
                                                <i className={`fa fa-star${object.RATING > 1 ?'':'-o'}`}> </i>
                                                <i className={`fa fa-star${object.RATING > 2 ?'':'-o'}`}> </i>
                                                <i className={`fa fa-star${object.RATING > 3 ?'':'-o'}`}> </i>
                                                <i className={`fa fa-star${object.RATING > 4 ?'':'-o'}`}> </i>
                                    </div>
                                </div>
                            </div>
                            <div>
                                        <h4>Последние отзывы</h4>
                                <hr />
                                        {this.renderReviews(object.reviews)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Loader loading={true}/>
        }
    }
}


export default ObjectMain;