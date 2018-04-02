import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import './st.css'

class Modal extends PureComponent {
    render() {
        const {onClose, show} = this.props
        // Render nothing if the "show" prop is false
        if (!show) {
            return null;
        }
        if (onClose) {
            return (
                <div className="backdrop">
                    <div className="modalDialog">
                        <div className="modalDialog__body">
                            {this.props.children}
                        </div>
                        <div className="modalDialog__footer">
                            <button className="btn btn-warning" onClick={this.props.onOk}>
                                {this.props.btnOkText || 'Ok'}
                            </button>
                            <button className="btn btn-info" onClick={this.props.onClose}>
                                {this.props.btnCloseText || 'X'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="backdrop">
                    <div className="modalDialog">
                        <div className="modalDialog__body">
                            {this.props.children}
                        </div>
                        <div className="modalDialog__footer">
                            <button className="btn btn-warning" onClick={this.props.onOk}>
                                {this.props.btnOkText || 'Ok'}
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

Modal.propTypes = {
    onClose: PropTypes.func,
    onOk: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node,
    btnOkText: PropTypes.string,
    btnCloseText: PropTypes.string
};

export default Modal;