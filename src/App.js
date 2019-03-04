import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Client} from "nes";

// TODO : afficher prochain record à battre en cours de partie
// TODO : finish divide in components + css too

class App extends Component {

    cli = new Client('ws://localhost:3005');

    // cli = new Client('ws://192.168.0.10:3005');

    constructor(props) {
        super(props);
        this.state = {
            step: 'w',
            countdown: 30,
            score: 0,
            scores: [
                {username: 'mimil', points: 120},
                {username: 'mimil', points: 8},
                {username: 'mimil', points: 90},
                {username: 'mimil', points: 100},
                {username: 'mimil', points: 5},
                {username: 'mimil', points: 4},
                {username: 'mimil', points: 3}
            ],
            scoresErrorMsg: ''
        };

        this.handleScore = this.handleScore.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.start = this.start.bind(this);
        this.gameOver = this.gameOver.bind(this);
        this.restart = this.restart.bind(this);
        this.getScores = this.getScores.bind(this);

        this.cli
            .connect()
            .then(() => {
                this.setState({
                    connected: true,
                    step: 'm',
                    scores: this.state.scores
                        .sort((currScore, prevScore) => currScore.points - prevScore.points)
                });
                this.cli.subscribe('/time', this.handleTime);
                this.cli.subscribe('/swish', this.handleScore);
                this.cli.subscribe('/gameover', this.gameOver);
            });

        // this.getScores();
    }

    handleScore(update, flags) {
        console.log('swish !', update);
        this.setState({score: update.score});
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
            .then(scores => {
                scores = scores.sort((currScore, prevScore) => currScore.points - prevScore.points);
                this.setState({scores});
            })
            .catch(err => this.setState({scoresErrorMsg: err}));
    }

    render() {
        const scores = <div className="row">
            <div className="col-12 mb-80">
                <div className="second">
                    <span className="number-two">2</span>
                    {this.state.scores[1].username}
                    <br/>
                    {this.state.scores[1].points + ' points'}
                </div>
                <span className="first-bgd-top-left"/>
                <span className="first-bgd-top-right"/>
                <span className="first-bgd-bottom"/>
                <div className="first">
                    <span className="number-one">1</span>
                    {this.state.scores[0].username}
                    <br/>
                    {this.state.scores[0].points + ' points'}
                </div>
                <div className="third">
                    <span className="number-three">3</span>
                    {this.state.scores[2].username}
                    <br/>
                    {this.state.scores[2].points + ' points'}
                </div>
            </div>
            {
                this.state.scoresErrorMsg.length > 0 ?
                    <div className="col-12 text-center">
                        Erreur getting scores : {this.state.scoresErrorMsg}
                    </div> :
                    this.state.scores.slice(3, 5).map((score, id) => (
                        <div className="col-4 offset-4 text-center" key={id}>
                            {(id + 4) + 'ème'}
                            <br/>
                            {score.username + ' : ' + score.points + ' points'}
                            {id < 1 ? <hr/> : null}
                        </div>
                    ))
            }
        </div>;

        const waitingConnection = <div className="row">
            <div className="col-12 text-center">
                <img src={logo} className="App-logo" alt="logo"/>
            </div>
        </div>;

        const startBtn = <div className="col-12 text-center row-start">
            <button className="btn-3d green" onClick={this.start}>Start !</button>
        </div>;

        const restartBtn = <div className="col-12 text-center row-start">
            <button className="btn-3d green" onClick={this.start}>Restart !</button>
        </div>;

        const main = <div className="row">
            {startBtn}
            <div className="col-12 text-center">
                {scores}
            </div>
        </div>;

        const partying = <div className="row justify-content-center">
            <div className="clock-size">
                <div className="row clock-border mx-3">
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

        const gameOver = <div className="row">
            <div className="col-12 text-center">
                Bravo, t'as fait {this.state.score} points !!
            </div>
            {restartBtn}
            <div className="col-12 text-center">
                {scores}
            </div>
        </div>;

        return (
            <div className="container-fluid app">
                <div className="row align-items-center full-h">
                    <div className="col">
                        {this.state.step === 'w' && waitingConnection}
                        {this.state.step === 'm' && main}
                        {this.state.step === 'p' && partying}
                        {this.state.step === 'g' && gameOver}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;