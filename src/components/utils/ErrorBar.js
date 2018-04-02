import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './st/ErrorBar.css'

class ErrorBar extends Component {
    constructor(props){
        super(props)
        this.state = {
            isShow: false
        }
        this.handleClose = this.handleClose.bind(this)
    }
    // static contextTypes = {
    //     router: PropTypes.object
    // };
    componentWillMount(){
        this.showBar(this.props)
    }
    componentWillUpdate(nextProps) {
        this.showBar(nextProps)
    }
    showBar(props){
        const {error} = props
        if(error && error.message && !this.state.isShow){
            this.setState({isShow:true})
        }
    }
    handleClose(){
        this.setState({isShow:false})
    }

    render() {
        const { isShow } = this.state
        const { error } = this.props
        if(isShow) {
            return (
                <div className="errorBar red white-text">
                    <span dangerouslySetInnerHTML={{__html: error.message}}/>
                    <i className="fa fa-close errorBar__close" aria-hidden="true" onClick={this.handleClose}/>
                </div>
            )
        }else{
            return <div/>
        }
    }
}

// ErrorBar.propTypes = {
//     error: PropTypes.object.isRequired
// }

export default ErrorBar