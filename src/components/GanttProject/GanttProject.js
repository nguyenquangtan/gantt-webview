import React, { Component } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import History from '../../History';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './GanttProject.css';

function getDateOnly(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); 
    var yyyy = date.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}

function getTimeOnly(date) {
    var H = String(date.getHours()).padStart(2, '0'); 
    var i = String(date.getMinutes()).padStart(2, '0');    
    var S = String(date.getSeconds()).padStart(2, '0');
    return H + ':' + i + ':' + S;
}

function dateDifferenceDaysHours(start, end) {
    var day = Math.floor((end - start)/(1000*60*60*24));
    var hour = Math.floor((end - start)%(1000*60*60*24)/(1000*60*60));
    if (hour == 0) {
        return String(day) + 'd';
    }
    return String(day) + 'd' + String(hour) + 'h';  
}

function highlightToday(date) {
    var today = new Date();
    if (getDateOnly(date) == getDateOnly(today)) {
        return "today";
    }
}
 
class GanttProject extends Component {
    initZoom() {
        gantt.ext.zoom.init({
            levels: [
                {
                    name: 'Days',
                    scales: [
                        { unit: 'month', step: 1, format: '%F' },
                        { unit: 'day', step: 1, format: '%j, %D', css: highlightToday}
                    ]
                },
                {
                    name: 'Months',
                    scales: [
                        { unit: 'year', step: 1, format: '%Y' },
                        { unit: 'month', step: 1, format: '%M' }
                    ]
                },
                {
                    name: 'Years',
                    scales: [
                        { unit: "year", step: 1, format: '%Y' }
                    ]   
                }
            ]
        });
    }

    setZoom(value) {
        if(!gantt.$initialized){
            this.initZoom();
        }
        gantt.ext.zoom.setLevel(value);
        localStorage.setItem('zoomMode', value);
    }

    setClickingNavigation() {
        const { tasks, zoom } = this.props;
        if(gantt._myClickHandler){
            gantt.detachEvent(gantt._myClickHandler);
        }

        gantt._myClickHandler = gantt.attachEvent('onTaskClick', function(id, e) {
            localStorage.setItem('zoomMode', zoom);
            History.push({
                pathname: '/task',
                state: { projectID: id , projects_and_tasks: tasks }
            });
        });
    }
    
    shouldComponentUpdate(nextProps) {
        return this.props.zoom !== nextProps.zoom;
    }

    componentDidUpdate() {
        gantt.render();
        var today = new Date();
        var position = gantt.posFromDate(today);
        gantt.scrollTo(position);
    }

    componentDidMount() {
        gantt.config.date_format = "%Y-%m-%d %H:%i:%s"; 
        gantt.config.columns = [];
        gantt.config.show_task_cells = false;
        gantt.config.drag_progress = false;
        gantt.config.drag_links = false;

        const { tasks } = this.props;
        
        var today = new Date();
        var position = gantt.posFromDate(today);
        gantt.scrollTo(position);
        
        gantt.templates.scale_cell_class = function(date) {
            if (getDateOnly(date) == getDateOnly(today)) {
                return "today";
            }
        };

        gantt.plugins({ 
            marker: true 
        });
 
        var id = gantt.addMarker({ 
            start_date: today, 
            css: "today_marker",
            title: getTimeOnly(today)
        });

        setInterval(function() {
            var today = gantt.getMarker(id);
            today.start_date = new Date();
            today.title = getTimeOnly(today.start_date);
            gantt.updateMarker(id);
        }, 1000);

        gantt.templates.task_text=function(start,end,task){
            if (task.type == 'project')
                return "<b>" + task.text + "</b>"; 
            return "<b>" + task.users + " - " + task.text + "</b>";
        };

        //gantt.templates.progress_text=function(start, end, task){return `<div style = "text-align: left; display: flex; justify-items: center; padding-left: 5px">`+ task.progress * 100 + "%</div>";};
        
        gantt.templates.leftside_text = function(start, end, task){
            return `<div style = "background-color: #a2b969; padding: 0 5px; color: white; border-radius: 20px; height : 70%; display: flex; align-items: center; margin-right: -15px; margin-top: 5px">`+ task.progress * 100 + "%</div>";;
        };

        gantt.templates.rightside_text = function(start, end, task){
            if (end - today <= 0)
                return "";
            return `<div style = "background-color: gray; padding: 0 5px; color: white; border-radius: 20px; height : 70%; display: flex; align-items: center; margin-left: -15px; margin-top: 5px">`+ dateDifferenceDaysHours(today, end) + "</div>";
        };

        gantt.attachEvent("onBeforeTaskDisplay", function(id, task) {
            if (task.parent)
                return false;
            return true;
        });

        gantt.init(this.ganttContainer);
        gantt.parse(tasks);
    }

    render() {
        const { zoom } = this.props;
        this.setZoom(zoom);
        this.setClickingNavigation();
        return (
            <div
                ref={(input) => { this.ganttContainer = input }}
                style={{ width: '100%', height: '100%' }}
            ></div>
        );
    }
}

export default withRouter(GanttProject);