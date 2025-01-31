// import { data } from "autoprefixer";
import { account, history_endpoint, limit } from "./constant"

export async function getActions( begin_iso_date, devname ) {

  let url = "https://mainnet.telos.net" + "/v2/history/get_actions?"
        +"account="+account
        +"&act.authorization.actor="+devname
        +"&after="+begin_iso_date
        +"&limit="+limit;

      const fetchPromiseMainnet = fetch(url);
      return fetchPromiseMainnet    

}

// get all the timeseries & data related to timeseries inside the json response
export function getData(bunk, devname) {
    let _temperature = []
    let _humidity = []
    let _pressure = []
    let _voltage = []
    let _rain = []
    let _light = []
    let _windspd = []
    let _winddir = []
    let _times = []
    let i = 0
    let d = {}
    for(let row of bunk){
      if(row.act.data.devname == devname) {
        _temperature.push(row.act.data.temperature_c)
        _humidity.push(row.act.data.humidity_percent)
        _pressure.push(row.act.data.pressure_hpa)
        _voltage.push(row.act.data.battery_millivolt)
        _rain.push(row.act.data.rain_1hr_mm)
        _light.push(row.act.data.light_intensity_lux)
        _windspd.push(row.act.data.wind_spd_ms)
        _winddir.push(row.act.data.wind_dir_deg)
        _times.push(new Date(row.timestamp).toISOString())

        i = i+1
      }
    }
  
    return {
      temperature: _temperature,
      humidity: _humidity,
      pressure: _pressure,
      voltage: _voltage,
      rain: _rain,
      light: _light,
      windspd: _windspd,
      winddir: _winddir,
      times: _times,
      // sensor: d
    }
  }


  // convert from celcius to fah value
  export function conversion(list) {
    var converted = []
    for (let i of list) {
      converted.push((i * 1.8 + 32).toFixed(2))
    }
    return converted
  }

  // compare the last date in the collected timeseries and the day_threshold(default is 5)
  export function compare(date1, date2) {
    return date1 <= date2;
  } 

  // check gmt index
  export function checkCurrentGMT(formated_date) {
    // var sign = formated_date.slice(0,1)
    var id = parseInt(formated_date.slice(1,3))

    return id
    
    
  }


  // getMapData
  export async function postMapData(content="weather") {
    const url = "https://mainnet.telos.net/v1/chain/get_table_rows" //https://telos.caleos.io/    //https://api.kandaweather.net/v1/chain/get_table_rows
    const url_mainnet = "https://kandaweather-mainnet.ddns.net/v1/chain/get_table_rows"
    let data
    if (content=='weather') // dclimateiot4 // ascendweathr //// sensorsv1 //sensorsv1
        data = "{\"code\":\"ascendweathr\",\"table\":\"weather\",\"scope\":\"ascendweathr\",\"index_position\":\"first\",\"json\":\"true\",\"limit\":100}"
    else
        data = "{\"code\":\"ascendweathr\",\"table\":\"sensorsv2\",\"scope\":\"ascendweathr\",\"index_position\":\"first\",\"json\":\"true\",\"limit\":100}"
    
    const response = await fetch(url, {
        method: "POST",
        headers: {"content-type": "application/json", "Accept-Charset": "UTF-8"},
        body: data
    })

    //const tmp = response.json()
    //console.log("Direct json response was:")
    //console.log(tmp)
    //console.log("response.rows was:")
    //console.log(tmp.rows)
    //return tmp.rows
    return response.json()
      
  }

  export async function getTableEntry( name="nxik2maqfxop" , table="weather" ) {
    const url = "https://mainnet.telos.net/v1/chain/get_table_rows" //https://telos.caleos.io/    //https://api.kandaweather.net/v1/chain/get_table_rows
    const url_mainnet = "https://kandaweather-mainnet.ddns.net/v1/chain/get_table_rows"

    let postData = "{\"code\":\"ascendweathr\",\"table\":\"" +
		  table +
		  "\",\"scope\":\"ascendweathr\",\"index_position\":\"first\",\"lower_bound\":\"" +
		  name +
		  "\",\"upper_bound\":\"" +
		  name +
		  "\",\"key_type\":\"name\",\"json\":\"true\",\"limit\":1}"
		  //",\"json\":\"true\",\"limit\":100}"

    const response = await fetch(url, {
        method: "POST",
        headers: {"content-type": "application/json", "Accept-Charset": "UTF-8"},
        body: postData
    })

    return response.json()

  }
    
  export function diff_days(date){
      var now = new Date()
      var dif = now - date
      //var days = Math.ceil(dif / (1000 * 3600 * 24))
      var hours = Math.ceil(dif / (1000 * 3600 ))
      return switchState(hours)
  }

  export function switchState(dif) {
    if(dif < 3) return "ACTIVE"
    else if(dif >=3) return "NOT ACTIVE"
  }
