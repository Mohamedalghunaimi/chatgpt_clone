const axios = require("axios");

require("dotenv").config()
const generateImage = async (prompt) => {
  try {
  const form = new FormData();

  form.append("prompt", prompt);
  form.append("output_format", "png");

  const response = await axios.post(
    "https://api.stability.ai/v2beta/stable-image/generate/core",
    form,
    {
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
    }
  );

  return response.data;
  } catch (error) {
    throw new Error(error)
    
  }

};


module.exports = {
generateImage
}