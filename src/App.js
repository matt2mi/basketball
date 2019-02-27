import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Client} from "nes";


// TODO : tout gérer back => points + fin de partie / décompte front juste pour l'affichage
// TODO : aligner les décomptes
// TODO : erreur pi-server.js:22


class App extends Component {

    countdownTimer;
    cli = new Client('ws://192.168.0.10:3005');

    constructor(props) {
        super(props);
        this.state = {
            connected: true,
            countdown: 10,
            score: 0,
            partyStarted: false,
            gameOver: false
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
                                    <button type="btn" className="btn btn-success" onClick={this.start}>
                                        Start !
                                    </button>
                                </div>

                                <div className="col-4">
                                    Score : {this.state.score}
                                </div>

                                <div className="col-4">
                                    Temps restant : {this.state.partyStarted ? this.state.countdown : '-'}
                                </div>
                            </div>
                            {
                                this.state.gameOver &&
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