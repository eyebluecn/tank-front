// support IE >= 9
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './setupAxios';

ReactDOM.render(<App />, document.getElementById('root'));
