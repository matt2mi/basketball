import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Client} from "nes";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };

        this.handleData = this.handleData.bind(this);
        this.start = this.start.bind(this);

        this.start();
    }

    start() {
        const cli = new Client('ws://localhost:3005');

        cli.connect()
            .then(() => cli.subscribe('/clutch', this.handleData))
            .then(() => cli.request('connection'))
            .then((data) => console.log(data.payload.msg));
    };

    handleData(update, flags) {
        console.log('update', update);
        this.setState({count: this.state.count + update.counter});
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>

                <div>
                    Count : {this.state.count}
                </div>
            </div>
        );
    }
}

export default App;