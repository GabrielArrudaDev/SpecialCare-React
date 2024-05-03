import React, { useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const Navbar = ({ userType }) => {
  const [mobile, setMobile] = useState(false);

  return (
    <>
      <nav className='navbar'>
        <h3 className='logo'>SpecialCare</h3>
        <ul className={mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
          <Link to='/pacientes' className='pacientes'>
            <li>Pacientes</li>
          </Link>
          <Link to='/alimentos' className='alimentos'>
            <li>Alimentos</li>
          </Link>
          <Link to='/medicamentos' className='medicamentos'>
            <li>Medicamentos</li>
          </Link>
          <Link to='/funcionarios' className='funcionarios'>
            <li>Funcionarios</li>
          </Link>
          <Link to='/usuarios' className='usuarios'>
            <li>Usuarios</li>
          </Link>

        </ul>
        <button className='mobile-menu-icon' onClick={() => setMobile(!mobile)}>
          {mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>
    </>
  );
};

export default Navbar;
