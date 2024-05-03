import React from "react";
import Navbar from "./compoent/Navbar";
import Pacientes from "./compoent/Pacientes";
import Alimentos from "./compoent/Alimentos";
import Medicamentos from "./compoent/Medicamentos";
import Contact from "./compoent/Usuarios";
import Funcionarios from "./compoent/Funcionarios";
import Login from "./compoent/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login} exact />
        <Route>
          <Navbar />
          <div className="main-content">
            <Switch>
              <Route path="/pacientes" component={Pacientes} exact />
              <Route path="/alimentos" component={Alimentos} exact />
              <Route path="/medicamentos" component={Medicamentos} exact />
              <Route path="/funcionarios" component={Funcionarios} exact />
            </Switch>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
