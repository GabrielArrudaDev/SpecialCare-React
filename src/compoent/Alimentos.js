import React, { useState, useEffect } from 'react';
import './App.css';
import './Navbar.css';
import { Link, useHistory } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";

function App() {
  const [alimentos, setAlimentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [adicionarAlimento, setAdicionarAlimento] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [novoAlimento, setNovoAlimento] = useState({ nome: '', alimento: '', horario: '', observacao: '' });
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [mobile, setMobile] = useState(false);
  const [funcaoUsuario, setFuncaoUsuario] = useState('');
  const history = useHistory();

  
  useEffect(() => {
    // Recupera a função do usuário do localStorage e a converte para minúsculas
    const funcao = localStorage.getItem('funcaoUsuario')?.toLowerCase();
    setFuncaoUsuario(funcao);
  }, []);

  useEffect(() => {
    async function fetchAlimentos() {
      try {
        const response = await fetch('http://localhost:8080/api/alimentos');
        const data = await response.json();
        setAlimentos(data);
      } catch (error) {
        console.error('Erro ao buscar alimentos:', error);
      }
    }
    fetchAlimentos();
  }, []);

  useEffect(() => {
    async function fetchPacientes() {
      try {
        const response = await fetch('http://localhost:8080/api/pacientes');
        const data = await response.json();
        setPacientes(data);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      }
    }
    fetchPacientes();
  }, []);

  const handleAdicionarAlimento = () => {
    setAdicionarAlimento(true);
  };

  const handleSalvarAlimento = async () => {
    try {
      setAdicionarAlimento(false);
      if (editandoId !== null) {
        await fetch(`http://localhost:8080/api/alimentos/${editandoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoAlimento),
        });
        setAlimentos(prevAlimentos =>
          prevAlimentos.map(alimento => (alimento.id === editandoId ? novoAlimento : alimento))
        );
        setEditandoId(null);
      } else {
        const response = await fetch('http://localhost:8080/api/alimentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoAlimento),
        });
        const data = await response.json();
        setAlimentos(prevAlimentos => [...prevAlimentos, data]);
      }
      setNovoAlimento({ nome: '', alimento: '', horario: '', observacao: '' });
    } catch (error) {
      console.error('Erro ao salvar alimento:', error);
    }
  };

  const handleExcluirAlimento = async id => {
    try {
      await fetch(`http://localhost:8080/api/alimentos/${id}`, {
        method: 'DELETE',
      });
      setAlimentos(prevAlimentos => prevAlimentos.filter(alimento => alimento.id !== id));
    } catch (error) {
      console.error('Erro ao excluir alimento:', error);
    }
  };

  const handleEditarAlimento = alimento => {
    setEditandoId(alimento.id);
    setNovoAlimento({ ...alimento });
  };

  const handleChange = (field, value) => {
    setNovoAlimento(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handlePesquisa = e => {
    setTermoPesquisa(e.target.value);
  };

  const alimentosFiltrados = alimentos.filter(alimento =>
    alimento.alimento.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const handleLogout = () => {
    // Limpa o localStorage e redireciona para a tela de login
    localStorage.clear();
    history.push('/login');
  };
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
          <Link to='/funcionarios' className={`funcionarios ${funcaoUsuario === 'familiar' ? 'hidden' : ''}`}>
            <li>Funcionarios</li>
          </Link>
          <Link to='/usuarios' className={`usuarios ${(funcaoUsuario === 'enfermeiro' || funcaoUsuario === 'familiar') ? 'hidden' : ''}`}>
            <li>Usuarios</li>
          </Link>
          <li onClick={handleLogout} className='logout'>Logout</li> {/* Adiciona um botão de logout */}
        </ul>
        <button className='mobile-menu-icon' onClick={() => setMobile(!mobile)}>
          {mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>
    <div className="App table-wrapper">
      <h1>Tabela de Alimentos</h1>
      <input
      className='pesquisar'
        type="text"
        placeholder="Pesquisar por nome do alimento..."
        value={termoPesquisa}
        onChange={handlePesquisa}
      />
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Alimento</th>
            <th>Horário</th>
            <th>Observação</th>
            <th className={`${(funcaoUsuario === 'enfermeiro' || funcaoUsuario === 'familiar') ? 'hidden' : ''}`}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alimentosFiltrados.map(alimento => (
            <tr key={alimento.id}>
              <td>
                {editandoId === alimento.id ? (
                  <select
                    value={novoAlimento.nome}
                    onChange={e => handleChange('nome', e.target.value)}
                  >
                    <option value="">Selecione o nome</option>
                    {pacientes.map(paciente => (
                      <option key={paciente.id} value={paciente.nome}>{paciente.nome}</option>
                    ))}
                  </select>
                ) : (
                  alimento.nome
                )}
              </td>
              <td>
                {editandoId === alimento.id ? (
                  <input
                    type="text"
                    value={novoAlimento.alimento}
                    onChange={e => handleChange('alimento', e.target.value)}
                  />
                ) : (
                  alimento.alimento
                )}
              </td>
              <td>
                {editandoId === alimento.id ? (
                  <input
                    type="text"
                    value={novoAlimento.horario}
                    onChange={e => handleChange('horario', e.target.value)}
                  />
                ) : (
                  alimento.horario
                )}
              </td>
              <td>
                {editandoId === alimento.id ? (
                  <input
                    type="text"
                    value={novoAlimento.observacao}
                    onChange={e => handleChange('observacao', e.target.value)}
                  />
                ) : (
                  alimento.observacao
                )}
              </td>
              <td className={`acoes ${(funcaoUsuario === 'enfermeiro' || funcaoUsuario === 'familiar') ? 'hidden' : ''}`}>
                {editandoId === alimento.id ? (
                  <button className="salvar" onClick={handleSalvarAlimento}>
                    Salvar
                  </button>
                ) : (
                  <>
                    <button className="editar" onClick={() => handleEditarAlimento(alimento)}>
                      Editar
                    </button>
                    <button className="excluir" onClick={() => handleExcluirAlimento(alimento.id)}>
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {adicionarAlimento && (
            <tr>
              <td>
                <select
                className='campoTabela'
                  value={novoAlimento.nome}
                  onChange={e => handleChange('nome', e.target.value)}
                >
                  <option value="">Selecione o nome</option>
                  {pacientes.map(paciente => (
                    <option key={paciente.id} value={paciente.nome}>{paciente.nome}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                className='campoTabela'
                  type="text"
                  value={novoAlimento.alimento}
                  onChange={e => handleChange('alimento', e.target.value)}
                />
              </td>
              <td>
                <input
                className='campoTabela'
                  type="text"
                  value={novoAlimento.horario}
                  onChange={e => handleChange('horario', e.target.value)}
                />
              </td>
              <td>
                <input
                className='campoTabela'
                  type="text"
                  value={novoAlimento.observacao}
                  onChange={e => handleChange('observacao', e.target.value)}
                />
              </td>
              <td className="acoes">
                <button className="salvar" onClick={handleSalvarAlimento}>
                  Salvar
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button className={`adicionar ${(funcaoUsuario === 'enfermeiro' || funcaoUsuario === 'familiar') ? 'hidden' : ''}`} onClick={handleAdicionarAlimento}>
        Adicionar Alimento
      </button>
    </div>
    </>
  );
}

export default App;
