/*
    Função para obter lista de produtos existente no banco de dados, via método GET
*/
const getList = async () => {
    let url = "http://127.0.0.1:8080/api/produtos/buscar-produtos";
    fetch(url, { 
        method: "get" 
    })
    .then( (response) => response.json() )
    .then( (jsonData) => {
        jsonData.forEach( item => insertList(item.id, item.nome, item.quantidade,item.valor));
    })
    .catch( (error) => {
        console.log('Error: ', error);
    });
}

// Chamando a função inicial para pegar lista de produtos da API
getList();


/* 
    Função para inserir novo produto, via método POST
*/
const novoItem = async () => {
    let url = "http://127.0.0.1:8080/api/produtos/salvar-produto";
    let requestBody = {
        nome: document.getElementById('newProduct').value,
        quantidade: document.getElementById('newQuantity').value,
        valor: document.getElementById('newPrice').value
    }
    
    if(requestBody.nome == ''){
        alert("Escreva o nome do produto!");
    } else if(isNaN(requestBody.quantidade) || isNaN(requestBody.valor)){
        alert("Quantidade e valor precisam ser números!")
    } else {

        fetch(url, {
            method: 'post',
            body: JSON.stringify(requestBody), //converter objeto javascript em um objeto do tipo json
            headers: {"Content-Type" : "application/json;"} // informar para a API que o body é um json
        })
        .then((response) => response.json())
        .then((responseBody) => {
            insertList(responseBody.id,responseBody.nome,responseBody.quantidade,responseBody.valor); //adicionar na tela
        })
        .catch((error) => {
            console.log('Error: ', error);
        });

        limparCamposInputTela(); // função para limpar as informações do campo de input da tela/interface        
        alert("Item adicionado!");
    }

} 

// Função auxiliar para limpar os inputs de texto da tela
const limparCamposInputTela = () => {
    document.getElementById("newProduct").value = "";
    document.getElementById("newQuantity").value = "";
    document.getElementById("newPrice").value = "";
}


/* 
    Função que chama o endpoint de delete passando o id do produto para ser deletado no banco de dados, via método DELETE
*/
const deleteItem = (id) => {
    let url = "http://127.0.0.1:8080/api/produtos/deletar-produto/"+id;
    fetch(url, {
        method: 'delete'
    })
    .then((response) => response.json())
    .catch((error) => {
        console.log('Error: ', error);
    });
}

/* 
    Função para remover/deletar um item da lista de acordo com o click no botão/ícone "close" (x)
*/
const onClickEvent2RemoveElement = () => {
    let lista_de_close = document.getElementsByClassName("close"); // pegando a lista de todos os elementos que contém a classe close, ou seja, <span>'s

    for(var i = 0; i < lista_de_close.length; i++){
        lista_de_close[i].onclick = function() { // adicionando um evento para "escutar" o click do usuário
            let row = this.parentElement.parentElement; // vou pegar o "avô" da <span>
            const idItem = row.getElementsByTagName('td')[0].innerHTML; // tô pegando o id do produto que será excluído
            if(confirm("Você tem certeza que deseja excluir o produto "+ row.getElementsByTagName('td')[1].innerHTML +"?")){
                deleteItem(idItem); // função para chamar o método/endpoint de deletar
                row.remove(); // remove a linha da tabela na interface
                alert("Produto removido!"); 
            }
        }
    }
}


/* 
    Função auxiliar para adicionar um ícone "x" na última posição de cada linha da tabela
*/
const insertIconX = (indice) => {
    let span = document.createElement("span"); // criando um novo elemento html do tipo span para colocar o conteúdo
    let txt = document.createTextNode("\u00D7"); // adicionado o símbolo "x" da multiplicação via código unicode
    span.className="close"; // atribuindo uma classe css ao meu mais novo span
    span.appendChild(txt); // adicionar o nó "txt" à minha tag <span>
    indice.appendChild(span); // adicionar na última posição da minha linha a <span> com o conteúdo
}

/* 
    Função auxiliar para "desenhar" ou colocar os items na tela (um por um).
*/
const insertList = (idProduto, nomeProduto, quantidadeProduto, valorProduto) => {
    var item = [idProduto, nomeProduto, quantidadeProduto, valorProduto];
    var table = document.getElementById('myTable');
    var row = table.insertRow();

    // Colocando conteúdo na lista, produto a produto
    for( var i = 0; i < item.length; i++){
        var celula = row.insertCell(i);
        celula.textContent = item[i];
    }
    insertIconX(row.insertCell(-1)); //função para adicionar um "x" na última célula/posição da linha

    onClickEvent2RemoveElement(); // função para adicionar um evento no ícone de remover, para remover  o elemento da linha que foi clicado
}