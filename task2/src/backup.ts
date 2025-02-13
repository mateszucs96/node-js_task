/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util';

const promisifiedExec = promisify(exec); // async version of exec function, should be used to run tar command
const logFilePath: string = 'backup_log.txt'; // the log file where backup hashes are stored, do not change

/**
 * Calculates a SHA-256 checksum for a given string.
 *
 * @param {string} str - The input string from which to generate the checksum (UTF8 encoding).
 * @returns {Promise<string>} A promise that resolves with the calculated checksum (HEX string).
 */
export const calculateDirectoryChecksum = async (str: string): Promise<string> =>
  // eslint-disable-next-line implicit-arrow-linebreak
  crypto.createHash('sha256').update(str, 'utf8').digest('hex');

/**
 * Retrieves the most recent backup hash from a log file.
 *
 * @param {string} logPath - Path to the log file containing backup hashes.
 * @returns {Promise<string | null>} A promise that resolves with the last backup hash found,
 *                                   or null if no hash is found or if an error occurs.
 */

export const getLastBackupHash = async (logPath: string): Promise<string | null> => {
  try {
    const data = await fs.readFile(logPath, 'utf8');
    const lines = data
      .trim()
      .split('\n')
      .filter((line) => line.includes('HASH:'));
    if (lines.length === 0) return null;

    const lastLine = lines[lines.length - 1];
    const match = lastLine.match(/HASH: ([a-f0-9]+)/i);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
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
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  try {
    const backupFileName = `backup-${timestamp}.tar.gz`;
    const backupFilePath = path.posix.join(destinationDir, backupFileName);
    const files = await fs.readdir(sourceDir);
    const checksum = await calculateDirectoryChecksum(files.join(','));

    await promisifiedExec(`tar -czf "${backupFilePath}" -C "${sourceDir}" .`);

    const logEntry = `${new Date().toISOString()}: SUCCESS: Backup created at ${backupFilePath}, HASH: ${checksum}\n`;
    await fs.appendFile(logFilePath, logEntry);
  } catch (error) {
    const logEntry = `${timestamp}: FAILED: tar command failed\n`;
    await fs.appendFile(logFilePath, logEntry);
    console.error(error);
    throw new Error('Failed to create backup, error = tar command failed');
  }
};

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
  try {
    const files = await fs.readdir(sourceDir);
    console.log('run:, ', files);
    const currentChecksum = await calculateDirectoryChecksum(files.join(','));

    const lastBackupHash = await getLastBackupHash(logFilePath);

    if (currentChecksum === lastBackupHash) {
      console.log('No changes detected since last backup');
      return;
    }
    await fs.mkdir(destinationDir, { recursive: true });
    await createArchive(sourceDir, destinationDir);
  } catch (error) {
    console.error('Backup process failed:', error);
    process.stderr.write((error as Error).message);
  }
};
