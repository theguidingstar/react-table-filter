import "./App.css";
import MUIDataTable from "mui-datatables";
import { Grid, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";

let results_file = typeof window.ENV.results_file === "undefined" ? null : window.ENV.results_file; 


const defaultOption = {
  filter: true,
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
      filter: false,
      sort: false,
      filterOptions: {
        fullWidth: true,
      },
    },
  },
  {
    name: "site",
    label: "site",
    options: {
      filter: true,
      sort: false,
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
      sort: false,
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
      sort: false,
    },
  },
];
function App() {
  const [data, setData] = useState([]);
  const [col, setCol] = useState(defaultCols);
  const [lesserThanAPY, setLesserThanAPY] = useState("");
  const [lesserThanTVL, setlesserThanTVL] = useState("");
  const [greaterThanAPY, setGreaterThanAPY] = useState("");
  const [greaterThanTVL, setGreaterThanTVL] = useState("");

  useEffect(() => {
    let url = results_file +"?t="+new Date().getTime();
    axios.get(url).then((res) => {
      setData(res.data);
    });
  }, []);

  /** Filter APY */
  const option = {
    filterType: "checkbox",
    print: false,
    download: false,
    viewColumns: false,
    onFilterChipClose: (index) => clearTexts(index),
  };
  const clearTexts = (index) => {
    if (index === 3) {
      setLesserThanAPY("");
      setGreaterThanAPY("");
    } else if (index === 4) {
      setGreaterThanTVL("");
      setlesserThanTVL("");
    }
    return index;
  };
  const changeApy = (type, value) => {
    if (value === "") {
      let newCol = [...col];
      newCol.forEach((cols) => {
        if (cols.name === "apy") {
          cols.options = defaultOption;
        }
      });
      setCol(newCol);
      if (type === "lesser than") {
        setLesserThanAPY(value);
      } else {
        setGreaterThanAPY(value);
      }
      return;
    }
    if (type === "lesser than") {
      const Strcuture = {
        filter: false,
        filterType: "textField",
        filterList: [value],
        filterOptions: {
          logic: (location, filters, row) => {
            if (parseFloat(row[3]) > parseFloat(filters[0])) {
              return true;
            } else return false;
          },
        },
        customFilterListOptions: { render: (v) => `APY ${type} ${v}` },
        sort: false,
      };
      let newCol = [...col];
      newCol.forEach((cols) => {
        if (cols.name === "apy") {
          cols.options = Strcuture;
        }
      });
      setLesserThanAPY(value);
      setCol(newCol);
    } else {
      const Strcuture = {
        filter: false,
        filterType: "textField",
        filterList: [value],
        filterOptions: {
          logic: (location, filters, row) => {
            if (parseFloat(row[3]) < parseFloat(filters[0])) {
              return true;
            } else return false;
          },
        },
        customFilterListOptions: { render: (v) => `APY ${type} ${v}` },
        sort: false,
      };
      let newCol = [...col];
      newCol.forEach((cols) => {
        if (cols.name === "apy") {
          cols.options = Strcuture;
        }
      });
      setGreaterThanAPY(value);
      setCol(newCol);
    }
  };

  const changeTVL = (type, value) => {
    if (value === "") {
      let newCol = [...col];
      newCol.forEach((cols) => {
        if (cols.name === "apy") {
          cols.options = defaultOption;
        }
      });
      if (type === "lesser than") {
        setlesserThanTVL(value);
      } else {
        setGreaterThanTVL(value);
      }
      setCol(newCol);
      return;
    }
    if (type === "lesser than") {
      const Strcuture = {
        filter: false,
        filterType: "textField",
        filterList: [value],
        filterOptions: {
          logic: (location, filters, row) => {
            if (parseFloat(row[4]) > parseFloat(filters[0])) {
              return true;
            } else return false;
          },
        },
        customFilterListOptions: { render: (v) => `tvl ${type} ${v}` },
        sort: false,
      };
      let newCol = [...col];
      newCol.forEach((cols) => {
        if (cols.name === "tvl") {
          cols.options = Strcuture;
        }
      });
      setlesserThanTVL(value);
      setCol(newCol);
    } else {
      const Strcuture = {
        filter: false,
        filterType: "textField",
        filterList: [value],
        filterOptions: {
          logic: (location, filters, row) => {
            if (parseFloat(row[4]) < parseFloat(filters[0])) {
              return true;
            } else return false;
          },
        },
        customFilterListOptions: { render: (v) => `tvl ${type} ${v}` },
        sort: false,
      };
      let newCol = [...col];
      newCol.forEach((cols) => {
        if (cols.name === "tvl") {
          cols.options = Strcuture;
        }
      });
      setGreaterThanTVL(value);
      setCol(newCol);
    }
  };

  return (
    <>
      <Grid container spacing={5} style={{ padding: 20 }}>
        <Grid item xs={4} spacing={2} justifyContent="space-between">
          <h3>Filters </h3>
        </Grid>
        <Grid item xs={4} spacing={2} justifyContent="space-between">
          <TextField
            id="outlined-basic"
            label="APY Lesser than"
            variant="outlined"
            value={lesserThanAPY}
            onChange={(e) => changeApy("lesser than", e.target.value)}
          />{" "}
          &nbsp;
          <TextField
            id="outlined-basic"
            label="APY Greater than"
            variant="outlined"
            value={greaterThanAPY}
            onChange={(e) => changeApy("greater than", e.target.value)}
          />{" "}
          &nbsp;
        </Grid>
        <Grid item xs={4} spacing={2}>
          <TextField
            id="outlined-basic"
            label="tvl Lesser than"
            variant="outlined"
            value={lesserThanTVL}
            onChange={(e) => changeTVL("lesser than", e.target.value)}
          />{" "}
          &nbsp;
          <TextField
            id="outlined-basic"
            label="tvl Greate than"
            variant="outlined"
            value={greaterThanTVL}
            onChange={(e) => changeTVL("greater than", e.target.value)}
          />{" "}
          &nbsp;
        </Grid>
      </Grid>
      <MUIDataTable data={data} columns={col} options={option} />{" "}
    </>
  );
}

export default App;