import React, { useState, useEffect } from 'react'

import Suggestions from '../product/Suggestions'
import Search from '../product/Search'
import Categories from '../product/Categories'
import {  getCategories, getLatestProducts } from '../product/api-product'
import useWindowDimension from '../hook/useWindowDimension'


const Home = () => {
    const [suggestions, setSuggestions] = useState([])
    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')
    
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getCategories(signal).then(res => {
            if (res && res.error) {
                setError(res.error)
            } else {
                setCategories(res)
            }
        })

        getLatestProducts(signal).then(res => {
            if (res && res.error) {
                setError(res.error)
            } else {
                setSuggestions(res)
            }
        })
    
        return () => controller.abort()
    }, [])

    return (
        <div>
            <Search categories={categories} />
            <Categories categories={categories} />
            <Suggestions products={suggestions} title={'Latest Products'} />
        </div>
    )
}

export default Home