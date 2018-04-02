import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {DebounceInput} from 'react-debounce-input'

var timeId

class SearchInput extends PureComponent {
    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props)
        const term = decodeURI(window.location.hash).slice(1)
        this.state = {
            term:term || ''
        }

        this.onInputChange = this.onInputChange.bind(this)
        this.moveCaretAtEnd = this.moveCaretAtEnd.bind(this)
    }

    moveCaretAtEnd(e) {
        const tempValue = e.target.value
        e.target.value = ''
        e.target.value = tempValue
    }

    onInputChange(e){
        const newSearch = e.target.value
        clearTimeout(timeId)
        if(newSearch.length > 2) {
            timeId = setTimeout(() => {
                const {onchange} = this.props
                window.location.hash = newSearch
                onchange(newSearch)
            }, 300)
        }
    }
    render() {
        const {onchange, label } = this.props
        return (
            <div className="md-form">
                <DebounceInput className="form-control" id="searchObject" type="text"  value={ this.state.term } autoFocus={true} onFocus={this.moveCaretAtEnd} onChange={this.onInputChange}/>
                <label className={`control-label${this.state.term ? ' active':''}`} htmlFor="searchObject">{label}</label>
            </div>
        )
    }
}

export default SearchInput