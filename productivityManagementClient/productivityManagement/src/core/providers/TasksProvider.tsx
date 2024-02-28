import React, { useContext, useEffect, useReducer } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "./AuthProvider";
import { TaskProps } from "../../models/TaskProps";
import { createTaskApi, deteteTaskApi, getTasksForUserApi, updateTaskApi } from "../apis/taskApi";

type CreateTaskFn = (task: TaskProps) => Promise<any>
type DeleteTaskFn = (taskId: string) => Promise<any>

export interface TasksState {
    tasks?: TaskProps[];
    fetching: boolean;
    fetched: boolean;
    fetchingError?: Error | null;
    deleting: boolean;
    deleted: boolean;
    deletingError?: Error | null;
    saving: boolean;
    saved: boolean;
    savingError?: Error | null;
    saveTask?: CreateTaskFn;
    deleteTask?: DeleteTaskFn;
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: TasksState = {
    fetching: false,
    fetched: false,
    deleting: false,
    deleted: false,
    saving: false,
    saved: false
}

const FETCH_TASKS_STARTED = 'FETCH_TASKS_STARTED';
const FETCH_TASKS_SUCCEDED = 'FETCH_TASKS_SUCCEDED';
const FETCH_TASKS_FAILED = 'FETCH_TASKS_FAILED';
const DELETE_TASK_STARTED = 'DELETE_TASK_STARTED';
const DELETE_TASK_SUCCEDED = 'DELETE_TASK_SUCCEDED';
const DELETE_TASK_FAILED = 'DELETE_TASK_FAILED';
const SAVE_TASK_STARTED = 'SAVE_TASK_STARTED';
const SAVE_TASK_SUCCEEDED = 'SAVE_TASK_SUCCEEDED';
const SAVE_TASK_FAILED = 'SAVE_TASK_FAILED';

const reducer: (state: TasksState, action: ActionProps) => TasksState =
  (state, { type, payload }) => {
    switch (type) {
        case FETCH_TASKS_STARTED:
            return { ...state, fetching: true, fetched: false, fetchingError: null };
        case FETCH_TASKS_SUCCEDED:
            return { ...state, fetching: false, fetched: true, tasks: payload.tasks };
        case FETCH_TASKS_FAILED:
            return { ...state, fetching: false, fetchingError: payload.error };
        case DELETE_TASK_STARTED:
            return { ...state, deleting: true, deleted: false, deletingError: null };
        case DELETE_TASK_SUCCEDED:
            const newTasks = [...(state.tasks || [])];
            const taskId = payload.taskId;
            const taskIndex = newTasks.findIndex(task => task._id === taskId);
            if(taskIndex !== -1){
                newTasks.splice(taskIndex, 1);
            }

            return { ...state, tasks: newTasks, deleted: true, deleting: false };
        case DELETE_TASK_FAILED:
            return { ...state, deletingError: payload.error, deleting: false };
        case SAVE_TASK_STARTED:
            return { ...state, savingError: null, saving: true, saved: false };
        case SAVE_TASK_SUCCEEDED:
            const tasks = [...(state.tasks || [])];
            const newTask = payload.newTask;
            const newTaskIndex = tasks.findIndex(task => task._id === newTask._id);
            if (newTaskIndex === -1) {
                tasks.splice(0, 0, newTask);
            } else {
                tasks[newTaskIndex] = newTask;
            }

            return { ...state, tasks: tasks, saving: false, saved: true };
        case SAVE_TASK_FAILED:
            return { ...state, savingError: payload.error, saving: false };
        default:
            return state;
    }
  };


export const TasksContext = React.createContext<TasksState>(initialState);

interface TasksProviderProps {
    children: PropTypes.ReactNodeLike
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { tasks, fetching, fetched, fetchingError, deleting, deleted, deletingError, saving, saved, savingError } = state;
    useEffect(getTasksEffect, [token]);
    const value = { tasks, fetching, fetched, fetchingError, deleting, deleted, deletingError, saving, saved, savingError, saveTask, deleteTask };


    return (
        <TasksContext.Provider value={value}>
            {children}
        </TasksContext.Provider>
    )

    function getTasksEffect() {
        let canceled = false;
        if (token) {
          fetchTasks();
        }

        return () => {
          canceled = true;
        }
    
        async function fetchTasks() {
          try {
            dispatch({ type: FETCH_TASKS_STARTED});
            const tasks = await getTasksForUserApi(token);

            if (!canceled) {
              dispatch({ type: FETCH_TASKS_SUCCEDED, payload: { tasks: tasks } });
            }
          } catch (error) {
            dispatch({ type: FETCH_TASKS_FAILED, payload: { error: error } });
          }
        }
    }

    async function saveTask(task: TaskProps){
        try {
            dispatch({ type: SAVE_TASK_STARTED });
            const savedTask = await (task._id ? updateTaskApi(task, token) :createTaskApi(task, token));
            dispatch({ type: SAVE_TASK_SUCCEEDED, payload: { newTask: savedTask } });
        } catch(error){
            dispatch({ type: SAVE_TASK_FAILED, payload: { error: error } });
        }
    }

    async function deleteTask(taskId: string){
        try{
            dispatch({ type: DELETE_TASK_STARTED });
            await deteteTaskApi(taskId, token);
            dispatch({ type: DELETE_TASK_SUCCEDED, payload: { taskId: taskId } });
        } catch(error){
            dispatch({ type: DELETE_TASK_FAILED, payload: { error: error } });
        }
    }
}