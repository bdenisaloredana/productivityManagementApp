import React, { useContext, useEffect, useReducer } from "react";
import PropTypes from 'prop-types';
import { ListProps } from "../../models/ListProps";
import { AuthContext } from "../../core/providers/AuthProvider";
import { createListApi, deleteListApi, getListsForUserApi } from "../apis/listApi";

type CreateListFn = (newList: ListProps) => Promise<any>
type DeleteListFn = (listId: string) => Promise<any>

export interface ListsState {
    lists?: ListProps[];
    fetching: boolean;
    fetched: boolean;
    fetchingError?: Error | null;
    saving: boolean;
    saved: boolean;
    savingError?: Error | null;
    deleting: boolean;
    deleted: boolean;
    deletingError?: Error | null;
    createList?: CreateListFn;
    deleteList?: DeleteListFn;
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: ListsState = {
    fetching: false,
    fetched: false,
    saving: false,
    saved: false,
    deleting: false,
    deleted: false
}

const FETCH_LISTS_STARTED = 'FETCH_LISTS_STARTED';
const FETCH_LISTS_SUCCEEDED = 'FETCH_LISTS_SUCCEEDED';
const FETCH_LISTS_FAILED = 'FETCH_LISTS_FAILED';
const SAVE_LIST_STARTED = 'SAVE_LISTS_STARTED';
const SAVE_LIST_SUCCEEDED = 'SAVE_LISTS_SUCCEEDED';
const SAVE_LIST_FAILED = 'SAVE_LISTS_FAILED';
const DELETE_LIST_STARTED = 'DELETE_LIST_STARTED';
const DELETE_LIST_SUCCEDED = 'DELETE_LIST_SUCCEDED';
const DELETE_LIST_FAILED = "DELETE_LIST_FAILED";

const reducer: (state: ListsState, action: ActionProps) => ListsState =
  (state, { type, payload }) => {
    switch (type) {
      case FETCH_LISTS_STARTED:
        return { ...state, fetching: true, fetched: false, fetchingError: null };
      case FETCH_LISTS_SUCCEEDED:
        return { ...state, lists: payload.lists, fetching: false, fetched: true };
      case FETCH_LISTS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      case SAVE_LIST_STARTED:
        return { ...state, savingError: null, saving: true, saved: false };
      case SAVE_LIST_SUCCEEDED:
        const newLists = [...(state.lists || [])];
        const newList = payload.list;
        const index = newLists.findIndex(list => list._id === newList._id);
        if (index === -1) {
          newLists.splice(0, 0, newList);
        } else {
          newLists[index] = newList;
        }
        return { ...state, lists: newLists, saving: false, saved: true };
      case SAVE_LIST_FAILED:
        return { ...state, savingError: payload.error, saving: false };
      case DELETE_LIST_STARTED:
        return { ...state, deleting: true, deleted: false, deletingError: null };
      case DELETE_LIST_SUCCEDED:
        const deletedListId = payload.deletedListId;
        const updatedLists = [...(state.lists || [])];
        const deletedListIndex = updatedLists.findIndex(list => list._id === deletedListId);
        if(deletedListIndex !== -1){
          updatedLists.splice(deletedListIndex, 1);
        }

        return { ...state, deleted: true, deleting: false, lists: updatedLists };
      case DELETE_LIST_FAILED:
        return { ...state, deleting: false, deletingError: payload.error };
      default:
        return state;
    }
  };


export const ListsContext = React.createContext<ListsState>(initialState);

interface ListsProviderProps {
    children: PropTypes.ReactNodeLike
}

export const ListsProvider: React.FC<ListsProviderProps> = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { lists, fetching, fetched, fetchingError, saving, saved, savingError, deleting, deleted, deletingError } = state;
    useEffect(getTasksListsEffect, [token]);
    const value = { lists, fetching, fetched, fetchingError, saving, saved, savingError, deleting, deleted, deletingError, createList, deleteList };


    return (
        <ListsContext.Provider value={value}>
            {children}
        </ListsContext.Provider>
    )

    function getTasksListsEffect() {
        let canceled = false;
        if (token) {
          fetchTasksLists();
        }

        return () => {
          canceled = true;
        }
    
        async function fetchTasksLists() {
          try {
            dispatch({ type: FETCH_LISTS_STARTED });
            const lists = await getListsForUserApi(token);
            
            if (!canceled) {
              dispatch({ type: FETCH_LISTS_SUCCEEDED, payload: { lists: lists } });
            }
          } catch (error) {
            dispatch({ type: FETCH_LISTS_FAILED, payload: { error: error } });
          }
        }
    }

    async function createList(newList: ListProps){
        try {
            dispatch({ type: SAVE_LIST_STARTED });
            const savedList = await createListApi(newList, token);
            dispatch({ type: SAVE_LIST_SUCCEEDED, payload: { list: savedList } });
        } catch(error){
            dispatch({ type: SAVE_LIST_FAILED, payload: { error: error } });
        }
    }

    async function deleteList(listId: string) {
      try {
        dispatch({ type: DELETE_LIST_STARTED });
        await deleteListApi(listId, token);
        dispatch({ type: DELETE_LIST_SUCCEDED, payload: { deletedListId: listId }});
      }catch(error){
        dispatch({ type: DELETE_LIST_FAILED, payload: { error: error } });
      }
    }
}