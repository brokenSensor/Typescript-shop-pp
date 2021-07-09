import { combineReducers } from 'redux'
import { productListReducer } from './productReducer'

export const reducer = combineReducers({ productList: productListReducer })
