let hiddenElements = document.getElementsByClassName("hidden");
let selectedMusics = [];
let selectMode = false;
let editedIndex = null;

function playStop(event) {
    let btnPlay = document.getElementById("btn-play");

    // Evita que a página dê refresh, uma vez que o botão clicado pertence a um formulário
    event.preventDefault();

    // Permite "tocar" playlist se houver músicas e a playlist estiver no modo de visualização (salva)
    if (!document.getElementById("playlist-musics").innerHTML == "" &&
         document.getElementById("btn-salvar-playlist").innerText == "Editar") {
        if (btnPlay.innerText == "| |") {
            btnPlay.innerText = "▶";
        } else {
            btnPlay.innerText = "| |";
            btnPlay.setAttribute("style", "font-weight: bold");
        }
    }
}

function searchMusicArtist() {
    let inputSearch = document.getElementById("input-pesquisa");
    let musics = document
        .getElementById("grid-musics")
        .getElementsByClassName("music");
    
    if (inputSearch.value != "") {
        let results = [];

        for (const m of musics) {
            const name = m.getElementsByTagName("h4")[0].innerText;
            const artist = m.getElementsByTagName("p")[1].innerText;
    
            if (name.toLowerCase().includes(inputSearch.value.toLowerCase()) ||
                artist.toLowerCase().includes(inputSearch.value.toLowerCase())) {
                console.log(m);
                results.push(m);
            } else {
                // Esconde divs (músicas) cujos nome e artista não atendam à pesquisa 
                m.style.display = "none";
            }
        }
        document.getElementById("btn-reload").style.display = "inline";
    }
}

function verifyEnter(event) {
    // Verifica o enter no campo de pesquisa
	if (event.key === "Enter") {
        let gridMusics = document.getElementById("grid-musics");

        for (const m of gridMusics.getElementsByClassName("music")) {
            m.setAttribute("style", "");
        }
        event.preventDefault();
        searchMusicArtist();
	}
}

function newPlaylist() {
    let container = document.getElementById("playlist-card");
    let btnAdd = document.getElementById("btn-adicionar");
    let btnNewPlaylist = document.getElementById("btn-newplaylist");
    let btnSavePlaylist = document.getElementById("btn-salvar-playlist");

    // Exibe container da playlist e botões de manipulação
    container.setAttribute("style", "display: inline-block");
    btnAdd.setAttribute("style", "display: inline");
    btnNewPlaylist.setAttribute("style", "display: none");
    btnSavePlaylist.setAttribute("style", "display: inline");
}

function addMusics() {
    // Inicia sessão de seleção de músicas a serem adicionadas
    selectMode = true;
    show();
}

function show() {
    let selectButtons = document.getElementsByClassName("btn-selecao");

    // Mostra elementos hidden, exclusivos do modo de seleção
    for (const e of hiddenElements) {
        e.setAttribute("style", "display: inline");
    }
    for (const b of selectButtons) {
        b.setAttribute("style", "display: inline");
    }
    for (const m of document.getElementById("grid-musics").getElementsByClassName("music")) {
        m.setAttribute("style", "cursor: pointer");
    }
    for (const m of selectedMusics) {
        document.getElementById(m.id).getElementsByTagName("button")[0].style["background-color"] = "white";
        document.getElementById(m.id).classList.remove("music-default");
        document.getElementById(m.id).classList.add("music-selected");
    }
}

function putMusics() {
    let playlist = document.getElementById("playlist-musics");

    // Finaliza a sessão de seleção de músicas, não permitindo que o clique mude seu estado enquanto false
    selectMode = false; 
    hide();

    // Remoção da versão anterior e criação das músicas contidas na playlist
    playlist.innerHTML = "";
    for (let i = 0; i < selectedMusics.length; i ++) {
        create(selectedMusics[i]);
    }

    // Exibição do botão de limpar e duração, caso haja músicas selecionadas
    let duracaoPlaylist = document.getElementById("playlist-duracao");
    let btnLimpar = document.getElementById("btn-limpar");

    duracaoPlaylist.innerText = calculateDuration();
    if (playlist.innerHTML != "") {
        btnLimpar.style.display = "inline";
    } else {
        btnLimpar.style.display = "none";
    }
}

