import React, { useState, useEffect } from 'react';
import './Home.css';

function App() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [adicionarMedicamento, setAdicionarMedicamento] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [novoMedicamento, setNovoMedicamento] = useState({ nome: '', tipo: '', dosagem: '', horario: '' });

  useEffect(() => {
    async function fetchMedicamentos() {
      try {
        const response = await fetch('http://localhost:8080/api/medicamentos');
        const data = await response.json();
        setMedicamentos(data);
      } catch (error) {
        console.error('Erro ao buscar medicamentos:', error);
      }
    }
    fetchMedicamentos();
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

  const handleAdicionarMedicamento = () => {
    setAdicionarMedicamento(true);
  };

  const handleSalvarMedicamento = async () => {
    try {
      setAdicionarMedicamento(false);
      if (editandoId !== null) {
        await fetch(`http://localhost:8080/api/medicamentos/${editandoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoMedicamento),
        });
        setMedicamentos(prevMedicamentos =>
          prevMedicamentos.map(medicamento => (medicamento.id === editandoId ? novoMedicamento : medicamento))
        );
        setEditandoId(null);
      } else {
        const response = await fetch('http://localhost:8080/api/medicamentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoMedicamento),
        });
        const data = await response.json();
        setMedicamentos(prevMedicamentos => [...prevMedicamentos, data]);
      }
      setNovoMedicamento({ nome: '', tipo: '', dosagem: '', horario: '' });
    } catch (error) {
      console.error('Erro ao salvar medicamento:', error);
    }
  };

  const handleExcluirMedicamento = async id => {
    try {
      await fetch(`http://localhost:8080/api/medicamentos/${id}`, {
        method: 'DELETE',
      });
      setMedicamentos(prevMedicamentos => prevMedicamentos.filter(medicamento => medicamento.id !== id));
    } catch (error) {
      console.error('Erro ao excluir medicamento:', error);
    }
  };

  const handleEditarMedicamento = medicamento => {
    setEditandoId(medicamento.id);
    setNovoMedicamento({ ...medicamento });
  };

  const handleChange = (field, value) => {
    setNovoMedicamento(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className="App table-wrapper">
      <h1>Tabela de Medicamentos</h1>
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Medicamento</th>
            <th>Tipo</th>
            <th>Dosagem</th>
            <th>Horário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {medicamentos.map(medicamento => (
            <tr key={medicamento.id}>
              <td>
                {editandoId === medicamento.id ? (
                  <select
                    value={novoMedicamento.nome}
                    onChange={e => handleChange('nome', e.target.value)}
                  >
                    <option value="">Selecione o paciente</option>
                    {pacientes.map(paciente => (
                      <option key={paciente.id} value={paciente.nome}>{paciente.nome}</option>
                    ))}
                  </select>
                ) : (
                  medicamento.nome
                )}
              </td>
              <td>
                {editandoId === medicamento.id ? (
                  <input
                    type="text"
                    value={novoMedicamento.medicamento}
                    onChange={e => handleChange('medicamento', e.target.value)}
                  />
                ) : (
                  medicamento.medicamento
                )}
              </td>
              <td>
                {editandoId === medicamento.id ? (
                  <input
                    type="text"
                    value={novoMedicamento.tipo}
                    onChange={e => handleChange('tipo', e.target.value)}
                  />
                ) : (
                  medicamento.tipo
                )}
              </td>
              <td>
                {editandoId === medicamento.id ? (
                  <input
                    type="text"
                    value={novoMedicamento.dosagem}
                    onChange={e => handleChange('dosagem', e.target.value)}
                  />
                ) : (
                  medicamento.dosagem
                )}
              </td>
              <td>
                {editandoId === medicamento.id ? (
                  <input
                    type="text"
                    value={novoMedicamento.horario}
                    onChange={e => handleChange('horario', e.target.value)}
                  />
                ) : (
                  medicamento.horario
                )}
              </td>
              <td className="acoes">
                {editandoId === medicamento.id ? (
                  <button className="salvar" onClick={handleSalvarMedicamento}>
                    Salvar
                  </button>
                ) : (
                  <>
                    <button className="editar" onClick={() => handleEditarMedicamento(medicamento)}>
                      Editar
                    </button>
                    <button className="excluir" onClick={() => handleExcluirMedicamento(medicamento.id)}>
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {adicionarMedicamento && (
            <tr>
              <td>
                <select
                  value={novoMedicamento.nome}
                  onChange={e => handleChange('nome', e.target.value)}
                >
                  <option value="">Selecione o paciente</option>
                  {pacientes.map(paciente => (
                    <option key={paciente.id} value={paciente.nome}>{paciente.nome}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={novoMedicamento.medicamento}
                  onChange={e => handleChange('medicamento', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={novoMedicamento.tipo}
                  onChange={e => handleChange('tipo', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={novoMedicamento.dosagem}
                  onChange={e => handleChange('dosagem', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={novoMedicamento.horario}
                  onChange={e => handleChange('horario', e.target.value)}
                />
              </td>
              <td className="acoes">
                <button className="salvar" onClick={handleSalvarMedicamento}>
                  Salvar
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="adicionar" onClick={handleAdicionarMedicamento}>
        Adicionar Medicamento
      </button>
    </div>
  );
}

export default App;
