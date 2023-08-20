
const arr1 = ['n','MUL', 'SUB','x', 'PWR', 'SUB','2','MUL', 'a','MUL', 'SUB', 'EVAL','1','SUB','1','ADD','7']
const arr2 = ['SUB','n','SUB','2','ADD','5']
const arr3 = ['EVAL','1','PWR','SUB','2','PWR','SUB','3','SUB','5']
// const arr3 = ['ADD','n','MUL','SUB', 'EVAL', '1','PWR','ADD','25','PWR','SUB','19','PWR','ADD','EVAL','2']

const OPCODES = {
    ADD:"ADD",
    SUB:"SUB",
    MUL:"MUL",
    DIV:"DIV",
    PWR:"PWR",
    BRKOP:"BRKOP",
    BRKCL:"BRKCL",
    EVAL:"EVAL",
    SIN:"SIN",
    COS:"COS",
    TAN:"TAN",
}

const opcodeVals = Object.values(OPCODES)

const getLastElement = (array = []) =>{
    if (array.length == 0) {
        return;
    }
    return array[array.length-1]
}

const isSorted = (array) =>{
    for (let index = 0; index < array.length - 1; index++) {
        if (array[index] > array[index + 1]) {
        return false;
        }
    }
    return true;
}

const sorter = (array, reverse = false, distinct = false) =>{
    let sortedArray = [...array];

    let recurse = 1;
    while (recurse > 0) {
        const tempArray = [];
        let index = 0;

        if (sortedArray.length >= 1) {
        if (tempArray.length === 0) {
            for (const element of sortedArray) {
            if (tempArray.length > 0) {
                if (getLastElement(tempArray) > element) {
                const num = tempArray.pop();
                tempArray.push(element);
                tempArray.push(num);
                } else if (getLastElement(tempArray) < element) {
                tempArray.push(element);
                }
            } else {
                tempArray.push(element);
            }
            index += 1;
            }

            if (!isSorted(tempArray)) {
            recurse = 2;
            }
            sortedArray = tempArray;
        } else {
            tempArray.push(sortedArray[0]);
            for (const element of sortedArray) {
            if (getLastElement(tempArray) > element) {
                const num = tempArray.pop();
                tempArray.push(element);
                tempArray.push(num);
            } else if (getLastElement(tempArray) < element) {
                tempArray.push(element);
            }
            index += 1;
            }
        }
        }

        if (!isSorted(tempArray)) {
        recurse = 2;
        }
        sortedArray = tempArray;

        recurse -= 1;
    }

    const distinctArray = distinct ? [...new Set(sortedArray)] : sortedArray;
    const reverseArray = reverse ? distinctArray.reverse() : distinctArray;
    return reverseArray;
}

const split_array = (array=[],indexes=[]) =>{

    let res = []

    for (let i = 0; i < indexes.length+1; i++) {
        let temp = []

        for (let j = 0; j < array.length; j++) {
            const el = array[j];

            let start;
            let end;
    
            if (i == indexes.length) {
                start = indexes[i-1]
    
                if (j >= start && j < array.length) {
                    temp.push(el)
                }
            }else{
                if (i > 0) {
                    start = indexes[i-1]
                    end = indexes[i]
                    if (j >= start && j < end) {
                        temp.push(el)
                    }
                }else{
                    end = indexes[i]
                    if (j >= 0 && j < end) {
                        temp.push(el)
                    }
                }
            }
            
        }
        res.push(temp)
    }

    if (indexes.length == 0) {
        res = [array]
    }
    return res
}

const asymetric_sorter = (array = [], ommit = [], reverse = false) =>{

    const res = []

    const array_1 = []
    const array_1_els = []

    for (let i = 0; i < array.length; i++) {
        const el = array[i];
        
        if (!ommit.includes(el)) {
            array_1.push(i)
            array_1_els.push(el)
        }
    }

    const sorted_arr = sorter(array_1_els,reverse);

    for (let i = 0; i < array.length; i++) {
        const el = array[i];
        
        if (array_1.includes(i)) {
            res.push(sorted_arr[array_1.indexOf(i)]);
        }else{
            res.push(el)
        }
    }

    return res
}

