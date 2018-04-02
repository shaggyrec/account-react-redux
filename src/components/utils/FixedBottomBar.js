import React, { Component } from 'react'
import './st/FixedBottomBar.css'

class FixedBottomBar extends Component {
    constructor(props) {
        super(props)
        this.handleScroll = this.handleScroll.bind(this)
        this.state = {
            fixed:'fixed'
        }
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll(e) {
        const { fixed } = this.state
        const scrolled = window.pageYOffset || document.documentElement.scrollTop
        const windowHeight = window.clientHeight ||document.documentElement.clientHeight
        const mainHeight = document.documentElement.querySelector('main').clientHeight
        const fixedBlockHeight = fixed ? 55 :0
        if(scrolled + windowHeight > mainHeight + fixedBlockHeight) {
            if (fixed){
                this.setState({
                    fixed: ''
                })
            }
        }else{
            if(!fixed) {
                this.setState({
                    fixed: 'fixed'
                })
            }
        }
    }
    render() {
        const { opacity, shadow } = this.props
        const styles = {
            background: `rgba(255,255,255,${opacity || .8})`
        }
        return (
            <div className={`FixedBottomBar${shadow ? ' shadow' : ''} ${this.state.fixed}`} style={styles}>
                {this.props.children}
            </div>
        )
    }
}
export default FixedBottomBar