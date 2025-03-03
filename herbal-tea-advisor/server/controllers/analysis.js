import OpenAI from 'openai';
import { config } from '../config/index.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openAiApiKey
});

/**
 * Controller for analyzing user input and generating tea recommendations
 */
export const analyzeTeaRecommendation = async (req, res, next) => {
  try {
    const { userFeeling, tongueImage } = req.body;

    // Input validation
    if (!userFeeling || !tongueImage) {
      return res.status(400).json({
        message: 'Missing required information (userFeeling or tongueImage)'
      });
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "chatgpt-4o-latest", 
      messages: [
        {
          role: "system",
          content: "You are a chinese classical medicine doctor (中医）, who works at an herbal tea shop. When a customer comes in, they will present details about how they are feeling and a picture of their tongue.\n\nYour job will be to recommend one or more chinese herbal medicines to made into an herbal tea drink for the customer given their conditions! You can also help the customer understand why they are being recommended each product in good detail! Give the entire response in chinese, including the names of the herbs. Recommend them in \"君臣佐世\" style.\n\nMake sure you properly analyze the picture of the tongue! No need to mention tea, these ingredients will be made into tea anyways! Write a nice long description of each ingredient you recommend, detailing why this specific ingredient will be beneficial to the customer. Make sure to never address the customer as '患者', refer to them as '用户'. \n\nReturn your response as a JSON object with the following structure and NO OTHER TEXT:\n{\n  \"patientOverview\": {\n    \"primaryConcerns\": \"Description of main health concerns based on symptoms and tongue\",\n    \"tongueAnalysis\": \"Detailed analysis of tongue characteristics\",\n    \"recommendationBasis\": \"Explanation of overall treatment strategy\"\n  },\n  \"herbalFormula\": {\n    \"emperor\": {\n      \"herb\": \"Name of the emperor herb\",\n      \"traditional_name\": \"Chinese name (in chinese)\",\n      \"role\": \"Detailed explanation of why this herb is chosen as the emperor\",\n      \"specific_benefits\": \"How this addresses the patient's main concern\"\n    },\n    \"minister\": {\n      \"herb\": \"Name of the minister herb\",\n      \"traditional_name\": \"Chinese name (in chinese)\",\n      \"role\": \"Detailed explanation of why this herb is chosen as the minister\",\n      \"specific_benefits\": \"How this supports the emperor herb and addresses secondary concerns\"\n    },\n    \"assistant\": {\n      \"herb\": \"Name of the assistant herb\",\n      \"traditional_name\": \"Chinese name(in chinese)\",\n      \"role\": \"Detailed explanation of why this herb is chosen as the assistant\",\n      \"specific_benefits\": \"How this moderates or supports the formula\"\n    },\n    \"courier\": {\n      \"herb\": \"Name of the courier herb\",\n      \"traditional_name\": \"Chinese name(in chinese)\",\n      \"role\": \"Detailed explanation of why this herb is chosen as the courier\",\n      \"specific_benefits\": \"How this helps deliver or harmonize the formula\"\n    }\n  }\n}"
        },
        {
          role: "user",
          content: [
            { type: "text", text: userFeeling },
            { type: "image_url", image_url: { url: tongueImage } }
          ]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 1,
      max_tokens: 7070,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    // Extract the generated analysis
    const analysis = JSON.parse(response.choices[0].message.content);
    
    // Return the analysis to the client
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Pass error to the error handler middleware
    next(error);
  }
};