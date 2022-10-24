const db = require("./config/firebase");
const uid = require("generate-unique-id");

const cropRef = db.collection("crops");

const data = [
    {
        name: "paddy",
        season: "rainy",
        image: "localhost:8000/img/paddy.png",
        type: "crop",
        temp_min: 15,
        temp_max: 27
    },
    {
        name: "mushroom",
        season: "rainy",
        image: "localhost:8000/img/mushroom.png",
        type: "crop",
        temp_min: 17,
        temp_max: 25
    },
    {
        name: "cabbage",
        season: "winter",
        image: "localhost:8000/img/cabbage.png",
        type: "vegetable",
        temp_min: 15,
        temp_max: 21
    },
    {
        name: "cauliflower",
        season: "winter",
        image: "localhost:8000/img/cauliflower.png",
        type: "vegetable",
        temp_min: 17,
        temp_max: 23
    },
    {
        name: "wheat",
        season: "winter",
        image: "localhost:8000/img/wheat.png",
        type: "crop",
        temp_min: 3.5,
        temp_max: 26
    },
    {
        name: "carrot",
        season: "winter",
        image: "localhost:8000/img/carrot.png",
        type: "vegetable",
        temp_min: 15,
        temp_max: 20
    },
    {
        name: "onion",
        season: "winter",
        image: "localhost:8000/img/onion.png",
        type: "vegetable",
        temp_min: 13,
        temp_max: 24
    },
    {
        name: "soyabean",
        season: "rainy",
        image: "localhost:8000/img/soyabean.png",
        type: "crop",
        temp_min: 20,
        temp_max: 30
    },
    {
        name: "sweet potato",
        season: "summer",
        image: "localhost:8000/img/sweet_potato.png",
        type: "crop",
        temp_min: 24,
        temp_max: 35
    },
    {
        name: "tomato",
        season: "summer",
        image: "localhost:8000/img/tomato.png",
        type: "vegetable",
        temp_min: 15,
        temp_max: 30
    },
    {
        name: "mango",
        season: "summer",
        image: "localhost:8000/img/mango.png",
        type: "fruit",
        temp_min: 30,
        temp_max: 45
    },
    {
        name: "apple",
        season: "summer",
        image: "localhost:8000/img/apple.png",
        type: "fruit",
        temp_min: 21,
        temp_max: 24
    },
    {
        name: "cotton",
        season: "summer",
        image: "localhost:8000/img/cotton.png",
        type: "crop",
        temp_min: 20,
        temp_max: 30
    },
    {
        name: "maize",
        season: "rainy",
        image: "localhost:8000/img/maize.png",
        type: "crop",
        temp_min: 22,
        temp_max: 28
    },
    {
        name: "sugarcane",
        season: "rainy",
        image: "localhost:8000/img/sugarcane.png",
        type: "crop",
        temp_min: 25,
        temp_max: 35
    }
    
];

async function createData(){
    await Promise.all(
        data.map(async(doc)=>{
          let id = uid();
          doc.id = id;
          await cropRef.doc(id).set(doc);
        })
    )
}

createData();
