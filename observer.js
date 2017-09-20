class ObserverManager
{
    constructor()
    {
        this.subscribers = {};
    }

    static get instance() {
        if(!this._instance)
            this._instance = new ObserverManager();

        return this._instance
    }

    subscribe(eventName, observer)
    {

        if (this.subscribers[eventName] === undefined) {
            this.subscribers[eventName] = [];
        }
        this.subscribers[eventName].push(observer);
    }

    dispatch(eventName, subject)
    {
        if (this.subscribers[eventName] === undefined) {
            return false;
        }
        for (let o of this.subscribers[eventName]) {
            o.execute(subject);
        }
    }
}