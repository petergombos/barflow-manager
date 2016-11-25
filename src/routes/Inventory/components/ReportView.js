import React, { Component } from 'react'
import { Button, Alert, Pagination } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import SearchBar from '../../../components/SearchBar'
import ProductListItem from './ProductListItem'

import './ReportView.scss'

class Report extends Component {
  constructor (props) {
    super(props)
    this._updateReportFilterAndURI = this._updateReportFilterAndURI.bind(this)
    this.handlePaginationSelect = this.handlePaginationSelect.bind(this)
  }

  componentDidMount () {
    const {
      venueId, reports, changeReportFilters, fetchReport, suppliers, fetchSuppliers, types, fetchTypes, location, params
    } = this.props

    // Fetch reports if there is new venueId or no reports in store yet
    if ((venueId && !reports.items.length) || (venueId && venueId !== reports.filters.venue_id)) {
      fetchReport({ venueId, rid: params.id })
    }

    // Fetch suppliers if needed
    if (
      (!suppliers.items.length && !suppliers.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && suppliers.items.length && venueId !== suppliers.items[0].venue_id)
    ) {
      fetchSuppliers(venueId)
    }

    // Fetch types if they are not in store yet
    if (!types.items.length) {
      fetchTypes()
    }

    // Load current filters from URI
    changeReportFilters({
      venue_id: venueId,
      ...location.query
    })
  }

  componentWillUnmount () {
    // Flush filters when unmount
    this.props.changeReportFilters({ venue_id: this.props.venueId })
  }

  componentWillReceiveProps (nextProps) {
    const {
      venueId, changeReportFilters, fetchReport, fetchSuppliers, location
    } = this.props
    if (venueId !== nextProps.venueId) {
      // Only fetch new reports for new venue_id
      fetchReport({ venueId: nextProps.venueId, rid: nextProps.params.id })

      // Fetch new suppliers
      fetchSuppliers(nextProps.venueId)
    }

    if (venueId && venueId !== nextProps.venueId) {
      // Update venue_id in URI if it has changed
      this._updateReportFilterAndURI({ venue_id: nextProps.venueId })
    }

    // Update filters when URI has changed from outside of the component
    if (nextProps.location.action === 'PUSH' && location.search !== nextProps.location.search) {
      changeReportFilters({
        ...nextProps.location.query,
        venue_id: nextProps.venueId
      })
    }

    // Scroll to top if search is emptyed (left hand menubar link click)
    if (location.key !== nextProps.location.key && !nextProps.location.search) {
      window.scrollTo(0, 0)
    }
  }

  _updateReportFilterAndURI (filters) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.props.router.replace({
        pathname: this.props.location.pathname,
        query: filters
      })
    }, 500)

    this.props.changeReportFilters(filters)
  }

  handlePaginationSelect (page) {
    const { reports } = this.props
    const filters = {
      ...reports.filters,
      skip: (reports.filters.limit * (page - 1))
    }
    this._updateReportFilterAndURI(filters)
    window.scrollTo(0, 0)
  }

  render () {
    const {
      reports, types, venueId, createReport, fetchReport
    } = this.props
    const rid = this.props.params.id

    const ProductList = reports.filteredItems.map(item =>
      <ProductListItem
        key={item._id}
        item={item} />
    ).splice(reports.filters.skip, reports.filters.limit)

    return (
      <div className='row'>
        <SubHeader
          className='bg-blue'
          left={<h3>Inventory</h3>}
          right={
            <div>
              <Button onClick={() => fetchReport({ venueId, rid })} disabled={!venueId}>Refresh</Button>
              <Button onClick={() => createReport({ venue_id: venueId })} disabled={!venueId}>Save Report</Button>
            </div>
          } />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 report'>

          <SearchBar
            filters={reports.filters}
            onChange={this._updateReportFilterAndURI}
            types={types} />

          <div className='items'>
            {!reports.isFetching && venueId ? (
              reports.filteredItems.length ? (
                ProductList
              ) : (<Alert bsStyle='warning'>No items found.</Alert>)
            ) : (
              <Alert bsStyle='warning'>Loading...</Alert>
            )}
          </div>

          {reports.filteredItems.length > reports.filters.limit &&
            <div className='text-center'>
              <Pagination ellipsis boundaryLinks
                items={Math.ceil(reports.filteredItems.length / reports.filters.limit)}
                maxButtons={9}
                activePage={(reports.filters.skip / reports.filters.limit) + 1}
                onSelect={this.handlePaginationSelect} />
            </div>
          }
        </div>

      </div>
    )
  }
}

Report.propTypes = {
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  types: React.PropTypes.object.isRequired,
  fetchTypes: React.PropTypes.func.isRequired,
  suppliers: React.PropTypes.object.isRequired,
  fetchSuppliers: React.PropTypes.func.isRequired,
  fetchReport: React.PropTypes.func.isRequired,
  changeReportFilters: React.PropTypes.func.isRequired,
  createReport: React.PropTypes.func.isRequired,
  reports: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string
}
export default Report
