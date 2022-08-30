import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import GanttProject from './components/GanttProject';
import Toolbar from './components/Toolbar';
import './App.css';
//Zoom.state.zoomMode
class Project extends Component {
    setZoomMode() {
        const zoom = localStorage.getItem('zoomMode');
        if (!zoom) {
            localStorage.setItem('zoomMode', 'Days');
            return 'Days';
        }
        return zoom;
    }
    
    state = {
        currentZoom: this.setZoomMode(),
        projects: { 
            data: [
                { id: 1, text: 'Project 1', type: 'project', open:true},   
                { id: 2, text: 'Task 1 - Project 1', start_date: '2022-08-15 23:59:00', duration: 2, progress: 0.2, parent: 1 },
                { id: 3, text: 'Task 2 - Project 1', start_date: '2022-09-01 23:59:00', duration: 3, progress: 0.3, parent: 1 },
                { id: 4, text: 'Task 3 - Project 1', start_date: '2022-09-02 23:59:00', duration: 4, progress: 0.4, parent: 1 }, 
                { id: 5, text: 'Project 2', type: 'project', open:true},   
                { id: 6, text: 'Task 1 - Project 2', start_date: '2022-07-15 23:59', duration: 8, progress: 0.5, parent: 5 },
                { id: 7, text: 'Task 2 - Project 2', start_date: '2022-08-28 23:59', duration: 7, progress: 0.6, parent: 5 },
                { id: 8, text: 'Task 3 - Project 2', start_date: '2022-09-03 23:59', duration: 6, progress: 0.7, parent: 5 },
                { id: 9, text: 'Project 3', type: 'project', open:true},   
                { id: 10, text: 'Task 1 - Project 3', start_date: '2022-08-01 23:59', duration: 10, progress: 0.8, parent: 9 },
                { id: 11, text: 'Task 2 - Project 3', start_date: '2022-08-18 23:59', duration: 11, progress: 0.9, parent: 9 },
            ]
        }
    };
  
    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom
        });
    }
    
    render() {
        const { currentZoom } = this.state;
        const { projects } = this.state;
        return (
            <div>
                <div className="zoom-bar">
                    <Toolbar
                        zoom={currentZoom}
                        onZoomChange={this.handleZoomChange}
                    />
                </div>
                <div className="gantt-project-container">
                    <GanttProject
                        tasks={projects}
                        zoom={currentZoom}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(Project);