// URL da API
const FIPE_URL = "https://parallelum.com.br/fipe/api"

// Função para transformar o formulário select em pesquisável (biblioteca select2)
$(function () {
  $("select").select2();
});

// Função para pegar as marcas de veículos dependendo da categoria selecionada e colocar no form de marca
async function getVehicle(type_form, brand_form, model_form, year_form = undefined){
    // Pegando o valor selecionado do form de categoria
    type_form_value = type_form.value;
    // Criando variável para armazenar os dados de resposta da API
    let data
    // Verificando qual categoria foi selecionada e fazendo a requisição para a API
    if (type_form_value == "car"){
      let response = await fetch(FIPE_URL + "/v1/carros/marcas")
      data = await response.json()
  
    } else if (type_form_value == "motorcycle"){
      let response = await fetch(FIPE_URL + "/v1/motos/marcas")
      data = await response.json()
  
    } else if (type_form_value == "truck"){
      let response = await fetch(FIPE_URL + "/v1/caminhoes/marcas")
      data = await response.json()
  
    } else { 
      return console.log("error")
    }
    // Resetando os forms
    if (year_form != undefined){
      // Caso o form de ano exista, reseta ele também
      span_year = document.getElementById("select2-" + year_form.id + "-container");
      span_year.innerHTML = "Selecione o ano do veículo";
    }
    span_brand = document.getElementById("select2-" + brand_form.id + "-container");
    span_model = document.getElementById("select2-" + model_form.id + "-container");
    span_brand.innerHTML = "Selecione a marca do veículo";
    span_model.innerHTML = "Selecione o modelo do veículo";
    // Setando os dados no próximo form (marca)
    setDataToBrandForm(data, brand_form)
}

// Função para setar os dados no form de marca
function setDataToBrandForm(data, brand_form){
    brand_form.innerHTML = '';
    let list = '';
    // Utiliza listagem dinâmica para setar os dados
    if (data.length <= 0){
      list += `<h3>Nenhuma marca de veículo disponível</h3>`
    } else {
      list += `<option value="0">Selecione a marca do veículo</option>`
      for(let i = 0; i < data.length; i++){
        list += `<option id="${data[i].codigo}">${data[i].nome}</option>`
      }
    }
    brand_form.innerHTML += list;
}

// Função para pegar os modelos de veículos dependendo da marca e categoria selecionadas e colocar no form de modelo
async function getModels(type_form, brand_form, model_form, year_form = undefined){
    var type_form_value = type_form.options[type_form.selectedIndex].value;
    var brand_number = brand_form.options[brand_form.selectedIndex].id;
    // Criando variável para armazenar os dados de resposta da API
    let data
    // Verificando qual categoria foi selecionada e fazendo a requisição para a API
    if (type_form_value == "car"){
      const response = await fetch(FIPE_URL + "/v1/carros/marcas/" + brand_number + "/modelos")
      data = await response.json()
  
    } else if (type_form_value == "motorcycle"){
      const response = await fetch(FIPE_URL + "/v1/motos/marcas/" + brand_number + "/modelos")
      data = await response.json()
  
    } else if (type_form_value == "truck"){
      const response = await fetch(FIPE_URL + "/v1/caminhoes/marcas/" + brand_number + "/modelos")
      data = await response.json()
  
    } else {
      return console.log("error")
    }
    // Resetando os forms
    if (year_form != undefined){
      // Caso o form de ano exista, resetar ele também
      span_year = document.getElementById("select2-" + year_form.id + "-container");
      span_year.innerHTML = "Selecione o ano do veículo";
    }
    span_model = document.getElementById("select2-" + model_form.id + "-container");
    span_model.innerHTML = "Selecione o modelo do veículo";
    // Setando os dados no próximo form
    setDataToModelForm(data, brand_number, model_form)

}

// Função para setar os dados no form de modelo
function setDataToModelForm(json, brand_number, model_form){
    data = json['modelos']
    model_form.innerHTML = '';
    let list = '';
    // Utiliza listagem dinâmica para setar os dados
    if (data.length <= 0){
      list += `<h3>Nenhum modelo de veículo disponível</h3>`
    } else {
      list += `<option value="0">Selecione o modelo do veículo</option>`
      for(let i = 0; i < data.length; i++){
        list += `<option value="${brand_number}" id="${data[i].codigo}">${data[i].nome}</option>`
      }
    }
    model_form.innerHTML += list;
}

