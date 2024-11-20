// // src/components/SearchFood.js
// import React, { useState } from "react";
// import axios from "axios";

// const SearchFood = ({ addFoodItem }) => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);

// //   const handleSearch = async () => {
// //     console.log(process.env.REACT_APP_BACKEND_KEY);
// //     const response = await axios.post(" https://lemickey-hi.onrender.com/food/search", {
// //       query,
// //     });
// //     setResults(response.data);
// //   };

// const handleSearch = async () => {
//   const response = await axios.post(
//     " https://trackapi.nutritionix.com/v2/natural/nutrients",
//     {
//       query,
//     },
//     {
//       headers: {
//         "x-app-id": "6581ce03",
//         "x-app-key": "a70efdad091c87b626984fd4e8017004",
//       },
//     }
//   );
//   setResults(response.data);
// };

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search for food"
//       />
//       <button onClick={handleSearch}>Search</button>
//       <ul>
//         {results.map((item, index) => (
//           <li key={index} onClick={() => addFoodItem(item)}>
//             {item.food_name} - {item.nf_calories} calories
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchFood;
