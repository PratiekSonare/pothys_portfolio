import React from 'react'
import Filter from './Filter'
import FilterMobile from './FilterMobile'

const FilterParent = ({ selectedDiscounts, handleDiscountChange }) => {
  return (
    <>
      <Filter
        selectedDiscounts={selectedDiscounts}
        handleDiscountChange={handleDiscountChange}
      />
      <FilterMobile
        selectedDiscounts={selectedDiscounts}
        handleDiscountChange={handleDiscountChange}
      />
    </>
  )
}

export default FilterParent