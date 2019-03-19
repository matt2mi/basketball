import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Podium from './components/podium/Podium';
import {Client} from "nes";

// TODO : un seul appel getScore (container podium)
// TODO : erreur sur connection au client
// TODO : finish divide in components + css too
// TODO : animation sur game over (bravo t'as fait x pts)

class App extends Component {

    // cli = new Client('ws://localhost:3005');

    cli = new Client('ws://192.168.0.10:3005');

    constructor(props) {
        super(props);
        this.state = {
            step: 'w',
            countdown: 30,
            score: 0,
            scores: [
                // {username: 'mimil', points: 1},
                // {username: 'mimil', points: 90},
                // {username: 'mimil', points: 8},
                // {username: 'mimil', points: 100},
                // {username: 'mimil', points: 5},
                // {username: 'mimil', points: 4},
            ],
                // .sort((currScore, prevScore) => prevScore.points - currScore.points),
            scoresErrorMsg: '',
            nextAward: {}
        };

        this.clientConnected = this.clientConnected.bind(this);
        this.handleScore = this.handleScore.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.start = this.start.bind(this);
        this.gameOver = this.gameOver.bind(this);
        this.restart = this.restart.bind(this);
        this.getScores = this.getScores.bind(this);
        this.setNextAward = this.setNextAward.bind(this);

        this.cli
            .connect()
            .then(this.clientConnected);

        this.getScores();
    }

    clientConnected() {
        this.setState({
            step: 'm',
            scores: this.state.scores
                .sort((currScore, prevScore) => prevScore.points - currScore.points)
        });
        this.cli.subscribe('/time', this.handleTime);
        this.cli.subscribe('/swish', this.handleScore);
        this.cli.subscribe('/gameover', this.gameOver);
    }

    handleScore(update, flags) {
        console.log('swish !', update);
        this.setState({score: update.score});
        this.setNextAward();
    }

    handleTime(update, flags) {
        this.setState({countdown: update.time});
    }

    start() {
        console.log('start');
        this.cli
            .request('start')
            .then((data) => {
                this.setState({
                    step: 'p',
                    countdown: 30,
                    score: 0
                });
                this.setNextAward();
                console.log('start retour', data);
            });
    }

    gameOver(update, flags) {
        console.log('gameOver', update);
        // this.cli.unsubscribe('/time');
        // this.cli.unsubscribe('/swish');
        // this.cli.unsubscribe('/gameover');
        this.setState({step: 'g'});
    }

    restart() {
        console.log('restart');
        this.cli
            .request('start')
            .then((data) => {
                this.setState({
                    step: 'p',
                    countdown: 10,
                    score: 0
                });
                console.log('restart retour', data);
            });
    }

    getScores() {
        fetch('/api/scoreboard')
            .then(res => res.json())
            .then(scores => {
                scores = scores
                    .slice(0, 5)
                    .sort((currScore, prevScore) => prevScore.points - currScore.points);
                this.setState({scores});
            })
            .catch(err => this.setState({scoresErrorMsg: err}));
    }

    setNextAward() {
        const reverseList = this.state.scores.slice(0, 5).reverse();
        const nextAward = reverseList.find(score => score.points > this.state.score);
        console.log('nextA', nextAward);
        this.setState({nextAward});
    }

    render() {
        const waitingConnection = <div className="row">
            <div className="col-12 text-center">
                <img src={logo} className="App-logo" alt="logo"/>
            </div>
        </div>;

        const main = <div className="row">
            <div className="col-12 text-center mb-4">
                <button className="btn-3d green" onClick={this.start}>Start !</button>
            </div>

            <div className="col-12 text-center">
                <Podium/>
            </div>
        </div>;

        const playing = <div className="row justify-content-center">
            <div className="clock-size">
                <div className="row clock-border mx-3">
                    <div className="col-12 py-3">
                        <div className="row">
                            <div className="col-6">score</div>
                            <div className="col-6">temps</div>
                        </div>

                        <div className="row row-front digitialism">
                            <div className="col-5 text-right">
                                <div className="numbers">
                                    {this.state.score}
                                </div>
                            </div>
                            <div className="col-6 text-right">
                                <div className="numbers">
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

                        <div className="row">
                            <div className="col-12">Prochain record à battre ({this.state.nextAward.username})</div>
                        </div>

                        <div className="row row-front">
                            <div className="col-8 text-right">
                                <div className="digitialism numbers">
                                    {this.state.nextAward.points}
                                </div>
                            </div>
                        </div>

                        <div className="digitialism next-award-bgd numbers">
                            888
                        </div>
                    </div>
                </div>
            </div>
        </div>;

        const gameOver = <div className="row">
            <div className="col-12 text-center">
                Bravo, t'as fait {this.state.score} points !!
            </div>

            <div className="col-12 text-center">
                <button className="btn-3d green" onClick={this.start}>Restart !</button>
            </div>

            <div className="col-12 text-center">
                <Podium/>
            </div>
        </div>;

        return (
            <div className="container-fluid app">
                <div className="row align-items-center full-h">
                    <div className="col">
                        {this.state.step === 'w' && waitingConnection}
                        {this.state.step === 'm' && main}
                        {this.state.step === 'p' && playing}
                        {this.state.step === 'g' && gameOver}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;