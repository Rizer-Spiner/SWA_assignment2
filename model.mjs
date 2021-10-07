function eventData(time, place) {
    function createEvent(time, place) {
        const getTime = () => time
        const getPlace = () => place
        const setTime = (_time) => createEvent(_time, place)
        const setPlace = (_place) => createEvent(time, _place)

        return {
            getPlace,
            getTime,
            setPlace,
            setTime
        }
    }

    return createEvent(time, place)
}


function dataType(type, unit) {
    function createDataType(type, unit) {
        const getType = () => type
        const getUnit = () => unit
        const setType = (_type) => createDataType(_type, unit)
        const setUnit = (_unit) => createDataType(type, _unit)

        return {
            getType,
            getUnit,
            setType,
            setUnit
        }
    }

    return createDataType(type, unit)
}

function weatherData(type, unit, time, place, value) {
    const getValue = () => value
    const setValue = (_value) => weatherData(type, unit, time, place, _value)

    return Object.assign({}, eventData(time, place), dataType(type, unit), { getValue, setValue })
}

const withConstructor = constructor => o => ({
   
    __proto__: {
      constructor
    },
    ...o
  });

  const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

  const convertToC = o =>{
      if(o.getUnit()!= 'C')
         o.setUnit('C')
  }

  const convertToF = o =>{
    if(o.getUnit()!= 'F')
    o.setUnit('F')
  }

  const temperatureT = (type, unit, time, place, value) => pipe(
      convertToC,
      convertToF,
      withConstructor(weatherData)
  )

function temperature(type, unit, time, place, value) {

    function createTemperature(weatherData){

        const convertToC = () =>{
            if(this.getUnit() != 'C'){
               this.setUnit('C')
               this.setValue(this.getValue() - 32) * (5 / 9)
            }
        }
        const convertToF = () =>{
            if(this.getUnit() != 'F'){
               this.setUnit('F')
               this.setValue((this.getValue() * 1.8) + 32)
             }
        }

        let temperature = Object.create({...weatherData, convertToC, convertToF})

        return temperature
    }


    return createTemperature(weatherData(type, unit, time, place, value))
    // let weatherD = weatherData(type, unit, time, place, value)
    // const convertToC = () => {
    //     if (getUnit() !== 'C') {
    //         weatherD = weatherD.setUnit('C')
    //         weatherD = weatherD.setValue((weatherD.getValue() - 32) * (5 / 9))
    //     }
    // }

    // const convertToF = () => {
    //     weatherD = weatherD.setUnit('F')
    //     // if (weatherD.getUnit() !== 'F') {
    //     //     weatherD = weatherD.setUnit('F')
    //     //     weatherD = weatherD.setValue((weatherD.getValue() * 1.8) + 32)
    //     // }
    // }

    // let temperature = Object.assign(weatherD, convertToC, convertToF)

    // return Object.assign({}, temperature)

}

let s = temperature("T", 'F', "2020:09:23", "V", 33)

console.log(s.getValue());
console.log(s.getUnit());
// s = s.setUnit('F');
// console.log(s.getUnit)
console.log(s.convertToC());
console.log(s.getUnit());
console.log(s.getValue());




// let w = weatherData("T", 'C', "2020:09:06", "V", 5)

// console.log(w.getTime());
// console.log(w.getValue());
// w = w.setValue(23)
// console.log(w.getValue());

// const data_type = (type, unit) => properties => Object.assign({}, properties, {type, unit})

// const eventT = (time, place) => properties => Object.assign({}, properties, {time, place})

// const measurement = (value)=> data_type => (object, eventT) => Object.assign(Object.create({eventT: () => eventT, value: value}), eventT(data_type(object)))

// let dataT = data_type("T", "C")
// let eventD = eventT("2020:09:23", "VIA")
// let vvvvv = measurement(26)
// let sssss = vvvvv(dataT)
// let m = sssss({value: 23, smth: "smth"}, eventD)


// console.log(m.time);
// console.log(m.place);
// console.log(sssss.value)