function hide() {
    let selectButtons = document.getElementsByClassName("btn-selecao");

    // Esconde elementos exclusivos do modo de seleção
    for (const e of hiddenElements){
        e.setAttribute("style", "display: none");
    }
    for (const b of selectButtons) {
        b.setAttribute("style", "display: none");
    }
    for (const m of document.getElementById("grid-musics").getElementsByClassName("music")) {
        m.setAttribute("style", "cursor: auto");
    }
    for (const m of selectedMusics) {
        document.getElementById(m.id).classList.add("music-default");
        document.getElementById(m.id).classList.remove("music-selected");
    }
}

function calculateDuration() {
    let playlist = document.getElementById("playlist-musics");
    let musicsPlaylist = playlist.getElementsByClassName("selected-music");

    let seconds = 0;
    let minutesSum = 0;
    for (const music of musicsPlaylist) {
        let duration = music.getElementsByClassName("selected-duration")[0].innerText;
        duration = duration.split(":");

        // Separa a string e guarda os minutos e segundos como inteiros
        let minutes = parseInt(duration[0]);
        seconds += parseInt(duration[1]);
        minutesSum += minutes;

        // Quando a variável de segundos (somada entre uma música e outra) atingir ou tornar-se superior a 60, minutos são incrementados
        if (seconds == 60) {
            minutesSum ++;
            seconds = 0;
        } else if (seconds > 60) {
            minutesSum ++;
            seconds -= 60;
        }
    }

    if (seconds == 0)
        return minutesSum + "min" ;
    return minutesSum + "min" + seconds;
}

class Playlist {
	constructor(name, genre, duration, favorite, access, collaborators, musics) {
		this.name = name;
        this.genre = genre;
		this.duration = duration;
        this.favorite = favorite;
        this.access = access;
        this.collaborators = collaborators;
		this.musics = musics;
	}
}

class Music {
	constructor(name, artist, duration, cover) {
		this.name = name;
		this.artist = artist;
		this.duration = duration;
		this.cover = cover;
	}
}

function convertMusic(divMusic) {
	let cover = divMusic.getElementsByClassName("mcapa")[0];
	let artist = divMusic.getElementsByClassName("mcantor")[0].innerText;
	let duration = divMusic.getElementsByClassName("mduracao")[0].innerText;
	let name = divMusic.getElementsByClassName("mnome")[0].innerText;
	let music = new Music(name, artist, duration, cover.src);
	return music;
}

