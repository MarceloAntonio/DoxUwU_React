import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function DoxingAPI() {
  const [idUsuario, setIdUsuario] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [senha, setSenha] = useState("")
  const [copiado, setCopiado] = useState(false)

  const navigate = useNavigate()

  const IrParaHome = () => {
    navigate("/")
  }

  //Função para gerar um numero aleatório de uma certa quanntidade começando por 1
  function gerarNumeroAleatorio(max) {
    return Math.floor(Math.random() * max) + 1
  }

  // Gera uma senha numérica aleatória
  function GerarSenha() {
    let s = gerarNumeroAleatorio(10).toString()
    for (let i = 0; i < 10; i++) {
      s += gerarNumeroAleatorio(9).toString()
    }
    return s
  }

  /*

Função de conexão com API

°Gera um numero entre 1 a 10 (quantidades de IDs na API) ou 1 a 11 se o usuario local for criado
°Chama a função de gerar senha
°Conecta na API com o id gerado
°Coloca no titulo o nome da pessoa
°Escreve no paragrafo as informações da pessoa do ID gerado
°Altera o titulo da pagina para Doxing - Nome da pessoa

*/
  const numeroDeUsers = JSON.parse(localStorage.getItem("QuantidadeUsers"))
  const dados = JSON.parse(localStorage.getItem("InfosConfidenciais"))

  const carregarUsuario = async () => {
    const id = gerarNumeroAleatorio(numeroDeUsers.usuarios)
    console.log(numeroDeUsers.usuarios)
    setIdUsuario(id)
    const novaSenha = GerarSenha()
    setSenha(novaSenha)

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
      )
      const data = await response.json()
      setUsuario(data)
      if (id === 11) {
        document.title = `DoxUwU - ${dados.Nome}`
      } else {
        document.title = `DoxUwU - ${data.name}`
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error)
    }
  }

  // Executa ao montar o componente
  useEffect(() => {
    carregarUsuario()
  }, [])

  // Copia as informações para a área de transferência
  const CopiarParaAreaDeTransferencia = () => {
    const texto = document.getElementById("Infos").innerText
    navigator.clipboard.writeText(texto)
    setCopiado(true)
  }

  // Recarrega o componente com novo usuário e senha
  const Recarregar = () => {
    setCopiado(false)
    setUsuario(null)
    carregarUsuario()
  }

  
//Caso seja o ID 11 ele vai puxar as infos do usuario Local
  if (idUsuario === 11) {
    return (
      <main>
        <div id="Dox">
          <h1 id="Titulo">
            {`Doxing - ${dados.Nome}`}
          </h1>
          <p id="Infos">
            {usuario ? (
              <>
                Nome Completo - {dados.Nome}
                <br />
                Email - {dados.Email}
                <br />
                Senha - {dados.Senha}
                <br />
                Telefone - {dados.Telefone}
                <br />
                Cidade - {dados.Cidade}
                <br />
                Rua - {dados.Rua}
                <br />
                ID do domicílio - {dados.Numero}
              </>
            ) : (
              "Carregando..."
            )}
          </p>
          <button id="btnCopy" onClick={CopiarParaAreaDeTransferencia}>
            {copiado ? "Copiado!" : "Copiar"}
          </button>
          <button onClick={Recarregar}>Outra Pessoa</button>
          <button onClick={IrParaHome}> Voltar </button>
        </div>
      </main>
    )
  } 
  
//Se não for 11 puxara da API
  else {
    return (
      <main>
        <div id="Dox">
          <h1 id="Titulo">
            {usuario ? `Doxing - ${usuario.name}` : "Carregando..."}
          </h1>
          <p id="Infos">
            {usuario ? (
              <>
                Nome Completo - {usuario.name}
                <br />
                Email - {usuario.email}
                <br />
                Senha - {senha}
                <br />
                Telefone - {usuario.phone}
                <br />
                Cidade - {usuario.address.city}
                <br />
                Rua - {usuario.address.street}
                <br />
                ID do domicílio - {usuario.address.suite}
              </>
            ) : (
              "Carregando..."
            )}
          </p>
          <button id="btnCopy" onClick={CopiarParaAreaDeTransferencia}>
            {copiado ? "Copiado!" : "Copiar"}
          </button>
          <button onClick={Recarregar}>Outra Pessoa</button>
          <button onClick={IrParaHome}> Voltar </button>
        </div>
      </main>
    )
  }
}
export default DoxingAPI
