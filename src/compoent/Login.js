import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';

function Login() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false); // Estado para controlar a visibilidade da senha
  const history = useHistory();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Verificar no banco de dados
      const response = await fetch('https://specialcare-banco.onrender.com/api/usuarios'); // Atualizado com a URL do Render
      const usuarios = await response.json();
      
      // Converter o nome de usuário para minúsculas
      const nomeUsuarioLowerCase = nomeUsuario.toLowerCase();
  
      // Procurar o usuário no array de usuários convertendo também o nome do banco para minúsculas
      const usuario = usuarios.find(u => u.nome.toLowerCase() === nomeUsuarioLowerCase && u.senha === senha);
      
      if (usuario) {
        // Login bem-sucedido
        console.log('Login bem-sucedido:', nomeUsuario);
        localStorage.setItem('funcaoUsuario', usuario.funcao.toLowerCase());
        history.push('/pacientes'); // Redireciona para a próxima página
      } else {
        setMensagemErro('Nome de usuário ou senha incorretos');
        setTimeout(() => {
          setMensagemErro('');
        }, 3000); // 3 segundos
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMensagemErro('Erro ao fazer login. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Special Care</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nomeUsuario">Nome de Usuário:</label>
            <input
              type="text"
              id="nomeUsuario"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <div className="password-input">
              <input
                type={mostrarSenha ? 'text' : 'password'} // Alternar entre password e text dependendo do estado mostrarSenha
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}>
              </button>
            </div>
          </div>
          <div className="form-group">
            <button  className="button1" type="submit">Entrar</button>
          </div>
          {mensagemErro && <p className="error-message">{mensagemErro}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
