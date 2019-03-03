import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Client} from "nes";


// TODO : font chiffres digitaux
// TODO : tout gérer back => points + fin de partie / décompte front juste pour l'affichage
// TODO : aligner les décomptes


class App extends Component {

    countdownTimer;

    cli = new Client('ws://192.168.0.10:3005');

    constructor(props) {
        super(props);
        this.state = {
            connected: true,
            countdown: 30,
            score: 0,
            partyStarted: false,
            gameOver: false,
            scoreClass: '',
            timeClass: ''
        };

        this.handleScore = this.handleScore.bind(this);
        this.start = this.start.bind(this);
        this.startParty = this.startParty.bind(this);
        this.gameOver = this.gameOver.bind(this);

        this.cli
            .connect()
            .then(() => {
                console.log('connected');
                this.setState({connected: true});
            });
    }

    handleScore(update, flags) {
        console.log('swish !', update);
        this.setState({score: update.score});
    }

    start() {
        this.setState({partyStarted: true});

        // const yop = setInterval(() => {
        //     this.setState({score: this.state.score + 2, countdown: this.state.countdown - 1});
        //     if (this.state.countdown <= 0) {
        //         clearInterval(yop);
        //     }
        // }, 1000);

        this.cli.subscribe('/gameover', this.gameOver);
        this.cli.subscribe('/swish', this.handleScore);
        this.cli
            .request('start')
            .then((data) => {
                console.log(data);
                this.startParty();
            });
    }

    startParty() {
        this.setState({partyStarted: true});
        this.countdownTimer = setInterval(() => {
            this.setState({countdown: this.state.countdown - 1});
        }, 1000);
    }

    gameOver(update, flags) {
        console.log('gameOver', update);
        this.cli.unsubscribe('/swish');
        this.cli.unsubscribe('/gameover');
        this.setState({gameOver: true});
        clearInterval(this.countdownTimer);
    }

    render() {
        const waitingConnection = <div className="row">
            <div className="col-12 text-center">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>Waiting connection...</p>
            </div>
        </div>;

        const gameOver = <div className="row">
            <div className="col-12 text-center">
                Bravo, t'as fait {this.state.score} points !!
            </div>
        </div>;

        const partying = <div className="row justify-content-center">
            <div className="clock-size">
                <div className="row clock-border mx-3">
                    {/*<div className="col-4">*/}
                    {/*<button type="btn" className="btn btn-success" onClick={this.stop}>*/}
                    {/*Stop*/}
                    {/*</button>*/}
                    {/*</div>*/}

                    <div className="col-12 py-3">
                        <div className="row">
                            <div className="col-6">score</div>
                            <div className="col-6">temps</div>
                        </div>
                        <div className="row row-front digitialism">
                            <div className="col-5 text-right">
                                <div className="digit-number-front numbers">
                                    {this.state.score}
                                </div>
                            </div>
                            <div className="col-6 text-right">
                                <div className="digit-number-front numbers">
                                    {this.state.countdown}
                                </div>
                            </div>
                        </div>
                        <div className="digitialism digit-score-bgd numbers">
                            888
                        </div>
                        <div className="digitialism digit-time-bgd numbers">
                            888
                        </div>
                    </div>
                </div>
            </div>
        </div>;

        return (
            <div className="container-fluid app">
                <div className="row align-items-center full-h">
                    <div className="col">
                        {!this.state.connected && waitingConnection}
                        {
                            this.state.connected && !this.state.partyStarted &&

                            <div className="btn-container">
                                <button className="btn-3d green" onClick={this.start}>Start !</button>
                            </div>
                        }
                        {this.state.connected && this.state.partyStarted && !this.state.gameOver && partying}
                        {this.state.connected && this.state.partyStarted && this.state.gameOver && gameOver}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;