function savePlaylist() {
    let username = "@" + document.getElementById("username").innerText;
    let playlist = document.getElementById("playlist-musics");
    let musicsPlaylist = playlist.getElementsByClassName("selected-music");
    let gridMusics = document
        .getElementById("grid-musics")
        .getElementsByClassName("music");

    // Atributos a serem salvos da playlist
    let namePlaylist = document.getElementById("nome-playlist").value;
    let genrePlaylist = document.getElementById("dropdown-genero").value;
    let durationPlaylist = document.getElementById("playlist-duracao").innerText;
    let isFavorite = document.getElementById("checkbox-favorite").checked;
    let accessPlaylist = document.getElementById("checkbox-access").checked;
    let collaboratorsPlaylist = document.getElementById("add-collaborators").value;
    let collaborators = [username];

    // Verifica se já existe playlist com o nome em questão (se for uma edição, não entra na condição)
    if (findPlaylist() != null && findPlaylist() != editedIndex) {
        alert("Desculpe, já existe uma playlist com esse nome.");
        return false;
    } else if (namePlaylist == "" || namePlaylist == null || genrePlaylist == "none") {
        alert("Desculpe, a playlist deve ter um nome e um gênero de música.");
        return false;
    } else if (collaboratorsPlaylist.charAt(0) != "@" && collaboratorsPlaylist != "") {
        alert("O nome de usuário do colaborador deve ser iniciado com '@'.");
        return false;
    } else {
        genrePlaylist = genrePlaylist.charAt(0).toUpperCase() + genrePlaylist.slice(1);

        if (collaboratorsPlaylist != "") {    
            collaborators.push(collaboratorsPlaylist);
        }

        if (accessPlaylist) {
            accessPlaylist = "Private";
        } else {
            accessPlaylist = "Public";
        }

        let ids = [];
        let musics = [];
		for (const music of musicsPlaylist) {
			ids.push(music.id.replace("id", ""));
		}

		for (const id of ids) {
			for (const music of gridMusics) {
				if (id == music.id) {
					musics.push(convertMusic(music));
				}
			}
		}
		let newPlaylist = new Playlist(namePlaylist, genrePlaylist, durationPlaylist, isFavorite, accessPlaylist, collaborators, musics);

        newPlaylist = JSON.stringify(newPlaylist);
        console.log(newPlaylist);

        let allPlaylists = localStorage.getItem("allPlaylists");
        allPlaylists = JSON.parse(allPlaylists);

        // Caso se trate de uma playlist existente, array novo é atribuído a ela
        if (editedIndex != null) {
            allPlaylists[editedIndex] = newPlaylist;

        // Senão, playlist é adicionada como um novo item
        } else {
            allPlaylists.push(newPlaylist);
        }
        localStorage.setItem("allPlaylists", JSON.stringify(allPlaylists));
        return true;
    }
}

function saveOrEdit(event) {
    // Botões
    let btnEditar = document.getElementById("btn-salvar-playlist");
    let btnAdicionar = document.getElementById("btn-adicionar");
    let btnPlay = document.getElementById("btn-play");
    let btnLimpar = document.getElementById("btn-limpar");

    // Elementos do formulário
    let dropdownGenero = document.getElementById("dropdown-genero");
    let inputNome = document.getElementById("nome-playlist");
    let checkboxFavorite = document.getElementById("checkbox-favorite");
    let checkboxPrivate = document.getElementById("checkbox-access");
    let deleteIcons = document.getElementsByClassName("delete-icon");
    
    if (event.target.innerText == "Salvar") {
        if (savePlaylist()) {
            // Índice da playlist editada é resetado a cada novo salvamento (de edição ou não)
            editedIndex = null;

            // Torna a playlist estática e muda estado do botão para edição
            btnEditar.innerText = "Editar";
            btnAdicionar.style.display = "none";
            btnLimpar.style.display = "none";
            inputNome.readOnly = true;
            dropdownGenero.disabled = true;
            checkboxFavorite.disabled = true;
            checkboxPrivate.disabled = true;
            btnPlay.className = "playable";

            for (const icon of deleteIcons) {
                icon.style.display = "none";
            }
        }
    } else {
        // Índice da playlist a ser editada é guardada na variável global temporariamente, até o fim da edição
        editedIndex = findPlaylist();

        // Torna a playlist editável
        btnEditar.innerText = "Salvar";
        btnAdicionar.style.display = "inline";
        inputNome.readOnly = false;
        dropdownGenero.disabled = false;
        checkboxFavorite.disabled = false;
        checkboxPrivate.disabled = false;
        btnPlay.className = "non-playable";

        if (document.getElementById("playlist-musics").innerHTML != "") {
            btnLimpar.style.display = "inline";
        }

        for (const icon of deleteIcons) {
            icon.style.display = "inline";
        }
    }
}

