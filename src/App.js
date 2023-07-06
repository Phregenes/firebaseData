import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);

  //ATUALIZAR EM TEMPO REAL MINHA TABELA DE POSTS

  useEffect(() => {
    function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPosts(listaPost);
      });
    }

    loadPosts();
  }, []);

  async function handleAdd() {
    // cadastrar um item único

    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    // .then(() => {
    //   console.log("dados registrados no banco!")
    // })
    // .catch((error) => {
    //   console.log("gerou erro" + error);
    // })

    //cadastrar um item com id aleatório em massa.

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("dados registrados no banco!");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        console.log("gerou erro" + error);
      });
  }

  //Buscar um único post passando o id  ex'1234'

  async function buscarPost() {
    // const postRef = doc(db, "posts", "1234")

    // await getDoc(postRef)
    // .then((snapshot) => {
    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)
    // })
    // .catch((error) => {
    //   console.log("erro ao buscar", error)
    // })

    const postsRef = collection(db, "posts");

    await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPosts(lista);
      })
      .catch((error) => {
        console.log("erro ao buscar", error);
      });
  }

  //EDITAR POST PELO ID INFORMADO

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("atualizou os campos");
        setIdPost("");
        setAutor("");
        setTitulo("");
      })
      .catch(() => {
        console.log("ops, ocorreu um erro");
      });
  }

  //EXCLUIR POST PELO ID INFORMADO

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);

    await deleteDoc(docRef)
      .then(() => {
        console.log("deletado");
      })
      .catch((error) => {
        console.log("OPS: Ocorreu um erro", error);
      });
  }

  //CRIAR NOVO USUARIO DE CADASTRO

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("usuario cadastrado", value);
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        console.log("ops, ocorreu um erro", error);
        if (error.code === "auth/weak-password") {
          alert("Senha muito curta");
        } else if (error.code === "auth/email-already-exists") {
          alert("Email já cadastrado");
        }
      });
  }

  //LOGAR USUARIO DO BANCO DE DADOS

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("usuario logado", value);

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        })
        setUser(true);

        setEmail("");
        setSenha("");
      })
      .catch(() => {
        console.log("ops, ocorreu um erro");
      });
  }

  return (
    <div className="App">
      <h1>React + firebase</h1>

      {user && 
        <div>
          <strong>Seja bem vindo(a) / você está logado!</strong>
          <br />
          <span>UID: {userDetail.uid} - Email: {userDetail.email}</span>
        </div>
      }

      <h2>Usuário</h2>

      <div className="container">
        <label>Email</label>
        <input
          placeholder="Digite um email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Informe sua senha"
        />
        <br />
        <button onClick={novoUsuario}>Cadastrar</button>
        <br />
        <button onClick={logarUsuario}>Fazer Login</button>
      </div>
      <br />
      <hr />
      <div className="container">
        <h2>Cadastro no banco</h2>

        <label>Id do post</label>
        <input
          placeholder="Digite o id do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />

        <br />
        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder="Digite o Titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <label>Autor:</label>
        <input
          type="text"
          placeholder="autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <button onClick={handleAdd}>Cadastrar post</button>

        <button onClick={buscarPost}>Buscar Post</button>
        <br />

        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong>
                <br />
                <span>Titulo: {post.titulo}</span>
                <br />
                <span>Autor: {post.autor}</span>
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
                <br />
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
