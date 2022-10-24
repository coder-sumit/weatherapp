let request = require('request');
const db = require("../config/firebase");
const uid = require("generate-unique-id");

// create promise to make api call
function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

//   request controller
module.exports.getWeather = async (req, res) => {
    try {
        const cities = req.body.cities;

        let temperatures = await Promise.all(
            cities.map(async (city) => {
                try {
                    // options for request
                    let options = {
                        'method': 'GET',
                        'url': `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=958bebd78c5d635ea9d32ce6ade7848b&units=metric`,
                    };
                    let res = await doRequest(options);
                    res = JSON.parse(res);
                    let resObj ={};
                    resObj.status = res.weather[0].main;
                    resObj.temp = res.main.temp;
                    resObj.temp_min = res.main.temp_min;
                    resObj.temp_max = res.main.temp_max;
                    resObj.location = res.name;
                    return resObj;
                } catch (err) {
                    console.log("Error while making request", err);
                }
            })
        );

       // create analysis data in database
       let weatherAnaRef = db.collection("weatherAnalysis");
       await Promise.all(
        temperatures.map(async(doc)=>{
           try{
            const id = uid();
            let date = new Date();
            let month = date.getMonth()+1;
            let year = date.getFullYear();
            let analysisDoc = {
            created_at: new Date(),
              id,
              month,
              year,
              location: doc.location,
              temp: doc.temp,
              temp_min: doc.temp_min,
              temp_max: doc.temp_max
            }
            await weatherAnaRef.doc(id).set(analysisDoc);
           }catch(err){
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error!"
            })
           }
        })
       )

       // change status
       temperatures = temperatures.map((doc)=>{
          if(doc.status == "Rain" || doc.status == "Clear"|| doc.status == "Snow" || doc.status == "Clouds"){
            return doc;
          }

          doc.status = "Haze";
          return doc;
       });



       return res.status(200).json({
        res: {
            status: "success",
            code: 200
        },
        message: "Data Fetched!",
        data: temperatures
       });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}