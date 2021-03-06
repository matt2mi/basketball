import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Podium from './components/podium/Podium';
import Congrats from './components/congrats/Congrats';
import {Client} from 'nes';
import {Howl} from 'howler';
import buzzerSound from './sounds/buzzer.mp3';
import bucketSound from './sounds/bucket_coin.mp3';
import crowdSound from './sounds/crowd.mp3';
import endSound from './sounds/fin_possession.mp3';

// TODO : erreur sur connection au client
// TODO : finish divide in components + css too

class App extends Component {

    // cli = new Client('ws://localhost:3005');
    cli;

    constructor(props) {
        super(props);
        this.state = {
            step: 'w',
            countdown: 30,
            score: 0,
            scores: [],
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

        const domain = window.location.href.substr(7).split(':')[0];
        this.cli = new Client('ws://' + domain + ':3005');

        this.buzzer = new Howl({src: [buzzerSound]});
        this.bucket = new Howl({src: [bucketSound]});
        this.crowd = new Howl({src: [crowdSound]});
        this.end = new Howl({src: [endSound]});
        this.endStarted = false;

        this.cli
            .connect()
            .then(this.clientConnected);

        this.getScores();
    }

    clientConnected() {
        this.setState({step: 'm',});
        this.cli.subscribe('/time', this.handleTime);
        this.cli.subscribe('/swish', this.handleScore);
        this.cli.subscribe('/gameover', this.gameOver);
    }

    handleScore(update, flags) {
        this.bucket.play();

        console.log('swish !', update);
        this.setState({score: update.score});
        this.setNextAward();
    }

    handleTime(update, flags) {
        if(update.time < 7 && !this.endStarted) {
            this.end.play();
            this.endStarted = true;
        }

        this.setState({countdown: update.time});
    }

    start() {
        this.crowd.play();

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
        this.end.stop();
        this.crowd.stop();
        this.buzzer.play();
        this.buzzer.fade(1, 0, 2000);

        console.log('gameOver', update);
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
                const orderedScores = scores
                    .sort((currScore, prevScore) => prevScore.score - currScore.score);
                this.setState({scores: orderedScores});
            })
            .catch(err => this.setState({scoresErrorMsg: err}));
    }

    setNextAward() {
        const reverseList = Array.from(this.state.scores).reverse();
        const nextAward = reverseList.find(score => score.score > this.state.score);
        if (nextAward) {
            this.setState({nextAward});
        } else {
            this.setState({nextAward: {username: 'C\'est toi ouaich !!', points: '---'}});
        }
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
                {this.state.scores.length > 1 ? <Podium scores={this.state.scores}/> : null}
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
                                    {this.state.nextAward.score}
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
                <Congrats score={this.state.score} updateScores={this.getScores}/>
            </div>

            <div className="col-12 col-sm-6 text-center">
                {this.state.scores.length > 1 ? <Podium scores={this.state.scores}/> : null}
            </div>

            <div className="col-12 col-sm-6 text-center">
                <button className="btn-3d green" onClick={this.start}>Restart !</button>
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
