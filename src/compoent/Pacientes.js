import React, { useState, useEffect } from 'react';
import './Home.css';

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [adicionarPaciente, setAdicionarPaciente] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [novoPaciente, setNovoPaciente] = useState({ nome: '', idade: '', condicao: '' });

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

  const handleAdicionarPaciente = () => {
    setAdicionarPaciente(true);
  };

  const handleSalvarPaciente = async () => {
    try {
      setAdicionarPaciente(false);
      if (editandoId !== null) {
        await fetch(`http://localhost:8080/api/pacientes/${editandoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoPaciente),
        });
        setPacientes(prevPacientes =>
          prevPacientes.map(paciente => (paciente.id === editandoId ? novoPaciente : paciente))
        );
        setEditandoId(null);
      } else {
        const response = await fetch('http://localhost:8080/api/pacientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoPaciente),
        });
        const data = await response.json();
        setPacientes(prevPacientes => [...prevPacientes, data]);
      }
      setNovoPaciente({ nome: '', idade: '', condicao: '' });
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const handleExcluirPaciente = async id => {
    try {
      await fetch(`http://localhost:8080/api/pacientes/${id}`, {
        method: 'DELETE',
      });
      setPacientes(prevPacientes => prevPacientes.filter(paciente => paciente.id !== id));
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
    }
  };

  const handleEditarPaciente = paciente => {
    setEditandoId(paciente.id);
    setNovoPaciente({ ...paciente });
  };

  const handleChange = (field, value) => {
    setNovoPaciente(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className="App table-wrapper">
      <h1>Tabela de Pacientes</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Condição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map(paciente => (
            <tr key={paciente.id}>
              <td>
                {editandoId === paciente.id ? (
                  <input
                    type="text"
                    value={novoPaciente.nome}
                    onChange={e => handleChange('nome', e.target.value)}
                  />
                ) : (
                  paciente.nome
                )}
              </td>
              <td>
                {editandoId === paciente.id ? (
                  <input
                    type="text"
                    value={novoPaciente.idade}
                    onChange={e => handleChange('idade', e.target.value)}
                  />
                ) : (
                  paciente.idade
                )}
              </td>
              <td>
                {editandoId === paciente.id ? (
                  <input
                    type="text"
                    value={novoPaciente.condicao}
                    onChange={e => handleChange('condicao', e.target.value)}
                  />
                ) : (
                  paciente.condicao
                )}
              </td>
              <td className="acoes">
                {editandoId === paciente.id ? (
                  <button className="salvar" onClick={handleSalvarPaciente}>
                    Salvar
                  </button>
                ) : (
                  <>
                    <button className="editar" onClick={() => handleEditarPaciente(paciente)}>
                      Editar
                    </button>
                    <button className="excluir" onClick={() => handleExcluirPaciente(paciente.id)}>
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {adicionarPaciente && (
            <tr>
              <td>
                <input
                  type="text"
                  value={novoPaciente.nome}
                  onChange={e => handleChange('nome', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={novoPaciente.idade}
                  onChange={e => handleChange('idade', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={novoPaciente.condicao}
                  onChange={e => handleChange('condicao', e.target.value)}
                />
              </td>
              <td className="acoes">
                <button className="salvar" onClick={handleSalvarPaciente}>
                  Salvar
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="adicionar" onClick={handleAdicionarPaciente}>
        Adicionar Paciente
      </button>
    </div>
  );
}

export default App;
