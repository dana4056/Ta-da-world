import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import router from './router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { CookiesProvider } from 'react-cookie';
import persistedReducer from './stores';
import './index.css';

const store = createStore(persistedReducer);
const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<CookiesProvider>
			<PersistGate loading={null} persistor={persistor}>
				<RouterProvider router={router} />
			</PersistGate>
		</CookiesProvider>
	</Provider>
	// </React.StrictMode>
);
