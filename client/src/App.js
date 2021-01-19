import React from 'react';
import {Provider} from "react-redux";

import {MainComponent} from './components/mainComponent';
import store from "./redux/store";

import './App.css';

export const App = () => {
    return (
        <Provider store={store}>
            <MainComponent/>
        </Provider>
    );
};
