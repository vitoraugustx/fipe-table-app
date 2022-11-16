const WEARABLE_URL = "https://api-wearable.herokuapp.com/events"
const FIPE_URL = "https://parallelum.com.br/fipe/api"
const type_form = document.getElementById('form-vehicle-type');
const brand_form = document.getElementById('form-vehicle-brand');
const model_form = document.getElementById('form-vehicle-model');
const year_form = document.getElementById('form-vehicle-year');

async function getVehicle(){
  var value = type_form.options[type_form.selectedIndex].value;
  console.log(value);
  if (value == "car"){
    let response = await fetch(FIPE_URL + "/v1/carros/marcas")
    let data = await response.json()
    
    setCarsToBrandForm(data)
  } else if (value == "motorcycle"){
    let response = await fetch(FIPE_URL + "/v1/motos/marcas")
    let data = await response.json()
    
    setMotorcycleToBrandForm(data)
  } else if (value == "truck"){
    let response = await fetch(FIPE_URL + "/v1/caminhoes/marcas")
    let data = await response.json()
    
    setTruckToBrandForm(data)
  } else { 
    console.log("error")
  }
}

function setCarsToBrandForm(data){
  brand_form.innerHTML = '';
  let list = '';
  if (data.length <= 0){
    list += `<h3>Nenhuma marca de carro disponível</h3>`
  } else {
    list += `<option value="0">Selecione a marca do veículo</option>`
    for(let i = 0; i < data.length; i++){
      list += `<option value="${data[i].codigo}">${data[i].nome}</option>`
    }
  }
  brand_form.innerHTML += list;
}

function setMotorcycleToBrandForm(data){
  brand_form.innerHTML = '';
  let list = '';
  if (data.length <= 0){
    list += `<h3>Nenhuma marca de moto disponível</h3>`
  } else {
    list += `<option value="0">Selecione a marca do veículo</option>`
    for(let i = 0; i < data.length; i++){
      list += `<option value="${data[i].codigo}">${data[i].nome}</option>`
    }
  }
  brand_form.innerHTML += list;
}

function setTruckToBrandForm(data){
  let list = '';
  if (data.length <= 0){
    list += `<h3>Nenhuma marca de caminhão disponível</h3>`
  } else {
    for(let i = 0; i < data.length; i++){
      list += `<option value="${data[i].codigo}">${data[i].nome}</option>`
    }
  }
  brand_form.innerHTML += list;
}


function renderMotorcycle(data){
  let list = '';
  if (data.length <= 0){
    list += `<h3>Nenhuma marca de moto disponível</h3>`
  } else {
    list += `<select id="form-vehicle-brand" onchange="getVehicleModel()">`

    for(let i = 0; i < data.length; i++){
      list += `<option value="${data[i].codigo}">${data[i].nome}</option>`
    }
  }
  listContainer.innerHTML += list;
}

function renderTruck(data){
  let list = '';
  if (data.length <= 0){
    list += `<h3>Nenhuma marca de caminhão disponível</h3>`
  } else {
    
    list += `<select id="form-vehicle-brand" onchange="getVehicleModel()">`
    for(let i = 0; i < data.length; i++){
      list += `<option value="${data[i].codigo}">${data[i].nome}</option>`
    }
  }
  listContainer.innerHTML += list;
}

async function getVehicleModel(){
  var value = select.options[select.selectedIndex].value;
  var brand = document.getElementById('form-vehicle-brand').value;
  console.log(brand);
  if (value == "car"){
    const response = await fetch(FIPE_URL + "/v1/carros/marcas/" + brand + "/modelos")
    const data = await response.json()
    console.log(data)
    renderCarModel(data)
  } else if (value == "motorcycle"){
    const response = await fetch(FIPE_URL + "/v1/motos/marcas/" + brand + "/modelos")
    const data = await response.json()
    console.log(data)
  } else if (value == "truck"){
    const response = await fetch(FIPE_URL + "/v1/caminhoes/marcas/" + brand + "/modelos")
    const data = await response.json()
    console.log(data)
  } else {
    console.log("error")
  }
}


/*function renderEvents(data){
  let list = '';
  if (data.length <= 0){
    list += `<h3>Nenhum evento disponível</h3>`
  } else {
    for(let i = 0; i < data.length; i++){
      list += `<div class="card">
        <div class="card-header">
            <h2 id='details_label'>Detalhes do evento</h2>
        </div>
        <div class="card-body">
            <ul>
                <li><b>ID de relógio:</b> ${data[i].smartWatchId}</li>
                <li><b>Data/hora:</b> ${data[i].dateTime}</li>
                <li><b>Nível de sonolência:</b> ${data[i].drowsinessLevel}</li>
            </ul>
        </div>
        <div class="card-footer">
        </div>
      </div>
      <br>
      <br>
      <br>`  
    }
  }
  listContainer.innerHTML = list;
}*/