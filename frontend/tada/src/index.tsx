import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import router from './router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import store from './stores';
import './index.css';

const stores = createStore(store);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<React.StrictMode>
		<Provider store={stores}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
);
