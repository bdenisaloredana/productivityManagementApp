import React, { useContext, useEffect, useReducer } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "./AuthProvider";
import { ListWithTasksProps } from "../../models/ListWithTasksProps";
import { getListWithTasksApi } from "../apis/listApi";
import { TasksContext } from "./TasksProvider";

type FetchTasksListsFn = (listId: string) => Promise<any>

export interface ListWithTasksState {
    listsWithTasks?: ListWithTasksProps[];
    fetching: boolean;
    fetched: boolean;
    fetchingError?: Error | null;
    updating: boolean;
    updated: boolean;
    updatingError?: Error | null;
    fetchListWithTasks?: FetchTasksListsFn;
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: ListWithTasksState = {
    fetching: false,
    fetched: false,
    updating: false,
    updated: false
}

const FETCH_LIST_WITH_TASKS_STARTED = 'FETCH_LIST_WITH_TASKS_STARTED';
const FETCH_LIST_WITH_TASKS_SUCCEDED = 'FETCH_LIST_WITH_TASKS_SUCCEDED';
const FETCH_LIST_WITH_TASKS_FAILED = 'FETCH_LIST_WITH_TASKS_FAILED';
const UPDATE_LISTS_WITH_TASKS_STARTED = 'UPDATE_LISTS_WITH_TASKS_STARTED';
const UPDATE_LISTS_WITH_TASKS_SUCCEDED = 'UPDATE_LISTS_WITH_TASKS_SUCCEDED';
const UPDATE_LISTS_WITH_TASKS_FAILED = 'UPDATE_LISTS_WITH_TASKS_FAILED';

const reducer: (state: ListWithTasksState, action: ActionProps) => ListWithTasksState =
  (state, { type, payload }) => {
    switch (type) {
        case FETCH_LIST_WITH_TASKS_STARTED:
            return { ...state, fetching: true, fetched: false, fetchingError: null };
        case FETCH_LIST_WITH_TASKS_SUCCEDED:
            const fetchedListWithTasks = payload.listWithTasks;
            const modifiedListsWithTasks = [...(state.listsWithTasks || [])];
            const fetchedTasksListIndex = modifiedListsWithTasks.findIndex(taskList => taskList.list._id === fetchedListWithTasks.list._id);
            if(fetchedTasksListIndex !== -1){
                modifiedListsWithTasks[fetchedTasksListIndex] = fetchedListWithTasks;
            } else {
                modifiedListsWithTasks.splice(0, 0, fetchedListWithTasks);
            }

            return { ...state, fetching: false, fetched: true, listsWithTasks: modifiedListsWithTasks };
        case FETCH_LIST_WITH_TASKS_FAILED:
            return { ...state, fetching: false, fetchingError: payload.error };
        case UPDATE_LISTS_WITH_TASKS_STARTED:
            return { ...state, updating: true, updated: false, updatingError: null };
        case UPDATE_LISTS_WITH_TASKS_SUCCEDED:
            return { ...state, updating: false, updated: true, listsWithTasks: payload.updatedListsWithTasks };
        case UPDATE_LISTS_WITH_TASKS_FAILED:
            return { ...state, updating: false, updatingError: payload.error };
        default:
            return state;
    }
  };


export const ListWithTasksContext = React.createContext<ListWithTasksState>(initialState);

interface ListWithTasksProviderProps {
    children: PropTypes.ReactNodeLike
}

export const ListWithTasksProvider: React.FC<ListWithTasksProviderProps> = ({ children }) => {
    const { token } = useContext(AuthContext);
    const { tasks } = useContext(TasksContext);
    useEffect(updateTasksListEffect, [tasks]);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { listsWithTasks, fetching, fetched, fetchingError, updated, updating } = state;
    const value = { listsWithTasks, fetching, fetched, fetchingError, updating, updated, fetchListWithTasks };


    return (
        <ListWithTasksContext.Provider value={value}>
            {children}
        </ListWithTasksContext.Provider>
    )

    async function fetchListWithTasks(listId: string) {
        try {
            dispatch({ type: FETCH_LIST_WITH_TASKS_STARTED});
            const listWithTasks = await getListWithTasksApi(token, listId);
            dispatch({ type: FETCH_LIST_WITH_TASKS_SUCCEDED, payload: { listWithTasks: listWithTasks } });
        } catch (error) {
            dispatch({ type: FETCH_LIST_WITH_TASKS_FAILED, payload: { error: error } });
          }
    }

    function updateTasksListEffect(){
        try {
            if(tasks === undefined || listsWithTasks === undefined){
                return;
            }

            dispatch({ type: UPDATE_LISTS_WITH_TASKS_STARTED });

            let updatedListsWithTasks: ListWithTasksProps[] = [];
            for(const listWithTasks of listsWithTasks){
                const currentTasks = tasks.filter(task => task.listId === listWithTasks.list._id);
                updatedListsWithTasks.push({ list: listWithTasks.list, tasks: currentTasks });
            }

            dispatch({ type: UPDATE_LISTS_WITH_TASKS_SUCCEDED, payload: { updatedListsWithTasks: updatedListsWithTasks } });
        } catch(error){
            dispatch({ type: UPDATE_LISTS_WITH_TASKS_FAILED, payload: { error: error } });
        }
    }
}