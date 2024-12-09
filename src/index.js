import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './index.css';
// import { App } from './App';
import { MainComponent } from './components/MainComponent';
import { LoginComponent } from './components/LoginComponent';
import { SignUpComponent } from './components/SignupComponent';
import reportWebVitals from './reportWebVitals';
import { HeaderComponent } from './components/HeaderComponent';
import { SanDetailComponent } from './components/SanDetailComponent';
import { DatSanNgayComponent } from './components/DatSanNgayComponent';
import { AuthProvider } from './cores/AuthProvider';
import { RequireAuthRoute } from './cores/RequireAuthRoute';
import { LayoutComponent } from './components/LayoutComponent';
import { DatLichComponent } from './components/DatLichComponent';
import { ThemSanComponent } from './components/ThemSanComponent';
import { KetQuaDatSan } from './services/KetQuaDatSan';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/signup" element={<SignUpComponent />} />
        <Route path="/tao-san" element={<ThemSanComponent />} />
        <Route path="/" element={<LayoutComponent />} >
          <Route index element={<MainComponent />} />
          <Route path="detail/:sanId" element={<SanDetailComponent />} />
          <Route path="dat-san/:sanId" element={<DatSanNgayComponent />} />
          <Route path="ket-qua-dat-san" element={<KetQuaDatSan />} />
          <Route path="dat-san-ngay/:sanId" element={
            <RequireAuthRoute>
              <DatLichComponent />
            </RequireAuthRoute>
          } />
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
