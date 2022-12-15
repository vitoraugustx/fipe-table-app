const FIPE_URL = "https://parallelum.com.br/fipe/api"

$(function () {
  $("select").select2();
});


async function getVehicle(type_form, brand_form){
    type_form_value = type_form.value;
    let data
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

    setDataToBrandForm(data, brand_form)
    
    // TODO: RESET MODEL FORM, YEAR FORM
}

function setDataToBrandForm(data, brand_form){
    brand_form.innerHTML = '';
    let list = '';
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

async function getModels(type_form, brand_form, model_form){
    var type_form_value = type_form.options[type_form.selectedIndex].value;
    var brand_number = brand_form.options[brand_form.selectedIndex].id;
    let data
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

    setDataToModelForm(data, brand_number, model_form)

}

function setDataToModelForm(json, brand_number, model_form){
    data = json['modelos']
    model_form.innerHTML = '';
    let list = '';
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

async function getYears(type_form, model_form, year_form, type){
    var value = type_form.options[type_form.selectedIndex].value;
    var model_number = model_form.options[model_form.selectedIndex].id;
    var brand_number = model_form.options[model_form.selectedIndex].value;  
    let data
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
    for (let i = 0; i < data.length; i++){
        if (data[i].codigo == '32000-1' || data[i].codigo == '32000-2' || data[i].codigo == '32000-3'){
            data.splice(i, 1)
        }
    }

    if (type == 1){
        setDataToYearForm(data, year_form)
    } else if (type == 2){
      let year_price = await getAllYearsPrices(data, type_form, model_form)
      plotGraph(year_price)
    }
}

function setDataToYearForm(data, year_form){
    year_form.innerHTML = '';
    let list = '';
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

function search(type_form, brand_form, model_form, year_form, result_div, type){
    if (type == 1){
      var type_number = type_form.options[type_form.selectedIndex].value;
      var brand_number = brand_form.options[brand_form.selectedIndex].value;
      var model_number = model_form.options[model_form.selectedIndex].value;
      var year_number = year_form.options[year_form.selectedIndex].value;
      if (type_number == "0" || brand_number == "0" || model_number == "0" || year_number == "0"){
        return alert("Selecione todos os campos para realizar a busca")
      } else {
        getVehiclePrice(type_form, model_form, year_form, result_div)
      }
    } else if (type == 2){
      var type_number = type_form.options[type_form.selectedIndex].value;
      var brand_number = brand_form.options[brand_form.selectedIndex].value;
      var model_number = model_form.options[model_form.selectedIndex].value;
      if (type_number == "0" || brand_number == "0" || model_number == "0"){
        return alert("Selecione todos os campos para realizar a busca")
      } else {
        getYears(type_form, model_form, undefined, 2)
      }
    }
}

async function getVehiclePrice(type_form, model_form, year_form, result_div, compare = false){
    var value = type_form.options[type_form.selectedIndex].value;
    var model_number = model_form.options[model_form.selectedIndex].id;
    var brand_number = model_form.options[model_form.selectedIndex].value;
    var year_number = year_form.options[year_form.selectedIndex].id;
    let data
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
    renderPrice(data, result_div, compare)
    result_div.style.display = 'block';
    window.location.href = "#" + result_div.id;
}

function renderPrice(data, result_div, compare = false){
  result_div.innerHTML = '';
  let list = '';
  price = data['Valor']
  brand = data['Marca']
  model = data['Modelo']
  year = data['AnoModelo']
  fuel_type = data['Combustivel']
  fipe_code = data['CodigoFipe']
  month_reference = data['MesReferencia']
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
  if (!compare){
    openNewTab(brand, model, year, price)
  }
}

async function openNewTab(brand, model, year){
  var url = "https://www.google.com/search?q=" + brand + "+" + model + "+" + year + "&hl=pt_br&site=imghp&tbm=isch"
  window.open(url, '', 'width=700,height=500')
}

async function getAllYearsPrices(data, type_form, model_form){
    let year_array = []
    let aux_price_array = []
    let price_array = []
    let year_price = []
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

function plotGraph(year_price){
  console.log(year_price)
  var year_array = []
  var price_array = []
  for (let i = 0; i < year_price.length; i++){
    year_array.push(year_price[i]['year'])
    price_array.push(year_price[i]['price'])
  }

  // Define the data
  var data = [{
    x: year_array,
    y: price_array,
    mode: 'lines+markers',
    type: 'bar',
    marker: {color: 'rgb(55, 83, 109)'}
  }];
  // Define the plot layout
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
  // Display the plot
  Plotly.newPlot('plot', data, layout);
  window.location.href='#plot';
}

async function getPrice(year_number, type_form, model_form){
  var value = type_form.options[type_form.selectedIndex].value;
  var model_number = model_form.options[model_form.selectedIndex].id;
  var brand_number = model_form.options[model_form.selectedIndex].value;
  if (value == "car"){
    const response = await fetch(FIPE_URL + "/v1/carros/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    const data = await response.json()
    return data['Valor']
  } else if (value == "motorcycle"){
    const response = await fetch(FIPE_URL + "/v1/motos/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    const data = await response.json()
    return data['Valor']
  } else if (value == "truck"){
    const response = await fetch(FIPE_URL + "/v1/caminhoes/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    const data = await response.json()
    return data['Valor']
  } else {
    console.log("error")
  }
}

function search_compare(type_form_left, type_form_right, brand_form_left, brand_form_right, model_form_left, model_form_right, year_form_left, year_form_right, result_left, result_right){
  var type_number_left = type_form_left.options[type_form_left.selectedIndex].value;
  var type_number_right = type_form_right.options[type_form_right.selectedIndex].value;
  var brand_number_left = brand_form_left.options[brand_form_left.selectedIndex].value;
  var brand_number_right = brand_form_right.options[brand_form_right.selectedIndex].value;
  var model_number_left = model_form_left.options[model_form_left.selectedIndex].value;
  var model_number_right = model_form_right.options[model_form_right.selectedIndex].value;
  var year_number_left = year_form_left.options[year_form_left.selectedIndex].value;
  var year_number_right = year_form_right.options[year_form_right.selectedIndex].value;
  if (type_number_left == "0" || brand_number_left == "0" || model_number_left == "0" || year_number_left == "0" || type_number_right == "0" || brand_number_right == "0" || model_number_right == "0" || year_number_right == "0"){
    return alert("Selecione todos os campos para realizar a comparação")
  } else {
    getVehiclePrice(type_form_left, model_form_left, year_form_left, result_left, true)
    getVehiclePrice(type_form_right, model_form_right, year_form_right, result_right, true)
  }
}