// const scanner = (array = []) =>{
//     const data = {
//         coef:[],
//         num_coef:1,
//         sign:OPCODES.ADD,
//         value:'',
//     }


//     // let skip = 0
//     // for (let i = 0; i < array.length; i++) {
//     //     const token = array[i];
        
//     //     if (opcodeVals.includes(token)) {
            
//     //         if (token == OPCODES.SUB) {
//     //             data.sign = data.sign == OPCODES.ADD ? OPCODES.SUB : OPCODES.ADD
//     //         }

//     //         if (token == OPCODES.PWR) {
//     //             for (let i = 0; i < data.coef.length; i++) {
//     //                 const var_data = data.coef[i];
                    
//     //                 if (var_data.variable == array[i-1]) {
//     //                     var_data.exponent = array[i+1]
//     //                     break;
//     //                 }
//     //             }
//     //             skip++
//     //         }

//     //         if (token == OPCODES.DIV) {
//     //             for (let i = 0; i < data.coef.length; i++) {
//     //                 const var_data = data.coef[i];
                    
//     //                 if (var_data.variable == array[i+1]) {
//     //                     var_data.exponent = array[i+1]
//     //                     break;
//     //                 }
//     //             }
//     //         }
//     //     }else{
//     //         if (skip == 0) {
//     //             if (token.match("[0-9]")) {
//     //                 data.num_coef *= parseFloat(token)
//     //             }else{
//     //                 let var_data = {
//     //                     variable: token,
//     //                     exponent:1
//     //                 }
//     //                 data.coef.push(var_data)
//     //             }
//     //         }else{
//     //             skip--
//     //         }
//     //     }

//     // }

//     let current_state;

//     const states = {
//         skip: 0,
//         eval_skip: 0,
//         numeric:(token,index)=>{
//             if (!token.match('[0-9]') && !opcodeVals.includes(token)) {
//                 current_state = states.variable

//                 const var_data = {
//                     coef: token,
//                     exponent:{
//                         value:'1',
//                         sign: OPCODES.ADD
//                     },
//                     sign: array[index-1] ?? OPCODES.ADD
//                 }

//                 data.coef.push(var_data);
//             }

//             else if (token == OPCODES.ADD || token == OPCODES.SUB) {
//                 current_state = states.add_sub

                

//             }

//             else if (token == OPCODES.MUL || token == OPCODES.DIV) {
//                 current_state = states.mul_div
//             }

//             else if (token == OPCODES.PWR) {
//                 current_state = states.pwr
//             }
//             else if(token.match("[0-9]")){
//                 console.log(token);
//             }

//             if (token == OPCODES.EVAL) {
//                 current_state = states.eval

//                 if (states.skip == 0 ) {
//                     const var_data = {
//                         coef: token,
//                         exponent:{
//                             value:'1',
//                             sign: OPCODES.ADD
//                         },
//                         sign: array[index-1] != OPCODES.SUB ? OPCODES.ADD : OPCODES.SUB
//                     }
                    
//                     data.coef.push(var_data);
//                 }else{
//                     states.skip--
//                 }

//                 // states.eval++
//             }
//         },
//         variable:(token,index)=>{
//             if (token.match('[0-9]') && !opcodeVals.includes(token)) {
//                 current_state = states.numeric
//             }

//            else if (token == OPCODES.ADD || token == OPCODES.SUB) {
//                 current_state = states.add_sub
//             }

//             else if (token == OPCODES.MUL || token == OPCODES.DIV) {
//                 current_state = states.mul_div
//             }

//             else if (token == OPCODES.PWR) {
//                 current_state = states.pwr
//             }

