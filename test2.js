
// const data = {
//     variable:null,
//     recurse:{
//         variable:null,
//         recurse:{
//             variable:null,
//             recurse:{
//                 variable:"Last",
//                 recurse:{
                    
//                 }
//             }
//         }
//     }
// }

// console.log(data);

// const keys = Object.keys(data)

// let recursable = 1
// let view = null
// while(recursable){

//     if (!view) {
//         if (Object.keys(data.recurse).length > 0) {
//             recursable++
//             view = data.recurse
//         }
//     }else{
//         if (Object.keys(view.recurse).length > 0) {
//             recursable++
//             view = view.recurse
//         }else{
//             console.log(view.variable);
//         }
//     }
//     recursable--
// }


let data = {
    index:0,
    recurse:null
}

let view;
for (let i = 1; i < 5; i++) {
    
    if (!data.recurse) {
        data.recurse = {
            index:i,
            recurse:null
        }
        view = data.recurse
    }else{
        view.recurse = {
            index:i,
            recurse:null
        }
        view = view.recurse
    }
}

// console.log(data);


// console.log(data);