// Função para pegar os anos de veículos dependendo da marca, categoria e modelo selecionados e colocar no form de ano
async function getYears(type_form, model_form, year_form, type){
  // Pegando os valores dos forms selecionados
  var value = type_form.options[type_form.selectedIndex].value;
  var model_number = model_form.options[model_form.selectedIndex].id;
  var brand_number = model_form.options[model_form.selectedIndex].value;  
  let data
  // Verificando qual categoria foi selecionada e fazendo a requisição para a API
  if (value == "car"){
    const response = await fetch(FIPE_URL + "/v1/carros/marcas/" + brand_number + "/modelos/" + model_number + "/anos")
    data = await response.json()
    
  } else if (value == "motorcycle"){
    const response = await fetch(FIPE_URL + "/v1/motos/marcas/" + brand_number + "/modelos/" + model_number + "/anos")
    data = await response.json()

  } else if (value == "truck"){
    const response = await fetch(FIPE_URL + "/v1/caminhoes/marcas/" + brand_number + "/modelos/" + model_number + "/anos")
    data = await response.json()

  } else {
    return console.log("error")
  }

  // Tratamento para o código 32000-X (errado)
  // Percorre o array de dados e remove os que possuem o código 32000
  for (let i = 0; i < data.length; i++){
      if (data[i].codigo == '32000-1' || data[i].codigo == '32000-2' || data[i].codigo == '32000-3'){
          data.splice(i, 1)
      }
  }

  // Flag para indicar se é uma pesquisa de veículo ou é para plotar o gráfico
  // Flag = 1: pesquisa de veículo
  // Flag = 2: plotar gráfico
  if (type == 1){
    span_year = document.getElementById("select2-" + year_form.id + "-container");
    span_year.innerHTML = "Selecione o ano do veículo";
    // Setando os dados no form de ano
    setDataToYearForm(data, year_form)
  } else if (type == 2){
    // Pegando os dados de preço de cada ano
    let year_price = await getAllYearsPrices(data, type_form, model_form)
    // Plotando o gráfico
    plotGraph(year_price)
  }
}

// Função para setar os dados no form de ano
function setDataToYearForm(data, year_form){
    year_form.innerHTML = '';
    let list = '';
    // Utiliza listagem dinâmica para setar os dados
    if (data.length <= 0){
      list += `<h3>Nenhum ano de veículo disponível</h3>`
    } else {
      list += `<option value="0">Selecione o ano do veículo</option>`
      for(let i = 0; i < data.length; i++){
        list += `<option id="${data[i].codigo}">${data[i].nome}</option>`
      }
    }
    year_form.innerHTML += list;
}

// Função para o botão de pesquisa
function search(type_form, brand_form, model_form, year_form, result_div, type){
  // Verifica a flag para saber se é uma pesquisa de veículo ou é para plotar o gráfico
  // Flag = 1: pesquisa de veículo
  // Flag = 2: plotar gráfico
  if (type == 1){
    // Pegando os valores dos forms selecionados  
    var type_number = type_form.options[type_form.selectedIndex].value;
    var brand_number = brand_form.options[brand_form.selectedIndex].value;
    var model_number = model_form.options[model_form.selectedIndex].value;
    var year_number = year_form.options[year_form.selectedIndex].value;
    // Verifica se todos os campos foram selecionados
    if (type_number == "0" || brand_number == "0" || model_number == "0" || year_number == "0"){
      return alert("Selecione todos os campos para realizar a busca")
    } else {
      // Chama a função para pegar o preço e informações do veículo
      getVehiclePrice(type_form, model_form, year_form, result_div)
    }
  } else if (type == 2){
    // Pegando os valores dos forms selecionados
    var type_number = type_form.options[type_form.selectedIndex].value;
    var brand_number = brand_form.options[brand_form.selectedIndex].value;
    var model_number = model_form.options[model_form.selectedIndex].value;
    // Verifica se todos os campos foram selecionados
    if (type_number == "0" || brand_number == "0" || model_number == "0"){
      return alert("Selecione todos os campos para realizar a busca")
    } else {
      // Chama a função para pegar o preço de todos os anos do veículo
      getYears(type_form, model_form, undefined, 2)
    }
  }
}

