import React, { useEffect, useReducer } from "react";
import { API } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";

const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "ADD_COINS":
      return { ...state, coins: action.coins, loading: false };
    default:
      return state;
  }
};

const initState = {
  loading: false,
  coins: []
};

function App() {
  const [{ coins, loading }, dispatch] = useReducer(reducer, initState);

  async function getData() {
    try {
      dispatch({ type: "LOADING" });
      // const data = await API.get("cryptoApi", "/coins");
      const data = await API.get("cryptoApi", "/coins?limit=500&start=0");
      console.log("data from Lambda REST API: ", data);
      const { coins } = data;
      dispatch({ type: "ADD_COINS", coins });
    } catch (err) {
      console.log("error fetching data..", err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ paddingLeft: "10%" }}>
      {loading ? (
        <span>loading ...</span>
      ) : (
        coins.map((c, i) => (
          <div stylekey={i}>
            <h2>{`${i + 1}. ${c.name}`}</h2>
            <p>{c.price_usd}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
