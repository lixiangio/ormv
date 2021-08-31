/**
 * Promise惰性代理
 * 仅在主动调用then、catch时输出原Promise
 */
class ProxyPromise {
    constructor(promise) {
        this.promise = promise;
    }
    then(resolve, reject = (value => value)) {
        return this.promise(resolve, reject);
    }
    catch(reject) {
        return this.promise(value => value, reject);
    }
}
export default ProxyPromise;
