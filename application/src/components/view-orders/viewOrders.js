import React, { Component } from 'react';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import { Link } from 'react-router-dom';
import './viewOrders.css';

class ViewOrders extends Component {
    state = {
        orders: []
    }

    componentDidMount() {
        fetch(`${SERVER_IP}/api/current-orders`)
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    this.setState({ orders: response.orders });
                } else {
                    console.log('Error getting orders');
                }
            });
    }

    deleteOrder(orderId) {
        fetch(`${SERVER_IP}/api/delete-order`, {
            method: 'POST',
            body: JSON.stringify({
                id: orderId,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                const orders = this.state.orders.filter(order => order.id !== orderId);
                this.setState({ orders })
            })
            .catch(error => console.error(error));
    }

    render() {
        return (
            <Template>
                <div className="container-fluid">
                    {this.state.orders.map(order => {
                        const createdDate = new Date(order.createdAt);
                        return (
                            <div className="row view-order-container" key={order._id}>
                                <div className="col-md-4 view-order-left-col p-3">
                                    <h2>{order.order_item}</h2>
                                    <p>Ordered by: {order.ordered_by || ''}</p>
                                </div>
                                <div className="col-md-4 d-flex view-order-middle-col">
                                    <p>Order placed at {`${createdDate.getHours()}:${createdDate.getMinutes()}:${createdDate.getSeconds()}`}</p>
                                    <p>Quantity: {order.quantity}</p>
                                </div>
                                <div className="col-md-4 view-order-right-col">
                                    <Link to={`/order/${order._id}`} className="btn btn-success">Edit</Link>
                                    <button className="btn btn-danger" onClick={() => this.deleteOrder(order._id)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Template>
        );
    }
}

export default ViewOrders;