//             if (token == OPCODES.EVAL) {
//                 current_state = states.eval

//                 if (states.skip == 0 ) {
//                     const var_data = {
//                         coef: token,
//                         exponent:{
//                             value:'1',
//                             sign: OPCODES.ADD
//                         },
//                         sign: array[index-1] != OPCODES.SUB ? OPCODES.ADD : OPCODES.SUB
//                     }
                    
//                     data.coef.push(var_data);
//                 }else{
//                     states.skip--
//                 }

//                 // states.eval++
//             }

//         },
//         add_sub:(token,index)=>{
//             if (!token.match('[0-9]') && !opcodeVals.includes(token)) {
//                 current_state = states.variable

//                 if (states.skip == 0 ) {
//                     const var_data = {
//                         coef: token,
//                         exponent:{
//                             value:'1',
//                             sign: OPCODES.ADD
//                         },
//                         sign: array[index-1] != OPCODES.SUB ? OPCODES.ADD : OPCODES.SUB
//                     }
                    
//                     data.coef.push(var_data);
//                 }else{
//                     states.skip--
//                 }
                
//             }

//             if (token.match('[0-9]') && !opcodeVals.includes(token)) {
//                 current_state = states.numeric

                
//                 if (states.skip == 0 ) {
//                     const var_data = {
//                         coef: token,
//                         exponent:{
//                             value:'1',
//                             sign: OPCODES.ADD
//                         },
//                         sign: array[index-1] != OPCODES.SUB ? OPCODES.ADD : OPCODES.SUB
//                     }
                    
//                     data.coef.push(var_data);
//                 }else{
//                     states.skip--
//                 }
//             }

//             if (token == OPCODES.MUL || token == OPCODES.DIV) {
//                 current_state = states.mul_div
//             }

//             if (token == OPCODES.PWR) {
//                 current_state = states.pwr
//             }

//             if (token == OPCODES.EVAL) {
//                 current_state = states.eval

//                 if (states.skip == 0 ) {
//                     const var_data = {
//                         coef: token,
//                         exponent:{
//                             value:'1',
//                             sign: OPCODES.ADD
//                         },
//                         sign: array[index-1] != OPCODES.SUB ? OPCODES.ADD : OPCODES.SUB
//                     }
                    
//                     data.coef.push(var_data);
//                 }else{
//                     states.skip--
//                 }

//                 // states.eval++
//             }
            
//         },
//         mul_div:(token,index)=>{
//             if (!token.match('[0-9]') && !opcodeVals.includes(token)) {
//                 current_state = states.variable

//                 const var_data = {
//                     coef: token,
//                     exponent:{
//                         value:'1',
//                         sign: OPCODES.ADD
//                     },
//                     sign: array[index-1] != OPCODES.SUB ? OPCODES.ADD : OPCODES.SUB
//                 }

//                 data.coef.push(var_data);
//             }

//             if (token.match('[0-9]') && !opcodeVals.includes(token)) {
//                 current_state = states.numeric

//                 const var_data = {
//                     coef: token,
//                     exponent:{
//                         value:'1',
//                         sign: OPCODES.ADD
//                     },
//                     sign: array[index-1] != OPCODES.SUB ? OPCODES.ADD : OPCODES.SUB
//                 }

//                 data.coef.push(var_data);
//             }

//             if (token == OPCODES.ADD || token == OPCODES.SUB) {
//                 current_state = states.add_sub
//             }
//             if (token == OPCODES.PWR) {
//                 current_state = states.pwr
//             }
//         },
//         pwr:(token,index)=>{
            
//             if (!token.match('[0-9]') && !opcodeVals.includes(token)) {
//                 current_state = states.variable
//                 // if (states.skip > 0) states.skip--

//                 for (let i = 0; i < data.coef.length; i++) {
//                     const el = data.coef[i];
                    
