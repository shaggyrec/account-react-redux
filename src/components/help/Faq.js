import React, { Component } from 'react'
import PropTypes from  'prop-types'
import { Link } from 'react-router-dom'
import Error from  '../utils/Error'
import Loader from '../utils/Loader'

class Faq extends Component {

    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //if (!token || token === '') {return;}
        this.props.fetchQuestions(token);
    }

    componentWillUpdate(nextProps, nextState){
        // if(nextProps.questions.questions.length === 1) {
        //     this.context.router.history.push(nextProps.questions.questions[0].ID.toString())
        // }
    }
    renderQuestions(questions) {
        if(questions) {
            //let result = []
            return questions.map((question) => {
                return (
                    <div key={question.ID} className="list-group-item list-group-item-action flex-column align-items-start">
                        <a href={`#q${question.ID}`} data-toggle="collapse" style={{width:'100%'}}><h4 className="list-group-item-heading"><i className="fa fa-arrow-right" aria-hidden="true"></i> <span dangerouslySetInnerHTML={{__html:question.NAME}}/></h4></a>
                        <div id={`q${question.ID}`} className="collapse" dangerouslySetInnerHTML={{__html:question.DETAIL_TEXT}}/>
                    </div>
                )
            })
            //return result
        }
    }

    renderQuestionsCats(questions) {
        if(questions) {
            let result = []
            for(let question in questions) {
                question = questions[question]
                result.push(
                    <div key={question.ID} className="list-group-item list-group-item-action flex-column align-items-start">
                        <a href={`#q${question.ID}`} data-toggle="collapse" style={{width:'100%'}}>
                            <h3 className="list-group-item-heading"><i className="fa fa-arrow-right" aria-hidden="true"></i> {question.NAME}</h3>
                        </a>
                        <div id={`q${question.ID}`} className="collapse" style={{width:'100%'}}>
                            {this.renderQuestionsCats(question.s)}
                            {this.renderQuestions(question.q)}
                        </div>
                    </div>
                )
            }
            return result
        }
    }

    render() {
        const { questions, loading, error } = this.props.questions;
        document.title = 'Помощь'
        if(loading) {
            return <Loader loading={true}/>
        } else if(error) {
            return <Error error={error}/>
        } else {
            return (
                <div className="container">
                    <div className="pageTitle"><h1>Частые вопросы</h1></div>
                    {this.renderQuestionsCats(questions)}
                </div>
            );
        }
    }
}


export default Faq;