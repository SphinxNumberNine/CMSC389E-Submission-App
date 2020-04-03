import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid
} from "@material-ui/core";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      uname: "",
      password: ""
    };
  }

  onFileChange = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  onUsernameChange = event => {
    this.setState({
      uname: event.target.value
    });
  };

  onPasswordChange = event => {
    this.setState({
      password: event.target.value
    });
  };

  onSubmit = async event => {
    let formData = new FormData();
    formData.append("file", this.state.selectedFile);
    formData.append("uname", this.state.uname);
    formData.append("password", this.state.password);

    let resp = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    if (resp.status == 200) {
      console.log("SUCCESS");
    } else {
      console.log("FAILURE");
    }
  };

  render() {
    console.log(this.state);
    return (
      <div className="App">
        <Typography variant="h2" className="Title">
          CMSC389E Project Submission App
        </Typography>
        <input
          accept=".zip"
          id="contained-button-file"
          type="file"
          className="input"
          onChange={this.onFileChange}
        />
        <div style={{ margin: "50px" }}></div>
        <Typography variant="body1">
          Note: the world folder AND the zip file that contains it must be named
          in the format &lt;directoryID&gt; - &lt;projectNumber&gt;
        </Typography>
        <div style={{ margin: "10px" }}></div>
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            className="ChooseFile"
          >
            Choose File
          </Button>
        </label>
        <div style={{ margin: "10px" }}></div>
        {this.renderFileName()}
        <div style={{ margin: "30px" }}></div>
        <Grid
          container
          spacing={1}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Grid
            container
            item
            xs={12}
            spacing={2}
            direction="row"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Grid item>
              <Typography>DirectoryID:</Typography>
            </Grid>
            <Grid item>
              <TextField
                variant="outlined"
                onChange={this.onUsernameChange}
              ></TextField>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            spacing={2}
            direction="row"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Grid item>
              <Typography>Password:</Typography>
            </Grid>
            <Grid item>
              <TextField
                variant="outlined"
                type="password"
                onChange={this.onPasswordChange}
              ></TextField>
            </Grid>
          </Grid>
        </Grid>
        <div style={{ margin: "30px" }}></div>
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={this.onSubmit}
        >
          Submit
        </Button>
      </div>
    );
  }

  renderFileName() {
    if (this.state.selectedFile) {
      return (
        <Typography variant="body1">
          Selected File: {this.state.selectedFile.name}
        </Typography>
      );
    }
  }
}

export default App;
