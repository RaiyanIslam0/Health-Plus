import React from 'react'
import DashboardPage from './DashboardPage'
import SearchFood from "./../Components/SearchFood";
import FoodTracker from "./../Components/FoodTracker";

const FoodsPage = () => {
  return (
    <DashboardPage>
      <FoodTracker />
    </DashboardPage>
  )
}

export default FoodsPage