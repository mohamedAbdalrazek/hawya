// export const toCamelCase = (rows) => {
//     const parsedRows = rows.map((row) => {
//         const replaced = {};
//         for (let key in row) {
//             const camelCaseKey = key.replace(/([-_][a-z])/gi, ($1) =>
//                 $1.toUpperCase().replace("_", "")
//             );
//             replaced[camelCaseKey] = row[key];
//         }
//         return replaced;
//     });
//     return parsedRows;
// };
