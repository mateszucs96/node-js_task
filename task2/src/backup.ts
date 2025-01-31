/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util';
import { appendFile } from 'fs';

const promisifiedExec = promisify(exec); // async version of exec function, should be used to run tar command
const logFilePath: string = 'backup_log.txt'; // the log file where backup hashes are stored, do not change

/**
 * Calculates a SHA-256 checksum for a given string.
 *
 * @param {string} str - The input string from which to generate the checksum (UTF8 encoding).
 * @returns {Promise<string>} A promise that resolves with the calculated checksum (HEX string).
 */
export const calculateDirectoryChecksum = async (str: string): Promise<string> => {
  const items = await fs.readdir(str);
  const filteredItems = await Promise.all(
    items.map(async (item) => {
      const itemPath = path.join(str, item);
      try {
        const stats = await fs.stat(itemPath);
        return stats.isFile() || stats.isDirectory() ? item : null;
      } catch (err) {
        console.warn(`Warning: Could not access ${itemPath} - ${err}`);
        return null;
      }
    }),
  );

  const sortedItems = filteredItems.filter(Boolean).sort();

  return crypto.createHash('sha256').update(sortedItems.join(',')).digest('hex');
};
// eslint-disable-next-line implicit-arrow-linebreak

/**
 * Retrieves the most recent backup hash from a log file.
 *
 * @param {string} logPath - Path to the log file containing backup hashes.
 * @returns {Promise<string | null>} A promise that resolves with the last backup hash found,
 *                                   or null if no hash is found or if an error occurs.
 */

export const getLastBackupHash = async (logPath: string): Promise<string | null> => {
  try {
    const data = await fs.readFile(logPath, 'utf-8');
    const lines = data.trim().split('\n');
    return lines.length > 0 ? lines[lines.length - 1].split('HASH: ')[1] || null : null;
  } catch (error) {
    return null; // Return null if file doesn't exist or another error occurs
  }
  // - Reads the entire log file (logFilePath variable) using `fs.readFile()`.
  // - Extracts the last hash created. If there is no hash, it returns null.
  // - If there is an error reading file, it returns null as well.
};

/**
 * Creates an archive from a specified source directory and stores it in a destination directory.
 * Logs the result to a predetermined log file.
 *
 * @param {string} sourceDir - The directory to archive.
 * @param {string} destinationDir - The directory where the archive is to be stored.
 * @throws {Error} Throws an error if the archive creation fails.
 * @returns {Promise<void>} A promise that resolves when the archive has been successfully created.
 */
export const createArchive = async (sourceDir: string, destinationDir: string): Promise<void> => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:]/g, '-')
    .replace(/\..*Z$/, '-000Z');

  try {
    const backupFilePath = path.posix.join(destinationDir, `backup-${timestamp}.tar.gz`);

    // **2. Backup Execution**
    const command = `tar -czf "${backupFilePath}" -C "${sourceDir}" .`;
    // Execute tar command
    const { stdout, stderr } = await promisifiedExec(command);

    // Check if stderr contains errors
    if (stderr) {
      console.error(`Backup failed with stderr: ${stderr}`);
      const errorMessage = `${new Date().toISOString()}: FAILED: tar command failed, STDERR: ${stderr}\n`;
      await fs.appendFile(logFilePath, errorMessage);
      return; // Exit early due to tar failure
    }

    console.log(`Backup created successfully: ${backupFilePath}`);
    console.log(stdout);

    // **3. Checksum and Logging**
    const currentHash = await calculateDirectoryChecksum(sourceDir);
    const logMessage = `${new Date().toISOString()}: SUCCESS: Backup created at ${backupFilePath}, HASH: ${currentHash}\n`;
    await fs.appendFile(logFilePath, logMessage);
  } catch (error) {
    // Handle exec errors

    await fs.appendFile(logFilePath, `${timestamp}: FAILED: tar command failed\n`);
    throw new Error(`Failed to create backup, error = ${(error as Error).message}`);
  }
};
// **3. Checksum and Logging**

//    - Reads the content of the source directory using `fs.readDir()` function (first level only, no nested subdirectories)
//    - Calculates a checksum of the source directory content using `calculateDirectoryChecksum()` function
//    - Appends the result of tar creation into the log file (using `fs.appendFile()` file):
//      - On success: `YYYY-MM-DDTHH-MM-SS-SSSZ: SUCCESS: Backup created at /output-path/backup-2020-01-01T00-00-00-000Z.tar.gz, HASH: {hash}\n`
//      - On error: - `YYYY-MM-DDTHH-MM-SS-SSSZ: FAILED: tar command failed\n`

/**
 * Executes the backup process by checking the checksum of the current directory against the last backup.
 * If the checksums differ, it proceeds to create a new archive; otherwise, it skips the backup process.
 *
 * @param {string} sourceDir - The source directory to check for changes.
 * @param {string} destinationDir - The destination directory for storing the backup archive.
 * @throws {Error} Throws an error if the directory creation or any part of the backup process fails.
 * @returns {Promise<void>} A promise that resolves when the backup process has completed,
 *                          either by creating a new backup or skipping the process.
 */
export const runBackup = async (sourceDir: string, destinationDir: string): Promise<void> => {
  // 1. **Directory Content Retrieval:**
  //     - Fetches the content of the source directory using `fs.readdir()` (list of files/folders, only at the top level, excluding subdirectories)
  //     - Calculates the checksum of the content by invoking `calculateDirectoryChecksum()` function
  // 2. **Checksum Verification:**
  //     - Retrieves the most recent backup checksum from a log file using `getLastBackupHash()`
  //     - Compares it with the newly calculated checksum from the source directory
  // 3. **Backup Decision:**
  //     - **No Change Detected:**
  //       - If checksums match (indicating no changes since the last backup), logs "No changes detected since last backup" to standard output.
  //       - Does not initiate a backup (`createArchive()` is not executed).
  //     - **Changes Detected:**
  //       - Ensures the destination directory exists by creating it if necessary with `fs.mkdir()`
  //       - Proceeds with the backup by running `createArchive()` function
  // 4. **Error Handling:**
  //     - Logs any errors encountered to the stderr.
};
