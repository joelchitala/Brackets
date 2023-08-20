
const arr1 = ['n','MUL', 'SUB','x', 'PWR', 'SUB','2','MUL', 'a','MUL', 'SUB', 'EVAL','1','SUB','1','ADD','7']
const arr2 = ['SUB','n','ADD','5']
const arr3 = ['SUB','n','ADD','9']
// const arr3 = ['EVAL','1','PWR','SUB','2','PWR','SUB','3','SUB','5']
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
            multi:null,
            differed:null
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

                if (idx-2 >= 0) {
                    data.multi = s_pwr[idx-2];
                }
                
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
                    multi: null,
                    differed:null
                }

                if (idx-2 >= 0) {

                    if (s_pwr[idx-2] == OPCODES.MUL || s_pwr[idx-2] == OPCODES.DIV ) {
                        view.exponent.multi = s_pwr[idx-2] ;
                        
                    }
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
        res_1.push(scanner(x))
    })


    // console.log("Scanner 2");
    
    const res_2 = []
    arr2_pairs.forEach(x=>{
        res_2.push(scanner(x))
    })

    let groups = []

    for (let i = 0; i < res_2.length; i++) {
        const r_2 = res_2[i];
        const group = []
        for (let j = 0; j < res_1.length; j++) {
            const r_1 = res_1[j];
            group.push(r_1)
            group.push(r_2)
            group.push(OPCODES.ADD)
        }
        groups.push(group)
    }

    
    groups = groups.map(x => {
        x.pop()
        return x
    })
    

    
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        
        const group_pairs = []
        for (let j = 0; j < group.length; j++) {
            const g = group[j];
            if (g == OPCODES.ADD) {
                group_pairs.push(j)
            }
            
        }

        console.log(split_array(group,group_pairs));
    }


}

pairer(arr3,arr2)