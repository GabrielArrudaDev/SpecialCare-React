import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Pacientes from "./compoent/Pacientes";
import Alimentos from "./compoent/Alimentos";
import Medicamentos from "./compoent/Medicamentos";
import Usuarios from "./compoent/Usuarios";
import Funcionarios from "./compoent/Funcionarios";
import Login from "./compoent/Login";

function App() {
  const isLoggedIn = !!localStorage.getItem("funcaoUsuario");

  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/pacientes" component={Pacientes} exact />
        <Route path="/alimentos" component={Alimentos} exact />
        <Route path="/medicamentos" component={Medicamentos} exact />
        <Route path="/funcionarios" component={Funcionarios} exact />
        <Route path="/usuarios" component={Usuarios} exact />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
