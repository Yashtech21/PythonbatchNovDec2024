import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdvisorForm from './components/AdvisorForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="text-center mb-4 text-primary">
              Advisor Information Form
            </h1>
            <AdvisorForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
