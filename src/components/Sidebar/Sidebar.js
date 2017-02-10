import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, FormControl } from 'react-bootstrap'
import './Sidebar.scss'

class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.fetchVenues = this.props.fetchVenues.bind(this)
    this.handleVenueChange = this.props.handleVenueChange.bind(this)
  }

  componentDidMount () {
    if (!this.props.venues.items.length) {
      this.fetchVenues()
    }

    if (this.props.router.location && this.props.router.location.query.venue_id) {
      this.handleVenueChange(this.props.router.location.query.venue_id)
    }
  }

  componentWillReceiveProps (newProps) {
    const { venue_id: venueId } = this.props.router.location.query
    const { newVenueId } = newProps.location.query
    if (newVenueId && venueId !== newVenueId) {
      this.handleVenueChange(newVenueId)
    }
  }

  render () {
    const { className = '', venues = { items:[] }, handleVenueChange } = this.props
    const venueItems = venues.items.map(item =>
      <option key={item._id} value={item._id}>
        {item.profile.name}
      </option>
    )

    const inventorySubItemsHidden = location.pathname.match(/^\/inventory/) ? '' : 'hidden'
    const ordersSubItemsHidden = location.pathname.match(/^\/orders/) ? '' : 'hidden'

    return (
      <div className={className + ' sidebar'}>
        <div className='venue-selector'>
          <FormControl
            componentClass='select'
            onChange={(event) => handleVenueChange(event.target.value)}
            value={venues.current || ''}>
            {venueItems}
          </FormControl>
        </div>
        <Nav>
          <LinkContainer to='/inventory' activeHref='active'>
            <NavItem>Inventory</NavItem>
          </LinkContainer>
          <LinkContainer to='/inventory/reports/live' activeHref='active'>
            <NavItem className={`sub inventory_sub ${inventorySubItemsHidden}`}>Live</NavItem>
          </LinkContainer>
          <LinkContainer to='/inventory/archive' activeHref='active'>
            <NavItem className={`sub inventory_sub ${inventorySubItemsHidden}`}>Archive</NavItem>
          </LinkContainer>
          <LinkContainer to='/orders' activeHref='active'>
            <NavItem>Orders</NavItem>
          </LinkContainer>
          <LinkContainer to='/orders/create' activeHref='active'>
            <NavItem className={`sub orders_sub ${ordersSubItemsHidden}`}>Create</NavItem>
          </LinkContainer>
          <LinkContainer to='/orders/archive' activeHref='active'>
            <NavItem className={`sub orders_sub ${ordersSubItemsHidden}`}>Archive</NavItem>
          </LinkContainer>
          <LinkContainer to='/products' activeHref='active'>
            <NavItem>Products</NavItem>
          </LinkContainer>
          <LinkContainer to='/venue' activeHref='active'>
            <NavItem>Venue</NavItem>
          </LinkContainer>
          <LinkContainer to='/suppliers' activeHref='active'>
            <NavItem>Suppliers</NavItem>
          </LinkContainer>
        </Nav>
      </div>
    )
  }
}

Sidebar.propTypes = {
  venues : React.PropTypes.object,
  fetchVenues: React.PropTypes.func.isRequired,
  handleVenueChange: React.PropTypes.func.isRequired,
  router: React.PropTypes.object,
  className: React.PropTypes.string
}
export default Sidebar
