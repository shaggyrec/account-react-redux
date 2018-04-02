import React, {Component, PureComponent} from 'react'
import PropTypes from  'prop-types'
import {Link} from 'react-router-dom'
import Error from  '../utils/Error'
import Loader from '../utils/Loader'
import SearchInput from '../utils/SearchInput'

class InvoicesList extends PureComponent {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props){
        super(props)

        this.goToInvoice = this.goToInvoice.bind(this)
    }
    componentWillMount() {
        this.props.fetchInvoices()
    }
    renderInvoices(invoices) {
        if(invoices && typeof(invoices) == 'object' && invoices.length > 0){
            return (<table className="table table-hover">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Описание</th>
                    <th>Дата</th>
                    <th>Ссылка</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                    {this.renderInvoicesBody(invoices)}
                </tbody>
                </table>
            )
        }else{
            return <div>Cчетов нет</div>
        }
    }

    renderInvoicesBody(invoices){
        if(invoices){
            return invoices.map(invoice => {
                const className = invoice['STATUS_ID'] == 'D' || invoice['STATUS_ID'] ==  'E' || invoice['STATUS_ID'] ==  'T'? 'table-danger' : ''
                return(
                    <tr key={invoice['ID']} className={className}>
                        <th scope="row">{invoice['ACCOUNT_NUMBER']}</th>
                        <td>
                            {invoice['ORDER_TOPIC']}
                            <table className="table table-bordered transparent" style={{lineHeight: 1}}>
                                {this.renderProducts(invoice['PRODUCT_ROWS'])}
                            </table>
                        </td>
                        <td>{invoice['DATE_BILL']}</td>
                        <td>{this.renderInvoiceExtranetLink(invoice)}</td>
                        <td>{invoice['PRICE']} {invoice['CURRENCY']}</td>
                        <td>{invoice['STATUS_TEXT']}</td>
                    </tr>
                )
            })
        }else{
            return <tr/>
        }
    }
    renderProducts(products){
        return products.map(p =>(
            <tr key={p.ID} className="d-flex"><td>{p.PRODUCT_NAME}</td><td>{p.PRICE}</td></tr>
        ))
    }
    renderInvoiceExtranetLink(invoice){
        if(invoice['LINK']){
            return <a href={invoice['LINK']} target="_blank">Посмотреть счёт</a>
        }else {
            return <button className="btn btn-sm btn-warning" onClick={e => this.goToInvoice(invoice['ID'])}>Получить ссылку</button>
        }
    }
    goToInvoice(id){
        this.props.fetchInvoiceLink(id)
    }
    render() {
        const {invoices, loading, error } = this.props.invoices
        document.title = 'Счета';
        if (loading) {
            return <Loader loading={true}/>
        } else if (error) {
            return <Error error={error}/>
        } else {
            return (
                <div className="container-fluid">
                    <div className="pageTitle"><h1>Счета</h1></div>
                    <div>{this.renderInvoices(invoices)}</div>
                </div>
            );
        }
    }
}


export default InvoicesList;