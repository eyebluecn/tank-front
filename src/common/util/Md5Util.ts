/**
 * MD5 utility for calculating chunk checksums.
 *
 * This module provides optional MD5 calculation for chunk integrity verification.
 * For full MD5 support, install spark-md5: npm install spark-md5 @types/spark-md5
 *
 * Without spark-md5 installed, this will return an empty string and skip MD5 verification.
 */

/**
 * Check if MD5 calculation is available (spark-md5 is installed)
 */
export async function isMd5Available(): Promise<boolean> {
  try {
    await import('spark-md5');
    return true;
  } catch {
    return false;
  }
}

/**
 * Calculate MD5 hash of a Blob (chunk).
 * This is fast since the chunk is already in memory.
 *
 * @param blob The blob/chunk to calculate MD5 for
 * @returns Promise<string> MD5 hash as hex string, or empty string if spark-md5 is not available
 */
export async function calculateChunkMd5(blob: Blob): Promise<string> {
  try {
    // @ts-ignore - dynamic import may not have types
    const SparkMD5 = (await import('spark-md5')).default;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const spark = new SparkMD5.ArrayBuffer();
          spark.append(e.target.result as ArrayBuffer);
          resolve(spark.end());
        } else {
          resolve('');
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read chunk for MD5 calculation'));
      };

      reader.readAsArrayBuffer(blob);
    });
  } catch (e) {
    // spark-md5 is not installed, return empty string
    return '';
  }
}
