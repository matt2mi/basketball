import React, {Component} from "react";
import './Podium.css';

class Podium extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scores: [],
            scoresErrorMsg: ''
        };

        this.getScores = this.getScores.bind(this);

        this.getScores();
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

    render() {
        if (this.state.scores.length > 0) {
            return (
                <div>
                    <div className="row justify-content-center mb-3 mt-3">
                        <div className="cadre-podium">
                            <div className="second">
                                <span className="number-two">2</span>
                                {this.state.scores[1] ? this.state.scores[1].username : null}
                                <br/>
                                {this.state.scores[1] ? this.state.scores[1].points + ' points' : null}
                            </div>
                            <span className="first-bgd-top-left"/>
                            <span className="first-bgd-top-right"/>
                            <div className="first">
                                <span className="number-one">1</span>
                                {this.state.scores[0] ? this.state.scores[0].username : null}
                                <br/>
                                {this.state.scores[0] ? this.state.scores[0].points + ' points' : null}
                            </div>
                            <div className="third">
                                <span className="number-three">3</span>
                                {this.state.scores[2] ? this.state.scores[2].username : null}
                                <br/>
                                {this.state.scores[2] ? this.state.scores[2].points + ' points' : null}
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="cadre-list">
                            {
                                this.state.scoresErrorMsg.length > 0 ?
                                    <div className="text-center">
                                        Erreur getting scores : {this.state.scoresErrorMsg}
                                    </div> :
                                    this.state.scores.slice(3, 5).map((score, id) => (
                                        <div className="text-center" key={id}>
                                            {(id + 4) + 'ème'}
                                            <br/>
                                            {score.username + ' : ' + score.points + ' points'}
                                            {id < 1 ? <hr/> : null}
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Podium;