import React, {Component} from 'react'

class SubmitButton extends Component{
    render() {
        const {submitting, disabled , children} = this.props
        if (submitting) {
            return (
                <button className="btn btn-success" type="submit" disabled={true}>
                    Сохраняю...
                </button>
            )
        } else if (disabled){
            return (
                <button className="btn grey" type="submit" disabled={true}>
                    Проверьте поля формы
                </button>
            )
        } else {
            return (
                <button className="btn red" type="submit">
                    {children || 'Применить'}
                </button>
            )
        }

    }
}

export default SubmitButton