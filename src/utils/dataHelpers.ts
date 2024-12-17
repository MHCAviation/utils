import { fromEntries } from "../typing.js";

/**
 * usage:
 * rowsToObjects(
 *   ['id', 'color' , 'shape'   , 'size'  , 'to' ] as const,
 *   [  1n, 'red'   , 'circle'  , 'big'   , '0x0'],
 *   [  2n, 'green' , 'square'  , 'small' , '0x0'],
 *   [  3n, 'blue'  , 'triangle', 'small' , '0x0'],
 * )
 * output:
 * [
 *   {id: 1n, color: 'red', shape: 'circle', size: 'big', to: '0x0'},
 *   {id: 2n, color: 'green', shape: 'square', size: 'small', to: '0x0'},
 *   {id: 3n, color: 'blue', shape: 'triangle', size: 'small', to: '0x0'},
 * ]
 *
 * P.S. I tried real hard, but failed to get rid of "const" from usage and
 */
export function rowsToObjects<
    Tobj extends { [i in `${number}` & keyof TcolTuple as TcolTuple[i]]: TvalTuple[i] },
    const TcolTuple extends readonly PropertyKey[],
    const TvalTuple extends Record<keyof TcolTuple, unknown>
>(cols: TcolTuple, ...rows: TvalTuple[]): Tobj[] {
    return rows.map((vals: TvalTuple) => {
        const entries: [keyof Tobj, Tobj[keyof Tobj]][] = [];
        for (let i = 0; i < cols.length; ++i) {
            const col: keyof Tobj = cols[i];
            const val = vals[i] as Tobj[keyof Tobj];
            entries.push([col, val]);
        }
        const obj: Partial<Record<keyof Tobj, Tobj[keyof Tobj]>> = fromEntries(entries);
        return obj as Tobj;
    });
}
