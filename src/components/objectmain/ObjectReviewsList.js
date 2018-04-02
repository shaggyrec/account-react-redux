import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loader from '../utils/Loader'
import ObjectReview from './ObjectReview'
import Error from "../utils/Error";

class ObjectReviewsList extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //if (!token || token === '') {return;}
        const { object } = this.props.activeObject
        if( !object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }
    renderReviews(reviews){
        if(reviews && reviews.length && reviews.length > 0) {
            return reviews.map((review, i) => {
                return <ObjectReview key={review.ID} review={review} />
            })
        }else{
            return <div>Отзывов пока нет :,-(</div>
        }
    }
    render() {
        const {object, loading, error} = this.props.activeObject
        const {reviews} = this.props
        document.title = `Отзывы ${object && object.NAME}`
        if(reviews && reviews.length && reviews.length >0){
            return (
                <div>
                    <Error error={error}/>
                    <Loader loading={loading}/>
                    <h1>Отзывы:</h1>
                    {this.renderReviews(reviews)}
                </div>)
        }else{
            return <div>Отзывов пока нет :,-(</div>
        }
    }
}

export default ObjectReviewsList