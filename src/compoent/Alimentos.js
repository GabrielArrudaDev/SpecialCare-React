import React, { useState, useEffect } from 'react';
import './Home.css';

function App() {
  const [alimentos, setAlimentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [adicionarAlimento, setAdicionarAlimento] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [novoAlimento, setNovoAlimento] = useState({ nome: '', alimento: '', horario: '', restricoes: '' });

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
      setNovoAlimento({ nome: '', alimento: '', horario: '', restricoes: '' });
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

  return (
    <div className="App table-wrapper">
      <h1>Tabela de Alimentos</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Alimento</th>
            <th>Horário</th>
            <th>Restrições</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alimentos.map(alimento => (
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
                    value={novoAlimento.restricoes}
                    onChange={e => handleChange('restricoes', e.target.value)}
                  />
                ) : (
                  alimento.restricoes
                )}
              </td>
              <td className="acoes">
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
                  type="text"
                  value={novoAlimento.alimento}
                  onChange={e => handleChange('alimento', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={novoAlimento.horario}
                  onChange={e => handleChange('horario', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={novoAlimento.restricoes}
                  onChange={e => handleChange('restricoes', e.target.value)}
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
      <button className="adicionar" onClick={handleAdicionarAlimento}>
        Adicionar Alimento
      </button>
    </div>
  );
}

export default App;
