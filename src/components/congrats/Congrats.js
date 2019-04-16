import React, {Component} from "react";
import './Congrats.css';
import congrats from './congrats.jpeg';
import enter from './enter.png';

class Podium extends Component {

    constructor(props) {
        super(props);
        this.state = {
            score: 30,
            pseudo: '',
            savedScore: false
        };

        this.onKeyDown = this.onKeyDown.bind(this);
        this.pseudoChange = this.pseudoChange.bind(this);
    }

    componentDidMount() {
        this.saveInput.focus();
    }

    onKeyDown(event) {
        if (event.key === 'Enter' && this.state.pseudo.length > 0) {
            event.preventDefault();
            event.stopPropagation();
            console.log('save ' + this.state.score + ' to ' + this.state.pseudo);
            fetch('/api/addScore/' + this.state.pseudo + '/' + this.state.score)
                .then(() => {
                    console.log('saved');
                    this.setState({savedScore: true});
                })
                .catch(error => console.error(error));
        }
    }

    pseudoChange(evt) {
        this.setState({pseudo: evt.target.value});
    }

    render() {
        return (
            <div className="row justify-content-center mb-3 mt-3">
                <div className="col-6">
                    <img src={congrats} alt="congrats" className="congrats-meme"/>
                </div>

                {
                    !this.state.savedScore ?
                        <div className="col-6">
                            <div className="row">
                                <div className="col-11 congrats-txt">
                                    Sauvegarde tes {this.state.score} points
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-11">
                                    <img src={enter} alt="enter" className="enter-ico"/>
                                    <input type="text" className="form-control" placeholder="pseudo..."
                                           value={this.state.pseudo}
                                           onChange={this.pseudoChange}
                                           ref={(input) => {
                                               this.saveInput = input;
                                           }}
                                           onKeyDown={this.onKeyDown}
                                    />
                                </div>
                            </div>
                        </div> :
                        <div className="col-6">
                            <div className="row">
                                <div className="col-11 congrats-txt">
                                    Sauvegardé !
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default Podium;