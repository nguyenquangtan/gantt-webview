import React, {Component} from 'react';
import {Router, Switch, Route, Link} from 'react-router-dom';
import History from './History';
import Project from './Project';
import Task from './Task';

class App extends Component {
    render() {
        window.onpopstate = () => {
            window.location.reload();
        }
        return(
            <Router history={History} forceRefresh={true}>
                <Switch>
                    <Route exact path='/' component={Project} />
                    <Route path='/task' component={Task} />
                </Switch>
            </Router>
        )
    }
}

export default App;