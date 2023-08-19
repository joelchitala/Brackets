
const eq_1 = `(n+1/2)+7+(n+1/4)`
const eq_2 = `(n-1)(n-(n-3))`
const eq_3 = `n(n+2)`
const eq_4 = `32n^2 + 38`
const eq_5 = `(n-1)(n-2^(1)(2))`
const eq_6 = `(n-1)(n-2)`

const remWhiteSpaces = (string) =>{
    let str = ""

    if (!string || typeof(string) != "string") return;

    for (let i = 0; i < string.length; i++) {
        const token = string[i];
        
        if (token != " ") {
            str += token
        }
    }

    return str
}

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

const calculatePrecidence = (decomposed) =>{
    const array = [];
    let index = 0;
    for (const opcode of decomposed) {
        switch (opcode) {
            case OPCODES.EVAL:
                array.push({ index, group: 0, OPCODE: opcode });
                break;
            case OPCODES.BRKOP:
                array.push({ index, group: 1, OPCODE: opcode });
                break;
            case OPCODES.BRKCL:
                array.push({ index, group: 1, OPCODE: opcode });
                break;
            case OPCODES.PWR:
                array.push({ index, group: 2, OPCODE: opcode });
                break;
            case OPCODES.SIN:
                array.push({ index, group: 3, OPCODE: opcode });
                break;
            case OPCODES.COS:
                array.push({ index, group: 3, OPCODE: opcode });
                break;
            case OPCODES.TAN:
                array.push({ index, group: 3, OPCODE: opcode });
                break;
            case OPCODES.DIV:
                array.push({ index, group: 4, OPCODE: opcode });
                break;
            case OPCODES.MUL:
                array.push({ index, group: 4, OPCODE: opcode });
                break;
            case OPCODES.ADD:
                array.push({ index, group: 5, OPCODE: opcode });
                break;
            case OPCODES.SUB:
                array.push({ index, group: 5, OPCODE: opcode });
                break;
        }
        index += 1;
    }
    return array;
}

const getPrecidenceOpcode = (opcode) => {
    switch (opcode) {
        case OPCODES.EVAL:
            return { group: 0, OPCODE: opcode };
        case OPCODES.BRKOP:
            return { group: 1, OPCODE: opcode };
        case OPCODES.BRKCL:
            return { group: 1, OPCODE: opcode };
        case OPCODES.PWR:
            return { group: 2, OPCODE: opcode };
        case OPCODES.SIN:
            return { group: 3, OPCODE: opcode };
        case OPCODES.COS:
            return { group: 3, OPCODE: opcode };
        case OPCODES.TAN:
            return { group: 3, OPCODE: opcode };
        case OPCODES.DIV:
            return { group: 4, OPCODE: opcode };
        case OPCODES.MUL:
            return { group: 4, OPCODE: opcode };
        case OPCODES.ADD:
            return { group: 5, OPCODE: opcode };
        case OPCODES.SUB:
            return { group: 5, OPCODE: opcode };
        default:
            return null;
    }
}

const getLastElement = (array = []) =>{
    if (array.length == 0) {
        return;
    }
    return array[array.length-1]
}

const getOpcodesValues = () =>{
    return Object.values(OPCODES)
}

const parser = (equation) =>{
    const OPERANDS = ["(",")","^","*","/","+","-"]
    const opcodeVals = getOpcodesValues()
    equation = remWhiteSpaces(equation)
    let num_str = ""
    const parsed_array = []
    for (let i = 0; i < equation.length; i++) {
        const token = equation[i];
        switch (i) {
            case 0:
                if(token == "(") parsed_array.push(OPCODES.BRKOP)
                if(token == "+") parsed_array.push(OPCODES.ADD)
                if(token == "-") parsed_array.push(OPCODES.SUB)
                if (!OPERANDS.includes(token))parsed_array.push(OPCODES.ADD)
                break;
            default:
                if (OPERANDS.includes(token) && num_str != "") {
                    parsed_array.push(num_str)
                    num_str = ""
                }
                if (token == "(") {
                    if (!opcodeVals.includes(getLastElement(parsed_array))) {
                        parsed_array.push(OPCODES.MUL)
                    }
                    if (getLastElement(parsed_array) == OPCODES.BRKCL) {
                        parsed_array.push(OPCODES.MUL)
                    }
                    parsed_array.push(OPCODES.BRKOP)
                }
                if (token == ")") {
                    parsed_array.push(OPCODES.BRKCL)
                }
                if (token == "^") {
                    if (!opcodeVals.includes(getLastElement(parsed_array))) {
                        parsed_array.push(OPCODES.PWR)
                    }
                }
                if (token == "/") {
                    if (!opcodeVals.includes(getLastElement(parsed_array))) {
                        parsed_array.push(OPCODES.DIV)
                    }
                }
                if (token == "*") {
                    if (!opcodeVals.includes(getLastElement(parsed_array))) {
                        parsed_array.push(OPCODES.MUL)
                    }
                }
                if (token == "+") {
                    if (getLastElement(parsed_array) != OPCODES.SUB && getLastElement(parsed_array) != OPCODES.ADD) {
                        parsed_array.push(OPCODES.ADD)
                    }
                }
                if (token == "-") {
                    if (getLastElement(parsed_array) == OPCODES.SUB) {
                        parsed_array.pop()
                        parsed_array.push(OPCODES.ADD)
                    }
                    if(getLastElement(parsed_array) == OPCODES.ADD){
                        parsed_array.pop()
                        parsed_array.push(OPCODES.SUB)
                    }

                    if (getLastElement(parsed_array) != OPCODES.SUB && getLastElement(parsed_array) != OPCODES.ADD) {
                        parsed_array.push(OPCODES.SUB)
                    }
                }
                break;
        }
        if (!OPERANDS.includes(token)) {
            if (!token.match("[0-9]")) {
                if (num_str != "") {
                    parsed_array.push(num_str)
                    num_str = ""
                    parsed_array.push(OPCODES.MUL)
                }
                if(!opcodeVals.includes(getLastElement(parsed_array))){
                    parsed_array.push(OPCODES.MUL)
                }
                parsed_array.push(token)
            }else{
                num_str += token
            }
        }
    }
    if (num_str != "") {
        parsed_array.push(num_str)
        num_str = ""
    }
    return parsed_array
}

