const uploadFile = async (fileUri) => {
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Extract file name from URI (if needed)
      const fileName = fileUri.split('/').pop();
      
      // Prepare file object for upload
      const file = {
        uri: fileUri, // The file URI from device
        name: fileName || 'uploaded_file.pdf', // Fallback name if extraction fails
        type: 'application/pdf', // Adjust MIME type based on your file type
      };
      
      // Append file to FormData
      formData.append('file', file);
  
      // Make API request
      const response = await fetch('https://quickchat-backend-on0b.onrender.com/api/v1/media/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Parse response
      const result = await response.json();
      
      // Check if response is successful
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
  
      // Return the URL from response (adjust based on your API response structure)
      return result.data || result.data?.fileUrl;
  
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };
  export{uploadFile}