const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/**
 * Gera uma URL pré-assinada para upload de arquivo no S3.
 * @param {string} key - Nome do arquivo (chave) no bucket.
 * @param {string} contentType - Tipo do conteúdo (ex: image/jpeg).
 * @returns {Promise<string>} URL pré-assinada.
 */
function generatePresignedUrl(key, contentType) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME_URL_ASSINADA,
    Key: key,
    Expires: 60 * 5, // 5 minutos
    ContentType: contentType,
  };
  return s3.getSignedUrlPromise('putObject', params);
}

module.exports = { generatePresignedUrl };