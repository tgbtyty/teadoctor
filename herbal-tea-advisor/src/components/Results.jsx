// src/components/Results.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OpenAI from 'openai'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Container } from "./ui/container"

function Results() {
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const analyzeData = async () => {
      try {
        const userFeeling = localStorage.getItem('userFeeling')
        const tongueImage = localStorage.getItem('tongueImage')

        if (!userFeeling || !tongueImage) {
          throw new Error('Missing required information')
        }

        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        });

        const response = await openai.chat.completions.create({
          model: "chatgpt-4o-latest",
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: "you are a chinese classical medicine doctor (中医）, who works at an herbal tea shop. When a customer comes in, they will present details about how they are feeling and a picture of their tongue.\n\nYour job will be to recommend one or more chinese herbal medicines to made into an herbal tea drink for the customer given their conditions! You can also help the customer understand why they are being recommended each product in good detail! Give the entire response in chinese. Recommend them in \"君臣佐世\" style.\n\nMake sure you properly analyze the picture of the tongue! No need to mention tea, these ingredients will be made into tea anyways! Write a nice long description of each ingredient you recommend, detailing why this specific ingredient will be beneficial to the customer.\n\nReturn your response as a JSON object with the following structure and NO OTHER TEXT:\n                         {\n                           \"patientOverview\": {\n                             \"primaryConcerns\": \"Description of main health concerns based on symptoms and tongue\",\n                             \"tongueAnalysis\": \"Detailed analysis of tongue characteristics\",\n                             \"recommendationBasis\": \"Explanation of overall treatment strategy\"\n                           },\n                           \"herbalFormula\": {\n                             \"emperor\": {\n                               \"herb\": \"Name of the emperor herb\",\n                               \"traditional_name\": \"Chinese name\",\n                               \"role\": \"Detailed explanation of why this herb is chosen as the emperor\",\n                               \"specific_benefits\": \"How this addresses the patient's main concern\"\n                             },\n                             \"minister\": {\n                               \"herb\": \"Name of the minister herb\",\n                               \"traditional_name\": \"Chinese name\",\n                               \"role\": \"Detailed explanation of why this herb is chosen as the minister\",\n                               \"specific_benefits\": \"How this supports the emperor herb and addresses secondary concerns\"\n                             },\n                             \"assistant\": {\n                               \"herb\": \"Name of the assistant herb\",\n                               \"traditional_name\": \"Chinese name\",\n                               \"role\": \"Detailed explanation of why this herb is chosen as the assistant\",\n                               \"specific_benefits\": \"How this moderates or supports the formula\"\n                             },\n                             \"courier\": {\n                               \"herb\": \"Name of the courier herb\",\n                               \"traditional_name\": \"Chinese name\",\n                               \"role\": \"Detailed explanation of why this herb is chosen as the courier\",\n                               \"specific_benefits\": \"How this helps deliver or harmonize the formula\"\n                             }\n                           },\n                         }"
                }
              ]
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: userFeeling
                },
                {
                  type: "image_url",
                  image_url: {
                    url: tongueImage
                  }
                }
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

        const parsedAnalysis = JSON.parse(response.choices[0].message.content);
        setAnalysis(parsedAnalysis);
      } catch (err) {
        console.error('Analysis error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    analyzeData()
  }, [])

  if (loading) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-700 mx-auto mb-4"></div>
          <h2 className="text-xl text-emerald-800">正在分析...</h2>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">发生错误</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
            >
              重新开始
            </button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      {analysis && (
        <div className="space-y-12">
          {/* Main Analysis Section */}
          <Card className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-emerald-800">中药配方推荐</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-700">主要症状</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{analysis.patientOverview.primaryConcerns}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-700">舌诊分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{analysis.patientOverview.tongueAnalysis}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-700">治疗方案</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{analysis.patientOverview.recommendationBasis}</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Herbs Section */}
          <div>
            <h2 className="text-2xl font-bold text-center text-emerald-800 mb-8">处方组成</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emperor Herb */}
              <Card className="opacity-0 animate-popIn" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <CardHeader className="bg-red-50 border-b border-red-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-red-600">君</span>
                    </div>
                    <CardTitle>{analysis.herbalFormula.emperor.traditional_name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{analysis.herbalFormula.emperor.role}</p>
                  <p className="text-emerald-700 bg-emerald-50 p-4 rounded-lg">
                    {analysis.herbalFormula.emperor.specific_benefits}
                  </p>
                </CardContent>
              </Card>

              {/* Minister Herb */}
              <Card className="opacity-0 animate-popIn" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">臣</span>
                    </div>
                    <CardTitle>{analysis.herbalFormula.minister.traditional_name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{analysis.herbalFormula.minister.role}</p>
                  <p className="text-emerald-700 bg-emerald-50 p-4 rounded-lg">
                    {analysis.herbalFormula.minister.specific_benefits}
                  </p>
                </CardContent>
              </Card>

              {/* Assistant Herb */}
              <Card className="opacity-0 animate-popIn" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                <CardHeader className="bg-green-50 border-b border-green-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-green-600">佐</span>
                    </div>
                    <CardTitle>{analysis.herbalFormula.assistant.traditional_name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{analysis.herbalFormula.assistant.role}</p>
                  <p className="text-emerald-700 bg-emerald-50 p-4 rounded-lg">
                    {analysis.herbalFormula.assistant.specific_benefits}
                  </p>
                </CardContent>
              </Card>

              {/* Courier Herb */}
              <Card className="opacity-0 animate-popIn" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <CardHeader className="bg-yellow-50 border-b border-yellow-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-yellow-600">使</span>
                    </div>
                    <CardTitle>{analysis.herbalFormula.courier.traditional_name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{analysis.herbalFormula.courier.role}</p>
                  <p className="text-emerald-700 bg-emerald-50 p-4 rounded-lg">
                    {analysis.herbalFormula.courier.specific_benefits}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-all"
            >
              重新开始
            </button>
          </div>
        </div>
      )}
    </Container>
  )
}

export default Results