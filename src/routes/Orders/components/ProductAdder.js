import React, { Component } from 'react'
import { Modal, Alert, Button, Panel, Pagination } from 'react-bootstrap'
import { Link } from 'react-router'

import ListItem from './ProductAdderListItem'
import SearchBar from '../../../containers/SearchBarContainer'
import { filterProductItems } from '../../Products/modules/products'

import './productAdder.scss'

class ProductAdder extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      filters: {},
      skip: 0,
      isConfirmDialogOpen: false
    }
    this.state = this.initialState

    this._handleSearchBarChange = this._handleSearchBarChange.bind(this)
    this._handlePaginationSelect = this._handlePaginationSelect.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
    this._addToCart = this._addToCart.bind(this)
  }

  _addToCart (item) {
    this.props.addCartItems(item)
  }

  _toggleConfirmDialog () {
    this.setState({
      isConfirmDialogOpen: !this.state.isConfirmDialogOpen
    })
  }

  _handleSearchBarChange (filters) {
    this.setState({
      filters,
      skip: 0
    })
  }

  _handlePaginationSelect (page) {
    this.setState({
      skip: (20 * (page - 1))
    })
    window.scrollTo(0, 0)
  }

  render () {
    const { products } = this.props
    const filteredItems = [...filterProductItems(products, this.state.filters)]

    const batchAddConfirmDialog = <Modal show={this.state.isConfirmDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='add-confirm-dialog'>
      <Modal.Header closeButton><Modal.Title>Confirm</Modal.Title></Modal.Header>
      <Modal.Body>Are you sure that you want to add all {filteredItems.length} products to this section?</Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={() => {
          this._addToCart(filteredItems)
          this._toggleConfirmDialog()
        }}>Yes</Button>
      </Modal.Footer>
    </Modal>

    return <Panel className='orders-create-product-adder'>
      {batchAddConfirmDialog}
      <div>
        <SearchBar
          filters={this.state.filters}
          onChange={this._handleSearchBarChange} />
      </div>
      <div>
        {filteredItems.length ? (
          <div className='items'>

            {filteredItems.length > 1 &&
            <div className='row add-low-pars'>
              <div className='col-xs-12 col-sm-9'>
                There are <span>{filteredItems.length}</span> products found,
                you can add them to this section all at once using this button.
              </div>
              <div className='col-xs-12 col-sm-3 text-right'>
                <Button onClick={this._toggleConfirmDialog}>
                  Add {filteredItems.length} Items
                </Button>
                {batchAddConfirmDialog}
              </div>
            </div>
            }

            {filteredItems.map(item =>
              <ListItem
                key={item._id}
                item={item}
                onSelect={this._addToCart} />
            ).splice(this.state.skip, 20)}

            {filteredItems.length > 20 &&
            <div className='pagination-container text-center'>
              <Pagination ellipsis boundaryLinks
                items={Math.ceil(filteredItems.length / 20)}
                maxButtons={5}
                activePage={(this.state.skip / 20) + 1}
                onSelect={this._handlePaginationSelect} />
            </div>
            }
          </div>
        ) : (
          products.isFetching ? (
            <Alert bsStyle='warning'>Loading...</Alert>
          ) : (
            <Alert bsStyle='warning'>
              No items found. You can easily add missing products to you venue <Link to='/products'>here</Link>.
            </Alert>
          )
        )}
      </div>
    </Panel>
  }
}

ProductAdder.propTypes = {
  addCartItems: React.PropTypes.func.isRequired,
  updateCartItem: React.PropTypes.func.isRequired,
  products: React.PropTypes.array
}

export default ProductAdder