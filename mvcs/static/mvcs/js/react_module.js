var ListItemForm = React.createClass({
  getInitialState: function() {
    return {itemName: "", itemQuantity: ""};
  },
  handleItemNameChange: function(event) {
    this.setState({itemName: event.target.value.trim()});
  },
  handleItemQuantityChange: function(event) {
    this.setState({itemQuantity: event.target.value.trim()});
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var name = this.state.itemName;
    var quantity = this.state.itemQuantity;

    if (!name) {
      console.error("name is required");
      return;
    }
    if (!quantity) {
      console.error("quantity is required");
      return;
    }
    if (/[^\d]+/.test(quantity)) {
      console.error("only whole numbers can be used for a quantity");
      return;
    }

    this.props.onListItemFormSubmit({name: name, quantity: quantity});
    this.setState({itemName: "", itemQuantity: ""});
  },
  render: function() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <div className="form-group">
            <label htmlFor="itemName">Item</label>
            <input
              type="text"
              className="form-control"
              id="itemName"
              placeholder="eggs"
              value={this.state.itemName}
              onChange={this.handleItemNameChange} />
        </div>
        <div className="form-group">
            <label htmlFor="itemQuantity">Quantity</label>
            <input
              type="text"
              className="form-control"
              id="itemQuantity"
              placeholder="12"
              value={this.state.itemQuantity}
              onChange={this.handleItemQuantityChange} />
        </div>
        <button type="submit" value="POST" className="btn btn-default" id="addItemBtn">Add</button>
      </form>
    );
  }
});

var ShoppingTable = React.createClass({
  render: function() {
    var listItemNodes = this.props.data.map(function(listItem) {
      return (
        <ShoppingListItem
          key={listItem.id}
          id={listItem.id}
          name={listItem.name}
          quantity={listItem.quantity}
          purchased={listItem.purchased}
          handleItemDelete={this.props.onListItemDelete}
          handlePurchasedToggle={this.props.onPurchasedToggle}></ShoppingListItem>
      );
    }, this);
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Purchased?</th>
            <th>Item</th>
            <th>Quantity</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>
          <tbody className="table-body">
            {listItemNodes}
          </tbody>
      </table>
    );
  }
});

var ShoppingListItem = React.createClass({
  getInitialState: function() {
    return {isChecked: false};
  },
  componentDidMount: function() {
    this.setState({isChecked: this.props.purchased});
  },
  togglePurchased: function(event) {
    this.setState({isChecked: !this.state.isChecked});
    this.props.handlePurchasedToggle({id: this.props.id, purchased: !this.state.isChecked});
  },
  deleteItem: function() {
    this.props.handleItemDelete({id: this.props.id});
  },
  render: function() {
    return (
      <tr className="table-item">
        <td><input
              type="checkbox"
              className="item-purchase"
              checked={this.state.isChecked}
              onChange={this.togglePurchased} />
        </td>
        <td>{this.props.name}</td>
        <td>{this.props.quantity}</td>
        <td className="item-delete" onClick={this.deleteItem}>X</td>
      </tr>
    );
  }
});

var ShoppingListContainer = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadListItemsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      cache: false,
      success: function(data) {
        this.setState({data: data.items});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadListItemsFromServer();
    // Optionally poll for updates on the server
    // setInterval(this.loadListItemsFromServer, this.props.pollInterval);
  },
  getCsrfToken: function() {
    var cookieName = 'csrftoken';
    var cookieValue = null;

    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");

      for (var i=0; i<cookies.length; i++) {
        var cookie = cookies[i].trim();

        if (cookie.substring(0, cookieName.length + 1) === (cookieName + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(cookieName.length + 1));
          break;
        }
      }
    }

    return cookieValue;
  },
  handleFormSubmit: function(item) {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      type: "POST",
      headers: {'X-CSRFToken': this.getCsrfToken()},
      data: item,
      success: function(data) {
        this.setState({data: data.items});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleListItemDelete: function(item) {
    $.ajax({
      url: this.props.url.concat(item.id),
      dataType: "json",
      type: "DELETE",
      headers: {"X-CSRFToken": this.getCsrfToken()},
      success: function(data) {
        this.setState({data: data.items});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handlePurchasedToggle: function(item) {
    var id = item.id;
    var purchased = item.purchased;
    $.ajax({
      url: this.props.url,
      dataType: "json",
      type: "PUT",
      headers: {"X-CSRFToken": this.getCsrfToken()},
      data: JSON.stringify(item),
      success: function(data) {
        this.setState({data: data.items});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <div className="row errors">
          <div className="col-xs-12">
              <div className="error-msg-container"></div>
          </div>
        </div>
        <div className="row form">
          <div className="col-xs-12">
              <div className="form-container" id="form-container">
                <ListItemForm onListItemFormSubmit={this.handleFormSubmit} />
              </div>
          </div>
        </div>
        <div className="row table-list">
          <div className="col-xs-12">
              <div className="table-container table-responsive" id="table-container">
                <ShoppingTable data={this.state.data} onListItemDelete={this.handleListItemDelete} onPurchasedToggle={this.handlePurchasedToggle}/>
              </div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <ShoppingListContainer url="/items/" pollInterval={2000} />,
  document.getElementById("shopping-list-container")
);
