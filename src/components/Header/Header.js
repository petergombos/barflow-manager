import React from 'react'
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import './Header.scss'

export const Header = ({ user, handleLogOut }) => (
  <Navbar collapseOnSelect fixedTop>
    <Navbar.Header>
      <Navbar.Brand>
        <IndexLinkContainer to='/'><a href='#'>BarFlow Manager</a></IndexLinkContainer>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    {user &&
    <Navbar.Collapse>
      <Nav pullRight>
        <NavDropdown eventKey={1} title={user.name} id='basic-nav-dropdown'>
          <LinkContainer to='/profile'><MenuItem eventKey={1.1}>Profile</MenuItem></LinkContainer>
          <MenuItem divider />
          <MenuItem eventKey={1.2} onSelect={handleLogOut}>Log out</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
    }
  </Navbar>
)

Header.propTypes = {
  user : React.PropTypes.object,
  handleLogOut: React.PropTypes.func.isRequired
}
export default Header