//                     if (el.coef == array[index-1]) {
//                         el.exponent.value = array[index+1]
//                         break;
//                     }
//                 }
//             }

//             if (token.match('[0-9]') && !opcodeVals.includes(token)) {
//                 current_state = states.numeric
//                 if (states.eval_skip > 0) {
//                     for (let i = 0; i < data.coef.length; i++) {
//                         const el = data.coef[i];
                        
//                         if (el.coef == array[index-3]) {
//                             console.log(array[index]);
//                             el.exponent.value = array[index]
//                             break;
//                         }
//                     }
//                     states.eval_skip--

//                 }else{
//                     for (let i = 0; i < data.coef.length; i++) {
//                         const el = data.coef[i];
                        
                        
//                         if (el.coef == array[index-2]) {
//                             el.exponent.value = array[index]
//                             break;
//                         }
//                     }
//                 }
                
//             }

//             if (token == OPCODES.ADD || token == OPCODES.SUB) {
                
//                 if (states.eval_skip > 0) {
//                     for (let i = 0; i < data.coef.length; i++) {
//                         const el = data.coef[i];
                        
//                         if (el.coef == array[index-3]) {
//                             el.exponent.value = array[index+1]
//                             el.exponent.sign = token
//                             break;
//                         }
//                     }
//                     states.eval_skip--
//                 }else{
//                     current_state = states.add_sub
//                     states.skip++
//                     for (let i = 0; i < data.coef.length; i++) {
//                         const el = data.coef[i];
                        
//                         if (el.coef == array[index-2]) {
//                             el.exponent.value = array[index+1]
//                             el.exponent.sign = token
//                             break;
//                         }
//                     }
//                 }
//             }

//             // if (token == OPCODES.MUL || token == OPCODES.DIV) {
//             //     current_state = states.mul_div
//             // }
//         },

//         eval:(token,index)=>{
//             // if(token == OPCODES.ADD || token == OPCODES.SUB){
//             //     current_state = states.add_sub
//             // }

//             if(token == OPCODES.MUL || token == OPCODES.DIV){
//                 current_state = states.mul_div
//             }

//             if (token == OPCODES.PWR) {
//                 current_state = states.pwr
//                 states.eval_skip++
//             }
//         }
//     }

//     current_state = states.numeric


//     console.log(array);
//     for (let i = 0; i < array.length; i++) {
//         const token = array[i];
        
//         current_state(token,i)
//     }

//     console.log(data);

// }

const dict_traverser = (dict={},key) =>{

    
    let recursable = 1
    let view = null
    while(recursable){

        if (!view) {
            if (dict[key]) {
                if (Object.keys(dict[key]).length > 0) {
                    recursable++
                    view = dict[key]
                }
            }else{
                return dict
            }
        }else{
            if (view[key]) {
                if (Object.keys(view[key]).length > 0) {
                    recursable++
                    view = view[key]
                }else{
                    return view
                }
            }else{
                return view
            }
        }
        recursable--
    }

    return
}

