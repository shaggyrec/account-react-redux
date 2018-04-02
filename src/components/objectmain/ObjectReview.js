import React, { Component } from 'react'

class ObjectReview extends Component {
    render(){
        const { review } = this.props
        if(review) {
            return (
                <div className="messagePreview grey lighten-4 card-block">
                    <div className="card-data">
                        <ul className="d-flex justify-content-between">
                            <li><a
                                className="messagePreview__userName">{review.USER_NAME} {review.USER_LAST_NAME}</a>
                            </li>
                            <li>
                                <div className="orange-text">
                                    <i className={`fa fa-star`}> </i>
                                    <i className={`fa fa-star${review.RATING > 1 ? '' : '-o'}`}> </i>
                                    <i className={`fa fa-star${review.RATING > 2 ? '' : '-o'}`}> </i>
                                    <i className={`fa fa-star${review.RATING > 3 ? '' : '-o'}`}> </i>
                                    <i className={`fa fa-star${review.RATING > 4 ? '' : '-o'}`}> </i>
                                </div>
                            </li>
                            <li className="messagePreview__date"><i
                                className="fa fa-clock-o"></i> {review.DATE}
                            </li>
                        </ul>
                    </div>
                    <div className="messagePreview__text">
                        <div className="row">
                            <div className="col-sm-2">
                                <b>Плюсы:</b>
                            </div>
                            <div className="col-sm-10">
                                <p>{review.PLUS}</p>
                                <hr/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-2">
                                <b>Минусы:</b>
                            </div>
                            <div className="col-sm-10">
                                <p>{review.MINUS}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else {
            return <div/>
        }
    }
}
export default ObjectReview