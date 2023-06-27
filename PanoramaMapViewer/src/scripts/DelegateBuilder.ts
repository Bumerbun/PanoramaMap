export interface IDelegate {
    (sender: any, parameters: any): void;
}

export class DelegateBuilder {
    private callers: IDelegate[];

    constructor() {
        this.callers = [];
    }
    
    invoke(sender: any, parameters: any) {
        for (var i = 0; i < this.callers.length; i++) {
            var caller = this.callers[i];
            if (caller)
                caller(sender, parameters);
        }
    }

    contains(callee: IDelegate) : Boolean {
        if (!callee)
            return false;

        return this.callers.indexOf(callee) >= 0;
    }

    add(callee: IDelegate): DelegateBuilder {
        if (!callee)
            return this;

        if (!this.contains(callee))
            this.callers.push(callee);

        return this;
    }
}