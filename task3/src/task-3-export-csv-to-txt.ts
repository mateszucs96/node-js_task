/**
 * Exports a CSV file to a TXT file.
 * CSV format:
 *  Book;Author;Amount;Price
 *  The Compound Effect;Darren Hardy;5;9,48
 * TXT format: {"book":"The Compound Effect","author":"Darren Hardy","price":9.48}
 * @param {string} csvPath - The path to the source CSV file.
 * @param {string} txtPath - The path to the destination TXT file.
 * @returns {Promise<boolean>} - A promise that resolves to true when export is done.
 */
import * as fs from 'fs';
import csv from 'csvtojson';

export const exportCsvToTxt = (csvPath: string, txtPath: string): Promise<boolean> =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(csvPath);
    const writeStream = fs.createWriteStream(txtPath);

    writeStream.on('error', (err) => {
      reject(new Error(`Failed to write to file: ${err.message}`));
    });

    csv({ delimiter: ';' })
      .fromStream(readStream)
      .subscribe(
        (jsonObj) => {
          const transformedObj = {
            book: jsonObj.Book,
            author: jsonObj.Author,
            price: parseFloat(jsonObj.Price.replace(',', '.')),
          };

          writeStream.write(`${JSON.stringify(transformedObj)}\n`);
        },
        (err) => {
          reject(new Error(`Failed to parse CSV: ${err.message}`));
        },
        () => {
          writeStream.end();
          resolve(true);
        },
      );

    readStream.on('error', (err) => {
      reject(new Error(`Failed to read file: ${err.message}`));
    });
  });
