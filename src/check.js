
// 自定义表单校验规则

// 这个是校验email的
export const checkemail = (rule, value, callback) => {
    const regemil =  /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    if(regemil.test(value)){
        return callback()
    }
    callback(new Error("请输入合法的邮箱"))
}

// 这个是校验mobile的
export const checkmobile = (rule, value, callback) => {
    const regmobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    if(regmobile.test(value)){
        return callback()
    }
    callback(new Error("请输入正确的手机号"))
}