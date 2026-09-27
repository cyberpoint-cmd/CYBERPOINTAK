export const errorHandler = (err, req, res, next) => {
  console.error('[CYBERPOINTAK Server Error]:', err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  
  // Clean user-facing error message without internal file paths or stack traces
  const userMessage = err.message && !err.message.includes('C:\\') && !err.message.includes('/') 
    ? err.message 
    : "We couldn't process this file. Please try another PDF or check your file formatting.";

  res.status(statusCode).json({
    success: false,
    error: userMessage,
    code: err.code || 'PROCESSING_ERROR'
  });
};
