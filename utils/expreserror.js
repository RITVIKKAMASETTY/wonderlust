class expreserror extends Error {
    constructor(statusCode,message) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
export default  expreserror;