// Função para pegar o preço do veículo e renderizar na tela
async function getVehiclePrice(type_form, model_form, year_form, result_div, compare = false){
  // Pegando os valores dos forms selecionados
  var value = type_form.options[type_form.selectedIndex].value;
  var model_number = model_form.options[model_form.selectedIndex].id;
  var brand_number = model_form.options[model_form.selectedIndex].value;
  var year_number = year_form.options[year_form.selectedIndex].id;
  let data
  // Verificando qual categoria foi selecionada e fazendo a requisição para a API
  if (value == "car"){
    const response = await fetch(FIPE_URL + "/v1/carros/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    data = await response.json()

  } else if (value == "motorcycle"){
    const response = await fetch(FIPE_URL + "/v1/motos/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    data = await response.json()

  } else if (value == "truck"){
    const response = await fetch(FIPE_URL + "/v1/caminhoes/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    data = await response.json()

  } else {
    return console.log("error")
  }
  // Renderiza o preço do veículo na tela
  renderPrice(data, result_div, compare)
  // Mostra o resultado
  result_div.style.display = 'block';
  // Faz o scroll para o resultado
  window.location.href = "#" + result_div.id;
}

// Função para renderizar o preço do veículo na tela
function renderPrice(data, result_div, compare = false){
  result_div.innerHTML = '';
  let list = '';
  // Pega os dados da resposta da requisição passada como parâmetro
  price = data['Valor']
  brand = data['Marca']
  model = data['Modelo']
  year = data['AnoModelo']
  fuel_type = data['Combustivel']
  fipe_code = data['CodigoFipe']
  month_reference = data['MesReferencia']
  // Utiliza listagem dinâmica para renderizar os dados na tela no formato de tabela
  list += `<br><br><h4>Informações do veículo</h4><br><table class="table table-bordered table-dark table-responsive">
  <tbody>
    <tr>
      <th scope="row">Marca</th>
      <td>${brand}</td>
    </tr>
    <tr>
      <th scope="row">Modelo</th>
      <td>${model}</td>
    </tr>
    <tr>
      <th scope="row">Ano</th>
      <td>${year}</td>
    </tr>
    <tr>
      <th scope="row">Preço médio</th>
      <td>${price}</td>
    </tr>
    <tr>
      <th scope="row">Combustível</th>
      <td>${fuel_type}</td>
    </tr>
    <tr>
      <th scope="row">Código FIPE</th>
      <td>${fipe_code}</td>
    </tr>
    <tr>
      <th scope="row">Mês de referência</th>
      <td>${month_reference}</td>
    </tr>
  </tbody>
  </table>`
  result_div.innerHTML += list;
  // Se o parâmetro compare for false, chama a função para abrir uma nova aba com as imagens do veículo
  // Para comparações, não foi utilizada a função de abrir abas com imagens dos veículos
  if (!compare){
    openNewTab(brand, model, year, price)
  }
}

// Função para abrir uma nova aba com as imagens do veículo
async function openNewTab(brand, model, year){
  // Monta a url para a pesquisa no google imagens
  var url = "https://www.google.com/search?q=" + brand + "+" + model + "+" + year + "&hl=pt_br&site=imghp&tbm=isch"
  window.open(url, '', 'width=700,height=500')
}

// Função para pegar o preço de todos os anos do veículo
async function getAllYearsPrices(data, type_form, model_form){
  // Cria arrays para armazenar os anos e os preços
  let year_array = []
  let aux_price_array = []
  let price_array = []
  let year_price = []
  // Pega os anos e os preços de cada ano
  for(let i = 0; i < data.length; i++){
    year_array.push(data[i].nome.slice(0,4))
    aux_price_array.push(await getPrice(data[i].codigo, type_form, model_form))
  }
  // Retira os valores que não são numéricos
  for (let i = 0; i < aux_price_array.length; i++){
    price_array.push(aux_price_array[i].replace('R$ ','').replaceAll('.','').replaceAll(',','.'))
  }
  // Convertendo para float
  price_array = price_array.map(parseFloat)
  // Cria um array de objetos com o ano e o preço
  for (let i = 0; i < year_array.length; i++){
    year_price = year_price.concat({year: year_array[i], price: price_array[i]})
  }
  // Ordena o array de acordo com o ano
  year_price.sort((a, b) => parseFloat(a.year) - parseFloat(b.year));
  return year_price
} 

// Função para plotar o gráfico utilizando a biblioteca plotly JS
function plotGraph(year_price){
  // Cria arrays para armazenar os anos e os preços
  var year_array = []
  var price_array = []

  // Pega os anos e os preços de cada ano
  for (let i = 0; i < year_price.length; i++){
    year_array.push(year_price[i]['year'])
    price_array.push(year_price[i]['price'])
  }

  // Configurações do gráfico
  var data = [{
    x: year_array,
    y: price_array,
    mode: 'lines+markers',
    type: 'bar',
    marker: {color: 'rgb(55, 83, 109)'}
  }];
  // Define o título do gráfico e os títulos dos eixos
  var layout = {
    title: 'Preço do modelo de acordo com o ano de fabricação',
    xaxis: {
      title: 'Ano do modelo',
      range: [Math.min(year_array), Math.max(year_array)],
      autotick: false
    },
    yaxis: {
      title: 'Preço médio (R$)',
      range: [Math.min(price_array), Math.max(price_array)],
      tickprefix: 'R$',
    }
  };
  // Mostra o gráfico
  Plotly.newPlot('plot', data, layout);
  // Scroll para a área do gráfico
  window.location.href='#plot';
}

// Função para pegar o preço do veículo
async function getPrice(year_number, type_form, model_form){
  // Valores dos forms selecionados
  var value = type_form.options[type_form.selectedIndex].value;
  var model_number = model_form.options[model_form.selectedIndex].id;
  var brand_number = model_form.options[model_form.selectedIndex].value;
  let data
  // Faz a requisição para a API e recebe como retorno todas as informações do veículo, mas apenas o valor é utilizado
  if (value == "car"){
    const response = await fetch(FIPE_URL + "/v1/carros/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    data = await response.json()
  } else if (value == "motorcycle"){
    const response = await fetch(FIPE_URL + "/v1/motos/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    data = await response.json()
  } else if (value == "truck"){
    const response = await fetch(FIPE_URL + "/v1/caminhoes/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    data = await response.json()
  } else {
    console.log("error")
  }
  // retorna o valor do veículo
  return data['Valor']
}

// Função do botão de comparação
function search_compare(type_form_left, type_form_right, brand_form_left, brand_form_right, model_form_left, model_form_right, year_form_left, year_form_right, result_left, result_right){
  // Valores dos forms selecionados
  var type_number_left = type_form_left.options[type_form_left.selectedIndex].value;
  var type_number_right = type_form_right.options[type_form_right.selectedIndex].value;
  var brand_number_left = brand_form_left.options[brand_form_left.selectedIndex].value;
  var brand_number_right = brand_form_right.options[brand_form_right.selectedIndex].value;
  var model_number_left = model_form_left.options[model_form_left.selectedIndex].value;
  var model_number_right = model_form_right.options[model_form_right.selectedIndex].value;
  var year_number_left = year_form_left.options[year_form_left.selectedIndex].value;
  var year_number_right = year_form_right.options[year_form_right.selectedIndex].value;
  // Verifica se todos os campos foram selecionados
  if (type_number_left == "0" || brand_number_left == "0" || model_number_left == "0" || year_number_left == "0" || type_number_right == "0" || brand_number_right == "0" || model_number_right == "0" || year_number_right == "0"){
    return alert("Selecione todos os campos para realizar a comparação")
  } else {
    // Chama a função para pegar o preço dos veículos e renderizar na tela
    getVehiclePrice(type_form_left, model_form_left, year_form_left, result_left, true)
    getVehiclePrice(type_form_right, model_form_right, year_form_right, result_right, true)
  }
}


