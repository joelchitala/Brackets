
const arr1 = ['SUB','n','MUL', 'x','SUB','1','ADD','7']
const arr2 = ['SUB','n','SUB','2','ADD','5']

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

    const res = []

    for (let i = 0; i < indexes.length+1; i++) {
        let temp = []

        for (let j = 0; j < array.length; j++) {
            const el = array[j];

            let start;
            let end;
    
            if (i == indexes.length) {
                start = indexes[i-1]
    
                if (j > start && j < array.length) {
                    temp.push(el)
                }
            }else{
                if (i > 0) {
                    start = indexes[i-1]
                    end = indexes[i]
                    if (j > start && j <= end) {
                        temp.push(el)
                    }
                }else{
                    end = indexes[i]
                    if (j >= 0 && j <= end) {
                        temp.push(el)
                    }
                }
            }
            
        }
        res.push(temp)
    }

    return res
}

split_array([0,1,2,3,4,5,6,7,8,9],[4])

const pairer = (arr1,arr2) =>{
    if (!arr1 || !arr2) {
        return;
    }

    let pairer_arr = []
    let res = []

    let current_state;

    const states = {
        skip:0,
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
                        states.pos_arr.push(index-1)
                    }
                }else{
                    states.skip--
                }
            }

            if (token != OPCODES.ADD && token != OPCODES.SUB && opcodeVals.includes(token)) {
                current_state = states.oprand2
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
    const arr1_pairs = split_array(arr1,f_pair_idx)

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

    const arr2_pairs = split_array(arr2,l_pair_idx)
    console.log(arr1_pairs);
    console.log(arr2_pairs);

}

pairer(arr1,arr2)