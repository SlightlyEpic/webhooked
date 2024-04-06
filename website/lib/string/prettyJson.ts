export function jsonToTruncString(data: { [key: string]: unknown }): string {
    let s = '{';
    let keys = Object.keys(data);
    let propWritten = 0;
    let comma = '';
    for(let i = 0; i < keys.length; i++) {
        if(s.length > 20) break;

        const key = keys[i];
        const type = typeof data[key];
        
        switch(type) {
        case 'number':
            propWritten++;
            s += comma;
            comma = ',';
            s += ` ${key}: ${data[key]}`;
            break;
        case 'string':
            propWritten++;
            s += comma;
            comma = ',';
            s += ` ${key}: "..."`;
            break;
        case 'boolean':
            propWritten++;
            s += comma;
            comma = ',';
            s += ` ${key}: ${data[key]}`;
            break;
        case 'object':
            propWritten++;
            s += comma;
            comma = ',';
            s += ` ${key}: { ... }`;
            break;
        }
    }

    if(propWritten !== keys.length) s += ', ...';
    s += ' }';

    return s;
}