const scanner = (array = []) =>{

    const res = []
    const pairs = []

    for (let i = 0; i < array.length; i++) {
        const token = array[i];
        
        if (token == OPCODES.MUL || token == OPCODES.DIV) {
            pairs.push(i)
        }
    }

    
    const s_array =  split_array(array,pairs);

    for (let i = 0; i < s_array.length; i++) {
        const pwr_pairs = []
        const arr = s_array[i];
        
        for (let j = 0; j < arr.length; j++) {
            const token = arr[j];
            if (token == OPCODES.PWR) {
                pwr_pairs.push(j)
            }
        }

        const s_pwr_split = split_array(arr,pwr_pairs)

        let data = {
            variable:null,
            exponent:null,
            sign: OPCODES.ADD,
            value:null,
        }

        let view;

        for (let j = 0; j < s_pwr_split.length; j++) {
            const s_pwr = s_pwr_split[j];
            
            if (j == 0) {
                const val = s_pwr.find(x => {
                    if (x == OPCODES.EVAL) {
                        return x
                    }

                    if (!opcodeVals.includes(x)) {
                        return x
                    }
                })

                const idx = s_pwr.indexOf(val)
                const sign = s_pwr[idx-1] ?? OPCODES.ADD
                const value = val == OPCODES.EVAL ? s_pwr[idx+1] : null

                
                data.variable = val
                data.sign = sign,
                data.value = value

                data.exponent = {}
                view = data

            }else{
                const val = s_pwr.find(x => {
                    if (x == OPCODES.EVAL) {
                        return x
                    }

                    if (!opcodeVals.includes(x)) {
                        return x
                    }
                })

                const idx = s_pwr.indexOf(val)
                const sign = s_pwr[idx-1] ?? OPCODES.ADD
                const value = val == OPCODES.EVAL ? s_pwr[idx+1] : null
                
                view.exponent = {
                    variable:val,
                    exponent:null,
                    sign: sign,
                    value:value,
                }

                view = view.exponent 
            }
        }
        
        res.push(data);
    }

    return res
}

const pairer = (arr1,arr2) =>{
    if (!arr1 || !arr2) {
        return;
    }

    let pairer_arr = []
    let res = []

    let current_state;

    const states = {
        skip:0,
        eval:0,
        pos_arr:[],
        numeric:(token,index)=>{
            
            if (token == OPCODES.ADD || token == OPCODES.SUB) {
                current_state = states.oprand1
            }


            if (token != OPCODES.ADD && token != OPCODES.SUB && opcodeVals.includes(token)) {
                current_state = states.oprand2
            }
        },
        oprand1:(token,index)=>{
            
            if (!opcodeVals.includes(token)) {
                current_state = states.numeric

                if (states.skip == 0) {
                    if (index-1 != 0) {

                        if (states.eval > 0) {
                            states.pos_arr.push(index-2)
                            states.eval--
                        }else{
                            states.pos_arr.push(index-1)
                        }

                    }
                }else{
                    states.skip--
                    states.eval--
                }
            }

            if (token != OPCODES.ADD && token != OPCODES.SUB && token != OPCODES.EVAL && opcodeVals.includes(token)) {
                current_state = states.oprand2
            }

            if (token == OPCODES.EVAL) {
                states.eval++
            }
        },
        oprand2:(token,index)=>{
            
            if (!opcodeVals.includes(token)) {
                current_state = states.numeric
            }else{

                if (token == OPCODES.ADD || token == OPCODES.SUB) {
                    states.skip++

                    current_state = states.oprand1
                }
            }

        }
    }

    current_state = states.numeric

    for (let i = 0; i < arr1.length; i++) {
        const token = arr1[i];
        
        current_state(token,i)

        states.pos_arr.forEach(x=>{
            pairer_arr.push(x)
        })
    }


    let f_pair_idx = sorter(pairer_arr,false,true)
    let arr1_pairs = split_array(arr1,f_pair_idx)

    for (let i = 0; i < arr1.length; i++) {
        const token_1 = arr1[i];
        
        states.skip = 0
        states.pos_arr = []
        
        if (!opcodeVals.includes(token_1)) {
            for (let j = 0; j < arr2.length; j++) {
                const token_2 = arr2[j];
                current_state(token_2,j)
            }
        }

        states.pos_arr.forEach(x=>{
            res.push(x)
        })
        
    }
    
    let l_pair_idx = sorter(res,false,true)

    let arr2_pairs = split_array(arr2,l_pair_idx)


    const res_1 = []
    arr1_pairs.forEach(x=>{
        res_1.push(scanner(x)[0])
    })

    console.log(res_1);

    console.log("Scanner 2");

    const res_2 = []
    arr2_pairs.forEach(x=>{
        res_2.push(scanner(x)[0])
    })

    console.log(res_2);
}

pairer(arr3,arr2)