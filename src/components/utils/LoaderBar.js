import React, { Component } from 'react';
import './st/LoaderBar.css'

class Loader extends Component {
    render() {
        const {loading} = this.props
        if(loading) {
            return (
                <div className="loaderBar white-text shadow">
                    <div className="progress elegant-color-dark">
                        <div className="indeterminate"/>
                    </div>
                    <div className="loaderBar__text">
                        Сохранение
                    </div>
                </div>
            );
        }else{
            return <div/>
        }
    }
}

export default Loader