import React from 'react';
import {Component, PureComponent} from 'react';
import ObjectIndex from '../../pages/ObjectIndex'
import Index from  '../../pages/Index'
import ObjectNew from  '../../pages/ObjectNew'
import ObjectDescription from  '../../pages/ObjectDescription'
import ObjectBasic from  '../../pages/ObjectBasic'
import ObjectPhotosPage from  '../../pages/ObjectPhotosPage'
import ObjectServicesPage from '../../pages/ObjectServicesPage'
import ObjectActionsPage from '../../pages/ObjectActionsPage'
import ObjectChildrenPage from '../../pages/ObjectChildrenPage'
import ObjectConditionsPage from '../../pages/ObjectConditionsPage'
import ObjectContactsPage from '../../pages/ObjectContactsPage'
import ObjectHowToGetHerePage from '../../pages/ObjectHowToGetHerePage'
import ObjectDistancesPage from '../../pages/ObjectDistancesPage'
import ObjectBookingPage from '../../pages/ObjectBookingPage'
import RoomsListPage from '../../pages/RoomsListPage'
import RoomsNew from '../../pages/RoomsNew'
import RoomsEdit from '../../pages/RoomsEdit'
import {Route, Switch, Redirect} from 'react-router-dom'
import SignIn from '../../pages/SignIn'
import SignUp from '../../pages/SignUp'
import RoomsCalendarPage from '../../pages/RoomsCalendarPage'
import FaqPage from '../../pages/FaqPage'
import InvoicesPage from  '../../pages/InvoicesPage'
import NotFound from '../../pages/NotFound'
import ObjectReviewsPage from '../../pages/ObjectReviewsPage'
import FeedbackPage from '../../pages/FeedbackPage'
import ContractPage from '../../pages/ContractPage'
import ContractsListPage from '../../pages/ContractsListPage'
import NotificationsHistoryPage from '../../pages/NotificationsHistoryPage'
import Notifications from '../notifications'
import ProfilePage from "../../pages/ProfilePage";
import SecurityPage from '../../pages/SecurityPage'
import SubordinatePage from '../../pages/SubordinatePage'


const PrivateRoute = ({component: Component, authenticatedUser, ...rest}) => (
    <Route {...rest} render={props => (
        authenticatedUser ? (
            <div>
                <Component {...props}/>
                <Notifications />
            </div>
        ) : (
            <Redirect to={{
                pathname: '/lk/login',
                state: {from: props.location.hash ? props.location.pathname + props.location.hash : props.location.pathname}
            }}/>
        )
    )}/>
)

export default class App extends PureComponent {
    componentWillMount() {
        this.props.loadUserFromToken();
    }

    render() {
        const {authenticatedUser} = this.props;

        return (
            <Switch>
                <PrivateRoute exact path="/lk/" component={Index} authenticatedUser={authenticatedUser}/>
                <Route path="/lk/login" component={SignIn}/>
                <Route exact path="/lk/registration" component={SignUp}/>
                <PrivateRoute exact path='/lk/faq' component={FaqPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/feedback' component={FeedbackPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/invoices' component={InvoicesPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path="/lk/new/object" component={ObjectNew} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path="/lk/notifications" component={NotificationsHistoryPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path="/lk/:id(\d+)" component={ObjectIndex} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path="/lk/:id/desc" component={ObjectDescription} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path="/lk/:id/main" component={ObjectBasic} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:id/photo' component={ObjectPhotosPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:id/services' component={ObjectServicesPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:id/actions' component={ObjectActionsPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:id/children' component={ObjectChildrenPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:id/conditions' component={ObjectConditionsPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:id/contacts' component={ObjectContactsPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:id/how-to-get-here' component={ObjectHowToGetHerePage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:id/distances' component={ObjectDistancesPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:object/rooms' component={RoomsListPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:object/reviews' component={ObjectReviewsPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:object/booking' component={ObjectBookingPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:object/rooms/new' component={RoomsNew} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:object/rooms/calendar' component={RoomsCalendarPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute exact path='/lk/:object/rooms/:id' component={RoomsEdit} authenticatedUser={authenticatedUser}/>
                <PrivateRoute path='/lk/:object/contract' component={ContractPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute path='/lk/contracts' component={ContractsListPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute path='/lk/profile' component={ProfilePage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute path='/lk/security' component={SecurityPage} authenticatedUser={authenticatedUser}/>
                <PrivateRoute path='/lk/subordinate' component={SubordinatePage} authenticatedUser={authenticatedUser}/>
                <Route path="*" component={NotFound} />
            </Switch>
        );
    }
}
