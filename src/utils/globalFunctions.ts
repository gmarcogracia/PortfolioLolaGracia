export function getEnv(name: string | undefined): string {


if (typeof name ==='undefined'  || typeof process.env[name] === 'undefined') {
var value = name? process.env : " No definida"
 throw new Error(name +" IS UNDEFINED"  +value );
}

return process.env[name]
}
export function envToNumber(envVariable: string | undefined):number {
console.log(" EEEEEEEEEEEE " + envVariable)
    if (typeof envVariable === "undefined"){
        throw new Error("EL valor se muestra como undefined");
    }
    return parseInt(envVariable);
}


