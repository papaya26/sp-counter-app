import React, { Component } from 'react';

import './App.css';

class App extends Component {

  state = {
    items: [],
    newItem: '',
    counters: `http://${window.location.host}/api/v1/counters`,
    counter: `http://${window.location.host}/api/v1/counter`,
  };

  componentWillMount() {
    this.updateItems(this.state.counters);
  }

  updateItems(url, opt) {
    fetch(url, { ... { headers: { 'Content-Type': 'application/json' } }, ...opt })
      .then(res => res.json())
      .then(json => this.setState({ items: [...json] }));
  }

  render() {
    return (
      <div className="d-flex flex-column p-3">
        <h1>My Simple Counter Application</h1>
        <br />

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add new item"
            value={this.state.newItem}
            onChange={this.onAddNewItemChange.bind(this)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.onAddNewItem.bind(this)}>
              Add
            </button>
          </div>
        </div>
        {this.getNewItemError()}
        <br />

        <hr />

        <h3>My Items</h3>
        {this.getItems()}
        <br />

        <hr />

        <h3 className="text-right">Total: {this.getItemsTotal()}</h3>

      </div>
    );
  }

  setNewItem(value = '') {
    this.setState({ newItem: value });
  }

  setNewItemError(value = '') {
    this.setState({ newItemError: value });
  }

  getNewItemError() {
    const { newItemError } = this.state;
    return newItemError ?
      (
        <div className="d-flex flex-row error-msg">
          <p>{newItemError}</p>
        </div>
      )
      : '';
  }

  onAddNewItemChange(e) {
    this.setNewItem(e.target.value);
  }

  onAddNewItem(e) {
    if (this.state.newItem) {
      if (this.state.items.filter(i => i.title === this.state.newItem).length) {
        this.setNewItemError('Item already exists');
        return;
      }
      this.setNewItemError();
      this.updateItems(this.state.counter, { method: 'POST', body: JSON.stringify({ title: this.state.newItem }) });
      this.setNewItem();
    }
  }

  onMyItemDelete(id, e) {
    this.updateItems(this.state.counter, { method: 'DELETE', body: JSON.stringify({ id: id }) });
  }

  onMyItemChange(item, action, e) {
    if (action === 'dec' && item.count === 0) {
      return;
    }
    this.updateItems(`${this.state.counter}/${action}`, { method: 'POST', body: JSON.stringify({ id: item.id }) });
  }

  getItems() {
    const { items } = this.state;
    return items.length ?
      items.map(i => {
        return (
          <div
            className="d-flex flex-row align-items-center my-item my-3"
            key={i.id}
          >
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.onMyItemDelete.bind(this, i.id)}>
              X
            </button>

            <h4 className="my-item__label">{i.title}</h4>

            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.onMyItemChange.bind(this, i, 'dec')}>
              -
            </button>

            <h4 className="my-item_counter text-center">{i.count}</h4>

            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.onMyItemChange.bind(this, i, 'inc')}>
              +
            </button>
          </div>
        );
      })
      : <p>No items added yet..</p>;
  }

  getItemsTotal() {
    const { items } = this.state;
    return items.map(i => i.count).reduce((a, b) => { return a + b }, 0);
  }
}

export default App;