function findPlaylist() {
    let currentPlaylist = document.getElementById("nome-playlist").value;
    let allPlaylists = JSON.parse(localStorage.getItem("allPlaylists"));
    let indexPlaylist = null;

    // Compara o nome da input com os nomes das playlists já cadastradas (playlist[0])
    for (let i = 0; i < allPlaylists.length; i++) {
        let playlist = JSON.parse(allPlaylists[i]);
        if (playlist[0] == currentPlaylist) {
            indexPlaylist = i;
        }
    }
    console.log(indexPlaylist);
    return indexPlaylist; // se o nome não existir, retorna null
}

function deleteMusic(event) {
    let playlist = document.getElementById("playlist-musics");
    let playlistDeleted = event.target.parentElement;
    let idDeleted = playlistDeleted.id.replace("id", "");

    // Caso a música deletada da playlist esteja visível na tabela, tendo que ser desselecionada
    selectDeselect(document.getElementById(idDeleted));

    // Repopula a playlist com as músicas ainda selecionadas
    playlist.innerHTML = "";
    for (let i = 0; i < selectedMusics.length; i ++) {
        create(selectedMusics[i]);
    }

    if (playlist.innerHTML == "") {
        document.getElementById("btn-limpar").style.display = "none";
        document.getElementById("playlist-duracao").innerText = "0min";
    }
}

function clearPlaylist(event) {
    let playlist = document.getElementById("playlist-musics");
    let duracaoPlaylist = document.getElementById("playlist-duracao");

    selectedMusics = [];
    event.target.style.display = "none";
    playlist.innerHTML = "";
    duracaoPlaylist.innerText = "0min";
}

function create(divMusic) {
    let playlist = document.getElementById("playlist-musics");
    let music = document.createElement("div");
    let capa = document.createElement("img");
    let divInfo = document.createElement("div");
    let divNomeDuracao = document.createElement("div");
    let nome = document.createElement("h4");
    let artista = document.createElement("p");
    let duracao = document.createElement("p");
    let deleteIcon = document.createElement("img");

    music.id = "id" + divMusic.id;
    nome.innerText = shorten(divMusic.getElementsByClassName("mnome")[0].innerText);
    artista.innerText = shorten(divMusic.getElementsByClassName("mcantor")[0].innerText);
    capa.src = divMusic.getElementsByClassName("mcapa")[0].src;
    duracao.innerText = divMusic.getElementsByClassName("mduracao")[0].innerText;

    music.className = "selected-music";
    capa.className = "selected-capa";
    divNomeDuracao.className = "selected-nome-duracao";
    divInfo.className = "music-info";
    duracao.className = "selected-duration";
    deleteIcon.className = "delete-icon";
    deleteIcon.src = "/assets/imgs/delete-icon.png";
    deleteIcon.setAttribute("onclick", "deleteMusic(event)");

    divNomeDuracao.appendChild(nome);
    divNomeDuracao.appendChild(duracao);
    divInfo.appendChild(divNomeDuracao);
    divInfo.appendChild(artista);
    music.appendChild(capa);
    music.appendChild(divInfo);
    music.appendChild(duracao);
    music.appendChild(deleteIcon);
    playlist.appendChild(music);
}

function shorten(string) {
    if (string.length > 20) {
        return string.substring(0, 19) + " ...";
    }
    return string;
}

function markSelected(event) {
    // Condiciona a seleção para toda música clicada (div ou componente interno) enquanto em modo de seleção
    if (selectMode) {
        let clickedMusic = "";
        if (event.target.parentElement.parentElement.classList.contains("music")) {
            clickedMusic = event.target.parentElement.parentElement;
        } else if (event.target.parentElement.classList.contains("music")) {
            clickedMusic = event.target.parentElement;
        } else {
            clickedMusic = event.target;
        }
        selectDeselect(clickedMusic);
    }
}

function getDeselectedIndex(id) {
    // Verifica existência da música (div) passada como parâmetro nas selecionadas
    let deselected = null;
    for (let i = 0; i < selectedMusics.length; i++) {
        if (selectedMusics[i].id == id) {
            deselected = i;
        }        
    }
    return deselected;
}

