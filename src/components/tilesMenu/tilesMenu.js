import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';


class TilesMenu extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    render() {
        const {type, activeObject} = this.props
        if (type === 'object') {
            return (
                <div className='tiles'>
                    <Link to={`/lk/${activeObject && activeObject.ID}/main`}
                          className={`tiles__item${this.context.router.route.location.pathname === '/lk/' + ( activeObject && activeObject.ID ) + '/main' ? ' active' : ''}`}>
                        <i className="fa fa-pie-chart" aria-hidden="true"></i>
                        Основное
                    </Link>
                    <Link to={`/lk/${activeObject && activeObject.ID}`}
                          className={`tiles__item${this.context.router.route.location.pathname === '/lk/' + ( activeObject && activeObject.ID ) ? ' active' : ''}`}>
                        <i className="fa fa-sticky-note" aria-hidden="true"></i>
                        Рабочий стол
                    </Link>
                    <Link to={`/lk/${activeObject && activeObject.ID}/photo`}
                          className={`tiles__item${this.context.router.route.location.pathname === '/lk/' + ( activeObject && activeObject.ID ) + '/photo' ? ' active' : ''}`}>
                        <i className="fa fa-image" aria-hidden="true"></i>
                        Фотографии
                    </Link>
                    <Link to={`/lk/${activeObject && activeObject.ID}/services`}
                          className={`tiles__item${this.context.router.route.location.pathname === '/lk/' + ( activeObject && activeObject.ID ) + '/services' ? ' active' : ''}`}>
                        <i className="fa fa-hotel" aria-hidden="true"></i>
                        Услуги и удобства
                    </Link>
                    <Link to={`/lk/${activeObject && activeObject.ID}/actions`}
                          className={`tiles__item${this.context.router.route.location.pathname === '/lk/' + ( activeObject && activeObject.ID ) + '/actions' ? ' active' : ''}`}>
                        <i className="fa fa-gift" aria-hidden="true"></i>
                        Акции и скидки
                    </Link>
                    <Link to={`/lk/${activeObject && activeObject.ID}/children`}
                          className={`tiles__item${this.context.router.route.location.pathname === '/lk/' + ( activeObject && activeObject.ID ) + '/children' ? ' active' : ''}`}>
                        <i className="fa fa-street-view" aria-hidden="true"></i>
                        Дети
                    </Link>
                    <Link to={`/lk/${activeObject && activeObject.ID}/conditions`}
                          className={`tiles__item${this.context.router.route.location.pathname === '/lk/' + ( activeObject && activeObject.ID ) + '/conditions' ? ' active' : ''}`}>
                        <i className="fa fa-plug" aria-hidden="true"></i>
                        Условия, ограничения
                    </Link>
                    <Link to={`/lk/${activeObject && activeObject.ID}/how-to-get-here`}
                          className={`tiles__item${this.context.router.route.location.pathname === '/lk/' + ( activeObject && activeObject.ID ) + '/how-to-get-here' ? ' active' : ''}`}>
                        <i className="fa fa-plug" aria-hidden="true"></i>
                        Как добраться
                    </Link>

                </div>
            )
        } else {
            return <div/>
        }
    }
}
export default  TilesMenu