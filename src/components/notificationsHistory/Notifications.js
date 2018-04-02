import React, {Component} from 'react'
class NotificationsHistory extends Component {

    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //  if (!token || token === '') {return;}
        const {notifications} = this.props;
        if (!notifications) {
            this.props.fetchNotifications(token);
        }
    }

    renderNotifications() {
        let {notifications} = this.props;
        if (!notifications) {
            return (
                <tbody>
                </tbody>
            );
        } else if (notifications.STATUS != 'OK') {
            return (
                <tbody>
                </tbody>
            );
        } else if (!notifications.RESULT || !notifications.RESULT.length) {
            return (
                <tbody>
                </tbody>
            );
        }
        notifications = notifications.RESULT;
        let rows = notifications.map((notification) => {
            const message = JSON.parse(notification.MESSAGE.replace(/#!NGINXNMS!#|#!NGINXNME!#/g,'').replace(/'/g,'"'))
            return (<tr key={`notification${notification.DATE_CREATE}`}>
                <td>{notification.DATE_CREATE}</td>
                <td>{message.data}</td>
            </tr>)
        });
        return (
            <tbody>
            {rows}
            </tbody>
        )
    }

    render() {
        document.title = 'Уведомления - Edem-v-Gosti.ru';
        return (
            <div className="container">
                <div className="pageTitle">
                    <h1>Уведомления</h1>
                </div>
                <hr/>
                <div className="card">
                    <table className="table table-hover grey lighten-4 mb-0">
                        <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Сообщение</th>
                        </tr>
                        </thead>
                        {this.renderNotifications()}
                    </table>
                </div>
            </div>
        )
    }
}
export default NotificationsHistory;