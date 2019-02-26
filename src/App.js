import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Client} from "nes";

class App extends Component {

    countdownTimer;
    cli = new Client('ws://localhost:3005');

    constructor(props) {
        super(props);
        this.state = {
            connected: true,
            countdown: 10,
            score: 0,
            partyStarted: false
        };

        this.cancelParty = this.cancelParty.bind(this);
        this.handleScore = this.handleScore.bind(this);
        this.restart = this.restart.bind(this);
        this.start = this.start.bind(this);
        this.startParty = this.startParty.bind(this);
        this.startFlowing = this.startFlowing.bind(this);
        this.startWizzing = this.startWizzing.bind(this);
        this.stopLeds = this.stopLeds.bind(this);

        this.cli
            .connect()
            .then(() => {
                console.log('connected');
                this.setState({connected: true});
            });
    }

    cancelParty() {
        clearInterval(this.countdownTimer);
        this.setState({
            countdown: 10,
            score: 0,
            partyStarted: false
        });
        this.cli
            .unsubscribe('/clutch')
            .then((data) => {
                if(data) {
                    console.log(data.payload.msg);
                }
            });
    }

    handleScore(update, flags) {
        if (this.state.countdown <= 29 && this.state.countdown > 0) {
            this.setState({score: this.state.score + update.newScore});
        }
    }
/*
    restart() {
        this.setState({
            countdown: 10,
            score: 0,
            partyStarted: false
        });
        this.start();
    }*/

    start() {
        this.cli
            .subscribe('/clutch', this.handleScore)
            .then(() => this.cli.request('start'))
            .then((data) => {
                console.log(data.payload.msg);
                this.startParty();
            });
    }

    startParty() {
        this.setState({partyStarted: true});
        this.countdownTimer = setInterval(() => {
            this.setState({countdown: this.state.countdown - 1});

            if (this.state.countdown <= 0) {
                clearInterval(this.countdownTimer);
            }
        }, 1000);
    }

/*  startFlowing() {
        this.cli.request('/flow')
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
    }

    startWizzing() {
        this.cli.request('/wizz')
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
    }

    stopLeds() {
        this.cli.request('/stop-leds')
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
    }*/

    render() {
        return (
            <div className="container-fluid app">
                {
                    !this.state.connected ?
                        <div className="row">
                            <div className="col-12 text-center">
                                <img src={logo} className="App-logo" alt="logo"/>
                                <p>Waiting connection...</p>
                            </div>
                        </div> :
                        <div>
                            <div className="row">
                                <div className="col-4">
                                    {/*{*/}
                                        // !this.state.partyStarted ?
                                            <button type="btn" className="btn btn-success" onClick={this.start}>
                                                Start !
                                            </button>
                                            // : this.state.countdown > 0 ?
                                            //     <button type="btn" className="btn btn-danger"
                                            //             onClick={this.cancelParty}>
                                            //         Cancel
                                            //     </button> :
                                            //     <button type="btn" className="btn btn-primary" onClick={this.restart}>
                                            //         Restart !
                                            //     </button>

                                    // }
                                </div>
                                <div className="col-4">
                                    Score : {this.state.score}
                                </div>
                                <div className="col-4">
                                    Temps restant : {this.state.partyStarted ? this.state.countdown : '-'}
                                </div>
                            </div>
                            {
                                this.state.countdown <= 0 &&
                                <div className="row">
                                    <div className="col-12 text-center">Bravo, t'as fait {this.state.score} points !!
                                    </div>
                                </div>
                            }
                        </div>
                }
            </div>
        );
    }
}

export default App;