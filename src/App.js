import "./App.css";
import MUIDataTable from "mui-datatables";
import { Button, Grid, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

let results_file =
  typeof window.ENV.results_file === "undefined"
    ? null
    : window.ENV.results_file;

const defaultOption = {
  filter: false,
  filterType: "textField",
  filterList: [],
  filterOptions: {
    logic: (location, filters, row) => {
      if (parseFloat(row[4]) < parseFloat(filters[0])) {
        return true;
      } else return false;
    },
  },
  customFilterListOptions: { render: (v) => `Greater than: ${v}` },
  sort: false,
};

const defaultCols = [
  {
    name: "chain",
    label: "chain",
    options: {
      filter: true,
      sort: false,
      filterType: 'checkbox'
    },
  },
  {
    name: "site",
    label: "site",
    options: {
      filter: true,
      sort: false,
      filterType: 'checkbox'
    },
  },
  {
    name: "token",
    label: "token",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "apy",
    label: "apy",
    options: {
      filter: false,
      filterType: "textField",
      filterOptions: {
        logic: (location, filters, row) => {
          if (parseFloat(row[3]) < parseFloat(filters[0])) {
            return true;
          } else return false;
        },
      },
      customFilterListOptions: { render: (v) => `APY greater than: ${v}` },
      sort: true,
    },
  },
  {
    name: "tvl",
    label: "tvl",
    options: {
      filter: false,
      filterType: "textField",
      filterOptions: {
        logic: (location, filters, row) => {
          if (parseFloat(row[4]) < parseFloat(filters[0])) {
            return true;
          } else return false;
        },
      },
      customFilterListOptions: { render: (v) => `TVL greater than: ${v}` },
      sort: true,
    },
  },
];
function App() {
  const [data, setData] = useState([]);
  const [col, setCol] = useState(defaultCols);
  const [lesserThanAPY, setLesserThanAPY] = useState("");
  const [lesserThanTVL, setLesserThanTVL] = useState("");
  const [greaterThanAPY, setGreaterThanAPY] = useState("");
  const [greaterThanTVL, setGreaterThanTVL] = useState("");
  const [logged_in, setLoggedIn] = useState(false);

  useEffect(() => {
    function toHex(s) {
      // utf8 to latin1
      var s = unescape(encodeURIComponent(s));
      var h = "";
      for (var i = 0; i < s.length; i++) {
        h += s.charCodeAt(i).toString(16);
      }
      return h;
    }

    function setCookie(name, value, days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    const login = async function () {
      if (typeof window.ethereum == "undefined") {
        alert("MetaMask isn't installed!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      var response = await fetch("nonce", {
        body: JSON.stringify({ publickey: account }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const nonce = await response.text();
      var params = [toHex("signing nonce: " + nonce), account];
      var sig = await window.ethereum.request({
        method: "personal_sign",
        params,
      });

      response = await fetch("getcookie", {
        body: JSON.stringify({ publickey: account, sig: sig }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      setCookie("c", await response.text(), 2);
      setLoggedIn(true);
    };

    login();
  }, []);

  useEffect(() => {
    let url = results_file +"?t="+new Date().getTime();
    axios.get(url).then((res) => {
      setData(res.data);
    });
  }, []);

  const option = {
    filterType: "none",
    selectableRows:false,
    print: false,
    download: false,
    viewColumns: false,
    onFilterChipClose: (index) => clearTexts(index),
  };
  const clearTexts = (index) => {
    let newCol = [...col];
    if (index === 3) {
      setLesserThanAPY("");
      setGreaterThanAPY("");
      newCol.forEach((cols) => {
        if (cols.name === "apy") {
          cols.options = defaultOption;
        }
      });
    } else if (index === 4) {
      setGreaterThanTVL("");
      setLesserThanTVL("");
      newCol.forEach((cols) => {
        if (cols.name === "tvl") {
          cols.options = defaultOption;
        }
      });
    }
    setCol(newCol);
    return index;
  };

  const applyFilter = () => {
    let newCol = [...col];
    if (lesserThanAPY !== "" || greaterThanAPY !== "") {
      let value = {};
      if (lesserThanAPY !== "") {
        value.less = lesserThanAPY;
      }
      if (greaterThanAPY !== "") {
        value.more = greaterThanAPY;
      }
      const Strcuture = {
        filter: false,
        filterType: "textField",
        filterList: [value],
        filterOptions: {
          logic: (location, filters, row) => {
            if (
              row[3] === "" ||
              row[3] === undefined ||
              isNaN(parseFloat(row[3]))
            ) {
              return true;
            }
            if (value && value.less && value.more) {
              if (
                parseFloat(row[3]) < parseFloat(filters[0].less) &&
                parseFloat(row[3]) > parseFloat(filters[0].more)
              ) {
                return false;
              } else return true;
            } else if (value && value.less) {
              if (parseFloat(row[3]) < parseFloat(filters[0].less)) {
                return false;
              } else return true;
            } else if (value && value.more) {
              if (parseFloat(row[3]) > parseFloat(filters[0].more)) {
                return false;
              } else return true;
            }
          },
        },
        customFilterListOptions: {
          render: (v) => {
            let text;
            if (value && value.less && value.more) {
              text = value.less + "< apy <" + value.more;
            } else if (value && value.less) {
              text = value.less + "> apy";
            } else if (value && value.more) {
              text = "apy >" + value.more;
            }
            return text;
          },
        },
        sort: false,
      };

      newCol.forEach((cols) => {
        if (cols.name === "apy") {
          cols.options = Strcuture;
        }
      });
    }
    if (lesserThanTVL !== "" || greaterThanTVL !== "") {
      let value = {};
      if (lesserThanTVL !== "") {
        value.less = lesserThanTVL;
      }
      if (greaterThanAPY !== "") {
        value.more = greaterThanTVL;
      }
      const Strcuture = {
        filter: false,
        filterType: "textField",
        filterList: [value],
        filterOptions: {
          logic: (location, filters, row) => {
            if (
              row[3] === "" ||
              row[3] === undefined ||
              isNaN(parseFloat(row[3]))
            ) {
              return true;
            }
            if (value && value.less && value.more) {
              if (
                parseFloat(row[4]) < parseFloat(filters[0].less) &&
                parseFloat(row[4]) > parseFloat(filters[0].more)
              ) {
                return false;
              } else return true;
            } else if (value && value.less) {
              if (parseFloat(row[4]) < parseFloat(filters[0].less)) {
                return false;
              } else return true;
            } else if (value && value.more) {
              if (parseFloat(row[4]) > parseFloat(filters[0].more)) {
                return false;
              } else return true;
            }
          },
        },
        customFilterListOptions: {
          render: (v) => {
            let text;
            if (value && value.less && value.more) {
              text = value.less + "< tvl <" + value.more;
            } else if (value && value.less) {
              text = value.less + "> tvl";
            } else if (value && value.more) {
              text = "tvl >" + value.more;
            }
            return text;
          },
        },
        sort: false,
      };

      newCol.forEach((cols) => {
        if (cols.name === "tvl") {
          cols.options = Strcuture;
        }
      });
    }
    setCol(newCol);
  };

  const LoginMessage = () => {
    return (
      <>
        <p class="bottom">Please sign the message with your public key</p>
      </>
    );
  };

  const LoggedInView = () => {
    return (
      <>
        <br />
        <Grid container spacing={5} style={{ padding: 20 }}>
          <Grid item xs={12} sm={12} md={2} lg={2} spacing={2}>
            <h3>Filters </h3>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} spacing={2}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="0"
              className="input-text-filter"
              value={lesserThanAPY}
              onChange={(e) => setLesserThanAPY(e.target.value)}
            />{" "}
            &nbsp; <h4> {"< APY <"} </h4> &nbsp; &nbsp;
            <TextField
              id="outlined-basic"
              className="input-text-filter"
              variant="outlined"
              placeholder="100"
              value={greaterThanAPY}
              onChange={(e) => setGreaterThanAPY(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} spacing={2}>
            <TextField
              id="outlined-basic"
              className="input-text-filter"
              placeholder="0"
              variant="outlined"
              value={lesserThanTVL}
              onChange={(e) => setLesserThanTVL(e.target.value)}
            />
            <h4> &nbsp; {"< TVL <"} </h4> &nbsp; &nbsp;
            <TextField
              id="outlined-basic"
              className="input-text-filter"
              placeholder="100"
              variant="outlined"
              value={greaterThanTVL}
              onChange={(e) => setGreaterThanTVL(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} spacing={2}>
            <Button
              className="cta-button"
              variant="contained"
              color="primary"
              onClick={(e) => applyFilter()}
            >
              Apply Filter
            </Button>
          </Grid>
        </Grid>
        <MUIDataTable data={data} columns={col} options={option} />
      </>
    );
  };

  return (
    <>
      <Header />
      <br />
      {logged_in ? LoggedInView() : LoginMessage()}
    </>
  );
}

export default App;