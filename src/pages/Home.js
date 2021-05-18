import React from "react";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";

const Home = () => {
  const INITIAL_LOAD_AMOUNT = 6;

  return (
    <>
      <div className="jumbotron">
        <h4>Le Sucre - Happiness Guaranteed </h4>
      </div>
      <h4 className="text-center p-3 mt-5 mb-5 display-4"> New Treats </h4>
      <NewArrivals />

      <h4 className="text-center p-3 mt-5 mb-5 display-4"> Trending </h4>
      <BestSellers />

      <br />
    </>
  );
};

export default Home;
