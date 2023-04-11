to correct dts generation add the following

    abort(reason?: any): AbortSignal;
    timeout(milliseconds: number): AbortSignal;
	
to the 

`declare var AbortSignal` of @types/node