import axios from 'axios';
import { EventEmitter } from './task-1-event-emitter';
import { WithTime } from './task-2-with-time';
import { exportCsvToTxt } from './task-3-export-csv-to-txt';

export * from './task-1-event-emitter';
export * from './task-2-with-time';
export * from './task-3-export-csv-to-txt';

const emitter = new EventEmitter();

// Test addListener and emit
emitter.addListener('testEvent', (data: any) => console.log(data));
emitter.emit('testEvent', 'Hello, World!'); // Should log 'Hello, World!'

// Test listenerCount
console.log(emitter.listenerCount('testEvent')); // Should log 1

// Test rawListeners
console.log(emitter.rawListeners('testEvent')); // Should log [ [Function] ]

// Test removeListener
emitter.removeListener('testEvent', console.log);
console.log(emitter.listenerCount('testEvent')); // Should log 0

const fetchFromUrl = (url: string, cb: (error: Error | null, data?: any) => void) => {
  axios
    .get(url)
    .then((response) => {
      cb(null, response.data);
    })
    .catch((error) => {
      cb(error);
    });
};

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('data', (data) => console.log('Data:', data));
withTime.on('end', () => console.log('Done with execute'));
withTime.on('error', (error) => console.log('Error:', error));

withTime.execute(fetchFromUrl, 'https://jsonplaceholder.typicode.com/posts/1');

exportCsvToTxt('./src/assets/books.csv', './src/assets/output.txt')
  .then(() => console.log('CSV successfully converted to TXT!'))
  .catch((err) => console.error('Error:', err));
