import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const PRODUCTS_FETCH_REQUEST = 'PRODUCTS_FETCH_REQUEST'
export const PRODUCTS_FETCH_SUCCESS = 'PRODUCTS_FETCH_SUCCESS'
export const PRODUCTS_FETCH_FAILURE = 'PRODUCTS_FETCH_FAILURE'

export const PRODUCTS_UPDATE_REQUEST = 'PRODUCTS_UPDATE_REQUEST'
export const PRODUCTS_UPDATE_SUCCESS = 'PRODUCTS_UPDATE_SUCCESS'
export const PRODUCTS_UPDATE_FAILURE = 'PRODUCTS_UPDATE_FAILURE'

export const PRODUCTS_ADD_REQUEST = 'PRODUCTS_ADD_REQUEST'
export const PRODUCTS_ADD_SUCCESS = 'PRODUCTS_ADD_SUCCESS'
export const PRODUCTS_ADD_FAILURE = 'PRODUCTS_ADD_FAILURE'

export const PRODUCTS_FILTER_CHANGE = 'PRODUCTS_FILTER_CHANGE'

export const PRODUCTS_TOGGLE_ADD_DIALOG = 'PRODUCTS_TOGGLE_ADD_DIALOG'

export const CATALOG_FETCH_REQUEST = 'CATALOG_FETCH_REQUEST'
export const CATALOG_FETCH_SUCCESS = 'CATALOG_FETCH_SUCCESS'
export const CATALOG_FETCH_FAILURE = 'CATALOG_FETCH_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchProducts = (venueId) => {
  return {
    [CALL_API]: {
      endpoint: `/inventory?populate=true&limit=2000&venue_id=${venueId}`,
      method: 'GET',
      types: [
        PRODUCTS_FETCH_REQUEST,
        PRODUCTS_FETCH_SUCCESS,
        PRODUCTS_FETCH_FAILURE
      ]
    }
  }
}

export const changeProductsFilter = (filter) => ({
  type: PRODUCTS_FILTER_CHANGE,
  payload: {
    limit: 20,
    skip: 0,
    ...filter
  }
})

export const addProduct = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/inventory?populate=true`,
      method: 'POST',
      body: JSON.stringify(payload),
      types: [
        PRODUCTS_ADD_REQUEST,
        PRODUCTS_ADD_SUCCESS,
        PRODUCTS_ADD_FAILURE
      ]
    }
  }
}

export const updateProduct = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/inventory/${payload._id}?populate=true`,
      method: 'PUT',
      body: JSON.stringify(payload),
      types: [
        PRODUCTS_UPDATE_REQUEST,
        PRODUCTS_UPDATE_SUCCESS,
        PRODUCTS_UPDATE_FAILURE
      ]
    }
  }
}

export const toggleAddNewDialog = () => ({
  type: PRODUCTS_TOGGLE_ADD_DIALOG
})

export const fetchCatalog = (filters) => {
  filters = {
    ...{ limit: 20, skip:0 },
    ...filters
  }
  const params = Object.keys(filters).reduce((mem, key) =>
    mem + '&' + key + '=' + filters[key]
  , '').substring(1)
  return {
    [CALL_API]: {
      endpoint: `/products?${params}`,
      method: 'GET',
      types: [
        {
          type: CATALOG_FETCH_REQUEST,
          meta: (action, state) => {
            return filters
          }
        },
        {
          type: CATALOG_FETCH_SUCCESS,
          meta: (action, state, res) => {
            return parseInt(res.headers.get('X-Total-Count'), 10)
          }
        },
        CATALOG_FETCH_FAILURE
      ]
    }
  }
}

export const actions = {
  fetchProducts,
  updateProduct,
  addProduct,
  toggleAddNewDialog,
  fetchCatalog
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PRODUCTS_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      items:[]
    }
  },
  [PRODUCTS_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: action.payload
    }
  },
  [PRODUCTS_ADD_REQUEST] : (state, action) => {
    return {
      ...state,
      addNew: {
        ...state.addNew,
        isSubmitting: true
      }
    }
  },
  [PRODUCTS_ADD_SUCCESS] : (state, action) => {
    return {
      ...state,
      items: [
        action.payload,
        ...state.items
      ]
    }
  },
  [PRODUCTS_FILTER_CHANGE] : (state, action) => {
    return {
      ...state,
      filters: action.payload
    }
  },
  [PRODUCTS_UPDATE_SUCCESS] : (state, action) => {
    return {
      ...state,
      items: state.items.map((item) => {
        if (item._id === action.payload._id) {
          item = action.payload
        }
        return item
      })
    }
  },
  [PRODUCTS_TOGGLE_ADD_DIALOG] : (state, action) => {
    return {
      ...state,
      addNew: {
        dialogOpen: !state.addNew.dialogOpen,
        isFetching: false,
        items: [],
        filters: {}
      }
    }
  },
  [CATALOG_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      addNew: {
        ...state.addNew,
        isFetching: true,
        items: [],
        filters: action.meta
      }
    }
  },
  [CATALOG_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      addNew: {
        ...state.addNew,
        isFetching: false,
        totalCount: action.meta,
        items: action.payload
      }
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  filters: {
    limit: 20,
    skip: 0
  },
  items: [],
  addNew: {
    dialogOpen: false,
    isFetching: false,
    isSubmitting: false,
    totalCount: 0,
    filters: {},
    items: []
  }
}
export default function productsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
