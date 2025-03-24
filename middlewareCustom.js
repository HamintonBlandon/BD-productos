export const middlewareCustom = (request, response, next) => {
    console.log("Hola mundo desde middleware");
    next();
};
