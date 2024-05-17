import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Pacientes from "./compoent/Pacientes";
import Alimentos from "./compoent/Alimentos";
import Medicamentos from "./compoent/Medicamentos";
import Usuarios from "./compoent/Usuarios";
import Funcionarios from "./compoent/Funcionarios";
import Login from "./compoent/Login";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login} exact />
        <Route>
          <Route path="/pacientes" exact>
            <Pacientes />
          </Route>
          <Route path="/alimentos" exact>
            <Alimentos />
          </Route>
          <Route path="/medicamentos" exact>
            <Medicamentos />
          </Route>
          <Route path="/funcionarios" exact>
            <Funcionarios />
          </Route>
          <Route path="/usuarios" exact>
            <Usuarios />
          </Route>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
