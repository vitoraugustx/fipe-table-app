const WEARABLE_URL = "https://api-wearable.herokuapp.com/events"
const FIPE_URL = "https://parallelum.com.br/fipe/api"
const type_form = document.getElementById('form-vehicle-type');
const brand_form = document.getElementById('form-vehicle-brand');
const model_form = document.getElementById('form-vehicle-model');
const year_form = document.getElementById('form-vehicle-year');
const result_div = document.getElementById('result');

async function getVehicle(){
  var value = type_form.options[type_form.selectedIndex].value;
  if (value == "car"){
    let response = await fetch(FIPE_URL + "/v1/carros/marcas")
    let data = await response.json()
    setDataToBrandForm(data, value)

  } else if (value == "motorcycle"){
    let response = await fetch(FIPE_URL + "/v1/motos/marcas")
    let data = await response.json()
    setDataToBrandForm(data, value)

  } else if (value == "truck"){
    let response = await fetch(FIPE_URL + "/v1/caminhoes/marcas")
    let data = await response.json()
    setDataToBrandForm(data, value)

  } else { 
    console.log("error")
  }
  // TODO: RESET MODEL FORM, YEAR FORM
}

function setDataToBrandForm(data, value){
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

function setDataToModelForm(json, brand_number){
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

function setDataToYearForm(data){
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

async function getModels(){
  var brand_number = brand_form.options[brand_form.selectedIndex].id;
  var value = type_form.options[type_form.selectedIndex].value;
  if (value == "car"){
    const response = await fetch(FIPE_URL + "/v1/carros/marcas/" + brand_number + "/modelos")
    const data = await response.json()
    setDataToModelForm(data, brand_number)

  } else if (value == "motorcycle"){
    const response = await fetch(FIPE_URL + "/v1/motos/marcas/" + brand_number + "/modelos")
    const data = await response.json()
    setDataToModelForm(data, brand_number)

  } else if (value == "truck"){
    const response = await fetch(FIPE_URL + "/v1/caminhoes/marcas/" + brand_number + "/modelos")
    const data = await response.json()
    setDataToModelForm(data, brand_number)

  } else {
    console.log("error")
  }
}

async function getYears(){
  var value = type_form.options[type_form.selectedIndex].value;
  var model_number = model_form.options[model_form.selectedIndex].id;
  var brand_number = model_form.options[model_form.selectedIndex].value;  
  let data
  if (value == "car"){
    const response = await fetch(FIPE_URL + "/v1/carros/marcas/" + brand_number + "/modelos/" + model_number + "/anos")
    data = await response.json()
    setDataToYearForm(data)
  } else if (value == "motorcycle"){
    const response = await fetch(FIPE_URL + "/v1/motos/marcas/" + brand_number + "/modelos/" + model_number + "/anos")
    data = await response.json()
    setDataToYearForm(data)
  } else if (value == "truck"){
    const response = await fetch(FIPE_URL + "/v1/caminhoes/marcas/" + brand_number + "/modelos/" + model_number + "/anos")
    data = await response.json()
    setDataToYearForm(data)
  } else {
    console.log("error")
  }
  let year_price = await getAllYearsPrices(data)
  console.log(year_price)
}

async function getVehiclePrice(){
  var value = type_form.options[type_form.selectedIndex].value;
  var model_number = model_form.options[model_form.selectedIndex].id;
  var brand_number = model_form.options[model_form.selectedIndex].value;
  var year_number = year_form.options[year_form.selectedIndex].id;
  if (value == "car"){
    const response = await fetch(FIPE_URL + "/v1/carros/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    const data = await response.json()
    renderPrice(data)
  } else if (value == "motorcycle"){
    const response = await fetch(FIPE_URL + "/v1/motos/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    const data = await response.json()
    renderPrice(data)
  } else if (value == "truck"){
    const response = await fetch(FIPE_URL + "/v1/caminhoes/marcas/" + brand_number + "/modelos/" + model_number + "/anos/" + year_number)
    const data = await response.json()
    renderPrice(data)
  } else {
    console.log("error")
  }
}

function renderPrice(data){
  result_div.innerHTML = '';
  let list = '';
  price = data['Valor']
  brand = data['Marca']
  model = data['Modelo']
  year = data['AnoModelo']
  fuel_type = data['Combustivel']
  fipe_code = data['CodigoFipe']
  month_reference = data['MesReferencia']
  list += `<h3>Marca: ${brand}</h3>`
  list += `<h3>Modelo: ${model}</h3>`
  list += `<h3>Ano: ${year}</h3>`
  list += `<h3>Combustível: ${fuel_type}</h3>`
  list += `<h3>Código FIPE: ${fipe_code}</h3>`
  list += `<h3>Mês de referência: ${month_reference}</h3>`
  list += `<h3>Preço: ${price}</h3>`
  result_div.innerHTML += list;
}

async function getAllYearsPrices(data){
  let year_array = []
  let aux_price_array = []
  let price_array = []
  let year_price = {}
  for(let i = 0; i < data.length; i++){
    year_array.push(data[i].nome.slice(0,4))
    year_array.sort()
    aux_price_array.push(await getPrice(data[i].codigo))
  }
  for (let i = 0; i < aux_price_array.length; i++){
    price_array.push(aux_price_array[i].replace('R$ ','').replace('.','').replace(',','.'))
  }
  price_array.sort()
  for (let i = 0; i < year_array.length; i++){
    year_price[year_array[i]] = price_array[i]
  }
  return year_price
} 

async function getPrice(year_number){
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