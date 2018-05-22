class Stack extends Array
{
    constructor(...args)
    {
        super(...args);
    };

    top()
    {
        return this[this.length - 1];
    };

    push(...T)
    {
        super.push(...T);
        return this.top();
    };

    pop()
    {
        super.pop();
        return this.top();
    };

    empty()
    {
        return this.length === 0;
    };

    clear()
    {
        this.length = 0;
    };
};