function selectDeselect(music) {
    console.log(selectedMusics);
    
    let deselected = getDeselectedIndex(music.id); // retorna o índice da música no array de selecionadas, caso pertença a ele
    let selectedButton = music.getElementsByTagName("button")[0];

    // Se já estiver selecionada, ela é desselecionada e vice-versa
    if (deselected != null) {
        selectedMusics.splice(deselected, 1);
        music.classList.remove("music-selected");
        music.classList.add("music-default");
        selectedButton.style["background-color"] = "rgb(25, 26, 31)";
    } else {
        selectedMusics.push(music);
        music.classList.remove("music-default");
        music.classList.add("music-selected");
        selectedButton.style["background-color"] = "white";
    }
}

function showPassword(event) {
	let passwordInput = document.getElementById("fsenha");

    if (verifyPassword(event)) {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    }
}

function verifyPassword(event) {
    let passwordInput = document.getElementById("fsenha");

    if (passwordInput.value == "") {
        alert("Digite uma senha primeiro.");
        event.preventDefault();
        return false;
    }
    return true;
}

function login(event) {
    let user = document.getElementById("fusername").value;
    let password = document.getElementById("fsenha").value;
    let remember = document.getElementById("checkbox-remember");

    let noPassword = password == "" || password == null || password == undefined;
    let noUser = user == "" || user == null || user == undefined;

    if (noPassword && noUser) {
        alert("Prencha corretamente todos os campos.");
        event.preventDefault();
    } else if (noPassword) {
        alert("Prencha a senha.");
        event.preventDefault();
    } else if (noUser) {
        alert("Preencha o nome de usuário.")
        event.preventDefault();
    } else {
        if (remember.checked) {
            localStorage.setItem("password", password);
        }
        localStorage.setItem("user", user);
        window.location.href='/public/home.html';
        event.preventDefault();
    }
}

function logoClicked(event) {
    alert("Você leva as coisas a sério mesmo, né?");
    event.preventDefault();
    window.location.href='/index.html';
}

function load() {
    // Autenticação do usuário logado
    document.getElementById("username").innerText = localStorage.getItem("user");

    // Cria o array de playlists do usuário, se ainda não existente
    let playlistStorage = localStorage.getItem("allPlaylists");
    if (playlistStorage == null) {
        let allPlaylists = JSON.stringify([]);
        localStorage.setItem("allPlaylists", allPlaylists);
    }

    addEventListeners();
}

function addEventListeners() {
    const musics = document.getElementById("grid-musics");
    let divs = musics.getElementsByClassName("music");

    // Adiciona event de onclick para todas as músicas da tabela
    for (const d of divs) {
        d.setAttribute("onclick", "markSelected(event)");
    }

    document.getElementById("barra-pesquisa").getElementsByTagName("input")[0].addEventListener("focus", function(event) {
        let searchBar = document.getElementById("barra-pesquisa");

        searchBar.style.border = "1px solid white";
    })

    document.getElementById("barra-pesquisa").getElementsByTagName("input")[0].addEventListener("focusout", function(event) {
        let searchBar = document.getElementById("barra-pesquisa");

        searchBar.style.border = "none";
    })

    document.getElementById("collaborators-div").getElementsByTagName("img")[0].addEventListener("click", function(event) {
        let inputCollaborators = document.getElementById("add-collaborators");

        if (inputCollaborators.className == "visible" && inputCollaborators.value == "") {
            inputCollaborators.className = "invisible";
        } else {
            inputCollaborators.className = "visible";
        }
    })

    // Adiciona event de reload da tabela original de músicas
    document.getElementById("btn-reload").addEventListener("click", function(event) {
        let gridMusics = document.getElementById("grid-musics");

        for (const m of gridMusics.getElementsByClassName("music")) {
            m.setAttribute("style", "");
        }
        document.getElementById("input-pesquisa").value = "";
        event.target.setAttribute("style", "display: none");
    })
}