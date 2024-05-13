const testNullish = (param) => {
    if(param !== (null || undefined)){
        return 'not nullish'
    }
} 

const u = undefined;



testNullish(u);