import React, { Component } from 'react'
import Header from '../components/header/HeaderContainer'
import Footer from '../components/footer/footer';
import {Link} from "react-router-dom";

class NotFound extends Component {
    render() {
        document.title = 'Страница не найдена'
        return (
            <div>
            <div>
                <Header />
                <main>
                    <div className="container text-center">
                        <div className="pageTitle red-text">
                            <h1><i className="fa fa-exclamation-triangle" aria-hidden="true"></i><br/>404</h1>
                        </div>
                        <h3>Нет такой страницы</h3>
                        <Link to="/lk/">Вернуться к списку объектов</Link>
                    </div>
                </main>
                <Footer/>
            </div>
            </div>
        )
    }
}


export default NotFound;