const decomposer = (equation) =>{
    const parsed = parser(equation)
    let heap = []
    heap.push(parsed)
    let stack = []
    let recurse = 1
    let idx = 1
    let pointer = 0
    while(recurse > 0){
        let temp_stack_1 = []
        let temp_stack_2 = []
        let temp_stack_3 = []

        let brackets = 0
        for (let i = 0; i < heap[pointer].length; i++) {
            const token = heap[pointer][i];
            if (token == OPCODES.BRKOP) {
                if (brackets == 0) {
                    brackets++
                    continue
                }
                brackets++
            }

            if (token == OPCODES.BRKCL) {
                brackets--
            }

            if (brackets > 0) {
                temp_stack_2.push(token);
            }else{
                if (token != OPCODES.BRKCL) {
                    temp_stack_1.push(token)
                }
            }
            if (brackets == 0) {
                if (temp_stack_2.length > 0) {
                    temp_stack_1.push(OPCODES.EVAL)
                    temp_stack_1.push(idx)
                    idx++

                    if (temp_stack_2.includes(OPCODES.BRKOP)) {
                        heap.push(temp_stack_2)
                        recurse++
                    }else{
                        temp_stack_3.push(temp_stack_2)
                    }
                }
                temp_stack_2 = []
            }
        }
        stack.push(temp_stack_1)
        temp_stack_3.forEach(x =>{
            stack.push(x)
        })
        pointer++
        recurse--
    }

    return stack
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

const execute = (num_1, opcode, num_2) =>{
    let result = 0;

    switch (opcode) {
        case OPCODES.PWR:
            if (num_1 >= 0) {
                result = Math.pow(num_1, num_2);
            }
            break;
        case OPCODES.SIN:
            result = num_1 * Math.sin(num_2);
            break;
        case OPCODES.COS:
            result = num_1 * Math.cos(num_2);
            break;
        case OPCODES.TAN:
            result = num_1 * Math.tan(num_2);
            break;
        case OPCODES.MUL:
            result = num_1 * num_2;
            break;
        case OPCODES.DIV:
            result = num_1 / num_2;
            break;
        case OPCODES.ADD:
            result = num_1 + num_2;
            break;
        case OPCODES.SUB:
            result = num_1 - num_2;
            break;
    }

    return result;
}

class Interpreter{
    constructor(){
        this.data = {
            stack:[]
        }
    }

    lookForward = (array,index,step=1) =>{
        if (index > array.length-1) {
            return;
        }
        return array[index+step]
    }

    lookBackward = (array,index,step=1) =>{
        if (index == 0) {
            return;
        }
        return array[index-step]
    }

    numerizer = (array,recurse = false) =>{
        let results;

        const stack = this.data.stack;
        console.log(array);
    
        const val = recurse ? array : array[0] 
        const groups = sorter(calculatePrecidence(val).map(x => x.group),true,true)
    
        while(groups.length > 0){
            const curr_group = groups.pop()
    
            for (let i = 0; i < val.length; i++) {
                const token = val[i];
                let pred = getPrecidenceOpcode(token)
    
                if (pred) {
                    pred = pred.group
                    if (curr_group == pred) {
                        const f_el = this.lookForward(val,i)

                        switch (token) {
                            case OPCODES.EVAL:
                                
                                let res = this.numerizer(stack[f_el],true)
                                
                                if (results) {
                                    console.log(res);
                                }
                                console.log(`Results ${results}`);
                                results = res
                                break;
                            default:
                                // console.log(token);

                                break;
                        }
                    }
                }
                
            }
    
    
        }
        return results
    } 
    pairer = (array) =>{

    }
    multiplexer = (equation) =>{
        let decomposed = decomposer(equation)
        this.data.stack = decomposed
        decomposed = this.numerizer(decomposed)
        // console.log(decomposed);

        this.pairer(decomposed)
        
    }
    
    
}

// new Interpreter().multiplexer(eq_6)