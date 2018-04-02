const normalizePhone = code => (value, previousValue) => {
    let cCode = (code.split('#', 2)[0]).trim(); // получаем код страны
    if (!value) {
        return (cCode + '(')
    }
    let mLen = code.split("#").length - 1; // получаем длину кода мобильного оператора
    let cLen = (cCode.length + 1); // получаем длину кода страны + "("
    if (cLen > value.length)
    {
        return (cCode + '(');
    }
    if(value.substring(0, cLen) === (cCode + '(')) {
        if(value.length === cLen){
            return value;
        }else {
            value = value.substring(cLen)
        }
    }
    const onlyNums = value.replace(/[^\d]/g, '');
    if (!previousValue || value.length > previousValue.length) {
        // typing forward
        if (onlyNums.length === mLen) {
            return onlyNums + '-'
        }
        if (onlyNums.length === (mLen + 3)) {
            return onlyNums.slice(0, mLen) + '-' + onlyNums.slice(3) + '-'
        }
    }
    if (onlyNums.length <= mLen) {
        return cCode + '(' + onlyNums.slice(0, mLen)
    }
    if (onlyNums.length <= (mLen + 3)) {
        return cCode + '(' + onlyNums.slice(0, mLen) + ')' + onlyNums.slice(mLen, (mLen + 3))
    }
    if (onlyNums.length <= (mLen + 5)) {
        return cCode + '(' + onlyNums.slice(0, mLen) + ')' + onlyNums.slice(mLen, (mLen + 3)) + '-' + onlyNums.slice((mLen + 3), (mLen + 5))
    }
    return cCode + '(' + onlyNums.slice(0, mLen) + ')' + onlyNums.slice(mLen, (mLen + 3)) + '-' + onlyNums.slice((mLen + 3), (mLen + 5)) + '-' +  onlyNums.slice((mLen + 5), (mLen + 7))
}

export default normalizePhone