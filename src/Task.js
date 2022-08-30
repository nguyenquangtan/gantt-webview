import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import GanttTask from './components/GanttTask';
import Toolbar from './components/Toolbar';
import './App.css';

class Task extends Component {
    state = {
        currentZoom: 'Days'
    };
  
    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom
        });
    }
    
    render() {
        const { currentZoom } = this.state;
        return (
            <div>
                <div className="zoom-bar">
                    <Toolbar
                        zoom={currentZoom}
                        onZoomChange={this.handleZoomChange}
                    />
                </div>
                <div className="gantt-task-container">
                    <GanttTask
                        tasks={this.props.location.state.projects_and_tasks}
                        projectID={this.props.location.state.projectID}
                        zoom={currentZoom}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(Task);