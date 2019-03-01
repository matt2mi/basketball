import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
// import {Client} from "nes";


// TODO : font chiffres digitaux
// TODO : tout gérer back => points + fin de partie / décompte front juste pour l'affichage
// TODO : aligner les décomptes


class App extends Component {

    countdownTimer;

    // cli = new Client('ws://192.168.0.10:3005');

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
        this.setClasses = this.setClasses.bind(this);
        this.transformNumber = this.transformNumber.bind(this);
        this.startParty = this.startParty.bind(this);
        this.gameOver = this.gameOver.bind(this);

        // this.cli
        //     .connect()
        //     .then(() => {
        //         console.log('connected');
        //         this.setState({connected: true});
        //     });
    }

    handleScore(update, flags) {
        console.log('swish !', update);
        this.setState({score: update.score});
    }

    start() {
        this.setState({partyStarted: true});

        this.setClasses();

        const yop = setInterval(() => {
            this.setState({score: this.state.score + 2, countdown: this.state.countdown - 1});
            this.setClasses();
            if (this.state.countdown <= 0) {
                clearInterval(yop);
            }
        }, 1000);

        // this.cli.subscribe('/gameover', this.gameOver);
        // this.cli.subscribe('/swish', this.handleScore);
        // this.cli
        //     .request('start')
        //     .then((data) => {
        //         console.log(data);
        //         this.startParty();
        //     });
    }

    setClasses() {
        const scoreTemp = this.state.score + '';
        const timeTemp = this.state.countdown + '';

        const valueScore = 'digit-number-front numbers' +
            (scoreTemp[scoreTemp.length - 1] === '3' ||
            scoreTemp[scoreTemp.length - 1] === '7' ||
            scoreTemp[scoreTemp.length - 1] === '1' ||
            scoreTemp === '22' ||
            scoreTemp === '55' ?
                ' fix-letter-spacing' : '');
        const valueTime = 'digit-number-front numbers' +
            (timeTemp[timeTemp.length - 1] === '3' ||
            timeTemp[timeTemp.length - 1] === '7' ||
            timeTemp[timeTemp.length - 1] === '1' ||
            timeTemp === '22' ||
            timeTemp === '55'  ?
                ' fix-letter-spacing' : '');

        console.log('score', valueScore);
        console.log('time', valueTime);

        this.setState({
            scoreClass: valueScore,
            timeClass: valueTime
        });
    }

    transformNumber(nb) {
        if(nb === 11 || nb === 21 || nb === 31) {
            const str = '' + nb;
            return [str.slice(0, str.length - 1), ' '].join('') + str[str.length-1];
        }
        return nb;
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
                                <div className={this.state.scoreClass}>
                                    {this.transformNumber(this.state.score)}
                                </div>
                            </div>
                            <div className="col-6 text-right">
                                <div className={this.state.timeClass}>
                                    {this.transformNumber(this.state.countdown)}
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