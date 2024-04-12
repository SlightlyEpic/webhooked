export type MakeStringType<T extends object, K extends string> = {
    [P in keyof T]: P extends K
        ? T[P] extends Array<infer V>
            ? string[]
            : string
        : T[P]
}
