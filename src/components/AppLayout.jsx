import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import './AppLayout.css';

export default function AppLayout() {
    return (
        <div id="app">
            <Header />
            <Outlet />
        </div>
    );
}