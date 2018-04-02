import React, { Component } from 'react'
import PropTypes from  'prop-types'
//import { Link } from 'react-router-dom'
import Error from  '../utils/Error'
import Loader from '../utils/Loader'

class PageText extends Component {

    componentWillMount() {
        const { resetMe,fetchPageText, page } = this.props
        resetMe()
        if(!page) return;

        let token = localStorage.getItem('jwtToken');
        fetchPageText(page,token);
    }
    render() {
        const { page,pageText, loading, error } = this.props;
        if(loading) {
            return <Loader loading={true}/>
        } else if(error) {
            return <Error error={error}/>
        } else if(page) {
            return (
                <div id={page} className="card" ref={page}>
                    <div className="card-block" dangerouslySetInnerHTML={{__html:pageText.pageText}} />
                </div>
            )
        }else{
            return <div/>
        }

    }
}

PageText.propTypes = {
    page: PropTypes.string.isRequired
}

export default PageText;